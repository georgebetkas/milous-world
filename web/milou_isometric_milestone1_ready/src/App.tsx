import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { MilouScene } from './game/MilouScene'
import './App.css'

export default function App() {
  const gameContainer = useRef<HTMLDivElement>(null)
  const [activity, setActivity] = useState('Η Μιλού εξερευνά τον νέο της κόσμο')

  useEffect(() => {
    if (!gameContainer.current) return

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: gameContainer.current,
      width: 960,
      height: 620,
      backgroundColor: '#d9e9da',
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene: [new MilouScene(setActivity)],
    })

    return () => { game.destroy(true) }
  }, [])

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">A living AI experiment</span>
          <h1>Milou's World</h1>
        </div>
        <span className="status-dot">● Prototype 0.1</span>
      </header>

      <main className="layout">
        <section className="world-panel">
          <div ref={gameContainer} className="game-container" />
          <p className="hint">Κάνε κλικ σε κάποιο πλακίδιο για να μετακινήσεις τη Μιλού.</p>
        </section>

        <aside className="sidebar">
          <h2>Η ζωή της Μιλού</h2>
          <p className="muted">Ο πρώτος μικρός κόσμος της.</p>
          <div className="info-card">
            <span className="card-label">ΤΩΡΙΝΗ ΔΡΑΣΤΗΡΙΟΤΗΤΑ</span>
            <p>{activity}</p>
          </div>
          <div className="info-card">
            <span className="card-label">ΜΕΡΗ</span>
            <p>🏠 Σπίτι</p>
            <p>💻 Coding Lab</p>
            <p>🎨 Art Studio</p>
          </div>
          <div className="info-card">
            <span className="card-label">COMING NEXT</span>
            <p>Ημερολόγιο, μνήμη, AI εγκέφαλος και δημιουργικά projects.</p>
          </div>
          <p className="muted small">Demo: οι κινήσεις ελέγχονται από εσένα, όχι ακόμη από AI.</p>
        </aside>
      </main>
    </div>
  )
}
