import {
  Object3D,
  PlaneBufferGeometry,
  RepeatWrapping,
  Vector2,
  Color,
} from 'three'
import { Water } from 'three/examples/jsm/objects/Water2.js'

import Simplex from 'perlin-simplex'

export default class WaterScene {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets
    this.debug = options.debug

    this.size = 256
    this.resolution = 256
    this.params = {
      speed: 10,
      size: 5,
      color: 0xaebdc2,
    }

    this.simplex = new Simplex()

    // Set up
    this.container = new Object3D()
    this.assets.textures.waterNormal.wrapS = this.assets.textures.waterNormal.wrapT = RepeatWrapping

    this.createWater()
    this.animateWater()
    if (this.debug) {
      this.setDebug()
    }
  }
  createWater() {
    this.water = new Water(
      new PlaneBufferGeometry(
        this.size,
        this.size,
        this.resolution,
        this.resolution
      ),
      {
        color: this.params.color,
        scale: 100,
        flowDirection: new Vector2(0.1, 0.1),
        textureWidth: 2048,
        textureHeight: 2048,
        reflectivity: 0.8,
        clipBias: 0.01,
        normalMap0: this.assets.textures.water.Water_1_M_Normal,
        normalMap1: this.assets.textures.water.Water_2_M_Normal,
      }
    )

    this.v = this.water.geometry.attributes.position.array
    this.water.rotation.x = -Math.PI / 2
    this.water.position.y = -1.2
    this.water.receiveShadow = true
    this.container.add(this.water)
  }

  animateWater() {
    this.time.on('tick', () => {
      for (let i = 0; i < this.v.length; i += 3) {
        let x = this.v[i]
        let y = this.v[i + 1]
        let n = this.simplex.noise3d(
          x / (this.params.size * 5),
          y / (this.params.size * 5),
          this.time.current / (this.params.speed * 500)
        )
        this.v[i + 2] = n * 1.5
      }
      this.water.geometry.attributes.position.needsUpdate = true
    })
  }
  setDebug() {
    this.debugFolder = this.debug.addFolder('Water')
    this.debugFolder.add(this.params, 'speed', 0.1, 20.0, 0.1).name('Speed')
    this.debugFolder.add(this.params, 'size', 0.1, 20.0, 0.1).name('Size')
    this.debugFolder
      .addColor(this.params, 'color')
      .name('Color')
      .onChange(() => {
        this.water.material.uniforms.color.value = new Color(this.params.color)
      })
  }
}
