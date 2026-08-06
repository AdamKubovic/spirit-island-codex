import type { OCFDU } from './types'
import { AXES } from './scoringPrimitives'

export { AXES }

export const AXIS_LABEL: Record<keyof OCFDU, string> = {
  offense: 'aggression',
  control: 'battlefield control',
  fear: 'fear generation',
  defense: 'staying power',
  utility: 'flexibility',
}
