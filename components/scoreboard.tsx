"use client"

import { useEffect, useState, useRef } from "react"
import { ScoreboardRow } from "@/components/scoreboard-row"
import { useWebSocket } from "@/hooks/use-websocket"
import { Flag, Play, Pause } from "lucide-react"

export type RaceStatus = "waiting" | "starting" | "running" | "finished"

export interface Racer {
  id: string
  position: number
  previousPosition?: number
  name: string
  kartNumber: number
  currentLap: number
  lastLapTime: number | null // in milliseconds
  bestLapTime: number | null // in milliseconds
  gapToLeader: number | null // in milliseconds
  averageLapTime: number | null // in milliseconds
}

interface RawRacerData {
  id: string
  name: string
  kartNumber: number
  position: number
  currentLap: number
  lastLapTime: number | null
  bestLapTime: number | null
  totalTime: number
}

interface ScoreboardProps {
  heatId: string
}

export function Scoreboard({ heatId }: ScoreboardProps) {
  const [racers, setRacers] = useState<Racer[]>([])
  const [raceStatus, setRaceStatus] = useState<RaceStatus>("waiting")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const previousRacersRef = useRef<Racer[]>([])

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/Heats/GetScorecard?heatNo=${heatId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch scoreboard data")
        }

        const data = await response.json()
        const formattedRacers = formatRacerData(data.racers)
        setRacers(formattedRacers)
        setRaceStatus(data.status || "waiting")
        previousRacersRef.current = formattedRacers
      } catch (err) {
        setError("Failed to load scoreboard data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [heatId])

  // WebSocket connection for real-time updates
  const { lastMessage, connectionStatus } = useWebSocket(`wss://your-server/ws?channel=race_${heatId}`)

  // Process WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data)

        if (data.type === "scoreboard_update") {
          // Store previous positions before updating
          previousRacersRef.current = racers

          // Update with new data
          const formattedRacers = formatRacerData(data.racers)
          setRacers(formattedRacers)
        } else if (data.type === "race_status_update") {
          setRaceStatus(data.status)
        }
      } catch (err) {
        console.error("Error processing WebSocket message:", err)
      }
    }
  }, [lastMessage, racers])

  // Format racer data and calculate derived values
  const formatRacerData = (racerData: RawRacerData[]): Racer[] => {
    // Find the leader's time for gap calculation
    const leaderTime = racerData.find((r) => r.position === 1)?.totalTime || 0

    return racerData
      .map((racer) => {
        // Find previous position to detect changes
        const previousRacer = previousRacersRef.current.find((r) => r.id === racer.id)

        return {
          id: racer.id,
          position: racer.position,
          previousPosition: previousRacer?.position,
          name: racer.name,
          kartNumber: racer.kartNumber,
          currentLap: racer.currentLap,
          lastLapTime: racer.lastLapTime,
          bestLapTime: racer.bestLapTime,
          gapToLeader: racer.position === 1 ? null : racer.totalTime - leaderTime,
          averageLapTime: racer.currentLap > 0 ? racer.totalTime / racer.currentLap : null,
        }
      })
      .sort((a, b) => a.position - b.position)
  }

  // Render status indicator
  const renderStatusIndicator = () => {
    switch (raceStatus) {
      case "waiting":
        return (
          <div className="flex items-center gap-2 text-yellow-400">
            <Pause className="h-5 w-5" /> WAITING
          </div>
        )
      case "starting":
        return (
          <div className="flex items-center gap-2 text-yellow-400 animate-pulse">
            <Play className="h-5 w-5" /> STARTING
          </div>
        )
      case "running":
        return (
          <div className="flex items-center gap-2 text-green-400">
            <Play className="h-5 w-5" /> RACE IN PROGRESS
          </div>
        )
      case "finished":
        return (
          <div className="flex items-center gap-2 text-white">
            <Flag className="h-5 w-5" /> RACE COMPLETED
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="bg-zinc-900 rounded-lg p-6 text-white">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-8 bg-zinc-800 rounded w-1/4"></div>
          <div className="h-12 bg-zinc-800 rounded"></div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-zinc-800 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-zinc-900 rounded-lg p-6 text-white">
        <div className="text-red-400 font-medium">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
      <div className="p-4 flex justify-between items-center bg-zinc-800">
        <h2 className="text-xl font-bold text-white">Heat #{heatId}</h2>
        <div className="font-mono text-sm">{renderStatusIndicator()}</div>
        <div className="text-zinc-400 text-sm">
          {connectionStatus === "connected" ? (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span> Live
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span> Reconnecting...
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="bg-zinc-800/50 text-zinc-400 text-xs uppercase">
              <th className="px-4 py-3 text-left">Pos</th>
              <th className="px-4 py-3 text-left">Racer</th>
              <th className="px-4 py-3 text-center">Kart</th>
              <th className="px-4 py-3 text-center">Lap</th>
              <th className="px-4 py-3 text-right">Last Lap</th>
              <th className="px-4 py-3 text-right">Best Lap</th>
              <th className="px-4 py-3 text-right">Gap</th>
              <th className="px-4 py-3 text-right">Avg Lap</th>
            </tr>
          </thead>
          <tbody>
            {racers.map((racer) => (
              <ScoreboardRow key={racer.id} racer={racer} />
            ))}
            {racers.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">
                  No racers in this heat yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
