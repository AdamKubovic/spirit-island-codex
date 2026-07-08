import type { OCFDU } from '../domain/types'

const AXES: { key: keyof OCFDU; label: string }[] = [
  { key: 'offense', label: 'O' },
  { key: 'control', label: 'C' },
  { key: 'fear', label: 'F' },
  { key: 'defense', label: 'D' },
  { key: 'utility', label: 'U' },
]

const SIZE = 80
const CENTER = SIZE / 2
const RADIUS = SIZE / 2 - 12
const MAX_VALUE = 6

function pointFor(index: number, value: number): [number, number] {
  const angle = (Math.PI * 2 * index) / AXES.length - Math.PI / 2
  const r = (value / MAX_VALUE) * RADIUS
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)]
}

/** Inline-SVG 5-axis OCFDU polygon. No charting dependency. */
export function OcfduRadar({ ratings }: { ratings: OCFDU }) {
  const polygon = AXES.map((axis, i) => pointFor(i, ratings[axis.key]).join(',')).join(' ')

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="OCFDU profile">
      {AXES.map((axis, i) => {
        const [x, y] = pointFor(i, MAX_VALUE)
        const [labelX, labelY] = pointFor(i, MAX_VALUE + 1.3)
        return (
          <g key={axis.key}>
            <line x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} />
            <text x={labelX} y={labelY} fontSize={8} textAnchor="middle" dominantBaseline="middle">
              {axis.label}
            </text>
          </g>
        )
      })}
      <polygon points={polygon} fill="currentColor" fillOpacity={0.35} stroke="currentColor" strokeWidth={1.5} />
    </svg>
  )
}
