import {Satellite} from '../satellite'

export default (satellite: Satellite) => {
  const time = new Date()
  satellite.on('tick', () => {
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
}
