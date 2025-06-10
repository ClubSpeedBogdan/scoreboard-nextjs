"use client"

import type { ScorecardData } from "@/types/karting"
import { formatTime } from "@/lib/format-time"
import { Users, Trophy, Timer, Hash } from "lucide-react"

interface RaceInfoProps {
  heatNumber: string
  scoreboardData: ScorecardData
}

export function RaceInfo({ heatNumber, scoreboardData }: RaceInfoProps) {
  const racerCount = scoreboardData.scorecardRows?.length || 0

  const leader = scoreboardData.scorecardRows?.find((row) => row.position === 1)
  const leaderName = leader ? leader.nickname || `${leader.firstName} ${leader.lastName}` : "-"

  let bestLapTime = Number.POSITIVE_INFINITY
  scoreboardData.scorecardRows?.forEach((row) => {
    const lapTime = Number.parseFloat(row.fastestLapTime)
    if (lapTime && lapTime < bestLapTime) {
      bestLapTime = lapTime
    }
  })

  const infoCards = [
    {
      title: "Heat #",
      value: heatNumber,
      icon: <Hash className="h-6 w-6" />,
      gradient: "from-blue-500 to-blue-600",
      shadowColor: "shadow-blue-500/25",
    },
    {
      title: "Racers",
      value: racerCount.toString(),
      icon: <Users className="h-6 w-6" />,
      gradient: "from-purple-500 to-purple-600",
      shadowColor: "shadow-purple-500/25",
    },
    {
      title: "Leader",
      value: leaderName,
      icon: <Trophy className="h-6 w-6" />,
      gradient: "from-yellow-500 to-yellow-600",
      shadowColor: "shadow-yellow-500/25",
    },
    {
      title: "Best Lap",
      value: bestLapTime < Number.POSITIVE_INFINITY ? formatTime(bestLapTime) : "-",
      icon: <Timer className="h-6 w-6" />,
      gradient: "from-green-500 to-green-600",
      shadowColor: "shadow-green-500/25",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {infoCards.map((card, index) => (
        <div key={card.title} className="relative group">
          <div
            className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
          ></div>
          <div
            className={`relative bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-lg ${card.shadowColor} transform hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 bg-gradient-to-r ${card.gradient} rounded-lg text-white`}>{card.icon}</div>
              <div className={`h-2 w-2 bg-gradient-to-r ${card.gradient} rounded-full animate-pulse`}></div>
            </div>
            <h3 className="text-sm text-gray-400 mb-2 font-medium uppercase tracking-wider">{card.title}</h3>
            <p className="text-2xl font-bold text-white truncate" title={card.value}>
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
