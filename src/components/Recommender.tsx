import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import spiritsData from '../data/spirits.json'
import { answersStore } from '../domain/answersStore'
import type { Answers } from '../domain/answersToWeights'
import { aspectLeanReason, topWeightedLowAxis } from '../domain/aspectNudge'
import { collectionStore, isConfigurationOwned } from '../domain/collectionStore'
import { complexityStore } from '../domain/complexityStore'
import { expand, type Configuration } from '../domain/configurations'
import { gameLog } from '../domain/gameLog'
import { QUESTIONS } from '../domain/questionnaire'
import { drawRandom } from '../domain/randomChoose'
import { rankForSession, SHORTLIST_SIZE } from '../domain/rankForSession'
import type { Weights } from '../domain/recommend'
import { AXES } from '../domain/scoringPrimitives'
import { analyzeTeam } from '../domain/teamCoverage'
import { tierStore } from '../domain/tierStore'
import { COMPLEXITIES } from '../domain/types'
import type { Complexity, OCFDU, Spirit } from '../domain/types'
import { whyYou } from '../domain/whyYou'
import { ManageCollectionLink, UnownedNote } from './collectionAffordances'
import { SpiritArt } from './SpiritArt'
import { Term } from './Term'

const spirits = spiritsData as Spirit[]
const configurations = expand(spirits)
const CONFIGS_BY_SPIRIT = configurations.reduce<Record<string, Configuration[]>>((acc, config) => {
  ;(acc[config.spirit.id] ??= []).push(config)
  return acc
}, {})

type Phase = 'wizard' | 'board' | 'random' | 'resume'

interface RecommenderState {
  phase: Phase
  setPhase: (p: Phase) => void
  step: number
  setStep: (fn: (s: number) => number) => void
  answers: Answers
  answer: (questionId: string, value: string) => void
  restart: () => void
  teamIds: string[]
  setTeamIds: (fn: (ids: string[]) => string[]) => void
  tuned: boolean
  setTuned: (b: boolean) => void
  wildcardOffset: number
  rerollWildcard: () => void
  /** v5 #07b: session-only, like the tier board's - a view preference, not collection data. */
  hardFilter: boolean
  setHardFilter: (b: boolean) => void
}

const Ctx = createContext<RecommenderState | null>(null)

function useRecommender(): RecommenderState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Recommender components must be inside <RecommenderProvider>')
  return ctx
}

/** `initialPhase` mirrors `DashboardTab`'s `initialSegment` — lets the server-rendered smoke
 * test reach a non-default phase (e.g. the results board) without simulating clicks. */
