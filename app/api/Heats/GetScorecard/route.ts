import { type NextRequest, NextResponse } from "next/server"

// This is a mock API endpoint that would normally fetch data from your database
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const heatNo = searchParams.get("heatNo")

  if (!heatNo) {
    return NextResponse.json({ error: "Heat number is required" }, { status: 400 })
  }

  // Mock data for demonstration
  const mockData = {
    heatId: heatNo,
    status: "running",
    racers: [
      {
        id: "1",
        position: 1,
        name: "Max Verstappen",
        kartNumber: 33,
        currentLap: 12,
        lastLapTime: 45230, // 45.23 seconds
        bestLapTime: 44890, // 44.89 seconds
        totalTime: 540000, // 9 minutes
      },
      {
        id: "2",
        position: 2,
        name: "Lewis Hamilton",
        kartNumber: 44,
        currentLap: 12,
        lastLapTime: 45450,
        bestLapTime: 45120,
        totalTime: 542300, // 9:02.30
      },
      {
        id: "3",
        position: 3,
        name: "Charles Leclerc",
        kartNumber: 16,
        currentLap: 12,
        lastLapTime: 45670,
        bestLapTime: 45340,
        totalTime: 544500,
      },
      {
        id: "4",
        position: 4,
        name: "Lando Norris",
        kartNumber: 4,
        currentLap: 12,
        lastLapTime: 45780,
        bestLapTime: 45230,
        totalTime: 546700,
      },
      {
        id: "5",
        position: 5,
        name: "Carlos Sainz",
        kartNumber: 55,
        currentLap: 12,
        lastLapTime: 45890,
        bestLapTime: 45450,
        totalTime: 548200,
      },
      {
        id: "6",
        position: 6,
        name: "Fernando Alonso",
        kartNumber: 14,
        currentLap: 11,
        lastLapTime: 46120,
        bestLapTime: 45670,
        totalTime: 550000,
      },
    ],
  }

  return NextResponse.json(mockData)
}
