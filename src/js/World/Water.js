import { Object3D, PlaneBufferGeometry, RepeatWrapping, Vector2 } from 'three'
import { Water } from 'three/examples/jsm/objects/Water2.js'

export default class WaterScene {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets

    // Set up
    this.container = new Object3D()
    this.assets.textures.waterNormal.wrapS = this.assets.textures.waterNormal.wrapT = RepeatWrapping

    this.createWater()
  }
  createWater() {
    // this.water = new Mesh(
    //   new PlaneBufferGeometry(256, 256, 32),
    //   new MeshStandardMaterial({
    //     color: 0x2030ee,
    //     transparent: true,
    //     opacity: 0.5,
    //   })
    // )
    this.water = new Water(new PlaneBufferGeometry(256, 256, 32), {
      color: 0xb1b1dc,
      scale: 4,
      flowDirection: new Vector2(0.1, 0.1),
      textureWidth: 256,
      textureHeight: 256,
    })

    this.water.rotation.x = -Math.PI / 2
    this.water.position.y = -0.5
    this.water.receiveShadow = true
    this.container.add(this.water)
  }
}
