import type { Element } from '../domain/types'

/** Same names the Cards tab's `CardFilters`/`CardRows` use for `public/elements/*.webp`. */
const ELEMENT_ICON: Record<Element, string> = {
  Sun: 'sun',
  Moon: 'moon',
  Fire: 'fire',
  Air: 'air',
  Water: 'water',
  Earth: 'earth',
  Plant: 'plant',
  Animal: 'animal',
}

export function ElementIcon({ element }: { element: Element }) {
  return <img className="element-icon" src={`${import.meta.env.BASE_URL}elements/${ELEMENT_ICON[element]}.webp`} alt={element} title={element} />
}
