import {
  Object3D,
  Mesh,
  PlaneGeometry,
  MeshStandardMaterial,
  RepeatWrapping,
  sRGBEncoding,
  PlaneBufferGeometry,
  DoubleSide,
  InstancedMesh,
  MeshDepthMaterial,
  RGBADepthPacking

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
    this.grassAmount = 4096;
    this.grassSize = 2;
    this.grass;
    this.possibleGrassPositions = []
    this.dummy = new Object3D()
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

    this.grassMesh = new Mesh(
      new PlaneBufferGeometry(1, 1),
      new MeshStandardMaterial({
        side: DoubleSide,
        alphaTest: 0.5
      })
    )
    this.grassMesh.customDepthMaterial = new MeshDepthMaterial({
      depthPacking: RGBADepthPacking,
      alphaTest: 0.5
    })
    this.grassMesh.castShadow = true;

    const grassAlbedo = this.assets.textures.grass_Albedo
    grassAlbedo.wrapS = RepeatWrapping
    grassAlbedo.wrapT = RepeatWrapping
    grassAlbedo.repeat.set(1, 1)
    grassAlbedo.encoding = sRGBEncoding
    this.grassMesh.material.map = grassAlbedo
    this.grassMesh.customDepthMaterial.map = grassAlbedo

    this.grass = new InstancedMesh(this.grassMesh.geometry, this.grassMesh.material, this.grassAmount);
    //this.grass.instanceMatrix.setUsage(DynamicDrawUsage); // will be updated every frame
    this.container.add(this.grass)


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

      if (d > this.islandSize) {
        v.z += this.GetHeight(d, p1, p2);
        if (v.z > (5 - Math.random() * 5)) {
          this.possibleGrassPositions.push(v)
        }
      }



    }

    this.dummy.rotateX(Math.PI / 2)
    for (let i = 0; i < this.grassAmount; i++) {
      let positionIndex = Math.floor(Math.random() * this.possibleGrassPositions.length)
      let position = this.possibleGrassPositions[positionIndex]
      this.dummy.rotateY(Math.PI * Math.random())
      let s = this.grassSize + Math.random() * 3
      this.dummy.scale.set(s, s, s)
      this.dummy.position.set(position.x, position.y, position.z + s / 2);
      this.dummy.updateMatrix();
      this.grass.setMatrixAt(i, this.dummy.matrix);
      this.possibleGrassPositions.splice(positionIndex, 1)
    }
    this.grass.instanceMatrix.needsUpdate = true;


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

    this.terrain.castShadow = false
    this.terrain.receiveShadow = true

    this.container.rotateX(-Math.PI / 2)
    this.container.add(this.terrain)
  }

  GetHeight(d, p1, p2) {
    return ((Math.sin((d - this.outerIslands) / 10) - 1) * 5 +
      p1 * 25 +
      p2 * 2)
  }
}