export function RecommenderProvider({ children, initialPhase }: { children: ReactNode; initialPhase?: Phase }) {
  const restored = useMemo(() => answersStore.load(), [])
  const hasRestored = !!restored && Object.keys(restored).length > 0

  const [phase, setPhase] = useState<Phase>(initialPhase ?? (hasRestored ? 'resume' : 'wizard'))
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(restored ?? {})
  const [teamIds, setTeamIds] = useState<string[]>([])
  const [tuned, setTuned] = useState(false)
  const [wildcardOffset, setWildcardOffset] = useState(0)
  const [hardFilter, setHardFilter] = useState(false)

  useEffect(() => {
    answersStore.save(answers)
  }, [answers])

  // An external write to the persisted answers (e.g. a backup import) re-syncs the provider's
  // in-memory answers instead of letting the two diverge until a page reload. The save-effect
  // above feeds back into this subscriber, which bails on reference equality — no loop.
  useEffect(() => {
    return answersStore.subscribe((next) => setAnswers(next))
  }, [])

  const value: RecommenderState = {
    phase,
    setPhase,
    step,
    setStep,
    answers,
    answer: (questionId, val) => setAnswers((prev) => ({ ...prev, [questionId]: val })),
    restart: () => {
      answersStore.clear()
      setAnswers({})
      setStep(0)
      setTeamIds([])
      setTuned(false)
      setPhase('wizard')
    },
    teamIds,
    setTeamIds,
    tuned,
    setTuned,
    wildcardOffset,
    rerollWildcard: () => setWildcardOffset((n) => n + 1),
    hardFilter,
    setHardFilter,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

/** Everything the ranking depends on, derived once and shared by both panes. The pipeline
 * itself lives in `rankForSession` — a pure, directly-tested module — and this hook just
 * snapshots the session's store-derived inputs and calls it. The answers store additionally
 * pushes changes to the provider, so a backup import mid-session can never leave persisted and
 * in-memory answers diverged. */
function useRanking() {
  const { answers, teamIds, tuned, wildcardOffset, hardFilter } = useRecommender()

  return useMemo(
    () =>
      rankForSession({
        answers,
        complexityOverrides: complexityStore.getAll(),
        excluded: new Set(collectionStore.getExcluded()),
        timesPlayed: Object.fromEntries(configurations.map((c) => [c.configId, gameLog.timesPlayed(c.configId)])),
        tierPrior: tierStore.getRankPrior(),
        teamIds,
        tuned,
        wildcardOffset,
        hardFilter,
      }),
    [answers, teamIds, tuned, wildcardOffset, hardFilter],
  )
}

/* ------------------------------ answers panel ------------------------------ */

/** "beatOpponents" -> "beat opponents". The full prompt stays as the control's tooltip. */
function shortLabel(id: string): string {
  return id.replace(/([A-Z])/g, ' $1').toLowerCase()
}

/** The 10 live answer selects. Rendered once, inside the results board's collapsible
 * "Your answers" panel — the recommend experience is one surface (recommender-results-polish
 * #01), and every change re-ranks the board immediately, no submit. */
function AnswersPanel() {
  const { answers, answer } = useRecommender()

  return (
    <div className="deck-knobs">
      {QUESTIONS.map((question) =>
        // ux-discoverability #07: the complexity question's caption is a Term popover. A button
        // can't live inside a <label> (it would steal the label's association), so this field is
        // a <div> with an aria-label on the select instead.
        question.id === 'complexityTolerance' ? (
          <div className="deck-field" key={question.id} title={question.prompt}>
            <Term id="complexity">{shortLabel(question.id)}</Term>
            <select
              aria-label={shortLabel(question.id)}
              value={answers[question.id] ?? ''}
              onChange={(e) => answer(question.id, e.target.value)}
            >
              <option value="" disabled>
                —
              </option>
              {question.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <label className="deck-field" key={question.id} title={question.prompt}>
            <span>{shortLabel(question.id)}</span>
            <select value={answers[question.id] ?? ''} onChange={(e) => answer(question.id, e.target.value)}>
              <option value="" disabled>
                —
              </option>
              {question.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ),
      )}
    </div>
  )
}

/* ------------------------------ main pane ------------------------------ */

export function RecommenderMain({
  onSelectConfiguration,
}: {
  /** #02: clicking a recommended configuration jumps the owner to Browse with that spirit's
   * modal open (and its aspect highlighted, if any) - App owns the tab switch. */
  onSelectConfiguration?: (configId: string) => void
} = {}) {
  const { phase } = useRecommender()
  if (phase === 'random') return <RandomChooser />
  if (phase === 'wizard') return <Wizard />
  if (phase === 'resume') return <ResumePrompt />
  return <ResultsBoard onSelectConfiguration={onSelectConfiguration} />
}

/** Shown once on load when answers were restored from a previous visit, instead of silently
 * jumping to results - the player explicitly chooses to continue or retake the questionnaire. */
function ResumePrompt() {
  const { setPhase, restart } = useRecommender()

  return (
    <section className="deck-wizard">
      <h2>Welcome back</h2>
      <p>You've got saved answers from last time.</p>
      <div className="deck-wizard-actions">
        <button type="button" onClick={() => setPhase('board')}>
          Continue with my saved answers
        </button>
        <button type="button" className="deck-ghost" onClick={restart}>
          Start fresh
        </button>
      </div>
    </section>
  )
}

function HeatStrip({ ratings, weights }: { ratings: OCFDU; weights: Weights }) {
  return (
    <div className="deck-heat" aria-hidden="true">
      {AXES.map((axis) => (
        <span key={axis} data-hot={(weights[axis] ?? 0) > 0} title={axis}>
          {ratings[axis]}
        </span>
      ))}
    </div>
  )
}

function ResultRow({
  config,
  score,
  rank,
  weights,
  tiers,
  owned,
  onSelectConfiguration,
}: {
  config: Configuration
  score: number
  rank: number
  weights: Weights
  tiers: Record<string, string>
  owned: boolean
  onSelectConfiguration?: (configId: string) => void
}) {
  const [open, setOpen] = useState(false)
  const { spirit, aspect } = config
  const hintAxis = topWeightedLowAxis(spirit, weights)
  // recommender-results-polish #04: the aspect earns a reason only when the data supports it —
  // its `shiftsToward` hint points at the player's top-weighted-low axis (provenance rule:
  // never an invented nudge). Otherwise it stays a badge, exactly as before.
  const aspectReason = aspectLeanReason(aspect, hintAxis)
  const siblings = CONFIGS_BY_SPIRIT[spirit.id].filter((c) => c.configId !== config.configId)

  return (
    <li className={owned ? 'deck-row' : 'deck-row deck-row-unowned'}>
      <button type="button" className="deck-row-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="deck-rank">{rank}</span>
        <SpiritArt spirit={spirit} className="deck-thumb" />
        <span className="deck-row-text">
          <span className="deck-name">
            {spirit.name}
            {aspect ? <> — play the <strong>{aspect.name}</strong> aspect</> : null}
          </span>
          <span className="deck-why">{whyYou(spirit, weights)}</span>
          {aspectReason && <span className="deck-aspect-reason">{aspectReason}</span>}
        </span>
        <HeatStrip ratings={spirit.ratings} weights={weights} />
        <span className="deck-score">{score.toFixed(2)}</span>
      </button>

      {!owned && (
        // v5 #07b: annotate mode (hard-filter off) still shows unowned results - the
        // "best spirit for you is in an expansion you don't have" case #06 called out as
        // information, not something to hide silently. ux-discoverability #04 makes the note a
        // link so "you don't own this" is actionable, not a dead end.
        <p className="deck-row-note">
          <UnownedNote />
        </p>
      )}

      {onSelectConfiguration && (
        <button
          type="button"
          className="deck-ghost"
          onClick={(e) => {
            e.stopPropagation()
            onSelectConfiguration(config.configId)
          }}
        >
          View in Browse
        </button>
      )}

      {open && (
        <div className="deck-row-body">
          <div className="deck-row-detail">
            <p className="meta">
              {spirit.expansion} · {config.effectiveComplexity} · {spirit.elements.join(', ')}
            </p>
            <p>{spirit.summary}</p>
            {aspect && (
              <p>
                <strong>{aspect.name}:</strong>{' '}
                {aspect.delta ?? <em className="meta">effect not transcribed yet</em>}
              </p>
            )}
            {spirit.notes && <p className="notes">{spirit.notes}</p>}
            {siblings.length > 0 && (
              <>
                <p className="meta">Other configurations of {spirit.name}:</p>
                <ul className="aspects">
                  {siblings.map((sibling) => {
                    const siblingReason = aspectLeanReason(sibling.aspect, hintAxis)
                    return (
                      <li key={sibling.configId} className={siblingReason ? 'aspect-hint' : undefined}>
                        <strong>{sibling.aspect ? sibling.aspect.name : 'Base'}:</strong>{' '}
                        {sibling.aspect?.delta ?? (sibling.aspect ? <em className="meta">effect not transcribed yet</em> : null)}
                        {' — tier '}
                        {tiers[sibling.configId] ?? 'not rated by this list'} · {sibling.effectiveComplexity}
                        {siblingReason && (
                          <>
                            {' '}
                            <em>{siblingReason}</em>
                          </>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </li>
  )
}

function ResultsBoard({ onSelectConfiguration }: { onSelectConfiguration?: (configId: string) => void }) {
  const { setPhase, setStep, restart, rerollWildcard, hardFilter, setHardFilter } = useRecommender()
  const { weights, shortlist, wildcard, excluded } = useRanking()
  const tiers = tierStore.getAll()

  return (
    <>
      {/* recommender-results-polish #01: one collapsible answers panel for both layouts —
       * collapsed by default so the top configurations lead; expanding shows the live selects,
       * and changing one re-ranks the board immediately. The shell's side slot no longer
       * carries survey state. */}
      <details className="deck-answers-disclosure">
        <summary>Your answers</summary>
        <AnswersPanel />
      </details>
      <div className="deck-head">
        <h2>Your top {SHORTLIST_SIZE}</h2>
        <div className="deck-head-actions">
          {/* recommender-results-polish #02: the soft redo — back into the wizard at question 1
           * with the previous answers pre-filled; nothing is lost until overwritten. */}
          <button
            type="button"
            onClick={() => {
              setStep(() => 0)
              setPhase('wizard')
            }}
          >
            Redo survey
          </button>
          {/* The quiet hard wipe — same restart as ever, demoted and renamed. */}
          <button type="button" className="deck-ghost" onClick={restart}>
            Start fresh
          </button>
          <button type="button" className="deck-ghost" onClick={() => setPhase('random')}>
            Pick at random instead
          </button>
        </div>
      </div>
      <p className="meta">Scored against: {tierStore.getActiveList().name}</p>
      {/* recommender-results-polish #03: the ownership control is a themed switch, same
       * session-only hardFilter state, default off; unowned configurations stay annotated. */}
      <button
        type="button"
        role="switch"
        aria-checked={hardFilter}
        className="deck-toggle"
        onClick={() => setHardFilter(!hardFilter)}
      >
        <span className="deck-toggle-track" aria-hidden="true" />
        Only recommend from my collection
      </button>{' '}
      <ManageCollectionLink />

      <ol className="deck-rows">
        {shortlist.map(({ config, score }, i) => (
          <ResultRow
            key={config.configId}
            config={config}
            score={score}
            rank={i + 1}
            weights={weights}
            tiers={tiers}
            owned={isConfigurationOwned(config, excluded)}
            onSelectConfiguration={onSelectConfiguration}
          />
        ))}
      </ol>
      <p className="deck-hint">Change an answer and the ranking recomputes immediately.</p>

      {wildcard && (
        <div className="deck-wild">
          <div className="deck-wild-tag">Wildcard</div>
          <SpiritArt spirit={wildcard.spirit} className="deck-thumb" />
          <div>
            <div className="deck-name">
              {wildcard.spirit.name}
              {wildcard.aspect ? <> — play the <strong>{wildcard.aspect.name}</strong> aspect</> : null}
            </div>
            <div className="meta">{wildcard.effectiveComplexity}</div>
            <div className="deck-why">{wildcard.spirit.summary}</div>
          </div>
          <button type="button" className="deck-ghost" onClick={rerollWildcard}>
            Reroll
          </button>
        </div>
      )}

      <TeamPanel />
    </>
  )
}

function TeamPanel() {
  const { teamIds, setTeamIds, setTuned } = useRecommender()
  const team = spirits.filter((s) => teamIds.includes(s.id))
  const { elementCoverage, roleGaps } = analyzeTeam(team)

  return (
    <section className="deck-team">
      <h3>Team coverage</h3>
      <select
        value=""
        onChange={(e) => {
          const id = e.target.value
          if (id) setTeamIds((ids) => [...ids, id])
        }}
      >
        <option value="">Add a teammate&rsquo;s spirit…</option>
        {spirits
          .filter((s) => !teamIds.includes(s.id))
          .map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
      </select>

      {team.length > 0 && (
        <>
          <ul className="deck-team-list">
            {team.map((s) => (
              <li key={s.id}>
                {s.name}
                <button
                  type="button"
                  onClick={() => setTeamIds((ids) => ids.filter((existing) => existing !== s.id))}
                  aria-label={`Remove ${s.name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <p className="meta">Elements: {elementCoverage.join(', ') || 'none'}</p>
          <p className="meta">
            Role gaps: {roleGaps.length > 0 ? roleGaps.join(', ') : 'none — the team is well-rounded'}
          </p>
          {roleGaps.length > 0 && (
            <button type="button" onClick={() => setTuned(true)}>
              Tune toward the gaps
            </button>
          )}
        </>
      )}
    </section>
  )
}

function Wizard() {
  const { step, setStep, answers, answer, setPhase } = useRecommender()

  const question = QUESTIONS[step]
  const selected = answers[question.id]
  const last = step === QUESTIONS.length - 1

  return (
    <section className="deck-wizard">
      <p className="meta">
        Question {step + 1} of {QUESTIONS.length}
      </p>
      <h2>{question.prompt}</h2>
      <ul className="deck-choices">
        {question.options.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              aria-pressed={selected === option.value}
              onClick={() => answer(question.id, option.value)}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="deck-wizard-actions">
        {step > 0 ? (
          <button type="button" className="deck-ghost" onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        ) : (
          <button type="button" className="deck-ghost" onClick={() => setPhase('random')}>
            Just pick one at random
          </button>
        )}
        <button type="button" disabled={!selected} onClick={() => (last ? setPhase('board') : setStep((s) => s + 1))}>
          {last ? 'See results' : 'Next'}
        </button>
      </div>
    </section>
  )
}

function RandomChooser() {
  const { setPhase } = useRecommender()
  const [complexityCeiling, setComplexityCeiling] = useState<Complexity | ''>('')
  const [drawKey, setDrawKey] = useState(0)
  // drawKey is a deliberate re-run trigger for the reroll button, not a real dependency.
  const drawn = useMemo(
    () => drawRandom(configurations, { complexityCeiling: complexityCeiling || undefined }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [complexityCeiling, drawKey],
  )

  return (
    <section className="deck-wizard">
      <h2>Random chooser</h2>
      <div className="deck-field">
        <span className="deck-field-caption">
          <Term id="complexity">Cap complexity at (session)</Term>
        </span>
        <select
          aria-label="Cap complexity at (session)"
          value={complexityCeiling}
          onChange={(e) => setComplexityCeiling(e.target.value as Complexity | '')}
        >
          <option value="">No limit</option>
          {COMPLEXITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <p className="meta">
        This ceiling lasts for this session only. Per-spirit overrides — your own read of how heavy
        a spirit feels — live in Settings.
      </p>

      {drawn ? (
        <div className="deck-drawn">
          <SpiritArt spirit={drawn.spirit} />
          <h3>
            {drawn.spirit.name}
            {drawn.aspect ? (
              <>
                {' '}
                — play the <strong>{drawn.aspect.name}</strong> aspect
              </>
            ) : null}
          </h3>
          <p>{drawn.spirit.summary}</p>
        </div>
      ) : (
        <p>No configurations match that constraint.</p>
      )}

      <div className="deck-wizard-actions">
        <button type="button" onClick={() => setDrawKey((k) => k + 1)}>
          Draw again
        </button>
        <button type="button" className="deck-ghost" onClick={() => setPhase('board')}>
          Back to recommendations
        </button>
      </div>
    </section>
  )
}
