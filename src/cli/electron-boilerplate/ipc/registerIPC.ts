import { ipcMain, IpcMainEvent } from "electron";

function handlePing(event : IpcMainEvent){ 
  console.log("Ping!")
}

export default function registerIPC() {

  ipcMain.on("ping", handlePing)
  
}