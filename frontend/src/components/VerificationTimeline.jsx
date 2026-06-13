import React from 'react'
import { motion } from 'framer-motion'

export default function VerificationTimeline({ data }) {
  if (!data.verification_complete) return null

  const completed = data.challenge_completed || {}
  const deepfakePassed = data.risk_level === "LOW"

  const items = [
    { label: "Face Alignment Confirmed", done: data.face_detected },
    { label: "Blink Liveness Challenge Passed", done: completed.blink ?? false },
    { label: "Left-Turn Liveness Challenge Passed", done: completed.turn_left ?? false },
    { label: "Right-Turn Liveness Challenge Passed", done: completed.turn_right ?? false },
    { label: "Generative Spoof (Deepfake) Check Clear", done: deepfakePassed },
  ]

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Security Audit Trail
        </span>
      </div>

      <div className="relative flex flex-col gap-5 pl-4 border-l border-slate-100">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            className="relative flex items-center gap-3.5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            {/* Timeline node circle */}
            <span
              className={`absolute -left-[27.5px] flex items-center justify-center h-5 w-5 rounded-full text-[9px] font-extrabold shadow-sm ${
                item.done
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {item.done ? "✓" : "✗"}
            </span>

            {/* Timeline label text */}
            <span
              className={`text-xs font-semibold ${
                item.done ? "text-slate-700" : "text-slate-400"
              }`}
            >
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
