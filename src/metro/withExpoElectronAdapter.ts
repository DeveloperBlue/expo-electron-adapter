import { MetroConfig } from 'metro-config';
import { isExpoElectronRuntime } from '../expo/isExpoElectron';
import path from 'path';

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
        
        if (isAppCode && platform === "web") {

          // Define the fallback chain based on runtime
          const platformChain = isExpoElectronRuntime 
            ? ["electron", "web"]  // electron → web → base
            : ["browser", "web"];   // browser → web → base
          
          // Try each platform in the chain
          for (const targetPlatform of platformChain) {
            try {

              const result = originalResolveRequest
                ? originalResolveRequest(context, moduleName, targetPlatform)
                : context.resolveRequest(context, moduleName, targetPlatform);

              if (result.type === 'sourceFile' && result.filePath.includes(`.${targetPlatform}.`)) {
                return result;
              }

              continue;
            } catch (error) {
              // If this platform doesn't exist, continue to next in chain
              continue;
            }
          }
        }
        
        // Default resolution (For non-app code or other platforms)
        return originalResolveRequest
                ? originalResolveRequest(context, moduleName, platform)
                : context.resolveRequest(context, moduleName, platform);
      }
    }
  }
}