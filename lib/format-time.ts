export function formatTime(time: string | number | null | undefined): string {
  if (!time || time === "0" || time === "-") return "-"

  // If time is already a string in format "mm:ss.sss"
  if (typeof time === "string" && time.includes(":")) {
    return time
  }

  // Convert numeric time to mm:ss.sss format
  const numTime = Number.parseFloat(time.toString())
  if (isNaN(numTime)) return "-"

  const minutes = Math.floor(numTime / 60000)
  const seconds = ((numTime % 60000) / 1000).toFixed(3)

  return minutes > 0 ? `${minutes}:${seconds.padStart(6, "0")}` : seconds
}

/**
 * Formats gap time with appropriate prefix
 */
export function formatGap(gap: string | number | null | undefined): string {
  if (!gap || gap === "-" || gap === "0") return "-"

  // If gap is already formatted
  if (typeof gap === "string" && (gap.includes(":") || gap.includes("L"))) {
    return gap
  }

  // Convert numeric gap
  const numGap = Number.parseFloat(gap.toString())
  if (isNaN(numGap)) return gap.toString()

  // If gap is more than a minute, might be lap down
  if (numGap > 60000) {
    const laps = Math.floor(numGap / 60000)
    return `+${laps}L`
  }

  return `+${(numGap / 1000).toFixed(3)}`
}
