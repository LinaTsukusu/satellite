declare namespace satellite {
  interface CommentData {
    number?: number
    thumbnailUrl: string
    userId: string
    userName: string
    handleName?: string
    site: string
    comment: string
    isFirst: boolean
    color?: string
    css?: string
  }

  interface SatellitePlugin {
    tick?(satellite: Satellite): void
    loaded?(satellite: Satellite): void
    beforeAddComment?(satellite: Satellite, comment: satellite.CommentData): void
    afterAddComment?(satellite: Satellite, comment: satellite.CommentData): void
    beforeDeleteComment?(satellite: Satellite, comment: satellite.CommentData): void
    afterDeleteComment?(satellite: Satellite, comment: satellite.CommentData): void
    beforeUpdateComment?(satellite: Satellite, oldComment: satellite.CommentData, newComment: satellite.CommentData): void
    afterUpdateComment?(satellite: Satellite, oldComment: satellite.CommentData, newComment: satellite.CommentData): void
  }

  interface Satellite {
    addComment(...comment: CommentData[]): boolean
    cancelAddComment(): boolean
    deleteComment(num: number): boolean
    updateComment(num: number, newComment: satellite.CommentData): boolean
  }

  enum Events {
    tick = 'tick',
    loaded = 'loaded',
    beforeAddComment = 'beforeAddComment',
    afterAddComment = 'afterAddComment',
    canceledAddComment = 'canceledAddComment',
    beforeDeleteComment = 'beforeDeleteComment',
    afterDeleteComment = 'afterDeleteComment',
    canceledDeleteComment = 'canceledDeleteComment',
    beforeUpdateComment = 'beforeUpdateComment',
    afterUpdateComment = 'afterUpdateComment',
    canceledUpdateComment = 'canceledUpdateComment',
  }
}
