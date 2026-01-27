import { MetroConfig } from 'metro-config';
export { isExpoElectronRuntime } from '../expo/index.js';

declare const withExpoElectronAdapter: (config: MetroConfig) => MetroConfig;

export { withExpoElectronAdapter };
