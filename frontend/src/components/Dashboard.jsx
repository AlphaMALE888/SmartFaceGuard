import React, { useState } from 'react'

const initialMockLogs = [
  {
    id: "sf_628a8d5c",
    name: "Eleanor Vance",
    timestamp: "2026-06-13 14:15:32",
    authenticity_score: 94,
    confidence_level: "HIGH",
    risk_level: "LOW",
    deepfake_probability: 0.04,
    status: "Verified",
    face_detected: true,
    blink_count: 2,
    head_turn: "completed"
  },
  {
    id: "sf_9b2e1f40",
    name: "Arthur Pendelton",
    timestamp: "2026-06-13 13:42:10",
    authenticity_score: 22,
    confidence_level: "LOW",
    risk_level: "HIGH",
    deepfake_probability: 0.93,
    status: "Suspicious",
    face_detected: true,
    blink_count: 0,
    head_turn: "failed"
  },
  {
    id: "sf_a7c3b2e9",
    name: "Marcus Vance",
    timestamp: "2026-06-13 11:20:05",
    authenticity_score: 88,
    confidence_level: "HIGH",
    risk_level: "LOW",
    deepfake_probability: 0.08,
    status: "Verified",
    face_detected: true,
    blink_count: 1,
    head_turn: "completed"
  },
  {
    id: "sf_7f4d9c2e",
    name: "Julia Roberts (Clone)",
    timestamp: "2026-06-13 09:05:44",
    authenticity_score: 35,
    confidence_level: "MEDIUM",
    risk_level: "HIGH",
    deepfake_probability: 0.81,
    status: "Suspicious",
    face_detected: true,
    blink_count: 1,
    head_turn: "completed"
  },
  {
    id: "sf_8e1a3b5c",
    name: "Sophia Martinez",
    timestamp: "2026-06-12 18:30:12",
    authenticity_score: 97,
    confidence_level: "HIGH",
    risk_level: "LOW",
    deepfake_probability: 0.02,
    status: "Verified",
    face_detected: true,
    blink_count: 2,
    head_turn: "completed"
  }
]

