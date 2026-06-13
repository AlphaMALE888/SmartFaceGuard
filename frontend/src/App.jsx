import { useCallback, useState, useRef } from 'react'
import WebcamFeed from './components/WebcamFeed'
import StatusPanel from './components/StatusPanel'
import ScoreCard from './components/ScoreCard'
import ChallengePanel from './components/ChallengePanel'
import VerificationResultCard from './components/VerificationResultCard'
import VerificationTimeline from './components/VerificationTimeline'
import ScanningOverlay from './components/ScanningOverlay'
import DemoMode from './components/DemoMode'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'

const API_URL = "http://localhost:8000"

const INITIAL_DATA = {
  face_detected: false,
  blink_count: 0,
  head_turn: "none",
  authenticity_score: 0,
  confidence_level: "LOW",
  current_challenge: "blink",
  challenge_completed: { blink: false, turn_left: false, turn_right: false },
  verification_complete: false,
  deepfake_probability: 0.0,
  risk_level: "LOW"
}

export default function App() {
  const [view, setView] = useState('landing') // 'landing' | 'verify' | 'dashboard'
  const [data, setData] = useState(INITIAL_DATA)
  const [demoRunning, setDemoRunning] = useState(false)
  const [sessionHistory, setSessionHistory] = useState([])
  const sessionIdRef = useRef(null)

  const handleReset = async () => {
    try {
      const headers = {}
      if (sessionIdRef.current) {
        headers['X-Session-ID'] = sessionIdRef.current
      }
      const res = await fetch(`${API_URL}/reset`, {
        method: 'POST',
        headers
      })
      const json = await res.json()
      if (json.session_id) {
        sessionIdRef.current = json.session_id
      }
      setData(INITIAL_DATA)
    } catch (err) {
      console.error("Reset error:", err)
      setData(INITIAL_DATA)
    }
  }

  // Push session to history logs when verification succeeds
  const logSessionResult = useCallback((sessionData) => {
    if (sessionData.verification_complete) {
      const isVerified = sessionData.authenticity_score >= 70 && sessionData.risk_level === "LOW"
      const sessionKey = sessionData.session_id 
        ? `sf_${sessionData.session_id.substring(0, 8)}`
        : `sf_${Math.random().toString(36).substring(2, 10)}`
      
      const newLog = {
        id: sessionKey,
        name: "Sandbox User Check",
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        authenticity_score: sessionData.authenticity_score,
        confidence_level: sessionData.confidence_level,
        risk_level: sessionData.risk_level,
        deepfake_probability: sessionData.deepfake_probability,
        status: isVerified ? "Verified" : "Suspicious",
        face_detected: sessionData.face_detected,
        blink_count: sessionData.blink_count,
        head_turn: (sessionData.challenge_completed?.turn_left && sessionData.challenge_completed?.turn_right) ? "completed" : "incomplete"
      }

      setSessionHistory(prev => {
        if (prev.some(s => s.id === newLog.id)) return prev
        return [newLog, ...prev]
      })
    }
  }, [])

  const handleFrame = useCallback(async (dataUrl) => {
    if (demoRunning) return

    try {
      const headers = { 'Content-Type': 'application/json' }
      if (sessionIdRef.current) {
        headers['X-Session-ID'] = sessionIdRef.current
      }

      const res = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ image: dataUrl })
      })
      const json = await res.json()

      if (json.error) {
        console.error("Analyze error:", json.error)
        return
      }

      if (json.session_id) {
        sessionIdRef.current = json.session_id
      }

      setData(json)
      logSessionResult(json)
    } catch (err) {
      console.error("Analyze error:", err)
    }
  }, [demoRunning, logSessionResult])

  const handleDemoResult = useCallback((step) => {
    setData(step)
    logSessionResult(step)
  }, [logSessionResult])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setView('landing')}>
            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/10">
              <span className="font-extrabold text-sm">SF</span>
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-lg block">SmartFaceGuard</span>
              <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block -mt-1">Identity & Trust</span>
            </div>
          </div>

          <nav className="flex items-center gap-1 md:gap-2">
            <button
              onClick={() => setView('landing')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${view === 'landing' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Home
            </button>
            <button
              onClick={() => { setView('verify'); handleReset(); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${view === 'verify' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Sandbox Verify
            </button>
            <button
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${view === 'dashboard' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Dashboard
            </button>
          </nav>
        </div>
      </header>

      {/* Main View Render */}
      <main className="flex-1">
        {view === 'landing' && (
          <LandingPage
            onStartVerify={() => { setView('verify'); handleReset(); }}
            onOpenDashboard={() => setView('dashboard')}
          />
        )}

        {view === 'dashboard' && (
          <Dashboard sessionHistory={sessionHistory} />
        )}

        {view === 'verify' && (
          <div className="py-10 px-6 max-w-6xl mx-auto">
            <div className="mb-8 text-center">
              <span className="text-xs uppercase font-extrabold text-blue-600 tracking-widest">Verification Sandbox</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Liveness Check Sandbox</h2>
              <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                Test our facial verification pipeline and liveness challenges inside this isolated developer workspace.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Webcam Viewport Column (Left) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-slate-100 rounded-lg shadow-sm">
                    <span className={`h-2 w-2 rounded-full ${demoRunning ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      {demoRunning ? 'Simulation Active' : 'Live Camera Feed'}
                    </span>
                  </div>
                  
                  <WebcamFeed onFrame={handleFrame} faceDetected={data.face_detected} />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleReset}
                    className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl shadow-sm transition active:scale-98 text-center text-sm"
                  >
                    Reset Challenge Session
                  </button>

                  <div className="w-1/3">
                    <DemoMode
                      running={demoRunning}
                      setRunning={setDemoRunning}
                      onResult={handleDemoResult}
                    />
                  </div>
                </div>
              </div>

              {/* Status and Telemetry Column (Right) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Liveness challenge active instructions */}
                <ChallengePanel
                  currentChallenge={data.current_challenge}
                  completed={data.challenge_completed}
                  verificationComplete={data.verification_complete}
                />

                {/* System check checklist */}
                <ScanningOverlay data={data} />

                {/* Score representation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ScoreCard score={data.authenticity_score} />
                  <StatusPanel data={data} />
                </div>

                {/* Telemetry output timeline & final card */}
                <VerificationTimeline data={data} />
                <VerificationResultCard data={data} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
