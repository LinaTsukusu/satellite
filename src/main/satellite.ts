import {EventEmitter} from 'events'
import {SatellitePlugin} from '@/main/satellite-plugin'
import * as path from 'path'
import {promises as fs} from 'fs'
import app = Electron.app


export class Satellite implements satellite.Satellite {
  private static event: EventEmitter = new EventEmitter()
  private static innerInstance: Satellite | null = null
  public static get instance() {
    if (!Satellite.innerInstance) {
      Satellite.innerInstance = new Satellite()
    }
    return Satellite.innerInstance
  }

  public static async loadPlugin() {
    const pluginPath = path.join(app.getAppPath(), 'plugins')
    const list = await fs.readdir(pluginPath, {withFileTypes: true})
    const plugins = await Promise.all(list.filter((v) => v.isFile() && path.extname(v.name) === '.js')
      .map(async (v) => (await import(path.join(pluginPath, v.name))).default))
    plugins.forEach((plugin) => Satellite.registerPlugin(plugin))
  }

  private static registerPlugin(plugin: () => SatellitePlugin) {
    Object.keys(plugin.prototype).filter((v) => {

    }).forEach((event) => {
      Satellite.event.on(event, plugin.prototype[event])
    })
  }

  private comments: satellite.CommentData[] = []

  private nextNum = 1
  private isCanceled = false

  private constructor() {
    Satellite.event.emit('created', this)
    setInterval(() => Satellite.event.emit('tick', this), 100)
  }

  public addComment(...comment: satellite.CommentData[]): boolean {
    let ret = false
    comment.forEach((v) => {
      Satellite.event.emit('beforeAddComment', this, v)
      if (!this.isCanceled) {
        v.number = this.nextNum++
        this.comments.push(v)
        Satellite.event.emit('afterAddComment', this, v)
        ret = true
      } else {
        Satellite.event.emit('canceledAddComment', this, v)
        this.isCanceled = false
      }
    })
    return ret
  }

  public cancelAddComment(): boolean {
    return this.isCanceled = true
  }

  public deleteComment(num: number): boolean {
    const index = this.findComment(num)
    const item = this.comments[index]
    Satellite.event.emit('beforeDeleteComment', this, item)
    if (!this.isCanceled) {
      this.comments.splice(index, 1)
      Satellite.event.emit('afterDeleteComment', this, item)
      return true
    } else {
      Satellite.event.emit('canceledDeleteComment', this, item)
      this.isCanceled = false
      return false
    }
  }

  public updateComment(num: number, newComment: satellite.CommentData): boolean {
    const index = this.findComment(num)
    const oldItem = this.comments[index]
    Satellite.event.emit('beforeUpdateComment', this, oldItem, newComment)
    if (!this.isCanceled) {
      this.comments[index] = newComment
      Satellite.event.emit('afterUpdateComment', this, oldItem, newComment)
      return true
    } else {
      Satellite.event.emit('canceledUpdateComment', this, oldItem, newComment)
      this.isCanceled = false
      return false
    }
  }

  private findComment(num: number): number {
    return this.comments.findIndex((v) => v.number === num)
  }

}
