import {Satellite} from '@/main/satellite'

export default async () => {
  await Satellite.loadPlugin()
  const satellite = Satellite.instance

}
