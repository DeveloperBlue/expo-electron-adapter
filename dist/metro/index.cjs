'use strict';

// src/expo/isExpoElectron.ts
var isExpoElectronRuntime = typeof process !== "undefined" && process.env && process.env.EXPO_PLATFORM == "electron";

// src/metro/withExpoElectronAdapter.ts
var withExpoElectronAdapter = (config) => {
  if (!isExpoElectronRuntime) {
    return config;
  }
  const originalResolveRequest = config.resolver.resolveRequest;
  return {
    ...config,
    resolver: {
      ...config.resolver,
      platforms: [
        "electron",
        ...config.resolver.platforms || []
      ],
      resolveRequest: (context, moduleName, platform) => {
        const isAppCode = context.originModulePath && !context.originModulePath.includes("node_modules");
        const targetPlatform = isAppCode ? isExpoElectronRuntime ? "electron" : platform : platform;
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