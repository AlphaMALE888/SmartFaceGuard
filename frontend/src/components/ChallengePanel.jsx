import React from 'react'

const CHALLENGE_LABELS = {
  blink: "Blink Once",
  turn_left: "Turn Your Head Left",
  turn_right: "Turn Your Head Right"
}

const CHALLENGE_ORDER = ["blink", "turn_left", "turn_right"]

export default function ChallengePanel({ currentChallenge, completed, verificationComplete }) {
  if (verificationComplete) {
    return (
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-5 text-center shadow-sm">
        <div className="mx-auto h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-extrabold text-xl mb-3">
          ✓
        </div>
        <h3 className="text-lg font-bold text-emerald-900">Biometric Verification Success</h3>
        <p className="text-xs text-emerald-700/80 mt-1">Liveness challenges successfully passed. Identity authenticity confirmed.</p>
      </div>
    )
  }

  const safeCompleted = completed || { blink: false, turn_left: false, turn_right: false }

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Required Actions</span>
          <h3 className="text-md font-bold text-slate-800 mt-0.5">Liveness Verification</h3>
        </div>
        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5 animate-pulse">
          Liveness Active
        </span>
      </div>

      <div className="mb-5">
        <p className="text-xs text-slate-400 font-semibold mb-1">Active Prompt</p>
        <p className="text-xl font-extrabold text-slate-900 tracking-tight">
          {currentChallenge ? CHALLENGE_LABELS[currentChallenge] : "Position Face in Camera"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {CHALLENGE_ORDER.map((key) => {
          const isDone = safeCompleted[key]
          const isActive = currentChallenge === key

          return (
            <div
              key={key}
              className={`text-center py-2.5 px-2 rounded-xl border transition ${
                isDone
                  ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                  : isActive
                  ? "bg-blue-50/50 border-blue-200 text-blue-700 font-semibold ring-1 ring-blue-500/10"
                  : "bg-slate-50 border-slate-200/40 text-slate-400"
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-tight mb-1 truncate">
                {key.replace('_', ' ')}
              </div>
              <div className="text-xs flex items-center justify-center gap-1">
                {isDone ? (
                  <span className="font-extrabold">✓</span>
                ) : isActive ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-ping" />
                ) : (
                  <span className="text-[10px] font-semibold opacity-60">Pending</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
