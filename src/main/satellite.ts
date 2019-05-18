import {EventEmitter} from 'events'
import * as path from 'path'
import * as fs from 'fs'
import {app} from 'electron'

import {Events} from '../lib/events'
import {getLogger} from 'log4js'


export class Satellite extends EventEmitter {
  public static readonly pluginPath = path.join(app.getPath('userData'), 'plugins')

  public static readonly instance = new Satellite()

  public static async loadPlugins() {
    const self = Satellite.instance
    self.logger.info('loadPlugin')

    fs.readdirSync(Satellite.pluginPath)
      .forEach((v) => {
        try {
          const plugin = __non_webpack_require__(path.join(Satellite.pluginPath, v)).default as (satellite: Satellite) => void
          plugin(self)
          self.logger.info(`Loaded plugin. [${v}]`)
        } catch (e) {
          self.logger.error(`PluginLoadError[${v}]: ${e.message}`)
        }
      })
    self.emit(Events.loaded)
    setInterval(() => self.emit(Events.tick), 100)
  }


  public readonly logger = getLogger('Satellite')

  private commentList: CommentData[] = []
  private nextNum = 1
  private isCanceled = false

  private constructor() {
    super()
  }

  public get comments() {
    return this.commentList
  }

  public addComment(...comment: CommentData[]): boolean {
    let ret = false
    comment.forEach((v) => {
      this.emit(Events.beforeAddComment, this, v)
      if (!this.isCanceled) {
        v.number = this.nextNum++
        this.commentList.push(v)
        this.emit(Events.afterAddComment, this, v)
        ret = true
      } else {
        this.emit(Events.canceledAddComment, this, v)
        this.isCanceled = false
      }
    })
    return ret
  }

  public cancel(): boolean {
    return this.isCanceled = true
  }

  public deleteComment(num: number): boolean {
    const index = this.findComment(num)
    const item = this.commentList[index]
    this.emit(Events.beforeDeleteComment, this, item)
    if (!this.isCanceled) {
      this.commentList.splice(index, 1)
      this.emit(Events.afterDeleteComment, this, item)
    } else {
      this.emit(Events.canceledDeleteComment, this, item)
      this.isCanceled = false
    }
    return !this.isCanceled
  }

  public updateComment(num: number, newComment: CommentData): boolean {
    const index = this.findComment(num)
    const oldItem = this.commentList[index]
    this.emit(Events.beforeUpdateComment, this, oldItem, newComment)
    if (!this.isCanceled) {
      this.commentList[index] = newComment
      this.emit(Events.afterUpdateComment, this, oldItem, newComment)
      return true
    } else {
      this.emit(Events.canceledUpdateComment, this, oldItem, newComment)
      this.isCanceled = false
      return false
    }
  }

  private findComment(num: number): number {
    return this.commentList.findIndex((v) => v.number === num)
  }

}
