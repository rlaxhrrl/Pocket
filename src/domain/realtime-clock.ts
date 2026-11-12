import type { PhoneState } from '../types.js'

const MAX_OFFSET_MS = 200 * 365 * 86_400_000

export function realtimeOffset(value: unknown): number {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.max(-MAX_OFFSET_MS, Math.min(MAX_OFFSET_MS, Math.round(n)))
}

/** The current Pocket time for a real-time clock: wall clock + saved offset. */
export function realtimeClockIso(state: Pick<PhoneState, 'roleplayRealtimeOffsetMs'>, nowMs = Date.now()): string {
  return new Date(nowMs + realtimeOffset(state.roleplayRealtimeOffsetMs)).toISOString()
}

/**
 * Moves roleplayNow forward to the live wall-clock time when the real-time clock is on.
 * Returns true when the state changed.
 */
export function syncRealtimeClock(state: PhoneState, nowMs = Date.now()): boolean {
  if (!state.roleplayClockRealtime) return false
  const next = realtimeClockIso(state, nowMs)
  let changed = false
  if (state.roleplayNow !== next) { state.roleplayNow = next; changed = true }
  if (state.roleplayClockSource !== 'manual') { state.roleplayClockSource = 'manual'; changed = true }
  if (state.roleplayClockPrecision !== 'exact') { state.roleplayClockPrecision = 'exact'; changed = true }
  const label = state.roleplayRealtimeOffsetMs ? 'Real-time clock (shifted)' : 'Real-time clock'
  if (state.roleplayClockLabel !== label) { state.roleplayClockLabel = label; changed = true }
  return changed
}
