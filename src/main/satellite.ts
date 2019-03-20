import {EventEmitter} from 'events'
import * as path from 'path'
import {promises as fs} from 'fs'
import app = Electron.app
import {Events} from '@/lib/events'
import {getLogger} from 'log4js'


const logger = getLogger()

export class Satellite {
  public static get instance() {
    if (!Satellite.innerInstance) {
      Satellite.innerInstance = new Satellite()
    }
    return Satellite.innerInstance
  }

  private static innerInstance: Satellite | null = null

  private event: EventEmitter = new EventEmitter()
  private comments: CommentData[] = []

  private nextNum = 1
  private isCanceled = false

  private constructor() {
    this.event = new EventEmitter()
  }

  public async loadPlugins() {
    const pluginPath = path.join(app.getAppPath(), 'plugins')
    const list = await fs.readdir(pluginPath, {withFileTypes: true})
    const plugins = await Promise.all(list.filter((v) => v.isFile() && path.extname(v.name) === '.js')
      .map(async (v) => (await import(path.join(pluginPath, v.name))).default))
    plugins.forEach((plugin) => {
      for (const event in Events) {
        if (plugin.prototype[event]) {
          this.event.on(event, plugin.prototype[event])
        }
      }
      plugin.loaded(this)
    })
    setInterval(() => this.event.emit(Events.tick, this), 100)
  }

  public addComment(...comment: CommentData[]): boolean {
    let ret = false
    comment.forEach((v) => {
      this.event.emit(Events.beforeAddComment, this, v)
      if (!this.isCanceled) {
        v.number = this.nextNum++
        this.comments.push(v)
        this.event.emit(Events.afterAddComment, this, v)
        ret = true
      } else {
        this.event.emit(Events.canceledAddComment, this, v)
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
    this.event.emit(Events.beforeDeleteComment, this, item)
    if (!this.isCanceled) {
      this.comments.splice(index, 1)
      this.event.emit(Events.afterDeleteComment, this, item)
      return true
    } else {
      this.event.emit(Events.canceledDeleteComment, this, item)
      this.isCanceled = false
      return false
    }
  }

  public updateComment(num: number, newComment: CommentData): boolean {
    const index = this.findComment(num)
    const oldItem = this.comments[index]
    this.event.emit(Events.beforeUpdateComment, this, oldItem, newComment)
    if (!this.isCanceled) {
      this.comments[index] = newComment
      this.event.emit(Events.afterUpdateComment, this, oldItem, newComment)
      return true
    } else {
      this.event.emit(Events.canceledUpdateComment, this, oldItem, newComment)
      this.isCanceled = false
      return false
    }
  }

  private findComment(num: number): number {
    return this.comments.findIndex((v) => v.number === num)
  }

}
