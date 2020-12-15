import {
  Scene,
  sRGBEncoding,
  WebGLRenderer,
  PCFSoftShadowMap,
  ACESFilmicToneMapping,
  FogExp2,
  Color
} from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass'

import * as dat from 'dat.gui'

import Sizes from '@tools/Sizes'
import Time from '@tools/Time'
import Loader from '@tools/Loader'
import Camera from './Camera'
import Infos from './Infos'
import World from '@world/index'

export default class App {
  constructor(options) {
    // Set options
    this.canvas = options.canvas
    this.intro = options.intro

    // Set up
    this.time = new Time()
    this.sizes = new Sizes()
    this.assets = new Loader()
    this.houses = []
    this.params = {
      color: 0xffffff
    }

    this.setConfig()
    this.setRenderer()
    this.setCamera()
    this.setInfos()
    this.setPass()
    this.setWorld()
  }
  setRenderer() {
    // Set scene
    this.scene = new Scene()
    this.scene.fog = new FogExp2(this.params.color, 0.008)
    // Set renderer
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    })
    // Set background color
    this.renderer.setClearColor(0xffffff, 1)
    // Set renderer pixel ratio & sizes
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
    this.renderer.physicallyCorrectLights = true
    // this.renderer.outputEncoding = sRGBEncoding
    this.renderer.toneMapping = ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 0.7
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMapSoft = true
    this.renderer.shadowMap.type = PCFSoftShadowMap
    this.renderer.autoClear = false
    // Resize renderer on resize event
    this.sizes.on('resize', () => {
      this.renderer.setSize(
        this.sizes.viewport.width,
        this.sizes.viewport.height
      )
    })

    if(this.debug) {
      this.debugFolder = this.debug.addFolder('Scene')
      this.debugFolder
        .addColor(this.params, 'color')
        .name('Color')
        .onChange(() => {
          this.scene.fog.color = new Color(this.params.color)
          this.renderer.setClearColor(new Color(this.params.color), 1)
        })
    }
    // Set RequestAnimationFrame with 60ips
    // this.time.on('tick', () => {
    //   this.renderer.render(this.scene, this.camera.camera)
    // })
  }
  setCamera() {
    // Create camera instance
    this.camera = new Camera({
      sizes: this.sizes,
      renderer: this.renderer,
      debug: this.debug,
    })
    this.time.on('tick', () => {
      this.camera.orbitControls.update()
    })
    // Add camera to scene
    this.scene.add(this.camera.container)
  }
  setInfos() {
    this.infos = new Infos({
      houses: this.houses,
      sizes: this.sizes,
      camera: this.camera.camera,
    })
  }
  setPass() {
    this.passes = {}
    // Set composer
    this.passes.composer = new EffectComposer(this.renderer)
    // Create passes
    this.passes.renderPass = new RenderPass(this.scene, this.camera.camera)
    this.passes.bokehPass = new BokehPass(this.scene, this.camera.camera, {
      focus: 20.0,
      aperture: 0.00003,
      maxblur: 0.004,
      width: this.sizes.viewport.width,
      height: this.sizes.viewport.height
    })

    this.passes.composer.addPass(this.passes.renderPass)
    this.passes.composer.addPass(this.passes.bokehPass)

    if (this.debug) {
      this.debugFolder = this.debug.addFolder('Depth of Field')
      this.debugFolder.add(this.passes.bokehPass.uniforms.focus, "value", 0.0, 300.0, 10).name('Focus')
      this.debugFolder.add(this.passes.bokehPass.uniforms.aperture, "value", 0, 0.0001, 0.00001).name('Aperture')
      this.debugFolder.add(this.passes.bokehPass.uniforms.maxblur, "value", 0.0, 0.01, 0.001).name('MaxBlur')
    }

    this.sizes.on('resize', () => {
      this.passes.composer.setSize(
        this.sizes.viewport.width,
        this.sizes.viewport.height
      )
    })

    this.time.on('tick', () => {
      // this.renderer.render(this.scene, this.camera.camera)
      this.passes.composer.render()
    })
  }
  setWorld() {
    // Create world instance
    this.world = new World({
      time: this.time,
      debug: this.debug,
      assets: this.assets,
      intro: this.intro,
      camera: this.camera.camera,
      houses: this.houses,
    })
    // Add world to scene
    this.scene.add(this.world.container)
  }
  setConfig() {
    if (window.location.hash === '#debug') {
      this.debug = new dat.GUI({ width: 420 })
    }
  }
}
