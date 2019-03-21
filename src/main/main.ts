import {ipcMain} from 'electron'
import {Satellite} from './satellite'


const satellite = Satellite.instance

export const main = () => {
  ipcMain.on('start', async (event: Electron.Event) => {
    satellite.logger.info("main")
    satellite.loadPlugins()
  })
}