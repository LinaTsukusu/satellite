import {SatellitePlugin} from './satellite-plugin'
import {Satellite} from './satellite'

export default class Test extends SatellitePlugin {
  onAfterAddComment(satellite: Satellite, comment: satellite.CommentData): void {
  }

  onAfterDeleteComment(satellite: Satellite, comment: satellite.CommentData): void {
  }

  onAfterUpdateComment(satellite: Satellite, oldComment: satellite.CommentData, newComment: satellite.CommentData): void {
  }

  onBeforeAddComment(satellite: Satellite, comment: satellite.CommentData): void {
  }

  onBeforeDeleteComment(satellite: Satellite, comment: satellite.CommentData): void {
  }

  onBeforeUpdateComment(satellite: Satellite, oldComment: satellite.CommentData, newComment: satellite.CommentData): void {
  }

  onLoaded(satellite: Satellite): void {
  }

  onTick(satellite: Satellite): void {
    satellite.addComment({thumbnailUrl: '', userId: '', userName: '', site: 'YouTube', comment: 'test', isFirst: true})
  }
}
