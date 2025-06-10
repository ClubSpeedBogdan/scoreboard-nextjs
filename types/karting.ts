export type ConnectionStatus = "connecting" | "connected" | "disconnected"

export interface ScorecardRow {
  guestId: string
  position: number
  kartId: number
  nickname?: string
  firstName: string
  lastName: string
  lapNum: number
  ambTime: string
  fastestLapTime: string
  gap: string
  averageLapTime: string
  totalRaces?: number
  isFirstTime: boolean
  isUpdated?: boolean
}

export interface ScorecardData {
  scorecardRows: ScorecardRow[]
}
