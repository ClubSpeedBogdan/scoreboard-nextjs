"use client"

import { useEffect, useState } from "react"
import type { Racer } from "@/components/scoreboard"
import { formatTime } from "@/lib/format-time"
import { ChevronUp, ChevronDown } from "lucide-react"

interface ScoreboardRowProps {
  racer: Racer
}

export function ScoreboardRow({ racer }: ScoreboardRowProps) {
  const [highlight, setHighlight] = useState(false)

  // Determine position change
  const positionChange =
    racer.previousPosition !== undefined && racer.position !== racer.previousPosition
      ? racer.position < racer.previousPosition
        ? "improved"
        : "dropped"
      : null

  // Highlight row on position change
  useEffect(() => {
    if (positionChange) {
      setHighlight(true)
      const timer = setTimeout(() => setHighlight(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [positionChange, racer.position])

  // Determine row background based on position and highlight state
  const getRowBackground = () => {
    if (highlight) {
      return positionChange === "improved" ? "bg-green-900/20 animate-pulse" : "bg-red-900/20 animate-pulse"
    }

    return racer.position % 2 === 0 ? "bg-zinc-900" : "bg-zinc-950"
  }

  // Render position change indicator
  const renderPositionChange = () => {
    if (!positionChange) return null

    if (positionChange === "improved") {
      return <ChevronUp className="h-4 w-4 text-green-400" />
    } else {
      return <ChevronDown className="h-4 w-4 text-red-400" />
    }
  }

  return (
    <tr className={`${getRowBackground()} transition-colors`}>
      <td className="px-4 py-3 font-mono text-lg font-bold">
        <div className="flex items-center gap-1">
          {racer.position}
          {renderPositionChange()}
        </div>
      </td>
      <td className="px-4 py-3 font-medium">{racer.name}</td>
      <td className="px-4 py-3 text-center">
        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-zinc-800 text-white font-mono">
          {racer.kartNumber}
        </span>
      </td>
      <td className="px-4 py-3 text-center font-mono">{racer.currentLap}</td>
      <td className="px-4 py-3 text-right font-mono">{racer.lastLapTime ? formatTime(racer.lastLapTime) : "-"}</td>
      <td className="px-4 py-3 text-right font-mono text-yellow-400">
        {racer.bestLapTime ? formatTime(racer.bestLapTime) : "-"}
      </td>
      <td className="px-4 py-3 text-right font-mono">
        {racer.gapToLeader ? formatTime(racer.gapToLeader, true) : "-"}
      </td>
      <td className="px-4 py-3 text-right font-mono">
        {racer.averageLapTime ? formatTime(racer.averageLapTime) : "-"}
      </td>
    </tr>
  )
}
