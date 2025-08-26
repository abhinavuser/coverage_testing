"use client"

export default function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-rose-25 to-orange-50" />

      <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-red-400/30 to-orange-400/20 rounded-full animate-pulse-glow blur-sm" />
      <div className="absolute top-2/3 right-1/3 w-32 h-32 bg-gradient-to-br from-rose-400/25 to-pink-400/15 rounded-full animate-float-slow blur-md" />
      <div className="absolute bottom-1/4 left-1/2 w-20 h-20 bg-gradient-to-br from-orange-400/35 to-red-400/25 rounded-full animate-float-reverse blur-sm" />

      <div className="absolute top-1/3 left-1/6 w-3 h-3 bg-red-500/60 rounded-full animate-float-fast shadow-lg shadow-red-500/40" />
      <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-orange-500/70 rounded-full animate-float-medium shadow-lg shadow-orange-500/50" />
      <div className="absolute bottom-1/3 left-2/3 w-4 h-4 bg-rose-500/50 rounded-full animate-pulse-slow shadow-lg shadow-rose-500/30" />
      <div className="absolute top-3/4 left-1/3 w-2.5 h-2.5 bg-red-400/80 rounded-full animate-float-diagonal shadow-lg shadow-red-400/60" />
      <div className="absolute top-1/6 right-2/3 w-1.5 h-1.5 bg-orange-400/90 rounded-full animate-float-fast shadow-md shadow-orange-400/70" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 top-1/4 left-1/4 border border-red-300/20 rounded-full animate-ripple-1" />
        <div className="absolute w-80 h-80 top-1/3 right-1/4 border border-orange-300/15 rounded-full animate-ripple-2" />
        <div className="absolute w-64 h-64 bottom-1/3 left-1/3 border border-rose-300/25 rounded-full animate-ripple-3" />
      </div>

      <div className="absolute top-1/6 right-1/6 w-12 h-12 opacity-20 animate-rotate-slow">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,10 90,35 90,65 50,90 10,65 10,35" fill="none" stroke="rgb(239, 68, 68)" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute bottom-1/6 left-1/5 w-8 h-8 opacity-15 animate-float-medium">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgb(251, 146, 60)" strokeWidth="3" />
          <circle cx="50" cy="50" r="20" fill="rgb(251, 146, 60)" opacity="0.3" />
        </svg>
      </div>
    </div>
  )
}
