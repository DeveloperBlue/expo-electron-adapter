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
              const result = originalResolveRequest ? originalResolveRequest(context, moduleName, targetPlatform) : context.resolveRequest(context, moduleName, targetPlatform);
              if (result.type === "sourceFile" && result.filePath.includes(`.${targetPlatform}.`)) {
                return result;
              }
              continue;
            } catch (error) {
              continue;
            }
          }
        }
        return originalResolveRequest ? originalResolveRequest(context, moduleName, platform) : context.resolveRequest(context, moduleName, platform);
      }
    }
  };
};

export { isExpoElectronRuntime, withExpoElectronAdapter };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map