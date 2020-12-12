import {
  Object3D,
  Mesh,
  PlaneGeometry,
  MeshStandardMaterial,
  RepeatWrapping,
  sRGBEncoding
} from 'three'
import Simplex from 'perlin-simplex'


export default class Terrain {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets

    // Set up
    this.container = new Object3D()
    this.size = 256
    this.resolution = 256
    this.simplex = new Simplex()
    this.islandSize = 5
    this.outerIslands = 50 + Math.random() * 2
    this.createTerrain()
  }

  createTerrain() {
    let geo = new PlaneGeometry(
      this.size,
      this.size,
      this.resolution,
      this.resolution
    )
    let vertices = geo.vertices

    let p1, p2,
      v,
      d = 0

    for (let i = 0; i < vertices.length - this.resolution; i++) {
      v = vertices[i]
      d = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2))
      p1 =
        (this.simplex.noise(
          v.x / 100,
          v.y / 100
        ) * 2 * d) / this.size

      p2 =
        (this.simplex.noise(
          v.x / 20,
          v.y / 20
        ) * 2 * d) / this.size

      // if (d < this.islandSize) {
      //  v.z += p* 2 * * 100
      //}
      if (d > this.islandSize) {
        v.z +=
          (Math.sin((d - this.outerIslands) / 10) - 1) * 5 +
          p1 * 25 +
          p2 * 2
      }
    }


    this.terrain = new Mesh(
      geo,
      new MeshStandardMaterial({
        wireframe: false,
        wireframeLinewidth: 30,
      })
    )

    let r = 32

    const albedo_ = this.assets.textures.sand_Albedo
    albedo_.wrapS = RepeatWrapping
    albedo_.wrapT = RepeatWrapping
    albedo_.repeat.set(r, r)
    albedo_.encoding = sRGBEncoding
    this.terrain.material.map = albedo_

    const normal_ = this.assets.textures.sand_Normal
    normal_.wrapS = RepeatWrapping
    normal_.wrapT = RepeatWrapping
    normal_.repeat.set(r, r)
    this.terrain.material.normalMap = normal_

    const roughness_ = this.assets.textures.sand_Roughness
    roughness_.wrapS = RepeatWrapping
    roughness_.wrapT = RepeatWrapping
    roughness_.repeat.set(r, r)
    this.terrain.material.roughnessMap = roughness_

    this.terrain.rotateX(-Math.PI / 2)
    this.terrain.castShadow = false
    this.terrain.receiveShadow = true
    this.container.add(this.terrain)
  }
}
