import { FrontSide, Object3D, Vector3 } from 'three'
import { easeInOutSine } from 'js-easing-functions'

export default class Houses {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets

    // Set up
    this.container = new Object3D()
    this.houses = []
    this.amount = 20
    this.baseScale = 0.0025
    this.spread = new Vector3(0.8, 0.2, 0.8)
    this.animationDuration = 1.5
    this.animationElapsed = 0
    this.animationOffset = 0.05

    this.createHouse()
  }
  createHouse() {
    this.originalHouse = this.assets.models.house.scene
    this.originalHouse.scale.set(0.3, 0.3, 0.3)
    let oldPos = new Vector3()
    let newPos = new Vector3()

    for (let i = 0; i < this.amount; i++) {
      let newHouse = this.assets.models.house.scene.clone()
      newHouse.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
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
      newHouse.originalScale = new Vector3(
        1 + Math.random(),
        1 + Math.random(),
        1 + Math.random()
      )
      newHouse.targetScale = newHouse.originalScale
      newHouse.targetScale.setLength(this.baseScale * (Math.random() + 0.5))

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
      this.houses.push(newHouse)
      this.container.add(newHouse)

      oldPos.set(
        this.clamp(newPos.x, -2, 2),
        newPos.y,
        this.clamp(newPos.z, -2, 2)
      )
    }
    console.log(this.houses)
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
