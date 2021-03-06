import { Object3D, DirectionalLight, Vector3, Color } from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky'

export default class SunLightSource {
  constructor(options) {
    // Set options
    this.debug = options.debug
    this.time = options.time

    // Set up
    this.container = new Object3D()
    this.sky = new Sky()
    this.sun = new Vector3()
    this.date = new Date()
    this.hours = this.date.getHours()
    this.minutes = this.date.getMinutes()

    this.effectController = {
      turbidity: 0.8,
      rayleigh: 0.985,
      mieCoefficient: 0.03,
      mieDirectionalG: 0.89,
      inclination: this.hours / 12 - 1 + this.minutes / 60 / 24,
      azimuth: 0.4104,
    }
    this.params = {
      color: 0xffffff,
    }

    //this.createSkyBox()
    this.createSunLight()
    if (this.debug) {
      this.setDebug2()
    }
  }
  createSkyBox() {
    this.uniforms = this.sky.material.uniforms
    this.uniforms['turbidity'].value = this.effectController.turbidity
    this.uniforms['rayleigh'].value = this.effectController.rayleigh
    this.uniforms['mieCoefficient'].value = this.effectController.mieCoefficient
    this.uniforms[
      'mieDirectionalG'
    ].value = this.effectController.mieDirectionalG
    this.setOrientation()

    this.time.on('tick', () => {
      this.date = new Date()
      this.hours = this.date.getHours()
      this.minutes = this.date.getMinutes()
      this.effectController.inclination =
        this.hours / 12 - 1 + this.minutes / 60 / 24
    })

    this.sky.scale.setScalar(450000)
    this.container.add(this.sky)
  }
  createSunLight() {
    this.light = new DirectionalLight(this.params.color, 1.5)
    this.light.castShadow = true
    this.light.shadow.mapSize.width = 1920
    this.light.shadow.mapSize.height = 1920
    //this.light.position.copy(this.sun)
    this.container.add(this.light)
  }
  setOrientation() {
    this.theta = Math.PI * (this.effectController.inclination - 0.5)
    this.phi = 2 * Math.PI * (this.effectController.azimuth - 0.5)
    this.sun.x = Math.cos(this.phi)
    this.sun.y = Math.sin(this.phi) * Math.sin(this.theta)
    this.sun.z = Math.sin(this.phi) * Math.cos(this.theta)
    this.uniforms['sunPosition'].value.copy(this.sun)
  }
  setDebug2() {
    this.debugFolder = this.debug.addFolder('SunLight')
    this.debugFolder
      .addColor(this.params, 'color')
      .name('Color')
      .onChange(() => {
        this.light.color = new Color(this.params.color)
      })
    this.debugFolder
      .add(this.light, 'intensity', 0.0, 2.0, 0.1)
      .name('Intensity')
  }
  setDebug() {
    this.debugFolder = this.debug.addFolder('Sky')
    this.debugFolder
      .add(this.effectController, 'turbidity', 0.0, 20.0, 0.1)
      .onChange(() => {
        this.uniforms['turbidity'].value = this.effectController.turbidity
      })
    this.debugFolder
      .add(this.effectController, 'rayleigh', 0.0, 4, 0.001)
      .onChange(() => {
        this.uniforms['rayleigh'].value = this.effectController.rayleigh
      })
    this.debugFolder
      .add(this.effectController, 'mieCoefficient', 0.0, 0.1, 0.001)
      .onChange(() => {
        this.uniforms[
          'mieCoefficient'
        ].value = this.effectController.mieCoefficient
      })
    this.debugFolder
      .add(this.effectController, 'mieDirectionalG', 0.0, 1, 0.001)
      .onChange(() => {
        this.uniforms[
          'mieDirectionalG'
        ].value = this.effectController.mieDirectionalG
      })
    this.debugFolder
      .add(this.effectController, 'azimuth', 0, 1, 0.0001)
      .onChange(() => {
        this.setOrientation()
        this.light.position.copy(this.sun)
      })
    this.debugFolder.add(this, 'hours', 0, 23, 1).onChange(() => {
      this.effectController.inclination =
        this.hours / 12 - 1 + this.minutes / 60 / 24
      this.setOrientation()
      this.light.position.copy(this.sun)
    })
    this.debugFolder.add(this, 'minutes', 0, 59, 1).onChange(() => {
      this.effectController.inclination =
        this.hours / 12 - 1 + this.minutes / 60 / 24
      this.setOrientation()
      this.light.position.copy(this.sun)
    })
  }
}
