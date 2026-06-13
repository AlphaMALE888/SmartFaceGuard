import React from 'react'

export default function ScoreCard({ score = 0 }) {
  const color = score >= 70 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-rose-600"
  const bgColor = score >= 70 ? "bg-emerald-50 border-emerald-100" : score >= 50 ? "bg-amber-50 border-amber-100" : "bg-rose-50 border-rose-100"
  const label = score >= 70 ? "High Trust" : score >= 50 ? "Medium Risk" : "Low Trust"

  // Circular progress calculations
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-5 text-center shadow-sm flex flex-col items-center justify-center">
      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3 block">
        Authenticity Score
      </span>
      
      {/* Circular Progress Gauge */}
      <div className="relative flex items-center justify-center h-24 w-24 mb-3">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="text-slate-100"
            strokeWidth="6.5"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            className={`transition-all duration-500 ease-out ${
              score >= 70 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500'
            }`}
            strokeWidth="6.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-2xl font-black text-slate-800 font-mono">{score}</span>
          <span className="text-[10px] text-slate-400 font-bold block -mt-1">/100</span>
        </div>
      </div>

      {/* Trust pill */}
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${bgColor} ${color}`}>
        {label}
      </span>
    </div>
  )
}
