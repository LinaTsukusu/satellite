import {Satellite} from '@/main/satellite'

export abstract class SatellitePlugin {
  public abstract onTick(satellite: Satellite): void
  public abstract onLoaded(satellite: Satellite): void
  public abstract onBeforeAddComment(satellite: Satellite, comment: satellite.CommentData): void
  public abstract onAfterAddComment(satellite: Satellite, comment: satellite.CommentData): void
  public abstract onBeforeDeleteComment(satellite: Satellite, comment: satellite.CommentData): void
  public abstract onAfterDeleteComment(satellite: Satellite, comment: satellite.CommentData): void
  public abstract onBeforeUpdateComment(
    satellite: Satellite, oldComment: satellite.CommentData, newComment: satellite.CommentData): void
  public abstract onAfterUpdateComment(
    satellite: Satellite, oldComment: satellite.CommentData, newComment: satellite.CommentData): void
}
