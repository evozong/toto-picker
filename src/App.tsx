import { useEffect, useState } from 'react'
import './App.css'

const NUMBERS = Array.from({ length: 49 }, (_, index) => index + 1)
const BET_TYPES = [
  { label: 'Ordinary', size: 6 },
  { label: 'System 7', size: 7 },
  { label: 'System 8', size: 8 },
  { label: 'System 9', size: 9 },
  { label: 'System 10', size: 10 },
  { label: 'System 11', size: 11 },
  { label: 'System 12', size: 12 },
]

function App() {
  const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(
    new Set(NUMBERS),
  )
  const [poolNumbers, setPoolNumbers] = useState<number[]>(NUMBERS)
  const [betHistory, setBetHistory] = useState<
    { label: string; size: number; pick: number[] }[]
  >([])

  const toggleNumber = (value: number) => {
    setSelectedNumbers((prev) => {
      const next = new Set(prev)
      if (next.has(value)) {
        next.delete(value)
      } else {
        next.add(value)
      }
      return next
    })
  }

  useEffect(() => {
    const remaining = NUMBERS.filter((num) => selectedNumbers.has(num))
    setPoolNumbers(remaining)
  }, [selectedNumbers])

  const handleBet = (label: string, size: number) => {
    if (poolNumbers.length < size) return

    const pool = [...poolNumbers]
    const pick: number[] = []

    for (let i = 0; i < size; i += 1) {
      const idx = Math.floor(Math.random() * pool.length)
      const [chosen] = pool.splice(idx, 1)
      pick.push(chosen)
    }

    const sortedPick = pick.sort((a, b) => a - b)
    setBetHistory((prev) => [...prev, { label, size, pick: sortedPick }])
  }

  return (
    <div className="page">
      <header className="intro">
        <h1 className="eyebrow">Toto Picker</h1>
        <p className="description">Build your bet slip with excluded numbers</p>
      </header>

      <section className="panel">
        <div className="panel__head">
          <div>
            <p className="label">Select numbers to remove</p>
            <p className="count">
              Removed {NUMBERS.length - selectedNumbers.size} numbers
            </p>
          </div>
        </div>

        <div className="number-grid">
          {NUMBERS.map((num) => {
            const isSelected = selectedNumbers.has(num)
            return (
              <button
                key={num}
                type="button"
                className={`number ${isSelected ? 'is-selected' : ''}`}
                onClick={() => toggleNumber(num)}
              >
                <span>{num}</span>
              </button>
            )
          })}
        </div>

        <div className="bets">
          <p className="label">Generate bets</p>
          <div className="bet-buttons">
            {BET_TYPES.map(({ label, size }) => (
              <button
                key={label}
                type="button"
                className="bet-btn"
                onClick={() => handleBet(label, size)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="bet-results">
            <p className="label">Generated Bets</p>
            {betHistory.length ? (
              <div className="pick-list">
                {betHistory.map(({ label, pick }, index) => (
                  <div key={`${label}-${index}`} className="bet-row">
                    <span className="bet-tag">{label}</span>
                    <div className="chips pick-row">
                      {pick.map((num) => (
                        <span key={`${label}-${index}-${num}`} className="chip">
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty">
                Generate the pool, then tap any bet type to create a pick.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
