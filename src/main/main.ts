import {ipcMain} from 'electron'
import {Satellite} from './satellite'
import * as fs from 'fs'


const satellite = Satellite.instance

export const main = () => {
  if (!fs.existsSync(Satellite.pluginPath)) {
    fs.promises.mkdir(Satellite.pluginPath).catch((e) => satellite.logger.error(e))
  }
  ipcMain.on('start', async (event: Electron.Event) => {
    satellite.logger.info('main')
    await satellite.loadPlugins().catch((e) => satellite.logger.error(e))
  })

  ipcMain.on('fetchComment', (event: Electron.Event) => {
    event.sender.send('receiveComment', satellite.comments)
  })

}