export default function Dashboard({ sessionHistory = [] }) {
  // Combine custom sessionHistory with mock logs
  const combinedHistory = [...sessionHistory, ...initialMockLogs]
  const [selectedSession, setSelectedSession] = useState(combinedHistory[0])
  const [filter, setFilter] = useState('All')

  const filteredHistory = combinedHistory.filter(session => {
    if (filter === 'All') return true
    return session.status === filter
  })

  // Calculate high-level stats
  const total = combinedHistory.length
  const verifiedCount = combinedHistory.filter(s => s.status === 'Verified').length
  const suspiciousCount = combinedHistory.filter(s => s.status === 'Suspicious').length
  const passRate = total > 0 ? ((verifiedCount / total) * 100).toFixed(1) : 0
  const avgScore = total > 0 ? (combinedHistory.reduce((acc, s) => acc + s.authenticity_score, 0) / total).toFixed(0) : 0

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Developer Analytics Console
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time monitoring of active session verifications and deepfake risk models.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-600">Model Engine v1.4.2 Active</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Checks</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{total}</p>
            <p className="text-[10px] text-slate-400 mt-1.5 font-mono">Sandbox & Live events</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pass Rate</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{passRate}%</p>
            <div className="flex items-center gap-1 mt-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-slate-500">Industry benchmark: 92.4%</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Trust Score</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{avgScore}<span className="text-lg text-slate-400">/100</span></p>
            <p className="text-[10px] text-slate-400 mt-1.5 font-mono">Confidence margin &plusmn;3%</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Suspicious Intercepts</p>
            <p className="text-3xl font-extrabold text-rose-600 mt-2">{suspiciousCount}</p>
            <p className="text-[10px] text-slate-400 mt-1.5 font-mono">Deepfake & spoofing flags</p>
          </div>
        </div>

        {/* Main Work Area */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Logs Table (Left 8 Columns) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Table Header Filter */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-bold text-slate-900 text-lg">Verification Logs</h2>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
                {['All', 'Verified', 'Suspicious'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-3 py-1.5 rounded-md transition ${filter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                    <th className="py-3 px-6">Session ID</th>
                    <th className="py-3 px-6">Subject</th>
                    <th className="py-3 px-6">Timestamp</th>
                    <th className="py-3 px-6 text-center">Score</th>
                    <th className="py-3 px-6 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.map((session) => (
                    <tr
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className={`hover:bg-slate-50/60 cursor-pointer transition ${selectedSession?.id === session.id ? 'bg-blue-50/20' : ''}`}
                    >
                      <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-500">{session.id}</td>
                      <td className="py-4 px-6 font-medium text-slate-900">{session.name}</td>
                      <td className="py-4 px-6 text-slate-500 text-xs">{session.timestamp}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`font-mono font-bold text-sm ${session.authenticity_score >= 70 ? 'text-emerald-600' : session.authenticity_score >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                          {session.authenticity_score}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          session.status === 'Verified' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${session.status === 'Verified' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredHistory.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400 text-sm">
                        No sessions found for this status.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Details Panel (Right 4 Columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {selectedSession ? (
              <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-6 relative overflow-hidden flex flex-col">
                <div className="border-b border-slate-100 pb-4 mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Telemetry Inspector</span>
                  <h3 className="font-extrabold text-slate-900 text-lg mt-1">{selectedSession.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {selectedSession.id}</p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Status Box */}
                  <div className={`p-4 rounded-xl border ${
                    selectedSession.status === 'Verified' 
                      ? 'bg-emerald-50/40 border-emerald-100 text-emerald-950'
                      : 'bg-rose-50/40 border-rose-100 text-rose-950'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider">Verification State</span>
                      <span className={`text-xs font-extrabold ${selectedSession.status === 'Verified' ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {selectedSession.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Core Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center">
                      <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Authenticity</span>
                      <span className={`text-2xl font-black font-mono ${selectedSession.authenticity_score >= 70 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {selectedSession.authenticity_score}%
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center">
                      <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Deepfake Risk</span>
                      <span className={`text-2xl font-black font-mono ${selectedSession.risk_level === 'LOW' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {selectedSession.risk_level}
                      </span>
                    </div>
                  </div>

                  {/* Telemetry Details */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Face Detected:</span>
                      <span className="font-bold text-slate-800">{selectedSession.face_detected ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Blink Count:</span>
                      <span className="font-bold text-slate-800">{selectedSession.blink_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Head Turns Check:</span>
                      <span className="font-bold text-slate-800 capitalize">{selectedSession.head_turn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Deepfake Probability:</span>
                      <span className="font-mono font-bold text-slate-800">p = {selectedSession.deepfake_probability}</span>
                    </div>
                  </div>

                  {/* Trust Audit Checklist */}
                  <div className="mt-2">
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2.5">Trust Checklist</h4>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`h-4 w-4 rounded-full flex items-center justify-center font-bold ${selectedSession.face_detected ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>✓</span>
                        <span className="text-slate-600">Landmarks detected</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`h-4 w-4 rounded-full flex items-center justify-center font-bold ${selectedSession.blink_count > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {selectedSession.blink_count > 0 ? '✓' : '✗'}
                        </span>
                        <span className="text-slate-600">Active eye blink challenge</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`h-4 w-4 rounded-full flex items-center justify-center font-bold ${selectedSession.head_turn === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {selectedSession.head_turn === 'completed' ? '✓' : '✗'}
                        </span>
                        <span className="text-slate-600">Gaze alignment shifts</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`h-4 w-4 rounded-full flex items-center justify-center font-bold ${selectedSession.risk_level === 'LOW' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {selectedSession.risk_level === 'LOW' ? '✓' : '✗'}
                        </span>
                        <span className="text-slate-600">Generative noise analysis (Deepfake)</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-8 text-center text-slate-400 text-sm">
                Select a verification session to inspect telemetry details.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
