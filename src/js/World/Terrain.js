import {
  Object3D,
  Mesh,
  PlaneBufferGeometry,
  MeshStandardMaterial,
} from 'three'

export default class Terrain {
  constructor(options) {
    // Options
    this.time = options.time
    this.container = new Object3D()

    this.createTerrain()
  }
  createTerrain() {
    this.terrain = new Mesh(
      new PlaneBufferGeometry(100, 100, 32),
      new MeshStandardMaterial({ color: 0x808080 })
    )
    this.terrain.rotateX(-Math.PI / 2)
    this.terrain.receiveShadow = true
    this.container.add(this.terrain)
    this.setMovement()
  }
  setMovement() {
    this.time.on('tick', () => {
      //this.terrain.rotation.y += 0.005
    })
  }
}
