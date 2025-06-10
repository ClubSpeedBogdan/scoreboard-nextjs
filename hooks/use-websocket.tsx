"use client"

import { useState, useEffect, useCallback, useRef } from "react"

type ConnectionStatus = "connecting" | "connected" | "disconnected"

interface UseWebSocketReturn {
  lastMessage: MessageEvent | null
  sendMessage: (message: string) => void
  connectionStatus: ConnectionStatus
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting")
  const webSocketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const MAX_RECONNECT_ATTEMPTS = 5
  const RECONNECT_DELAY_MS = 2000

  // Function to create a new WebSocket connection
  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url)
      webSocketRef.current = ws
      setConnectionStatus("connecting")

      ws.onopen = () => {
        console.log("WebSocket connected")
        setConnectionStatus("connected")
        reconnectAttemptsRef.current = 0
      }

      ws.onmessage = (event) => {
        setLastMessage(event)
      }

      ws.onclose = () => {
        console.log("WebSocket disconnected")
        setConnectionStatus("disconnected")

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1
            connect()
          }, RECONNECT_DELAY_MS)
        }
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        ws.close()
      }
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error)
      setConnectionStatus("disconnected")
    }
  }, [url])

  // Function to send a message
  const sendMessage = useCallback((message: string) => {
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(message)
    } else {
      console.error("WebSocket is not connected")
    }
  }, [])

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }

      if (webSocketRef.current) {
        webSocketRef.current.close()
      }
    }
  }, [connect])

  return { lastMessage, sendMessage, connectionStatus }
}
