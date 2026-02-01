'use client'
import { useState } from 'react'
import { Globe, Play, Square, CheckCircle, Circle, Loader2, Terminal } from 'lucide-react'

export default function Home() {
  const [command, setCommand] = useState('')
  const [running, setRunning] = useState(false)
  const [steps, setSteps] = useState([])
  const [history, setHistory] = useState([
    { command: 'Find the cheapest flight from NYC to LA next Friday', status: 'completed' },
    { command: 'Fill out the contact form on acme.com with my info', status: 'completed' },
  ])

  const runCommand = async () => {
    if (!command.trim() || running) return
    setRunning(true)
    setSteps([])
    
    const mockSteps = [
      { action: 'Opening browser', status: 'done' },
      { action: 'Navigating to target website', status: 'done' },
      { action: 'Analyzing page structure', status: 'done' },
      { action: 'Locating relevant elements', status: 'done' },
      { action: 'Performing requested action', status: 'done' },
      { action: 'Verifying results', status: 'done' },
    ]

    for (let i = 0; i < mockSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setSteps(prev => [...prev, { ...mockSteps[i], status: i === mockSteps.length - 1 ? 'running' : 'done' }])
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    setSteps(prev => prev.map((s, i) => i === prev.length - 1 ? { ...s, status: 'done' } : s))
    setHistory(prev => [{ command, status: 'completed' }, ...prev])
    setRunning(false)
    setCommand('')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Globe className="text-green-400" />
          Browser Agent
        </h1>
        <p className="text-slate-400 mb-8">Automate the web with natural language</p>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="flex gap-3">
            <input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && runCommand()}
              placeholder="Tell me what to do... (e.g., 'Book a table for 2 at Nobu on Saturday 7pm')"
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={runCommand}
              disabled={running || !command.trim()}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
            >
              {running ? <Square size={18} /> : <Play size={18} />}
              {running ? 'Stop' : 'Run'}
            </button>
          </div>
        </div>

        {steps.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="text-green-400" />
              <span className="text-white font-medium">Execution Log</span>
            </div>
            <div className="space-y-2 font-mono text-sm">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  {step.status === 'done' ? (
                    <CheckCircle className="text-green-400" size={16} />
                  ) : step.status === 'running' ? (
                    <Loader2 className="text-yellow-400 animate-spin" size={16} />
                  ) : (
                    <Circle className="text-slate-600" size={16} />
                  )}
                  <span className={step.status === 'running' ? 'text-yellow-400' : ''}>{step.action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-white font-medium mb-4">Recent Commands</h3>
          <div className="space-y-2">
            {history.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <span className="text-slate-300 text-sm">{item.command}</span>
                <span className="text-green-400 text-xs flex items-center gap-1">
                  <CheckCircle size={12} /> Done
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          {['Book flights', 'Fill forms', 'Compare prices', 'Extract data', 'Monitor changes', 'Auto-login'].map((example) => (
            <button
              key={example}
              onClick={() => setCommand(example + '...')}
              className="p-3 bg-slate-800/30 border border-slate-700 rounded-lg text-slate-400 text-sm hover:bg-slate-700/50 hover:text-white transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
