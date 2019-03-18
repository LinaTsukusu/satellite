// @types/nodeの型が足りないので追加
declare module 'fs' {
  namespace promises {
    function readdir(path: PathLike, options?: { withFileTypes: true }): Promise<Dirent[]>
  }
}
