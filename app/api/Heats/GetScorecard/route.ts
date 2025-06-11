import { type NextRequest, NextResponse } from "next/server"

// Function to convert time string to milliseconds
function timeStringToMs(timeStr: string): number | null {
  if (!timeStr) return null;
  // Assuming time format is "MM:SS.mmm" or "SS.mmm"
  const parts = timeStr.split(':');
  let minutes = 0;
  let seconds = 0;
  
  if (parts.length === 2) {
    minutes = parseInt(parts[0]);
    seconds = parseFloat(parts[1]);
  } else {
    seconds = parseFloat(parts[0]);
  }
  
  return (minutes * 60 * 1000) + (seconds * 1000);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const heatNo = searchParams.get("heatNo")

  if (!heatNo) {
    return NextResponse.json({ error: "Heat number is required" }, { status: 400 })
  }

  try {
    // Fetch data from the unified data API
    const response = await fetch(`https://unified-data-api.resova.io/api/Heats/GetScorecard?heatNo=${heatNo}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the data to match frontend expectations
    const transformedData = {
      heatId: heatNo,
      status: "running", // You might want to get this from your backend
      racers: data.map((scorecard: any) => {
        const row = scorecard.ScorecardRows[0]; // Get the first row for each scorecard
        return {
          id: row.GuestId.toString(),
          position: row.Position,
          name: `${row.FirstName} ${row.LastName}`.trim() || row.Nickname,
          kartNumber: row.KartId,
          currentLap: row.LapNum,
          lastLapTime: timeStringToMs(row.LTime),
          bestLapTime: timeStringToMs(row.FastestLapTime),
          totalTime: timeStringToMs(row.AmbTime) || 0, // Using AmbTime as total time, fallback to 0
        };
      }).sort((a: any, b: any) => a.position - b.position), // Sort by position
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching scoreboard data:', error);
    return NextResponse.json(
      { error: "Failed to fetch scoreboard data" },
      { status: 500 }
    );
  }
}
