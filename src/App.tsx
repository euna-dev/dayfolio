function App() {
  return (
    <div className="min-h-screen bg-bg text-ink font-body p-8">
      <h1 className="font-display text-4xl mb-4">dayfolio</h1>
      <p className="text-ink-muted mb-6">Tailwind v4 @theme 동작 확인</p>
      <div className="flex gap-3">
        <div className="bg-accent text-surface px-4 py-2 rounded-md">accent</div>
        <div className="bg-surface-alt text-ink px-4 py-2 rounded-md border border-border">
          surface-alt
        </div>
        <div className="bg-accent-soft text-accent px-4 py-2 rounded-md">accent-soft</div>
      </div>
      <p className="font-mono text-ink-faint mt-4">2026-04-02</p>
    </div>
  )
}

export default App
