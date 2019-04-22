import {ipcMain, Event} from 'electron'
import {Satellite} from './satellite'
import * as fs from 'fs'


const satellite = Satellite.instance

export const main = () => {
  if (!fs.existsSync(Satellite.pluginPath)) {
    fs.promises.mkdir(Satellite.pluginPath).catch((e) => satellite.logger.error(e))
  }
  ipcMain.on('start', async (event: Event) => {
    satellite.logger.info('main')
    await Satellite.loadPlugins().catch((e) => satellite.logger.error(e))
  })

  ipcMain.on('fetchComment', (event: Event) => {
    event.sender.send('receiveComment', satellite.comments)
  })

}
