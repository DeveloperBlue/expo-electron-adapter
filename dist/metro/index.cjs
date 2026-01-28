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
        let targetPlatform = platform;
        if (isAppCode) {
          if (isExpoElectronRuntime) {
            targetPlatform = "electron";
          } else if (platform === "web") {
            targetPlatform = "browser";
          }
        }
        if (originalResolveRequest) {
          return originalResolveRequest(context, moduleName, targetPlatform);
        }
        return context.resolveRequest(context, moduleName, targetPlatform);
      }
    }
  };
};

exports.isExpoElectronRuntime = isExpoElectronRuntime;
exports.withExpoElectronAdapter = withExpoElectronAdapter;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map