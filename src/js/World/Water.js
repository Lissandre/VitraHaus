import {
  Object3D,
  Mesh,
  PlaneBufferGeometry,
  MeshStandardMaterial,
} from 'three'

export default class Water {
  constructor(options) {
    // Options
    this.time = options.time
    this.container = new Object3D()

    this.createWater()
  }
  createWater() {
    this.water = new Mesh(
      new PlaneBufferGeometry(256, 256, 32),
      new MeshStandardMaterial({
        color: 0x2030ee,
        transparent: true,
        opacity: 0.5,
      })
    )
    this.water.rotateX(-Math.PI / 2)
    this.water.position.y = -0.5
    this.water.receiveShadow = true
    this.container.add(this.water)
  }
}
