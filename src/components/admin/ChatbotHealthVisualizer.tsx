'use client'

import { Activity, BrainCircuit, CheckCircle2, Database, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ChatbotHealthVisualizer() {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const systems = [
    { name: 'Core AI Engine', status: 'Online', icon: BrainCircuit, color: 'text-green-500' },
    { name: 'Pricing Matrix', status: 'Synced', icon: Database, color: 'text-blue-500' },
    { name: 'Context Memory', status: 'Active', icon: Zap, color: 'text-amber-500' },
    { name: 'Lead Pipeline', status: 'Connected', icon: CheckCircle2, color: 'text-purple-500' },
  ]

  return (
    <div className="rounded-[2.5rem] border border-white/60 bg-white/60 p-8 shadow-sm backdrop-blur-xl mb-8 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-green-400/10 to-transparent blur-3xl pointer-events-none" />
      
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm border border-brown-50">
            <Activity className="h-4 w-4 text-brown-700 z-10" />
            <div className={`absolute inset-0 rounded-2xl bg-green-400/20 transition-transform duration-1000 ${pulse ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`} />
          </div>
          <h2 className="font-display text-2xl text-brown-800">System Health Visualizer</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 shadow-sm">
          <div className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">All Systems Nominal</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {systems.map((sys, idx) => {
          const Icon = sys.icon
          return (
            <div key={idx} className="group relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/50 p-5 shadow-sm transition-all hover:shadow-md hover:bg-white/80">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm ${sys.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`h-1.5 w-1.5 rounded-full bg-current ${sys.color} ${pulse ? 'opacity-100' : 'opacity-50'} transition-opacity duration-500`} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-500">{sys.status}</span>
                </div>
              </div>
              <p className="font-semibold text-charcoal-900 tracking-tight">{sys.name}</p>
              
              {/* Pulse line effect */}
              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-charcoal-900/5 overflow-hidden">
                <div className={`h-full w-1/3 bg-current ${sys.color} rounded-full transform transition-transform duration-1000 ease-in-out`} style={{ transform: pulse ? 'translateX(300%)' : 'translateX(-100%)' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
