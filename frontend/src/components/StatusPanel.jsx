import React from 'react'

export default function StatusPanel({ data }) {
  return (
    <div className="grid grid-cols-2 gap-3 text-slate-800 h-full">
      {/* Face Detected */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Face Detected</p>
        <p className={`text-xl font-extrabold mt-1.5 ${data.face_detected ? 'text-emerald-600' : 'text-rose-600'}`}>
          {data.face_detected ? "Detected" : "None"}
        </p>
      </div>

      {/* Blink Count */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Blink Count</p>
        <p className="text-xl font-extrabold mt-1.5 text-blue-600 font-mono">
          {data.blink_count}
        </p>
      </div>

      {/* Head Turn */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Head Position</p>
        <p className="text-xl font-extrabold mt-1.5 text-slate-800 capitalize">
          {data.head_turn || "center"}
        </p>
      </div>

      {/* Deepfake Risk */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Deepfake Risk</p>
        <p className={`text-base font-extrabold mt-1.5 ${
          data.risk_level === "LOW" ? "text-emerald-600" :
          data.risk_level === "MEDIUM" ? "text-amber-600" : "text-rose-600"
        }`}>
          {data.risk_level || "LOW"}
          <span className="text-[10px] text-slate-400 block font-normal font-mono -mt-0.5">
            p = {data.deepfake_probability?.toFixed(2) ?? "0.00"}
          </span>
        </p>
      </div>
    </div>
  )
}
