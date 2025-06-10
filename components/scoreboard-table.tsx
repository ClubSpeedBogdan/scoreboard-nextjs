"use client"

import type { ScorecardData } from "@/types/karting"
import { formatTime, formatGap } from "@/lib/format-time"
import { Trophy, Medal, Award } from "lucide-react"

interface ScoreboardTableProps {
  data: ScorecardData
}

export function ScoreboardTable({ data }: ScoreboardTableProps) {
  if (!data.scorecardRows || data.scorecardRows.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12">
            <Trophy className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <p className="text-2xl text-gray-400 font-medium">No race data available</p>
          </div>
        </div>
      </div>
    )
  }

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400" />
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
        return "text-white bg-gray-700/50 border-gray-600/50"
    }
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-900/20 rounded-2xl blur-xl"></div>
      <div className="relative bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-700 to-gray-800 border-b border-gray-600/50">
                <th className="px-4 py-4 text-left font-bold uppercase text-sm tracking-wider text-white">Position</th>
                <th className="px-4 py-4 text-left font-bold uppercase text-sm tracking-wider text-white">Kart</th>
                <th className="px-4 py-4 text-left font-bold uppercase text-sm tracking-wider text-white">Driver</th>
                <th className="px-4 py-4 text-center font-bold uppercase text-sm tracking-wider text-white">Lap</th>
                <th className="px-4 py-4 text-right font-bold uppercase text-sm tracking-wider text-white">
                  Last Time
                </th>
                <th className="px-4 py-4 text-right font-bold uppercase text-sm tracking-wider text-white">
                  Best Time
                </th>
                <th className="px-4 py-4 text-right font-bold uppercase text-sm tracking-wider text-white">Gap</th>
                <th className="px-4 py-4 text-right font-bold uppercase text-sm tracking-wider text-white hidden lg:table-cell">
                  Avg Time
                </th>
                <th className="px-4 py-4 text-center font-bold uppercase text-sm tracking-wider text-white hidden xl:table-cell">
                  Races
                </th>
              </tr>
            </thead>
            <tbody>
              {data.scorecardRows.map((row, index) => (
                <tr
                  key={row.guestId}
                  className={`border-b border-gray-700/30 transition-all duration-300 hover:bg-gray-700/30 ${
                    row.isUpdated ? "bg-green-600/20 shadow-lg shadow-green-500/20" : ""
                  } ${index % 2 === 0 ? "bg-gray-800/30" : "bg-gray-900/30"}`}
                >
                  {/* Position */}
                  <td className="px-4 py-4">
                    <div
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${getPositionStyle(row.position)}`}
                    >
                      {getPositionIcon(row.position)}
                      <span className="text-2xl font-black">{row.position}</span>
                    </div>
                  </td>

                  {/* Kart */}
                  <td className="px-4 py-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-lg blur-sm"></div>
                      <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-2 rounded-lg font-bold text-center min-w-12 shadow-lg">
                        {row.kartId}
                      </div>
                    </div>
                  </td>

                  {/* Driver */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold text-lg">
                          {row.nickname || `${row.firstName} ${row.lastName}`}
                        </span>
                        {row.isFirstTime && (
                          <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                            ROOKIE
                          </span>
                        )}
                      </div>
                      <span className="text-gray-400 text-sm">
                        {row.firstName} {row.lastName}
                      </span>
                    </div>
                  </td>

                  {/* Lap */}
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center justify-center">
                      <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                        Lap {row.lapNum}
                      </span>
                    </div>
                  </td>

                  {/* Last Time */}
                  <td className="px-4 py-4 text-right">
                    <span className="font-mono font-bold text-lg text-white bg-gray-700/50 px-3 py-1 rounded-lg">
                      {formatTime(row.ambTime)}
                    </span>
                  </td>

                  {/* Best Time */}
                  <td className="px-4 py-4 text-right">
                    <span className="font-mono font-bold text-lg text-purple-400 bg-purple-400/10 px-3 py-1 rounded-lg border border-purple-400/30">
                      {formatTime(row.fastestLapTime)}
                    </span>
                  </td>

                  {/* Gap */}
                  <td className="px-4 py-4 text-right">
                    <span className="font-mono text-red-400 bg-red-400/10 px-3 py-1 rounded-lg border border-red-400/30">
                      {formatGap(row.gap)}
                    </span>
                  </td>

                  {/* Average Time */}
                  <td className="px-4 py-4 text-right hidden lg:table-cell">
                    <span className="font-mono font-bold text-lg text-green-400 bg-green-400/10 px-3 py-1 rounded-lg border border-green-400/30">
                      {formatTime(row.averageLapTime)}
                    </span>
                  </td>

                  {/* Total Races */}
                  <td className="px-4 py-4 text-center hidden xl:table-cell">
                    <span className="text-white bg-gray-700/50 px-3 py-1 rounded-lg font-semibold">
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
