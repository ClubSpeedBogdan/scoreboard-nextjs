"use client"

import { useRef, useCallback } from "react"
import type { ConnectionStatus } from "@/types/karting"

interface UseKartingWebSocketProps {
  onStatusChange: (status: ConnectionStatus) => void
  onMessage: (event: MessageEvent) => void
  onConnect: () => void
  onDisconnect: () => void
  onError: (error: string) => void
}

export function useKartingWebSocket({
  onStatusChange,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
}: UseKartingWebSocketProps) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentUrlRef = useRef<string | null>(null)

  const connect = useCallback(
    (url: string) => {
      currentUrlRef.current = url
      onStatusChange("connecting")

      try {
        const ws = new WebSocket(url)
        wsRef.current = ws

        ws.onopen = () => {
          onStatusChange("connected")
          onConnect()

          // Clear any existing reconnect interval
          if (reconnectIntervalRef.current) {
            clearInterval(reconnectIntervalRef.current)
            reconnectIntervalRef.current = null
          }
        }

        ws.onmessage = onMessage

        ws.onerror = (event) => {
          console.error("WebSocket Error:", event)
          onError("WebSocket connection failed. Check console for details.")
        }

        ws.onclose = (event) => {
          onStatusChange("disconnected")
          onDisconnect()

          // Auto-reconnect logic
          if (!reconnectIntervalRef.current && currentUrlRef.current) {
            onError("Attempting to reconnect in 5 seconds...")
            reconnectIntervalRef.current = setInterval(() => {
              if (wsRef.current?.readyState !== WebSocket.OPEN && currentUrlRef.current) {
                onError("Reconnecting...")
                connect(currentUrlRef.current)
              }
            }, 5000)
          }
        }
      } catch (error) {
        onError(`Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`)
        onStatusChange("disconnected")
      }
    },
    [onStatusChange, onMessage, onConnect, onDisconnect, onError],
  )

  const disconnect = useCallback(() => {
    currentUrlRef.current = null

    if (reconnectIntervalRef.current) {
      clearInterval(reconnectIntervalRef.current)
      reconnectIntervalRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    onStatusChange("disconnected")
  }, [onStatusChange])

  return {
    connect,
    disconnect,
    isConnecting: false, // You could track this state if needed
  }
}
