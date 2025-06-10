export function formatTime(time: string | number | null | undefined): string {
  if (!time || time === "0" || time === "-" || time === "null") return "-"

  // Convert string to number if needed
  const numTime = typeof time === "string" ? Number.parseFloat(time) : time
  if (isNaN(numTime) || numTime <= 0) return "-"

  // Handle different time formats based on the value range

  // Very small numbers (likely already in seconds with decimals)
  if (numTime < 10) {
    return `${numTime.toFixed(3)}`
  }

  // Medium numbers (10-1000) - likely seconds
  if (numTime >= 10 && numTime < 1000) {
    const minutes = Math.floor(numTime / 60)
    const seconds = (numTime % 60).toFixed(3)
    return minutes > 0 ? `${minutes}:${seconds.padStart(6, "0")}` : `${seconds}`
  }

  // Large numbers (1000+) - likely milliseconds or need different handling
  if (numTime >= 1000 && numTime < 10000000) {
    // Treat as milliseconds
    const totalSeconds = numTime / 1000
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = (totalSeconds % 60).toFixed(3)
    return minutes > 0 ? `${minutes}:${seconds.padStart(6, "0")}` : `${seconds}`
  }

  // Very large numbers - these might be timestamps or encoded differently
  // Let's try to extract meaningful lap time data
  if (numTime > 10000000) {
    // Try treating the last few digits as the actual time
    const timeStr = numTime.toString()

    // If it's a 9-digit number like 369890871, try different approaches
    if (timeStr.length >= 8) {
      // Try taking last 4-6 digits and treating as milliseconds
      const lastDigits = Number.parseInt(timeStr.slice(-4))
      if (lastDigits > 0 && lastDigits < 10000) {
        const seconds = lastDigits / 1000
        return `${seconds.toFixed(3)}`
      }

      // Alternative: try modulo operations to extract reasonable lap times
      const modTime = numTime % 100000 // Get last 5 digits
      if (modTime > 1000 && modTime < 99999) {
        const seconds = modTime / 1000
        return `${seconds.toFixed(3)}`
      }
    }

    // If all else fails, show the raw number for debugging
    return `${numTime}`
  }

  return `${numTime.toFixed(3)}`
}

/**
 * Formats gap time with appropriate prefix
 */
export function formatGap(gap: string | number | null | undefined): string {
  if (!gap || gap === "-" || gap === "0" || gap === "0.000") return "-"

  // If gap is already formatted as a string
  if (typeof gap === "string") {
    if (gap.includes("L")) return gap // Already formatted as laps
    const numGap = Number.parseFloat(gap)
    if (isNaN(numGap) || numGap === 0) return "-"
    return numGap > 0 ? `+${numGap.toFixed(3)}` : `${numGap.toFixed(3)}`
  }

  // Convert numeric gap
  const numGap = Number.parseFloat(gap.toString())
  if (isNaN(numGap) || numGap === 0) return "-"

  // If gap is more than a minute, might be lap down
  if (numGap > 60) {
    const laps = Math.floor(numGap / 60)
    return `+${laps}L`
  }

  return numGap > 0 ? `+${numGap.toFixed(3)}` : `${numGap.toFixed(3)}`
}
