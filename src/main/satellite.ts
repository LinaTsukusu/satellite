import {EventEmitter} from 'events'
import {SatellitePlugin} from '@/main/satellite-plugin'
import * as path from "path"
import {promises as fs} from "fs"
import app = Electron.app


export class Satellite {
  private static event: EventEmitter = new EventEmitter()
  private static innerInstance: Satellite | null = null

  private comments: satellite.CommentData[] = []

  private nextNum = 1
  private isCanceled = false

  private constructor() {
    Satellite.event.emit('created', this)
    setInterval(() => Satellite.event.emit('tick', this), 100)
  }

  public static get instance() {
    if (!Satellite.innerInstance) {
      Satellite.innerInstance = new Satellite()
    }
    return Satellite.innerInstance
  }

  public static async loadPlugin(plugin: SatellitePlugin) {
    const pluginPath = path.join(app.getAppPath(), 'plugins')
    const list = await fs.readdir(pluginPath, {withFileTypes: true})
    const plugins = await Promise.all(list.filter((v) => v.isFile() && path.extname(v.name) === '.js')
      .map(async (v) => await import(path.join(pluginPath, v.name)) as SatellitePlugin))
    plugins.forEach((plugin) => Satellite.registerPlugin(plugin))
  }

  private static registerPlugin(plugin: SatellitePlugin) {

  }

  public addComment(...comment: satellite.CommentData[]) {
    comment.forEach((v) => {
      Satellite.event.emit('beforeAddComment', this, v)
      if (!this.isCanceled) {
        v.number = this.nextNum++
        this.comments.push(v)
      }
      this.isCanceled = false
      Satellite.event.emit('afterAddComment', this, v)
    })
  }

  public cancelAddComment() {
    this.isCanceled = true
  }

  public deleteComment(num: number) {
    const index = this.findComment(num)
    const item = this.comments[index]
    Satellite.event.emit('beforeDeleteComment', this, item)
    if (!this.isCanceled) {
      this.comments.splice(index, 1)
    }
    this.isCanceled = false
    Satellite.event.emit('afterDeleteComment', this, item)
  }

  public updateComment(num: number, newComment: satellite.CommentData) {
    const index = this.findComment(num)
    const oldItem = this.comments[index]
    Satellite.event.emit('beforeUpdateComment', this, oldItem, newComment)
    if (!this.isCanceled) {
      this.comments[index] = newComment
    }
    this.isCanceled = false
    Satellite.event.emit('afterUpdateComment', this, oldItem, newComment)
  }

  private findComment(num: number): number {
    return this.comments.findIndex((v) => v.number === num)
  }

}
