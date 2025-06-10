"use client"

import type { ScorecardData } from "@/types/karting"
import { formatTime, formatGap } from "@/lib/format-time"
import { Crown, Medal, Award, Zap } from "lucide-react"

interface ScoreboardTableProps {
  data: ScorecardData
}

export function ScoreboardTable({ data }: ScoreboardTableProps) {
  if (!data.scorecardRows || data.scorecardRows.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-800/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12">
            <div className="text-6xl mb-4">🏁</div>
            <p className="text-2xl text-gray-400 font-medium">No race data available</p>
          </div>
        </div>
      </div>
    )
  }

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-300" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return null
    }
  }

  const getPositionStyle = (position: number) => {
    switch (position) {
      case 1:
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
      case 2:
        return "text-gray-300 bg-gray-300/10 border-gray-300/30"
      case 3:
        return "text-amber-600 bg-amber-600/10 border-amber-600/30"
      default:
        return "text-white bg-gray-700/30 border-gray-600/30"
    }
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 via-gray-900/20 to-gray-800/20 rounded-2xl blur-xl"></div>
      <div className="relative bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-b border-gray-700/50">
                <th className="px-6 py-5 text-left font-bold uppercase text-sm tracking-wider text-gray-300">
                  Position
                </th>
                <th className="px-6 py-5 text-left font-bold uppercase text-sm tracking-wider text-gray-300">Kart</th>
                <th className="px-6 py-5 text-left font-bold uppercase text-sm tracking-wider text-gray-300">Driver</th>
                <th className="px-6 py-5 text-center font-bold uppercase text-sm tracking-wider text-gray-300">Lap</th>
                <th className="px-6 py-5 text-right font-bold uppercase text-sm tracking-wider text-gray-300">
                  Last Lap
                </th>
                <th className="px-6 py-5 text-right font-bold uppercase text-sm tracking-wider text-gray-300">
                  Best Lap
                </th>
                <th className="px-6 py-5 text-right font-bold uppercase text-sm tracking-wider text-gray-300">Gap</th>
                <th className="px-6 py-5 text-right font-bold uppercase text-sm tracking-wider text-gray-300 hidden lg:table-cell">
                  Avg Lap
                </th>
                <th className="px-6 py-5 text-center font-bold uppercase text-sm tracking-wider text-gray-300 hidden xl:table-cell">
                  Races
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {data.scorecardRows.map((row, index) => (
                <tr
                  key={row.guestId}
                  className={`group hover:bg-gray-700/30 transition-all duration-300 ${
                    row.isUpdated ? "animate-pulse bg-blue-600/20" : ""
                  } ${index % 2 === 0 ? "bg-gray-800/20" : "bg-gray-900/20"}`}
                >
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${getPositionStyle(row.position)}`}
                    >
                      {getPositionIcon(row.position)}
                      <span className="text-2xl font-black">{row.position}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-xl blur-sm"></div>
                      <span className="relative bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl font-black text-lg shadow-lg">
                        #{row.kartId}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-white font-semibold text-lg">
                          {row.nickname || `${row.firstName} ${row.lastName}`}
                        </div>
                        {row.isFirstTime && (
                          <div className="flex items-center gap-1 mt-1">
                            <Zap className="h-3 w-3 text-yellow-400" />
                            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-2 py-0.5 rounded-full text-xs font-bold uppercase">
                              Rookie
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      Lap {row.lapNum}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono font-bold text-lg text-white bg-gray-700/30 px-3 py-1 rounded-lg">
                      {formatTime(row.ambTime)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono font-bold text-lg text-purple-400 bg-purple-400/10 px-3 py-1 rounded-lg border border-purple-400/30">
                      {formatTime(row.fastestLapTime)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-red-400 bg-red-400/10 px-3 py-1 rounded-lg border border-red-400/30">
                      {formatGap(row.gap)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right hidden lg:table-cell">
                    <span className="font-mono font-bold text-lg text-gray-300 bg-gray-700/30 px-3 py-1 rounded-lg">
                      {formatTime(row.averageLapTime)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center hidden xl:table-cell">
                    <span className="text-gray-300 bg-gray-700/30 px-3 py-1 rounded-lg font-semibold">
                      {row.totalRaces || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
