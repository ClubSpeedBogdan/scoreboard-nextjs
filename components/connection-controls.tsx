"use client"

import { Wifi, WifiOff, Loader2 } from "lucide-react"

interface ConnectionControlsProps {
  heatNumber: string
  onHeatNumberChange: (value: string) => void
  isConnected: boolean
  isConnecting: boolean
  onToggleConnection: () => void
}

export function ConnectionControls({
  heatNumber,
  onHeatNumberChange,
  isConnected,
  isConnecting,
  onToggleConnection,
}: ConnectionControlsProps) {
  return (
    <div className="flex justify-center gap-4 mb-8">
      <div className="relative">
        <input
          type="text"
          value={heatNumber}
          onChange={(e) => onHeatNumberChange(e.target.value)}
          placeholder="Heat Number"
          className="px-6 py-4 bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white text-lg font-medium w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 placeholder-gray-400"
          disabled={isConnected}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-xl -z-10"></div>
      </div>

      <button
        onClick={onToggleConnection}
        disabled={isConnecting}
        className={`relative px-8 py-4 rounded-xl text-lg font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 ${
          isConnected
            ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/25"
            : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-500/25"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl"></div>
        <div className="relative flex items-center gap-3">
          {isConnecting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isConnected ? (
            <WifiOff className="h-5 w-5" />
          ) : (
            <Wifi className="h-5 w-5" />
          )}
          {isConnecting ? "Connecting..." : isConnected ? "Disconnect" : "Connect"}
        </div>
      </button>
    </div>
  )
}
