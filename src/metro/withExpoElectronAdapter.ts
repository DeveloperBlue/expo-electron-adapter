import { MetroConfig } from 'metro-config';
import { isExpoElectronRuntime } from '../expo/isExpoElectron';

export const withExpoElectronAdapter = (config : MetroConfig) : MetroConfig => {

  if (!isExpoElectronRuntime) { return config }

  const originalResolveRequest = config.resolver!.resolveRequest
  
  return {
    ...config,
    resolver : {
      ...config.resolver,
      platforms : [
        "electron", "browser", ...(config.resolver!.platforms || [])
      ],
      resolveRequest: (context, moduleName, platform) => {
      
        // Only apply *.electron resolutions for component files in our app, and not for node_modules
        const isAppCode = context.originModulePath && 
                          !context.originModulePath.includes('node_modules');
        const targetPlatform = isAppCode ? (isExpoElectronRuntime ? "electron" : platform) : platform;
        
        if (originalResolveRequest) {
          return originalResolveRequest(context, moduleName, targetPlatform);
        }
        return context.resolveRequest(context, moduleName, targetPlatform);

      }
    }
  }

}