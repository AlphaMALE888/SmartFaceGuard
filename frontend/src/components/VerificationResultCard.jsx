import React from 'react'

export default function VerificationResultCard({ data }) {
  if (!data.verification_complete) return null

  const { authenticity_score, confidence_level, risk_level, deepfake_probability, session_id } = data

  const deepfakeOk = risk_level === "LOW"
  const isVerified = authenticity_score >= 70 && deepfakeOk

  const scoreColor =
    authenticity_score >= 70 ? "text-emerald-600" :
    authenticity_score >= 50 ? "text-amber-600" : "text-rose-600"

  const riskColor =
    risk_level === "LOW" ? "text-emerald-600" :
    risk_level === "MEDIUM" ? "text-amber-600" : "text-rose-600"

  const checks = [
    { label: "Face Alignment Check", done: data.face_detected },
    { label: "Blink Liveness", done: data.challenge_completed?.blink ?? false },
    { label: "Head Turns Challenge", done: (data.challenge_completed?.turn_left ?? false) && (data.challenge_completed?.turn_right ?? false) },
    { label: "Deepfake Spoof Filter", done: deepfakeOk },
  ]

  return (
    <div className="relative w-full mx-auto">
      {/* Light glow behind verified card */}
      <div className={`absolute -inset-1 rounded-2xl blur-xl opacity-20 ${
        isVerified ? 'bg-emerald-500' : 'bg-rose-500'
      }`} />

      <div className="relative bg-white border border-slate-200/60 rounded-2xl p-6 shadow-md">
        
        {/* Card Header Status */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isVerified ? 'bg-emerald-400' : 'bg-rose-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isVerified ? 'bg-emerald-500' : 'bg-rose-500'
              }`} />
            </span>
            <h2 className="text-sm font-extrabold text-slate-800 tracking-wide">
              VERIFICATION SUMMARY
            </h2>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
              isVerified
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {isVerified ? "Verified" : "Suspicious"}
          </span>
        </div>

        {/* Small checklist of requirements */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {checks.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2"
            >
              <span className={`text-xs font-extrabold ${item.done ? "text-emerald-600" : "text-rose-600"}`}>
                {item.done ? "✓" : "✗"}
              </span>
              <span className="text-[10px] font-semibold text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Telemetry Breakdown Details */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">
              Authenticity
            </p>
            <p className={`text-2xl font-black font-mono ${scoreColor}`}>
              {authenticity_score}%
            </p>
            <p className="text-[9px] text-slate-400 font-bold mt-0.5">{confidence_level} CONFIDENCE</p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">
              Deepfake Risk
            </p>
            <p className={`text-2xl font-black font-mono ${riskColor}`}>
              {risk_level}
            </p>
            <p className="text-[9px] text-slate-400 font-bold mt-0.5">
              p = {deepfake_probability?.toFixed(3) ?? "0.00"}
            </p>
          </div>
        </div>

        {/* Signature stamp */}
        <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          <span>SmartFaceGuard Trust Engine</span>
          <span className="font-mono text-slate-400 normal-case">
            ID: {session_id ? session_id.substring(0, 12) : "sandbox_test"}
          </span>
        </div>
      </div>
    </div>
  )
}
