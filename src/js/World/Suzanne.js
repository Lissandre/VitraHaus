import { Object3D } from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import SuzanneModel from '@models/suzanne.glb'

export default class Suzanne {
  constructor(options) {
    // Options
    this.time = options.time

    // Set up
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./draco/')
    dracoLoader.setDecoderConfig({ type: 'js' })

    this.gltfLoader = new GLTFLoader()
    this.gltfLoader.setDRACOLoader(dracoLoader)
    this.container = new Object3D()

    this.createSuzanne()
  }
  createSuzanne() {
    this.gltfLoader.load(SuzanneModel, (loaded) => {
      this.suzanne = loaded.scene
      this.container.add(this.suzanne)
      this.setMovement()
    })
  }
  setMovement() {
    this.time.on('tick', () => {
      this.suzanne.rotation.y += 0.005
    })
  }
}
