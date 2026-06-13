import React from 'react'

export default function LandingPage({ onStartVerify, onOpenDashboard }) {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-xs font-semibold text-blue-700 mb-6 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
          Enterprise Trust Verification Platform
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl leading-tight">
          Verify digital identity with <span className="text-blue-600">absolute confidence</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
          Real-time, browser-based face verification with active liveness validation, passive deepfake prevention, and instant authenticity scoring. Built for secure onboarding.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <button
            onClick={onStartVerify}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 duration-200 text-center"
          >
            Launch Identity Sandbox
          </button>
          <button
            onClick={onOpenDashboard}
            className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 duration-200 text-center"
          >
            Open Developer Console
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 w-full max-w-4xl border-t border-slate-200/60 pt-10">
          <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-6">
            Trusted by security-focused platforms worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60 grayscale hover:grayscale-0 transition duration-300">
            <span className="text-lg font-bold tracking-tight text-slate-700">STRIPE</span>
            <span className="text-lg font-bold tracking-tight text-slate-700">PERSONA</span>
            <span className="text-lg font-bold tracking-tight text-slate-700">OKTA</span>
            <span className="text-lg font-bold tracking-tight text-slate-700">ONFIDO</span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-white border-t border-b border-slate-200/60 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Enterprise-Grade Biometric Security
            </h2>
            <p className="mt-4 text-slate-600">
              SmartFaceGuard combines multi-layered detection engines to establish high-confidence identity trust inside the browser in under 10 seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition duration-200">
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Face Detection</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Real-time landmark mapping tracks facial positioning, lighting quality, and gaze alignment within the capture area.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition duration-200">
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Active Liveness</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Prompts users with dynamic, random challenges like blinking and head turns to thwart static photo or pre-recorded video spoofing.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition duration-200">
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Deepfake Analysis</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Evaluates generative noise, micro-textures, and compression artifacts to detect AI-generated synthetic faces and avatars.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition duration-200">
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Authenticity Scoring</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Combines biometrics and neural net risk assessments into a single 0-100 trust score for automated or manual decision flows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Integration */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-2xl relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">
              Integrate in minutes, scale to millions
            </h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              We provide developer-friendly SDKs, webhook listeners, and detailed API responses designed to seamlessly plug into any onboarding workflow.
            </p>
            <button
              onClick={onStartVerify}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition duration-200"
            >
              Get Sandbox Credentials
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black">
              SF
            </span>
            <span className="font-bold text-slate-800 tracking-tight">SmartFaceGuard</span>
          </div>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} SmartFaceGuard Inc. All rights reserved. Built for security & compliance.
          </p>
        </div>
      </footer>
    </div>
  )
}
