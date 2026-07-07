import spiritsData from './data/spirits.json'
import { recommend } from './domain/recommend'
import type { Spirit } from './domain/types'

const spirits = spiritsData as Spirit[]

function App() {
  const ranked = recommend(spirits, { offense: 1 })

  return (
    <main>
      <h1>Spirit Island Spirit Recommender</h1>
      <ol>
        {ranked.map(({ spirit, score }) => (
          <li key={spirit.id}>
            {spirit.name} — score {score} (O{spirit.ratings.offense} C{spirit.ratings.control}{' '}
            F{spirit.ratings.fear} D{spirit.ratings.defense} U{spirit.ratings.utility})
          </li>
        ))}
      </ol>
    </main>
  )
}

export default App
