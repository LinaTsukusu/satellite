interface CommentData {
  number?: number
  time: Date
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
  beforeAddComment?(satellite: Satellite, comment: CommentData): void
  afterAddComment?(satellite: Satellite, comment: CommentData): void
  beforeDeleteComment?(satellite: Satellite, comment: CommentData): void
  afterDeleteComment?(satellite: Satellite, comment: CommentData): void
  beforeUpdateComment?(satellite: Satellite, oldComment: CommentData, newComment: CommentData): void
  afterUpdateComment?(satellite: Satellite, oldComment: CommentData, newComment: CommentData): void
}

interface Satellite {
  addComment(...comment: CommentData[]): boolean
  cancelAddComment(): boolean
  deleteComment(num: number): boolean
  updateComment(num: number, newComment: CommentData): boolean
}
