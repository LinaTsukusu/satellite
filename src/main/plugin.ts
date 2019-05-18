import {getLogger} from 'log4js'
// import {Satellite} from '@/main/satellite'


export class Plugin {

  public readonly logger = getLogger()
  public readonly name: string
  // private satellite: Satellite = Satellite.instance

  constructor(name: string) {
    this.name = name
    this.logger = getLogger()
  }

}
