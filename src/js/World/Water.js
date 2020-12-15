import { Object3D, Mesh, PlaneBufferGeometry, MeshStandardMaterial, RepeatWrapping, Vector2 } from 'three'
import { Water } from 'three/examples/jsm/objects/Water2.js'

import Simplex from 'perlin-simplex'

export default class WaterScene {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets

    this.size = 256
    this.resolution = 256

    this.simplex = new Simplex()

    // Set up
    this.container = new Object3D()
    this.assets.textures.waterNormal.wrapS = this.assets.textures.waterNormal.wrapT = RepeatWrapping

    this.createWater()
    this.animateWater()
  }
  createWater() {
    this.water = new Water(new PlaneBufferGeometry(this.size, this.size, this.resolution, this.resolution), {
      color: 0xaebdc2,
      scale: 100,
      flowDirection: new Vector2(0.1, 0.1),
      textureWidth: 2048,
      textureHeight: 2048,
      reflectivity: 0.8,
      clipBias: 0.01,
    })

    console.log(this.water)

    this.v = this.water.geometry.attributes.position.array;
    console.log(this.v)
    this.water.rotation.x = -Math.PI / 2
    this.water.position.y = -1.5
    this.water.receiveShadow = true
    this.container.add(this.water)
  }

  animateWater() {
    this.time.on('tick', () => {
      for (let i = 0; i < this.v.length; i += 3) {
        let x = this.v[i]
        let y = this.v[i + 1]
        let n = this.simplex.noise3d(
          x / 20,
          y / 20,
          this.time.current / 3000
        )
        this.v[i + 2] = n * 1.5
      }
      this.water.geometry.attributes.position.needsUpdate = true
    })
  }
}
