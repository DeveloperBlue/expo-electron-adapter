import type { ElectronApis } from "./api/api-interface"

declare global {
  interface Window extends Partial<ElectronApis> {}
}

export {}