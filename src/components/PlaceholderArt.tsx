import type { Spirit } from '../domain/types'

const ELEMENT_COLOR: Record<string, string> = {
  Sun: '#e8b923',
  Moon: '#5b5f97',
  Fire: '#c8452b',
  Air: '#8fc1e3',
  Water: '#2e6f95',
  Earth: '#8a5a3b',
  Plant: '#4c8c4a',
  Animal: '#b07a3e',
}
const DEFAULT_COLOR = '#777'

/** Element-colored fallback tile, used when a spirit's artwork is missing or fails to load. */
export function PlaceholderArt({ spirit, className = 'placeholder-art' }: { spirit: Spirit; className?: string }) {
  const color = ELEMENT_COLOR[spirit.elements[0]] ?? DEFAULT_COLOR
  const initials = spirit.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 3)
    .join('')

  return (
    <div className={className} style={{ backgroundColor: color }} aria-hidden="true">
      {initials}
    </div>
  )
}
