import { Object3D } from 'three'

import Intro from './Intro'
import AmbientLightSource from './AmbientLight'
import PointLightSource from './PointLight'
import Suzanne from './Suzanne'

export default class World {
  constructor(options) {
    // Set options
    this.time = options.time
    this.debug = options.debug
    this.intro = options.intro

    // Set up
    this.container = new Object3D()

    if (this.debug) {
      this.debugFolder = this.debug.addFolder('World')
      this.debugFolder.open()
    }

    this.setIntro()
    this.setAmbientLight()
    this.setPointLight()
    this.setSuzanne()
  }
  setIntro() {
    if(this.intro === true) {
      new Intro()
    }
  }
  setAmbientLight() {
    this.light = new AmbientLightSource({
      debug: this.debugFolder,
    })
    this.container.add(this.light.container)
  }
  setPointLight() {
    this.light = new PointLightSource({
      debug: this.debugFolder,
    })
    this.container.add(this.light.container)
  }
  setSuzanne() {
    this.suzanne = new Suzanne({
      time: this.time,
    })
    this.container.add(this.suzanne.container)
  }
}
