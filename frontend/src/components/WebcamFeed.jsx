import { useEffect, useRef } from 'react'

export default function WebcamFeed({ onFrame, faceDetected = false }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    let interval

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch(err => console.error("Camera access error:", err))

    interval = setInterval(() => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (video && canvas && video.readyState === 4) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
        onFrame(dataUrl)
      }
    }, 500)

    return () => {
      clearInterval(interval)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [onFrame])

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-md aspect-video max-w-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover scale-x-[-1]" 
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* SVG Face Oval Guide (Stripe/Persona style) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <svg
          className={`w-3/5 h-4/5 transition-all duration-300 ${
            faceDetected ? 'text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'text-slate-400/80'
          }`}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Oval frame */}
          <path
            d="M50 10C28 10 28 45 28 55C28 73 38 90 50 90C62 90 72 73 72 55C72 45 72 10 50 10Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="4 3"
          />
          {/* Corner tick marks */}
          <path d="M22 35V20H37" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M78 35V20H63" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M22 65V80H37" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M78 65V80H63" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Alert instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-1.5 bg-slate-900/90 text-white rounded-full text-xs font-semibold tracking-wider text-center shadow-lg border border-slate-800">
        {faceDetected ? "FACE ALIGNED" : "POSITION FACE WITHIN GUIDE"}
      </div>
    </div>
  )
}
