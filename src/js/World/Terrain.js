import { Object3D, Vector2, Mesh, PlaneGeometry, MeshStandardMaterial, TextureLoader, RepeatWrapping } from 'three'
import Perlin from '@tools/Perlin'

import albedo from '@textures/sand_Albedo.jpg'
import normal from '@textures/sand_Normal.jpg'
import roughness from '@textures/sand_Roughness.jpg'


export default class Terrain {
  constructor(options) {
    // Options
    this.time = options.time
    this.container = new Object3D()
    this.size = 256;
    this.resolution = 256;
    this.perlin = new Perlin()
    this.islandSize = 5;
    this.outerIslands = 50 + Math.random() * 2;
    this.createTerrain()
  }

  createTerrain() {
    let geo = new PlaneGeometry(this.size, this.size, this.resolution, this.resolution);
    let vertices = geo.vertices;

    let p, v, d = 0

    for (let i = 0; i < vertices.length - this.resolution; i++) {
      v = vertices[i]
      d = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2))
      p = this.perlin.get((v.x + this.resolution / 2) / this.resolution,
        (v.y + this.resolution / 2) / this.resolution) * 2 * d / this.size

      // if (d < this.islandSize) {
      //  v.z += p * 100
      //}
      if (d > this.islandSize) {
        v.z += (Math.sin((d - this.outerIslands) / 10) - 1) * 5 + p * (d - this.islandSize)
      }
    }

    this.terrain = new Mesh(
      geo,
      new MeshStandardMaterial({wireframe: false, wireframeLinewidth: 30})
    );

    let r = 32
  
    const albedo_ = new TextureLoader().load(albedo);    
    albedo_.wrapS = RepeatWrapping
    albedo_.wrapT = RepeatWrapping
    albedo_.repeat.set(r, r)
    this.terrain.material.map = albedo_

    const normal_ = new TextureLoader().load(normal);
    normal_.wrapS = RepeatWrapping
    normal_.wrapT = RepeatWrapping
    normal_.repeat.set(r, r)
    this.terrain.material.normalMap = normal_

    const roughness_ = new TextureLoader().load(roughness);

    roughness_.wrapS = RepeatWrapping
    roughness_.wrapT = RepeatWrapping
    roughness_.repeat.set(r, r)
    this.terrain.material.roughnessMap = roughness_
    
    console.log(this.terrain.material)

    this.terrain.rotateX(-Math.PI / 2)
    this.terrain.castShadow = false;
    this.terrain.receiveShadow = true;
    this.container.add(this.terrain);
    this.setMovement()
  }


  setMovement() {
    this.time.on('tick', () => {
      //this.terrain.rotation.y += 0.005
    })
  }
}