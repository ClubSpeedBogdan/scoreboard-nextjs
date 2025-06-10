"use client"

import type { ConnectionStatus } from "@/types/karting"
import { Wifi, WifiOff, Loader2 } from "lucide-react"

interface StatusIndicatorProps {
  status: ConnectionStatus
  heatNumber: string | null
}

export function StatusIndicator({ status, heatNumber }: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          className: "from-green-600 to-green-700 shadow-green-500/25",
          text: heatNumber ? `Connected to Heat #${heatNumber}` : "Connected",
          icon: <Wifi className="h-5 w-5" />,
          pulse: "bg-green-400",
        }
      case "connecting":
        return {
          className: "from-yellow-600 to-yellow-700 shadow-yellow-500/25",
          text: "Connecting...",
          icon: <Loader2 className="h-5 w-5 animate-spin" />,
          pulse: "bg-yellow-400",
        }
      case "disconnected":
      default:
        return {
          className: "from-red-600 to-red-700 shadow-red-500/25",
          text: "Disconnected",
          icon: <WifiOff className="h-5 w-5" />,
          pulse: "bg-red-400",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className="flex justify-center mb-8">
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r ${config.className} rounded-xl blur-xl opacity-50`}></div>
        <div
          className={`relative bg-gradient-to-r ${config.className} text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-3`}
        >
          <div className={`h-3 w-3 ${config.pulse} rounded-full animate-pulse`}></div>
          {config.icon}
          {config.text}
        </div>
      </div>
    </div>
  )
}
