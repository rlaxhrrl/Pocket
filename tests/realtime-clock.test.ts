import { expect, test } from 'bun:test'
import { realtimeClockIso, syncRealtimeClock } from '../src/domain/realtime-clock.js'

test('helper derives the clock from wall time plus offset', () => {
  expect(realtimeClockIso({ roleplayRealtimeOffsetMs: 3_600_000 }, 0)).toBe('1970-01-01T01:00:00.000Z')
  const state: any = { roleplayClockRealtime: true, roleplayRealtimeOffsetMs: 0, roleplayNow: '2000-01-01T00:00:00.000Z' }
  expect(syncRealtimeClock(state, 1_000)).toBe(true); expect(state.roleplayNow).toBe('1970-01-01T00:00:01.000Z')
  expect(syncRealtimeClock({ roleplayNow: 'x' } as any)).toBe(false)
})

