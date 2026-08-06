import { useState, type ReactNode } from 'react'
import powerCardsData from '../data/power-cards.json'
import spiritsData from '../data/spirits.json'
import { collectionStore, filterOwnedConfigurations, isCardOwned, isConfigurationOwned } from '../domain/collectionStore'
import { expand, type Configuration } from '../domain/configurations'
import { powerCardGallery, type GalleryImage } from '../domain/gallerySequence'
import { groupByTier, tierStore } from '../domain/tierStore'
import { subjectUniverse } from '../domain/tierSubjects'
import type { PowerCard, Spirit, TierList, TierListSubject } from '../domain/types'
import { CardViewer } from './CardViewer'
import { SpiritArt } from './SpiritArt'
import { SpiritDetail } from './SpiritDetail'
import { expansionChipColor, expansionColorFor, normalizeExpansion } from './tagColors'
import { tierColor } from './tierColors'
import { TierListControls } from './TierListControls'
import { useGalleryArrows } from './useGalleryArrows'

const spirits = spiritsData as Spirit[]
const configurations = expand(spirits)
const powerCards = powerCardsData as PowerCard[]

/** Edit-mode controls for one tile (#15): reassign its tier, or send it to Unrated. Rendered
 * only when the viewed list is personal — the store refuses cited edits, the UI never offers
 * them. Note for #17: while edit mode is active it owns tile interaction; the view-mode
 * click-to-detail behaviour must never fire during editing. */
function TierTileEdit({
  name,
  current,
  labels,
  onAssign,
}: {
  name: string
  current: string
  labels: string[]
  onAssign: (label: string) => void
}) {
  return (
    <label className="tier-tile-edit">
      <span className="visually-hidden">Tier for {name}</span>
      <select value={current} onChange={(e) => onAssign(e.target.value)}>
        {labels.map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
        <option value="">Unrated</option>
      </select>
    </label>
  )
}

/**
 * theming-spread #02: expansion colour on the tier board, extending the existing single-source
 * `EXPANSION_COLOR` mapping to a surface that showed no expansion at all (phase-4 #21 audited it
 * as one of two gaps; the Archive's rows closed the other in legibility-pass #05).
 *
 * A tier tile is 116px wide with 53px of art and a figcaption already absolutely positioned over
 * its bottom edge — there is nowhere to put the *text* chip Browse and the Archive rows use, the
 * same constraint `.unowned-badge` documents. So the colour lands as the 4px left-edge stripe
 * `SpiritTile` already uses for this exact signal (no new treatment invented, no new palette), and
 * the expansion's name goes in the tile's `title` tooltip, where words do fit — colour is never the
 * only carrier of the signal.
 *
 * `undefined` renders no stripe at all rather than a fallback colour, honouring
 * `expansionColorFor`'s contract (a raw string it can't place is an honest absence, never a guess).
 */
function ExpansionStripe({ color }: { color: string | undefined }) {
  if (!color) return null
  return <span className="tier-tile-expansion" style={{ background: color }} aria-hidden="true" />
}

/** The tooltip's expansion clause. A configuration is gated by up to *two* boxes
 * (`isConfigurationOwned` checks both the spirit's and the aspect's), but one stripe can only
 * carry one colour — it follows the base spirit, so a spirit reads as the same colour here as on
 * Browse. When an aspect ships in a different box, that fact can't be a colour, so it's stated in
 * words; when it ships in the spirit's own box the clause is omitted rather than repeated. */
function expansionTitle(config: Configuration): string {
  const { spirit, aspect } = config
  if (aspect && aspect.expansion !== spirit.expansion) {
    // The caller has already named the aspect, so this clause says "the aspect", not its name.
    return `${spirit.expansion}; the aspect ships in ${aspect.expansion}`
  }
  return spirit.expansion
}

/**
 * The three parts of "outside your collection" that every tier tile wears, in one place: the dim
 * class, the ⊘ badge, and the screen-reader text the badge can't carry (it's `aria-hidden`,
 * because a decorative glyph read aloud is noise). Spirit tiles and card tiles rendered these
 * identically in two spots, so a badge tweak meant editing both — extracted per code review.
 *
 * `tierTileClass` and `unownedTitleSuffix` are separate because they land on the `figure`'s own
 * attributes rather than in its children; a tile whose title is built differently (a spirit names
 * its aspect's box, a card doesn't) still gets the same suffix.
 */
function tierTileClass(owned: boolean): string {
  return owned ? 'tier-tile' : 'tier-tile tier-tile-unowned'
}

function unownedTitleSuffix(owned: boolean): string {
  return owned ? '' : ' (not in your collection)'
}

function UnownedMark({ owned }: { owned: boolean }) {
  if (owned) return null
  return (
    <>
      <span className="unowned-badge" aria-hidden="true">
        ⊘
      </span>
      <span className="visually-hidden"> — not in your collection</span>
    </>
  )
}

/** v5 #06: a configuration outside the collection stays in its rated tier row - a tier is
 * "how good," not "do you own it," so it's dimmed and badged in place, never regrouped.
 * #17: in view mode the tile opens the spirit detail (`onOpen`); in edit mode `onOpen` is
 * absent and only the tier select responds — the modal never opens while editing. */
function TierTile({
  config,
  owned,
  edit,
  onOpen,
}: {
  config: Configuration
  owned: boolean
  edit?: ReactNode
  onOpen?: () => void
}) {
  return (
    <figure
      className={tierTileClass(owned)}
      title={
        (config.aspect ? `${config.spirit.name} — ${config.aspect.name} aspect` : config.spirit.name) +
        ` — ${expansionTitle(config)}` +
        unownedTitleSuffix(owned)
      }
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={
        onOpen
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onOpen()
              }
            }
          : undefined
      }
    >
      <SpiritArt spirit={config.spirit} className="tier-tile-art" />
      <ExpansionStripe color={expansionChipColor(config.spirit.expansion)} />
      {config.aspect ? (
        <figcaption className="tier-tile-aspect">
          <span className="tier-tile-aspect-name">{config.aspect.name}</span>
          <span className="tier-tile-spirit-name">{config.spirit.name}</span>
        </figcaption>
      ) : (
        <figcaption>{config.spirit.name}</figcaption>
      )}
      {edit}
      <UnownedMark owned={owned} />
    </figure>
  )
}

