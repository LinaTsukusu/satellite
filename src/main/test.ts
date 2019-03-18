import {SatellitePlugin} from './satellite-plugin'
import {Satellite} from '@/main/satellite'


export default class Test implements SatellitePlugin {
  public tick(satellite: Satellite): void {
  }
}
