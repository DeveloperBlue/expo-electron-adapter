// isElectron.ts
// Checks if we're running in the electron renderer process.

export const isElectron = (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0);