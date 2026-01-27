// isMetroElectronConfig.ts
// Checks if we're running in the context of the Metro Bundler for Electron.

export const isExpoElectronRuntime = (typeof process !== 'undefined' && process.env && process.env.EXPO_PLATFORM == "electron");