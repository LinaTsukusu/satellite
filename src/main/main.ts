import {ipcMain, Event, BrowserWindow} from 'electron'
import {Satellite} from './satellite'
import * as fs from 'fs'


const satellite = Satellite.instance

export const main = (win: BrowserWindow) => {
  if (!fs.existsSync(Satellite.pluginPath)) {
    fs.promises.mkdir(Satellite.pluginPath).catch((e) => satellite.logger.error(e))
  }
  ipcMain.on('start', async () => {
    satellite.logger.info('main')
    await Satellite.loadPlugins().catch((e) => satellite.logger.error(e))
  })

  ipcMain.on('fetchComment', (event) => {
    event.sender.send('receiveComment', satellite.comments)
  })

}
