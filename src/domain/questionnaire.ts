import type { Complexity, OCFDU } from './types'

export interface Option<Delta> {
  value: string
  label: string
  delta: Delta
}

export interface QuestionDef<Delta> {
  id: string
  prompt: string
  options: Option<Delta>[]
}

type WeightDelta = Partial<OCFDU>

export const beatOpponentsQ: QuestionDef<WeightDelta> = {
  id: 'beatOpponents',
  prompt: 'How do you like to beat your opponents?',
  options: [
    { value: 'force', label: 'Overwhelming force', delta: { offense: 3 } },
    { value: 'outsmart', label: 'Outsmart them and control the board', delta: { control: 3 } },
    { value: 'panic', label: 'Make them panic and flee', delta: { fear: 3 } },
    { value: 'outlast', label: 'Dig in and outlast them', delta: { defense: 3 } },
    { value: 'adapt', label: 'Adapt flexibly to whatever comes up', delta: { utility: 3 } },
  ],
}

export const gutReactionQ: QuestionDef<WeightDelta> = {
  id: 'gutReaction',
  prompt: "What's your gut reaction when a threat shows up?",
  options: [
    { value: 'strike-first', label: 'Hit it before it hits me', delta: { offense: 2 } },
    { value: 'box-in', label: 'Box it in so it can’t do anything', delta: { control: 2 } },
    { value: 'scare-off', label: 'Make it want to leave', delta: { fear: 2 } },
    { value: 'brace', label: 'Brace and absorb the hit', delta: { defense: 2 } },
    { value: 'go-around', label: 'Find another way around it', delta: { utility: 2 } },
  ],
}

export const focusStyleQ: QuestionDef<WeightDelta> = {
  id: 'focusStyle',
  prompt: 'Do you like doing one thing brilliantly, or keeping many options open?',
  options: [
    { value: 'one-thing', label: 'One thing, brilliantly', delta: { utility: -1 } },
    { value: 'many-options', label: 'Keep many options open', delta: { utility: 3 } },
  ],
}

export const turnStyleQ: QuestionDef<WeightDelta> = {
  id: 'turnStyle',
  prompt: 'Do you prefer huge decisive turns, or steady, inevitable pressure?',
  options: [
    { value: 'decisive', label: 'Huge decisive turns', delta: { offense: 2, fear: 1 } },
    { value: 'steady', label: 'Steady, inevitable pressure', delta: { control: 2, defense: 1 } },
  ],
}

export const tempoQ: QuestionDef<{ tempo: number }> = {
  id: 'tempo',
  prompt: 'Are you more early-game or late-game focused?',
  options: [
    { value: 'fast', label: 'Strong from turn one', delta: { tempo: 2 } },
    { value: 'balanced', label: 'A bit of both', delta: { tempo: 0 } },
    { value: 'slow', label: 'A slow snowball into a late-game powerhouse', delta: { tempo: -2 } },
  ],
}

export const boardControlQ: QuestionDef<{ boardControl: number }> = {
  id: 'boardControl',
  prompt: 'How do you feel about fiddly positioning puzzles?',
  options: [
    { value: 'love', label: 'Love them', delta: { boardControl: 2 } },
    { value: 'neutral', label: "They're fine", delta: { boardControl: 0 } },
    { value: 'avoid', label: 'Not for me', delta: { boardControl: -2 } },
  ],
}

export const complexityToleranceQ: QuestionDef<{ complexityImportance: number }> = {
  id: 'complexityTolerance',
  prompt: 'How much complexity and bookkeeping do you enjoy?',
  options: [
    { value: 'simple', label: 'Keep it simple', delta: { complexityImportance: 1 } },
    { value: 'some', label: "I don't mind some", delta: { complexityImportance: 0.5 } },
    { value: 'bring-it', label: 'Bring on the bookkeeping', delta: { complexityImportance: 0 } },
  ],
}

export const experienceQ: QuestionDef<{ complexityCeiling: Complexity }> = {
  id: 'experience',
  prompt: 'How well does the player at the table know Spirit Island?',
  options: [
    { value: 'newcomer', label: "Complete newcomer, never played", delta: { complexityCeiling: 'Low' } },
    { value: 'few-games', label: 'Played a few times', delta: { complexityCeiling: 'Moderate' } },
    { value: 'experienced', label: 'Knows the game well', delta: { complexityCeiling: 'High' } },
    { value: 'veteran', label: 'Veteran — bring the hardest spirit', delta: { complexityCeiling: 'Very High' } },
  ],
}

export const ELEMENTS = ['Sun', 'Moon', 'Fire', 'Air', 'Water', 'Earth', 'Plant', 'Animal'] as const

export const elementQ: QuestionDef<{ elementAffinity: string[] }> = {
  id: 'element',
  prompt: 'Drawn to a particular element or theme?',
  options: [
    { value: 'none', label: 'No preference', delta: { elementAffinity: [] } },
    ...ELEMENTS.map((element) => ({
      value: element.toLowerCase(),
      label: element,
      delta: { elementAffinity: [element] },
    })),
  ],
}

export const powerVsFreshQ: QuestionDef<{ tierKnob: number }> = {
  id: 'powerVsFresh',
  prompt: 'Tonight, are you chasing raw power or something fresh?',
  options: [
    { value: 'power', label: 'Give me the strongest pick available', delta: { tierKnob: 1 } },
    { value: 'balanced', label: 'A bit of both', delta: { tierKnob: 0.5 } },
    { value: 'fresh', label: 'Something fresh — strength be damned', delta: { tierKnob: 0 } },
  ],
}

export const QUESTIONS = [
  beatOpponentsQ,
  gutReactionQ,
  focusStyleQ,
  turnStyleQ,
  tempoQ,
  boardControlQ,
  complexityToleranceQ,
  experienceQ,
  elementQ,
  powerVsFreshQ,
] as const