/** Card art with the same missing-file posture as the rest of the app: a plain placeholder,
 * never a broken image.
 *
 * A card outside the collection is dimmed and badged in place, exactly like an unowned spirit
 * (`TierTile`) — a tier says "how good", never "do you own it", so it keeps its rated row. This
 * reverses v5 #16's "card lists are ungated": that call was made when the board showed only names,
 * where the full pool reads as a reference list. Now that tiles show art, an unowned card is
 * visually indistinguishable from an owned one, which is the specific thing the owner asked to
 * fix. The full pool still renders — nothing is hidden, and there is deliberately no card
 * equivalent of the configurations board's "only show what I own" hard filter.
 *
 * The tier tile prints the card at 116px, where its rules text is unreadable — so the art is a
 * button that enlarges it, the same affordance `SpiritDetail` gives a starting card. Only the
 * *image* is the target, never the whole `figure`: the tile already contains the edit-mode tier
 * select, and a tile-wide button would nest an interactive control inside a button. That also
 * lets enlarging stay live during edit mode, unlike the spirit tile's whole-tile `onOpen` (#17) —
 * reading a card is most useful exactly while you are deciding its tier, and there is no longer a
 * conflicting click target to suppress.
 *
 * A card whose image 404s renders the placeholder and no button: there is nothing to enlarge.
 */
function CardTile({
  card,
  owned,
  edit,
  onEnlarge,
}: {
  card: PowerCard
  owned: boolean
  edit?: ReactNode
  onEnlarge?: () => void
}) {
  const [failed, setFailed] = useState(false)
  // Raw transcribed string (`Basegame`, `Promo2`, …), so it goes through the alias-aware resolver
  // rather than the direct index the canonical spirit side can use.
  const color = expansionColorFor(card.expansion)
  return (
    <figure className={tierTileClass(owned)} title={`${card.name} — ${card.expansion}` + unownedTitleSuffix(owned)}>
      {failed ? (
        <span className="tier-tile-card-art tier-tile-card-missing" aria-hidden="true" />
      ) : (
        <button
          type="button"
          className="tier-tile-card-zoom"
          onClick={onEnlarge}
          aria-label={`Enlarge ${card.name}`}
        >
          <img
            className="tier-tile-card-art"
            src={`${import.meta.env.BASE_URL}${card.image}`}
            alt={card.name}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
          />
        </button>
      )}
      <ExpansionStripe color={color} />
      <figcaption>{card.name}</figcaption>
      {edit}
      <UnownedMark owned={owned} />
    </figure>
  )
}

