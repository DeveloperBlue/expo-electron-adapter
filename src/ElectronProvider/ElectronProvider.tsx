import React, { createContext, useContext } from "react";
import { isElectron } from "./isElectron";


function createElectronApiContext<T>() {
  return createContext<T | null>(null);
}

const ElectronApiContext = createElectronApiContext<any>();

export function ElectronApiProvider({ apis = ["api"], children } : {apis: string[], children : React.ReactNode}) {
  
  const value : Record<string, any> = {}
  
  if (isElectron) {
    
    console.log("[ElectronProvider] Electron Environment Detected")
    
    for (const key of apis) {
      const api = (window as any)[key]
      if (api) {
        value[key] = api
      } else if (process.env.NODE_ENV === "development") {
        console.warn(
          `[ElectronApiProvider] window.${key} not found` +
          `Make sure your preload script exposes it via \`contextBridge.exposeInMainWorld('${key}', ...)\`.`
        )
      }
    }
  }
  
  return (
    <>
      <ElectronApiContext.Provider value={value}>
        {children}
      </ElectronApiContext.Provider>
      { isElectron && <script src="./preload.js"/> }
    </>
  );
};

export function useElectronProvider<T>(): T {
  
  if (!isElectron) {
    throw new Error(`useElectronProvider can only be used in an electron renderer context. Ensure you are not using it in a component that does not render outside of the Electron renderer.`)
  }
  
  const ctx = useContext(ElectronApiContext)
  
  if (!ctx) {
    throw new Error(
      "useElectronProvider must be used within an ElectronApiProvider context. Ensure your app root is wrapped with ElectronApiProvider."
    )
  }
  
  return ctx as T
}

export type TypedUseElectronHook<T> = () => T;

export { isElectron }