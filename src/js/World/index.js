import { Object3D } from 'three'
import * as lottie from 'lottie-web'

import Intro from './Intro'
import Sounds from './Sounds'
import AmbientLightSource from './AmbientLight'
import SunLightSource from './SunLight'
import Houses from './Houses'
import Terrain from './Terrain'
import WaterScene from './Water'

export default class World {
  constructor(options) {
    // Set options
    this.time = options.time
    this.debug = options.debug
    this.assets = options.assets
    this.introStatus = options.intro
    this.camera = options.camera
    this.housesList = options.houses

    // Set up
    this.container = new Object3D()

    if (this.debug) {
      this.debugFolder = this.debug.addFolder('World')
    }

    this.setLoader()
  }
  init() {
    this.setIntro()
    this.setHouses()
    this.setSounds()
  }
  setLoader() {
    this.loadDiv = document.querySelector('.loadScreen')
    this.loadModels = this.loadDiv.querySelector('.load')
    this.progress = this.loadDiv.querySelector('.progress')
    
    lottie.loadAnimation({
      container: this.loadModels, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: './anim.json' // the path to the animation json
    })

    this.assets.on('ressourceLoad', () => {
      this.progress.style.width = `${
        Math.floor((this.assets.done / this.assets.total) * 100) +
        Math.floor((1 / this.assets.total) * this.assets.currentPercent)
      }%`
    })

    this.assets.on('ressourcesReady', () => {
      this.button = document.createElement('button')
      this.button.innerHTML = 'Start VitraHaus'
      this.loadDiv.append(this.button)

      let that = this
      const start = function() {
        that.button.removeEventListener('click', start)
        setTimeout(() => {
          that.loadDiv.style.opacity = 0
          setTimeout(() => {
            that.loadDiv.remove()
            that.init()
          }, 550)
        }, 1000)
      }

      this.button.addEventListener('click', start)
      this.setAmbientLight()
      this.setSunLight()
      this.setWater()
    })
  }
  setIntro() {
    this.intro = new Intro({
      introStatus: this.introStatus,
    })
  }
  setSounds() {
    this.sounds = new Sounds({
      assets: this.assets,
      camera: this.camera,
    })
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
    this.intro.on('endIntro', () => {
      this.houses = new Houses({
        time: this.time,
        assets: this.assets,
        housesList: this.housesList,
      })
      this.container.add(this.houses.container)
    })
  }
  setTerrain() {
    this.terrain = new Terrain({
      time: this.time,
      assets: this.assets,
    })
    this.container.add(this.terrain.container)
  }
  setWater() {
    this.water = new WaterScene({
      time: this.time,
      assets: this.assets,
      debug: this.debugFolder,
    })
    this.container.add(this.water.container)
  }
}