/** The tier board. One tab serves every subject (#16): spirit tiles for configurations lists,
 * card tiles for card lists, same tier rows. Editing is a mode on this board (#15) —
 * personal-origin lists only, persisting through the same override machinery everywhere. */
export function TierBoard({ initialSubject }: { initialSubject?: TierListSubject } = {}) {
  const [, setVersion] = useState(0)
  const [hardFilter, setHardFilter] = useState(false)
  const [editing, setEditing] = useState(false)
  // The board tracks which SUBJECT is on display; the list shown is always that subject's
  // active list, so the board and the store can never disagree about whose ratings render.
  const [viewedSubject, setViewedSubject] = useState<TierListSubject>(initialSubject ?? 'configurations')
  // #17: board → detail. An aspect tile opens the base spirit's modal scrolled to that aspect.
  const [detail, setDetail] = useState<{ spirit: Spirit; aspect?: string } | null>(null)
  // The enlarged card, plus the tier row it came from so the arrows have somewhere to walk. The
  // row is captured at click time rather than recomputed: re-tiering a card mid-enlarge must not
  // reshuffle the sequence under the arrow keys.
  const [enlarged, setEnlarged] = useState<{ images: GalleryImage[]; index: number } | null>(null)
  const bump = () => setVersion((v) => v + 1)

  // Escape-to-close comes from `CardViewer` itself; only the row walk is this board's business.
  useGalleryArrows(enlarged?.index, enlarged?.images.length ?? 0, (next) =>
    setEnlarged((current) => (current ? { ...current, index: next } : current)),
  )

  const viewed: TierList | undefined = tierStore.getActiveListFor(viewedSubject)
  if (viewed === undefined) {
    return (
      <section>
        <h2>Tier list</h2>
        <p className="meta">No tier list exists for this subject.</p>
      </section>
    )
  }
  const subject = viewed.subject
  const customised = tierStore.isCustomised(subject)
  const excluded = new Set(collectionStore.getExcluded())
  // The store refuses cited edits; the UI must not offer them (#15). `editing` may survive a
  // list switch, so the affordance is gated on the *current* list's origin, not the toggle.
  const canEdit = viewed.origin === 'personal'
  const editingHere = editing && canEdit
  const tiers = tierStore.getAll(subject)
  // Subject dispatch lives in the domain: which items, their id namespace, their universe size.
  const { idOf, items, total } = subjectUniverse(subject, configurations, powerCards)

  const assign = (key: string) => (label: string) => {
    tierStore.setTier(key, label, subject)
    bump()
  }

  const editControl = (key: string, name: string, current: string) =>
    editingHere ? (
      <TierTileEdit name={name} current={current} labels={viewed.tierLabels} onAssign={assign(key)} />
    ) : undefined

  const configTiles = (items: Configuration[], current: string) =>
    items.map((config) => (
      <TierTile
        key={config.configId}
        config={config}
        owned={isConfigurationOwned(config, excluded)}
        edit={editControl(
          config.configId,
          config.aspect ? `${config.spirit.name} — ${config.aspect.name}` : config.spirit.name,
          current,
        )}
        onOpen={
          editingHere ? undefined : () => setDetail({ spirit: config.spirit, aspect: config.aspect?.name })
        }
      />
    ))
  const cardTiles = (items: PowerCard[], current: string) => {
    const images = powerCardGallery(items, import.meta.env.BASE_URL)
    return items.map((card, i) => (
      <CardTile
        key={card.name}
        card={card}
        owned={isCardOwned(normalizeExpansion(card.expansion), excluded)}
        edit={editControl(card.name, card.name, current)}
        onEnlarge={() => setEnlarged({ images, index: i })}
      />
    ))
  }

  // Hard-filter (#06's opt-in): excluded exactly as if annotation had removed them first, rather
  // than dimmed in place. Session-only - a view preference, not collection data, so it isn't
  // persisted or exported like the collection itself. Configurations boards only (#16): card
  // lists are ungated, matching the Archive's exemption.
  const visibleConfigurations = hardFilter ? filterOwnedConfigurations(configurations, excluded) : configurations
  const groups =
    subject === 'configurations'
      ? groupByTier(visibleConfigurations, (c) => c.configId, tiers, viewed.tierLabels)
      : groupByTier(items as PowerCard[], idOf as (item: PowerCard) => string, tiers, viewed.tierLabels)
  const tilesFor = (items: (Configuration | PowerCard)[], current: string) =>
    subject === 'configurations'
      ? configTiles(items as Configuration[], current)
      : cardTiles(items as PowerCard[], current)

  return (
    <section>
      <h2>Tier list</h2>
      <TierListControls
        viewed={viewed}
        total={total}
        allowCreate
        onSelect={(list) => {
          tierStore.setActiveListId(list.id)
          setViewedSubject(list.subject)
          bump()
        }}
      />
      <details className="tier-explainer">
        <summary>How this list works</summary>
        <p>
          {customised ? 'Your customised tier list' : 'The shipped tier list'} — <strong>{viewed.tierLabels[0]}</strong>{' '}
          is strongest, <strong>{viewed.tierLabels[viewed.tierLabels.length - 1]}</strong> weakest.{' '}
          {subject === 'configurations' && (
            <>
              This ordering feeds the recommender: the <em>raw power ↔ something fresh</em> slider decides how
              heavily a spirit's tier counts toward its score.{' '}
            </>
          )}
          {canEdit ? (
            <>
              Toggle <strong>Edit tiers</strong> to reassign {subject === 'configurations' ? 'spirits' : 'cards'} right
              here.
            </>
          ) : (
            <>A cited list can't be edited — switch to a personal list to make changes.</>
          )}
        </p>
      </details>
      {subject === 'configurations' && (
        <label className="deck-field-inline">
          <input type="checkbox" checked={hardFilter} onChange={(e) => setHardFilter(e.target.checked)} />
          Only show spirits I own
        </label>
      )}
      {canEdit && (
        <label className="deck-field-inline">
          <input type="checkbox" checked={editing} onChange={(e) => setEditing(e.target.checked)} />
          Edit tiers
        </label>
      )}
      {tierStore.wasDiscarded(subject) && (
        <p className="notice">
          Your saved tier edits were discarded because the shipped tier list has changed since you
          made them. Export a backup from Settings next time to avoid losing edits like this.{' '}
          <button
            type="button"
            onClick={() => {
              tierStore.dismissDiscardNotice(subject)
              bump()
            }}
          >
            Dismiss
          </button>
        </p>
      )}
      {editingHere && (
        <p>
          <button
            type="button"
            disabled={!customised}
            onClick={() => {
              if (!customised) return
              const ok = window.confirm(
                'This discards your tier edits and cannot be undone. Export a backup from Settings first?\n\n' +
                  'Choose Cancel to go export, or OK to reset anyway.',
              )
              if (!ok) return
              tierStore.reset(subject)
              bump()
            }}
          >
            Reset to the shipped tier list
          </button>{' '}
          {customised ? <span className="meta">You have unsaved-to-repo edits.</span> : null}
        </p>
      )}

      <div className="tier-board">
        {viewed.tierLabels.map((label, i) => (
          <div className="tier-row" key={label}>
            <div className="tier-label" style={{ backgroundColor: tierColor(i) }}>
              {label}
            </div>
            <div className="tier-tiles">
              {groups.labeled[label].length === 0 ? (
                <p className="tier-empty">
                  {subject === 'configurations' ? 'No spirits in this tier' : 'No cards in this tier'}
                </p>
              ) : (
                tilesFor(groups.labeled[label], label)
              )}
            </div>
          </div>
        ))}

        <div className="tier-row tier-row-unrated">
          <div className="tier-label tier-label-unrated">Unrated</div>
          <div className="tier-tiles">
            <p className="tier-empty meta">
              Not rated by this source — different from rated badly. {groups.unrated.length} of{' '}
              {total} {subject === 'configurations' ? 'configurations' : 'cards'} here.
            </p>
            {tilesFor(groups.unrated, '')}
          </div>
        </div>
      </div>

      {detail && (
        <SpiritDetail spirit={detail.spirit} highlightAspect={detail.aspect} onClose={() => setDetail(null)} />
      )}

      {enlarged && (
        <CardViewer
          src={enlarged.images[enlarged.index].src}
          alt={enlarged.images[enlarged.index].alt}
          onClose={() => setEnlarged(null)}
        />
      )}
    </section>
  )
}
