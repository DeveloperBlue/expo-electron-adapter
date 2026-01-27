export interface FileApi {
  openFile(): Promise<string>
}

export interface WindowApi {
  minimize(): void
}

export type ElectronApis = {
  api: FileApi
  api2: WindowApi
}
