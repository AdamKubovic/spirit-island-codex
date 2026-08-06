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

/** The one element-icon renderer — every surface that draws an element icon uses this component,
 * so the file-name map exists once instead of in every renderer. `className` lets a surface keep
 * its own chip styling (e.g. `card-row-element-icon`). */
export function ElementIcon({ element, className = 'element-icon' }: { element: Element; className?: string }) {
  return <img className={className} src={`${import.meta.env.BASE_URL}elements/${ELEMENT_ICON[element]}.webp`} alt={element} title={element} />
}
