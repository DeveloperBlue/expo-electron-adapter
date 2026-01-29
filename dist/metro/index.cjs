'use strict';

// src/expo/isExpoElectron.ts
var isExpoElectronRuntime = typeof process !== "undefined" && process.env && process.env.EXPO_PLATFORM == "electron";

// src/metro/withExpoElectronAdapter.ts
var withExpoElectronAdapter = (config) => {
  const originalResolveRequest = config.resolver?.resolveRequest;
  const customPlatforms = isExpoElectronRuntime ? ["electron"] : ["browser"];
  return {
    ...config,
    resolver: {
      ...config.resolver,
      platforms: [
        ...customPlatforms,
        ...config.resolver?.platforms || []
      ],
      resolveRequest: (context, moduleName, platform) => {
        const isAppCode = context.originModulePath && !context.originModulePath.includes("node_modules");
        if (isAppCode && platform === "web") {
          const platformChain = isExpoElectronRuntime ? ["electron", "web"] : ["browser", "web"];
          for (const targetPlatform of platformChain) {
            try {
              if (originalResolveRequest) {
                return originalResolveRequest(context, moduleName, targetPlatform);
              }
              return context.resolveRequest(context, moduleName, targetPlatform);
            } catch (error) {
              continue;
            }
          }
        }
        if (originalResolveRequest) {
          return originalResolveRequest(context, moduleName, platform);
        }
        return context.resolveRequest(context, moduleName, platform);
      }
    }
  };
};

exports.isExpoElectronRuntime = isExpoElectronRuntime;
exports.withExpoElectronAdapter = withExpoElectronAdapter;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map