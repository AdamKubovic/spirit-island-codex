import spiritsData from '../data/spirits.json'
import { parse, serialise, type BackupState, type KnownIds, type LogEntry } from './backup'
import type { Answers } from './answersToWeights'
import { expand } from './configurations'
import { QUESTIONS } from './questionnaire'
import { EXPANSIONS, type Complexity, type ExpansionName, type Spirit, type TierList } from './types'

/** The stores behind one seam. The real tier/complexity/collection/answers/log stores satisfy
 * these structurally; tests pass in-memory adapters, so the round-trip never touches
 * localStorage or the DOM. */
export interface BackupTierHandle {
  getLists(): TierList[]
  getPersonalLists(): TierList[]
  getOverridesForList(listId: string): Record<string, string>
  resetList(listId: string): void
  importOverrides(perList: Record<string, Record<string, string>>): { unresolved: string[] }
  hasAnyPersonalEdits(): boolean
}

export interface BackupComplexityHandle {
  getOverrides(): Record<string, Complexity>
  resetAll(): void
  setComplexity(spiritId: string, complexity: Complexity): void
  isCustomised(): boolean
}

export interface BackupCollectionHandle {
  getExcluded(): ExpansionName[]
  resetAll(): void
  setOwned(expansion: ExpansionName, owned: boolean): void
  isCustomised(): boolean
}

export interface BackupAnswersHandle {
  load(): Answers | null
  save(answers: Answers): void
}

export interface BackupLogHandle {
  list(): LogEntry[]
  replaceAll(entries: LogEntry[]): void
}

export interface BackupStoreHandle {
  tiers: BackupTierHandle
  complexity: BackupComplexityHandle
  collection: BackupCollectionHandle
  answers: BackupAnswersHandle
  log: BackupLogHandle
}

/**
 * The backup round-trip as a module: collecting a backup from the stores and applying one back,
 * with ADR 0012's semantics exactly. Known-ids assembly (which Configuration ids, list ids,
 * spirit ids, question ids, and expansions exist) and the unresolved-id report live here too, so
 * a component stops reaching into five stores to assemble a backup by hand.
 */
export function createBackupService(handle: BackupStoreHandle) {
  const spirits = spiritsData as Spirit[]
  const configurations = expand(spirits)

  function knownIds(): KnownIds {
    return {
      tierIds: new Set(configurations.map((c) => c.configId)),
      listIds: new Set(handle.tiers.getLists().map((l) => l.id)),
      complexityIds: new Set(spirits.map((s) => s.id)),
      questionIds: new Set(QUESTIONS.map((q) => q.id)),
      expansions: new Set(EXPANSIONS),
    }
  }

  function ownersListId(): string {
    return handle.tiers.getLists().find((l) => l.origin === 'personal')?.id ?? ''
  }

  /** Assembles the backup state from every store — what an export carries. Personal tier-list
   * overrides only, and only lists that actually carry edits. */
  function collect(): BackupState {
    const tiers: Record<string, Record<string, string>> = {}
    for (const list of handle.tiers.getPersonalLists()) {
      const overrides = handle.tiers.getOverridesForList(list.id)
      if (Object.keys(overrides).length > 0) tiers[list.id] = overrides
    }
    return {
      tiers,
      complexityOverrides: handle.complexity.getOverrides(),
      answers: handle.answers.load() ?? {},
      log: handle.log.list(),
      collection: handle.collection.getExcluded(),
    }
  }

  /** Applies a parsed backup with ADR 0012's semantics: personal tier-list overrides replaced
   * per list, complexity overrides replaced, Collection replaced, answers replaced, game log
   * replaced with the parsed merge (append + de-duplicate by id — done in `parse`), cited lists
   * refused. The answers write goes through `answers.save`, so the recommender provider re-syncs
   * via the answers store's change notification. */
  function apply(state: BackupState): void {
    for (const list of handle.tiers.getPersonalLists()) {
      handle.tiers.resetList(list.id)
    }
    handle.tiers.importOverrides(state.tiers)
    handle.complexity.resetAll()
    for (const [spiritId, complexity] of Object.entries(state.complexityOverrides)) {
      handle.complexity.setComplexity(spiritId, complexity)
    }
    handle.answers.save(state.answers)
    handle.log.replaceAll(state.log)
    handle.collection.resetAll()
    for (const expansion of state.collection) {
      handle.collection.setOwned(expansion, false)
    }
  }

  /** Whether importing a backup would replace existing data (drives the confirm prompt). */
  function hasExistingData(): boolean {
    return (
      handle.tiers.hasAnyPersonalEdits() ||
      handle.complexity.isCustomised() ||
      handle.collection.isCustomised() ||
      Object.keys(handle.answers.load() ?? {}).length > 0 ||
      handle.log.list().length > 0
    )
  }

  return {
    /** The backup state an export carries. */
    collect,
    /** Parses and validates a backup file against the live known-ids, merging the log against
     * the current one. Throws on an unreadable / future-schema file. */
    parse(json: string) {
      return parse(json, knownIds(), handle.log.list(), ownersListId())
    },
    /** Applies a parsed backup (ADR 0012 semantics — see the function doc). */
    apply,
    /** Whether importing a backup would replace existing data. */
    hasExistingData,
    /** Collect → serialise, the full export. */
    export(): string {
      return serialise(collect())
    },
  }
}
