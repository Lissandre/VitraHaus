import { Object3D } from 'three'

import Intro from './Intro'
import AmbientLightSource from './AmbientLight'
import SunLightSource from './SunLight'
import Houses from './Houses'
import Terrain from './Terrain'

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
    this.setSunLight()
    this.setHouses()
    this.setTerrain()
  }
  setIntro() {
    if (this.intro === true) {
      new Intro()
    }
  }
  setAmbientLight() {
    this.light = new AmbientLightSource({
      debug: this.debugFolder,
    })
    this.container.add(this.light.container)
  }
  setSunLight() {
    this.light = new SunLightSource({
      debug: this.debugFolder,
      time: this.time,
    })
    this.container.add(this.light.container)
  }
  setHouses() {
    this.houses = new Houses({
      time: this.time,
    })
    this.container.add(this.houses.container)
  }
  setTerrain() {
    this.terrain = new Terrain({
      time: this.time,
    })
    this.container.add(this.terrain.container)
  }
}
