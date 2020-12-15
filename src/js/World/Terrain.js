import {
  Object3D,
  Mesh,
  PlaneGeometry,
  BoxGeometry,
  MeshStandardMaterial,
  RepeatWrapping,
  sRGBEncoding,
  PlaneBufferGeometry,
  DoubleSide,
  InstancedMesh,
  MeshDepthMaterial,
  RGBADepthPacking,
} from 'three'
import Simplex from 'perlin-simplex'

export default class Terrain {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets

    // Set up
    this.container = new Object3D()
    this.size = 512
    this.resolution = 128
    this.simplex = new Simplex()
    this.islandSize = 30
    this.outerIslands = 70
    this.grassAmount = 0
    this.grassSize = 2
    this.grass
    this.possibleGrassPositions = []
    this.dummy = new Object3D()
    this.createTerrain()
  }

  createTerrain() {
    const scale = this.size / this.resolution;
    const amount = Math.pow(this.resolution, 2)
    const geometry = new BoxGeometry(
      scale, scale, scale
    );
    const material = new MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.3
    });
    this.terrain = new InstancedMesh(
      geometry,
      material,
      amount
    )
    console.log(amount)
    let x, y, z, d, p1, p2 = 0;
    let min = 0
    let max = 0
    for (let i = 0; i < amount; i++) {
      x = (i % this.resolution) * scale - (this.resolution * scale) / 2
      z = Math.floor(i / this.resolution) * scale - (this.resolution * scale) / 2
      d = Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2))
      p1 = (this.simplex.noise(x / 15, z / 15) * 2 * d) / this.size
      p2 = (this.simplex.noise(x / 15, z / 15) * 2 * d) / this.size

      if (d > this.islandSize + Math.random() * 5) {
        this.dummy.rotation.set(0, p1 * Math.PI * 2, p2 * Math.PI * 2)
        y = this.GetHeight(d, p1, p2)
        let s = Math.max(d / 50, 1)
        this.dummy.scale.set(s * 3, s / 3, s / 3)
      }
      else {
        this.dummy.rotation.set(0, 0, 0)
        this.dummy.scale.set(0.9, 0.9, 0.9)
        y = -10
      }

      console.log(y)
      this.dummy.position.set(
        x,
        -scale / 2 + y,
        z
      )

      this.dummy.updateMatrix()
      this.terrain.setMatrixAt(i, this.dummy.matrix)
    }

    this.container.add(this.terrain)
  }

  // createTerrain() {
  //   let geo = new PlaneGeometry(
  //     this.size,
  //     this.size,
  //     this.resolution,
  //     this.resolution
  //   )
  //   let vertices = geo.vertices

  //   let p1,
  //     p2,
  //     v,
  //     d = 0

  //   this.grassMesh = new Mesh(
  //     new PlaneBufferGeometry(1, 1),
  //     new MeshStandardMaterial({
  //       side: DoubleSide,
  //       alphaTest: 0.5,
  //     })
  //   )
  //   this.grassMesh.customDepthMaterial = new MeshDepthMaterial({
  //     depthPacking: RGBADepthPacking,
  //     alphaTest: 0.5,
  //   })
  //   this.grassMesh.castShadow = true

  //   const grassAlbedo = this.assets.textures.grass_Albedo
  //   grassAlbedo.wrapS = RepeatWrapping
  //   grassAlbedo.wrapT = RepeatWrapping
  //   grassAlbedo.repeat.set(1, 1)
  //   // grassAlbedo.encoding = sRGBEncoding
  //   this.grassMesh.material.map = grassAlbedo
  //   this.grassMesh.customDepthMaterial.map = grassAlbedo

  //   this.grass = new InstancedMesh(
  //     this.grassMesh.geometry,
  //     this.grassMesh.material,
  //     this.grassAmount
  //   )
  //   //this.grass.instanceMatrix.setUsage(DynamicDrawUsage); // will be updated every frame
  //   this.container.add(this.grass)

  //   for (let i = 0; i < vertices.length - this.resolution; i++) {
  //     v = vertices[i]
  //     d = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2))
  //     p1 = (this.simplex.noise(v.x / 100, v.y / 100) * 2 * d) / this.size

  //     p2 = (this.simplex.noise(v.x / 20, v.y / 20) * 2 * d) / this.size

  //     if (d > this.islandSize) {
  //       v.z += this.GetHeight(d, p1, p2)
  //     }
  //     if (d > (this.islandSize + 30) && v.z > 5 - Math.random() * 5) {
  //       this.possibleGrassPositions.push(v)
  //     }
  //   }

  //   this.dummy.rotateX(Math.PI / 2)
  //   for (let i = 0; i < this.grassAmount; i++) {
  //     let positionIndex = Math.floor(
  //       Math.random() * this.possibleGrassPositions.length
  //     )
  //     let position = this.possibleGrassPositions[positionIndex]
  //     this.dummy.rotateY(Math.PI * Math.random())
  //     let s = this.grassSize + Math.random() * 3
  //     this.dummy.scale.set(s, s, s)
  //     this.dummy.position.set(position.x, position.y, position.z + s / 2)
  //     this.dummy.updateMatrix()
  //     this.grass.setMatrixAt(i, this.dummy.matrix)
  //     this.possibleGrassPositions.splice(positionIndex, 1)
  //   }
  //   this.grass.instanceMatrix.needsUpdate = true

  //   this.terrain = new Mesh(
  //     geo,
  //     new MeshStandardMaterial({
  //       wireframe: false,
  //       wireframeLinewidth: 30,
  //     })
  //   )

  //   let r = 32

  //   const albedo_ = this.assets.textures.sand_Albedo
  //   albedo_.wrapS = RepeatWrapping
  //   albedo_.wrapT = RepeatWrapping
  //   albedo_.repeat.set(r, r)
  //   // albedo_.encoding = sRGBEncoding
  //   this.terrain.material.map = albedo_

  //   const normal_ = this.assets.textures.sand_Normal
  //   normal_.wrapS = RepeatWrapping
  //   normal_.wrapT = RepeatWrapping
  //   normal_.repeat.set(r, r)
  //   this.terrain.material.normalMap = normal_

  //   const roughness_ = this.assets.textures.sand_Roughness
  //   roughness_.wrapS = RepeatWrapping
  //   roughness_.wrapT = RepeatWrapping
  //   roughness_.repeat.set(r, r)
  //   this.terrain.material.roughnessMap = roughness_

  //   this.terrain.castShadow = false
  //   this.terrain.receiveShadow = true

  //   this.container.rotateX(-Math.PI / 2)
  //   this.container.add(this.terrain)
  // }

  GetHeight(d, p1, p2) {
    return (Math.sin((d - this.outerIslands) / 10) - 1) * 5 + p1 * 25 + p2 * 2
  }
}
