import {EventEmitter} from 'events'
import * as path from 'path'
import * as fs from 'fs'
import {app} from 'electron'

import {Events} from '../lib/events'
import {getLogger} from 'log4js'


export class Satellite {
  public static readonly pluginPath = path.join(app.getAppPath(), 'plugins')

  public static get instance() {
    if (!Satellite.innerInstance) {
      Satellite.innerInstance = new Satellite()
    }
    return Satellite.innerInstance
  }

  private static innerInstance: Satellite | null = null

  public readonly logger = getLogger()

  private event: EventEmitter = new EventEmitter()
  private commentList: CommentData[] = []
  private nextNum = 1
  private isCanceled = false

  private constructor() {
    this.event = new EventEmitter()
    ////////////////////
    this.event.on('tick', (satellite: this) => {
      const time = new Date()
      if (time.getMilliseconds() % 1000 > 500) {
        satellite.addComment({
          time,
          thumbnailUrl: '',
          userId: '1',
          userName: '',
          site: 'youtube',
          comment: 'aaaa',
          isFirst: true,
        })
      }
    })
    ////////////////////
  }

  public get comments() {
    return this.commentList
  }

  public async loadPlugins() {
    this.logger.info('loadPlugin')
    const pluginFiles = fs.readdirSync(Satellite.pluginPath, {withFileTypes: true})
    const plugins = await Promise.all(pluginFiles.filter((v) => v.isFile() && path.extname(v.name) === '.js')
      .map(async (v) => (await import(path.join(Satellite.pluginPath, v.name))).default))
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
        this.commentList.push(v)
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
    const item = this.commentList[index]
    this.event.emit(Events.beforeDeleteComment, this, item)
    if (!this.isCanceled) {
      this.commentList.splice(index, 1)
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
    const oldItem = this.commentList[index]
    this.event.emit(Events.beforeUpdateComment, this, oldItem, newComment)
    if (!this.isCanceled) {
      this.commentList[index] = newComment
      this.event.emit(Events.afterUpdateComment, this, oldItem, newComment)
      return true
    } else {
      this.event.emit(Events.canceledUpdateComment, this, oldItem, newComment)
      this.isCanceled = false
      return false
    }
  }

  private findComment(num: number): number {
    return this.commentList.findIndex((v) => v.number === num)
  }

}
