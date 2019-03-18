import {Satellite} from '@/main/satellite'

export interface SatellitePlugin {
  tick?(satellite: Satellite): void
  loaded?(satellite: Satellite): void
  beforeAddComment?(satellite: Satellite, comment: satellite.CommentData): void
  afterAddComment?(satellite: Satellite, comment: satellite.CommentData): void
  beforeDeleteComment?(satellite: Satellite, comment: satellite.CommentData): void
  afterDeleteComment?(satellite: Satellite, comment: satellite.CommentData): void
  beforeUpdateComment?(satellite: Satellite, oldComment: satellite.CommentData, newComment: satellite.CommentData): void
  afterUpdateComment?(satellite: Satellite, oldComment: satellite.CommentData, newComment: satellite.CommentData): void
}
