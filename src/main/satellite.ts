import {EventEmitter} from 'events'


class Satellite {
  private static event: EventEmitter = new EventEmitter()
  public comments: satellite.CommentData[] = []

  public addComment(...comment: satellite.CommentData[]) {
    this.comments.push(...comment)
    Satellite.event.emit('addComment', ...comment)
  }

}
