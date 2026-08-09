import Taro from '@tarojs/taro'
import { migrateStoredAssessment, type StoredAssessmentV2 } from '@tt16/core'

export const STORAGE_KEY = 'tt16:assessment:v2'
const LEGACY_KEY = 'tt16:free:v1'

function parse(value: unknown): unknown {
  if (typeof value !== 'string') return value
  try { return JSON.parse(value) } catch { return null }
}

export function readAssessment(): StoredAssessmentV2 | null {
  try {
    const current = Taro.getStorageSync(STORAGE_KEY)
    const legacy = Taro.getStorageSync(LEGACY_KEY)
    const migrated = migrateStoredAssessment(parse(current || legacy))
    if (!migrated) return null
    Taro.setStorageSync(STORAGE_KEY, migrated)
    if (legacy) Taro.removeStorageSync(LEGACY_KEY)
    return migrated
  } catch {
    return null
  }
}

export function writeAssessment(value: StoredAssessmentV2): void {
  try { Taro.setStorageSync(STORAGE_KEY, value) } catch { /* Continue in memory. */ }
}

export function clearAssessment(): void {
  try { Taro.removeStorageSync(STORAGE_KEY); Taro.removeStorageSync(LEGACY_KEY) } catch { /* Already clear. */ }
}
