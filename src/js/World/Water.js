import {
  Object3D,
  Mesh,
  PlaneBufferGeometry,
  MeshStandardMaterial,
  RepeatWrapping,
  Vector2
} from 'three'
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
    this.water = new Water( new PlaneBufferGeometry(256, 256, 32), {
      color: 0x6c7cbe,
      scale: 2,
      flowDirection: new Vector2( 1, 1 ),
      textureWidth: 1024,
      textureHeight: 1024
    } )

    this.water.rotation.x = - Math.PI / 2
    this.water.position.y = -0.5
    this.water.receiveShadow = true
    this.container.add(this.water)
  }
}
