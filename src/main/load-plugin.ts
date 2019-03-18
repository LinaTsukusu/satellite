import * as path from 'path'
import {Dirent, promises as fs} from 'fs'

import app = Electron.app
import {SatellitePlugin} from '@/main/satellite-plugin'
import {Satellite} from '@/main/satellite'


async function loadPlugins() {
  const pluginPath = path.join(app.getAppPath(), 'plugins')
  const list = await fs.readdir(pluginPath, {withFileTypes: true})
  Promise.all(list.filter((v) => v.isFile() && path.extname(v.name) === '.js')
    .map(async (v) => await import(path.join(pluginPath, v.name)) as SatellitePlugin))
    .then((plugins) => {
      plugins.forEach((plugin) => {
        Satellite.loadPlugin(plugin)
      })
    })
}
