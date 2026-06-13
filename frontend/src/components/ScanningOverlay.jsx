import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STAGES = [
  "Detecting facial biometrics",
  "Checking interactive liveness",
  "Running deepfake neural analysis",
  "Calculating authenticity index"
]

function getStageIndex(data) {
  if (!data.face_detected) return 0

  const { blink, turn_left, turn_right } = data.challenge_completed || {}
  const livenessDone = blink && turn_left && turn_right

  if (!livenessDone) return 1

  if (data.risk_level === undefined || data.risk_level === null) return 2

  if (data.authenticity_score === undefined || data.authenticity_score === 0) return 3

  return 3
}

export default function ScanningOverlay({ data }) {
  if (data.verification_complete) return null

  const stageIndex = getStageIndex(data)

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm relative overflow-hidden">
      
      {/* Small top header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Analysis Pipeline
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">
          Step {stageIndex + 1} of 4
        </span>
      </div>

      {/* Checklist Grid */}
      <div className="flex flex-col gap-3.5">
        {STAGES.map((label, i) => {
          const status =
            i < stageIndex ? "done" :
            i === stageIndex ? "active" : "pending"

          return (
            <div key={label} className="flex items-center gap-3.5">
              {/* Left Indicator icon */}
              <div className="w-5 h-5 flex items-center justify-center">
                {status === "done" && (
                  <span className="text-emerald-600 font-extrabold text-sm bg-emerald-50 border border-emerald-100 rounded-full w-5 h-5 flex items-center justify-center">
                    ✓
                  </span>
                )}
                {status === "active" && (
                  <svg className="animate-spin h-4.5 w-4.5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {status === "pending" && (
                  <span className="h-2 w-2 rounded-full bg-slate-200 inline-block" />
                )}
              </div>

              {/* Text Label */}
              <div className="flex-1">
                <span
                  className={`text-xs font-semibold tracking-wide ${
                    status === "done" ? "text-slate-400 line-through decoration-slate-200" :
                    status === "active" ? "text-slate-900 font-bold" : "text-slate-400"
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Status Pill on the Right */}
              <div>
                {status === "done" && (
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                    OK
                  </span>
                )}
                {status === "active" && (
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                    Running
                  </span>
                )}
                {status === "pending" && (
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-50 text-slate-400 border border-slate-100">
                    Wait
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
