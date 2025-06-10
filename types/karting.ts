export type ConnectionStatus = "connecting" | "connected" | "disconnected"

export interface ScorecardRow {
  id: {
    timestamp: number
    creationTime: string
  }
  kartId: number
  guestId: number
  lTime: string | null
  ambTime: string
  timeStamp: string
  isBadTime: boolean
  lapNum: number
  actualDate: string
  timeAdjustment: string | null
  position: number
  gap: string
  nickname: string
  averageLapTime: string
  fastestLapTime: string
  firstName: string
  lastName: string
  isFirstTime: boolean
  totalRaces: number
  isUpdated?: boolean
}

export interface ScorecardData {
  id: {
    timestamp: number
    creationTime: string
  }
  channel: string
  heatId: number
  scorecardRows: ScorecardRow[]
}
