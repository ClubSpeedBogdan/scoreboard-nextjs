"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ScoreboardTable } from "@/components/scoreboard-table"
import { RaceInfo } from "@/components/race-info"
import { ConnectionControls } from "@/components/connection-controls"
import { StatusIndicator } from "@/components/status-indicator"
import { useKartingWebSocket } from "@/hooks/use-karting-websocket"
import type { ScorecardData, ConnectionStatus, ScorecardRow } from "@/types/karting"
import { Flag, Zap } from "lucide-react"

export function KartingScoreboard() {
  const [heatNumber, setHeatNumber] = useState("1")
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected")
  const [scoreboardData, setScoreboardData] = useState<ScorecardData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [messages, setMessages] = useState<string[]>([])
  const lastUpdateTimeRef = useRef<Record<string, number>>({})
  const previousDataRef = useRef<ScorecardData | null>(null)

  const { connect, disconnect, isConnecting } = useKartingWebSocket({
    onStatusChange: setConnectionStatus,
    onMessage: () => {
      log("Received Data")
      if (heatNumber) {
        fetchRaceData(heatNumber)
      }
    },
    onConnect: () => {
      setIsConnected(true)
      log(`Connected to race_${heatNumber}`)
    },
    onDisconnect: () => {
      setIsConnected(false)
      log("Disconnected")
    },
    onError: (error) => {
      log(`Error: ${error}`)
    },
  })

  const log = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `${timestamp}: ${message}`
    setMessages((prev) => [...prev.slice(-49), logMessage])
  }

  const fetchRaceData = useCallback(async (heatNo: string) => {
    try {
      const response = await fetch(`https://unified-data-api.resova.io/api/Heats/GetScorecard?heatNo=${heatNo}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.scorecardRows) {
        const currentTime = Date.now()

        // Compare with previous data to detect actual changes
        data.scorecardRows.forEach((row: ScorecardRow) => {
          const rowId = `racer-${row.guestId}`
          const previousRow = previousDataRef.current?.scorecardRows?.find((r) => r.guestId === row.guestId)

          // Only mark as updated if there's an actual change in meaningful data
          const hasChanged =
            !previousRow ||
            previousRow.lapNum !== row.lapNum ||
            previousRow.position !== row.position ||
            previousRow.ambTime !== row.ambTime ||
            previousRow.fastestLapTime !== row.fastestLapTime

          if (hasChanged) {
            row.isUpdated = true
            lastUpdateTimeRef.current[rowId] = currentTime

            // Clear the update flag after 2 seconds
            setTimeout(() => {
              setScoreboardData((prevData) => {
                if (!prevData) return prevData
                return {
                  ...prevData,
                  scorecardRows: prevData.scorecardRows.map((r) =>
                    r.guestId === row.guestId ? { ...r, isUpdated: false } : r,
                  ),
                }
              })
            }, 2000)
          } else {
            row.isUpdated = false
          }
        })

        // Store current data as previous for next comparison
        previousDataRef.current = JSON.parse(JSON.stringify(data))
      }

      setScoreboardData(data)
    } catch (error) {
      log(`Error fetching scorecard: ${error instanceof Error ? error.message : "Unknown error"}`)
      console.error("Fetch error:", error)
    }
  }, [log])

  const handleConnect = useCallback(() => {
    if (!heatNumber) {
      alert("Please enter a heat number")
      return
    }

    const channel = `race_${heatNumber}`
    connect(`wss://unified-pub-sub.resova.io/ws?channel=${channel}`)
    fetchRaceData(heatNumber)
  }, [heatNumber, connect, fetchRaceData])

  const handleDisconnect = () => {
    disconnect()
    setScoreboardData(null)
    previousDataRef.current = null
  }

  const toggleConnection = () => {
    if (isConnected) {
      handleDisconnect()
    } else {
      handleConnect()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "d" && e.ctrlKey) {
        e.preventDefault()
        setShowMessages((prev) => !prev)
      }
    }

    const handleEnterKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isConnected) {
        handleConnect()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keydown", handleEnterKey)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keydown", handleEnterKey)
    }
  }, [isConnected, heatNumber, handleConnect])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fillOpacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="text-center mb-10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-yellow-500/20 to-red-600/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-gradient-to-r from-gray-800/90 via-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Flag className="h-8 w-8 text-yellow-400 animate-pulse" />
              <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 uppercase tracking-wider">
                Live Race
              </h1>
              <Zap className="h-8 w-8 text-yellow-400 animate-pulse" />
            </div>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full mb-4"></div>
            <p className="text-xl text-gray-300 font-medium">
              {isConnected ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></span>
                  Heat #{heatNumber} - Live Results
                </span>
              ) : (
                "Connect to a race to see live results"
              )}
            </p>
          </div>
        </div>

        {/* Enhanced Controls */}
        <ConnectionControls
          heatNumber={heatNumber}
          onHeatNumberChange={setHeatNumber}
          isConnected={isConnected}
          isConnecting={isConnecting}
          onToggleConnection={toggleConnection}
        />

        {/* Enhanced Status */}
        <StatusIndicator status={connectionStatus} heatNumber={isConnected ? heatNumber : null} />

        {/* Enhanced Race Info */}
        {isConnected && scoreboardData && <RaceInfo heatNumber={heatNumber} scoreboardData={scoreboardData} />}

        {/* Enhanced Scoreboard */}
        <div className="mb-8">
          {scoreboardData ? (
            <ScoreboardTable data={scoreboardData} />
          ) : (
            <div className="text-center py-20">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12">
                  <Flag className="h-16 w-16 text-gray-500 mx-auto mb-4 animate-bounce" />
                  <p className="text-2xl text-gray-400 font-medium">
                    {isConnected ? "Loading race data..." : "Connect to a race to view live timing data"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Debug Messages */}
        {showMessages && (
          <div className="mt-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl blur-xl"></div>
            <div className="relative bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 text-gray-300 mb-4 font-semibold">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                Debug Messages (Ctrl+D to toggle)
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className="py-2 px-3 bg-gray-900/50 rounded-lg text-sm text-gray-300 border-l-2 border-blue-500/50"
                  >
                    {message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
