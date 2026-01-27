import { contextBridge, ipcRenderer } from "electron";
import type { ElectronApis } from "./api/api-interface"

contextBridge.exposeInMainWorld("api3", {
  ping : () => {
    ipcRenderer.send("ping")
  },
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel: string, func: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_, ...args) => func(...args));
  },
});


const api: ElectronApis["api"] = {
  async openFile() {
    return "file.txt"
  },
}

contextBridge.exposeInMainWorld("api", api)
