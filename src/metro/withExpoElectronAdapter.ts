import { MetroConfig } from 'metro-config';
import { isExpoElectronRuntime } from '../expo/isExpoElectron';

export const withExpoElectronAdapter = (config: MetroConfig): MetroConfig => {
  const originalResolveRequest = config.resolver?.resolveRequest;
  
  // Only add "browser" platform if NOT in Electron runtime
  const customPlatforms = isExpoElectronRuntime 
    ? ["electron"]
    : ["browser"];
  
  return {
    ...config,
    resolver: {
      ...config.resolver,
      platforms: [
        ...customPlatforms,
        ...(config.resolver?.platforms || [])
      ],
      resolveRequest: (context, moduleName, platform) => {
        // Only apply custom resolutions for component files in our app, and not for node_modules
        const isAppCode = context.originModulePath && 
                          !context.originModulePath.includes('node_modules');
        
        let targetPlatform = platform;
        
        if (isAppCode) {
          if (isExpoElectronRuntime) {
            // In Electron runtime, use "electron" platform
            targetPlatform = "electron";
          } else if (platform === "web") {
            // In browser runtime (web but not Electron), use "browser" platform
            targetPlatform = "browser";
          }
        }
        
        if (originalResolveRequest) {
          return originalResolveRequest(context, moduleName, targetPlatform);
        }
        return context.resolveRequest(context, moduleName, targetPlatform);
      }
    }
  }
}