import {getLogger} from 'log4js'
import {Events} from '@/lib/events'
import {Satellite} from '@/main/satellite'


export class PluginDriver {

  public readonly logger = getLogger()
  public readonly name: string
  // private satellite: Satellite = Satellite.instance

  constructor(name: string) {
    this.name = name
    this.logger = getLogger(name)
  }

  public on(event: Events, listener: (...args: any[]) => void) {
    Satellite.instance.on(event, listener)
  }

  public addComment(...comment: CommentData[]): boolean {
    let ret = false
    const satellite = Satellite.instance
    comment.forEach((v) => {
      satellite.emit(Events.beforeAddComment, this, v)
      if (!satellite.isCanceled) {
        v.number = satellite.nextNum++
        satellite.commentList.push(v)
        satellite.emit(Events.afterAddComment, this, v)
        ret = true
      } else {
        satellite.emit(Events.canceledAddComment, this, v)
        satellite.isCanceled = false
      }
    })
    return ret
  }

}
