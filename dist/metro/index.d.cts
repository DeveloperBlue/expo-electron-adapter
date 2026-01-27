import { MetroConfig } from 'metro-config';
export { isExpoElectronRuntime } from '../expo/index.cjs';

declare const withExpoElectronAdapter: (config: MetroConfig) => MetroConfig;

export { withExpoElectronAdapter };
