import {
  createGuessSession,
  migrateStoredGuessSession,
  type GuessSessionV1,
} from '@tt16/core/guess'

export const GUESS_STORAGE_KEY = 'tt16:guess:v1'

function localSeed(): string {
  try {
    const values = new Uint32Array(2)
    crypto.getRandomValues(values)
    return `local-${values[0].toString(36)}-${values[1].toString(36)}`
  } catch {
    return `local-${Math.random().toString(36).slice(2)}`
  }
}

export function newLocalGuessSession(): GuessSessionV1 {
  return createGuessSession(localSeed())
}

export function readStoredGuessSession(): GuessSessionV1 | null {
  try {
    const raw = localStorage.getItem(GUESS_STORAGE_KEY)
    if (!raw) return null
    const migrated = migrateStoredGuessSession(JSON.parse(raw))
    if (!migrated) localStorage.removeItem(GUESS_STORAGE_KEY)
    return migrated
  } catch {
    return null
  }
}

export function persistGuessSession(session: GuessSessionV1): void {
  try {
    localStorage.setItem(GUESS_STORAGE_KEY, JSON.stringify(session))
  } catch {
    // Storage restrictions never block the in-memory guessing experience.
  }
}

export function clearStoredGuessSession(): void {
  try {
    localStorage.removeItem(GUESS_STORAGE_KEY)
  } catch {
    // The current in-memory session can still be reset.
  }
}
