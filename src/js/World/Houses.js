import { FrontSide, Object3D, Vector3, PlaneBufferGeometry, MeshBasicMaterial, Mesh, Texture } from 'three'
import { easeInOutSine } from 'js-easing-functions'
import data from '@/data.json'
import p5 from "p5"

export default class Houses {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets
    this.housesList = options.housesList

    // Set up
    this.container = new Object3D()
    this.houses = []
    this.amount = 20
    this.scale = 8
    this.baseScale = 0.0025 * this.scale
    this.spread = new Vector3(
      0.8 * this.scale,
      0.2 * this.scale,
      0.8 * this.scale
    )
    this.animationDuration = 1.5
    this.animationElapsed = 0
    this.animationOffset = 0.05

    this.selected = 0;
    this.planes = []

    this.setUpCanvas()
    this.createHouse()
    this.updatePlanes()
  }
  setUpCanvas() {

    const sketch = (s) => {
      let gifs = []
      s.preload = () => {
        for (let i = 0; i < this.amount; i++) {
          gifs.push(s.loadImage("./gifs/" + i + ".gif"))
        }
      }

      s.setup = () => {
        this.canvas = s.createCanvas(500, 500, 500, 500);
        console.log()
      }

      s.draw = () => {
        s.image(gifs[this.selected], 0, 0);
      }
    }
    const sketchInstance = new p5(sketch);
  }

  updatePlanes() {
    this.time.on('tick', () => {
      if (!this.canvas) return;
      let i = 0
      this.planes.forEach(p => {
        if (p.visible) {
          this.selected = i
          this.canvasTexture = new Texture(this.canvas.canvas)
          this.canvasTexture.needsUpdate = true
          p.material.map = this.canvasTexture;
        }
        i++
      });

    })

  }

  createHouse() {
    this.originalHouse = this.assets.models.house.scene
    this.originalHouse.scale.set(0.3, 0.3, 0.3)
    let oldPos = new Vector3()
    let newPos = new Vector3()

    const planeGeometry = new PlaneBufferGeometry(150, 150, 1);
    const planeMaterial = new MeshBasicMaterial({ color: 0xffffff });
    const plane = new Mesh(planeGeometry, planeMaterial);

    for (let i = 0; i < this.amount; i++) {
      let newHouse = this.assets.models.house.scene.clone()
      this.housesList.push(newHouse)
      newHouse.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.material = child.material.clone()
          child.material.name = `copy_${child.material.name}${i}`
          child.material.side = FrontSide
        }
      })

      newHouse.startRotation = new Vector3(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      )
      newHouse.originalRotation = new Vector3(0, Math.random() * Math.PI * 2, 0)
      newHouse.targetRotation = newHouse.originalRotation

      newHouse.rotation.set(
        newHouse.startRotation.x,
        newHouse.startRotation.y,
        newHouse.startRotation.z
      )

      newHouse.scale.set(0, 0, 0)
      newHouse.originalScale = new Vector3(1, 1, 1)
      newHouse.targetScale = newHouse.originalScale
      newHouse.targetScale.setLength(this.baseScale)

      if (i > 2)
        newPos.set(
          oldPos.x + (Math.random() - 0.5) * this.spread.x,
          oldPos.y + (Math.sqrt(Math.random()) - 0.1) * this.spread.y,
          oldPos.z + (Math.random() - 0.5) * this.spread.z
        )
      else
        newPos.set(
          (Math.random() - 0.5) * this.spread.x,
          0,
          (Math.random() - 0.5) * this.spread.z
        )

      newHouse.position.set(newPos.x, newPos.y, newPos.z)
      newHouse.originalPosition = new Vector3(newPos.x, newPos.y, newPos.z)
      let p = plane.clone()
      this.planes.push(p)
      p.material.map = this.canvasTexture;// this.assets.textures[data[i].image]
      p.material.needsUpdate = true
      newHouse.plane = p
      newHouse.plane.rotateY(Math.PI)
      newHouse.plane.position.set(
        newPos.x + 0,
        newPos.y + 90,
        newPos.z + 150
      )
      newHouse.add(newHouse.plane)
      newHouse.plane.visible = false;
      newHouse.plane.name = "Plane"
      this.houses.push(newHouse)
      this.container.add(newHouse)

      oldPos.set(
        this.clamp(newPos.x, -2, 2),
        newPos.y,
        this.clamp(newPos.z, -2, 2)
      )
    }
    this.setMovement()
  }

  setMovement() {
    this.time.on('tick', () => {
      if (this.animationElapsed < this.animationDuration + this.amount) {
        for (let i = 0; i < this.amount; i++) {
          let offset = i * this.animationOffset
          let elapsed = this.animationElapsed - offset

          if (elapsed < 0 || elapsed > this.animationDuration) continue

          let h = this.houses[i]

          let diff = new Vector3()
          diff.subVectors(h.targetRotation, h.startRotation)

          this.easeInOutSineVector(
            elapsed,
            h.rotation,
            h.startRotation,
            diff,
            this.animationDuration
          )
          this.easeInOutSineVector(
            elapsed,
            h.scale,
            new Vector3(0, 0, 0),
            h.targetScale,
            this.animationDuration
          )
        }
        this.animationElapsed += this.time.delta / 1000
      }
    })
  }

  clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num
  }

  easeInOutSineVector(elapsed, current, start, target, duration) {
    current.set(
      easeInOutSine(elapsed, start.x, target.x, duration),
      easeInOutSine(elapsed, start.y, target.y, duration),
      easeInOutSine(elapsed, start.z, target.z, duration)
    )
  }
}
