import { createContext, useContext } from 'react';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';

// src/ElectronProvider/ElectronProvider.tsx

// src/ElectronProvider/isElectron.ts
var isElectron = typeof navigator === "object" && typeof navigator.userAgent === "string" && navigator.userAgent.indexOf("Electron") >= 0;
function createElectronApiContext() {
  return createContext(null);
}
var ElectronApiContext = createElectronApiContext();
function ElectronApiProvider({ apis = ["api"], children }) {
  const value = {};
  if (isElectron) {
    console.log("[ElectronProvider] Electron Environment Detected");
    for (const key of apis) {
      const api = window[key];
      if (api) {
        value[key] = api;
      } else if (process.env.NODE_ENV === "development") {
        console.warn(
          `[ElectronApiProvider] window.${key} not foundMake sure your preload script exposes it via \`contextBridge.exposeInMainWorld('${key}', ...)\`.`
        );
      }
    }
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(ElectronApiContext.Provider, { value, children }),
    isElectron && /* @__PURE__ */ jsx("script", { src: "./preload.js" })
  ] });
}
function useElectronProvider() {
  if (!isElectron) {
    throw new Error(`useElectronProvider can only be used in an electron renderer context. Ensure you are not using it in a component that does not render outside of the Electron renderer.`);
  }
  const ctx = useContext(ElectronApiContext);
  if (!ctx) {
    throw new Error(
      "useElectronProvider must be used within an ElectronApiProvider context. Ensure your app root is wrapped with ElectronApiProvider."
    );
  }
  return ctx;
}

export { ElectronApiProvider, isElectron, useElectronProvider };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map