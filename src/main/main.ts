import {Satellite} from '@/main/satellite'
import {ipcMain} from 'electron'

const satellite = Satellite.instance

ipcMain.on('start', async (event: Electron.Event) => {
  await satellite.loadPlugins()
})
