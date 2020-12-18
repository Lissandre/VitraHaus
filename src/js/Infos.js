import EventEmitter from '@tools/EventEmitter'
import { Color, Raycaster, Vector2 } from 'three'
import anime from 'animejs'
import data from '@/data.json'

export default class Controls extends EventEmitter {
  constructor(options) {
    super()

    // Set options
    this.sizes = options.sizes
    this.houses = options.houses
    this.camera = options.camera
    this.about = options.about

    // Set up
    this.infosDOM = document.querySelector('.infos')
    this.nameDOM = document.querySelector('h1.name')
    this.titleDOM = this.infosDOM.querySelector('h2.title')
    this.descriptionDOM = this.infosDOM.querySelector('p.description')
    this.linkDOM = this.infosDOM.querySelector('a.action')

    this.mouse = {}
    this.raycaster = new Raycaster()
    this.direction = new Vector2()
    this.lastindex = null

    this.selected = null

    this.mouseMove()
    this.mouseClick()
  }
  mouseMove() {
    document.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / this.sizes.viewport.width) * 2 - 1

      this.mouse.y = -(event.clientY / this.sizes.viewport.height) * 2 + 1
      this.raycaster.setFromCamera(this.mouse, this.camera.camera)

      this.objects = []
      this.houses.forEach((house) => {
        house.traverse((child) => {
          if (child.isMesh && child.name != 'Plane') {
            this.objects.push(child)
            child.material.emissiveIntensity = 0
          }
        })
      })

      this.houses.forEach((house) => {
        house.traverse((child) => {
          if (child.isMesh) {
            child.material.emissiveIntensity = 0
          }
        })
      })

      this.intersects = this.raycaster.intersectObjects(this.objects)

      if (
        this.intersects.length > 0 &&
        this.camera.selectMode &&
        !this.about.isActive
      ) {
        console.log(this.houses.indexOf(this.intersects[0].object.parent.parent))
        this.setName(
          this.houses.indexOf(this.intersects[0].object.parent.parent)
        )
        this.intersects[0].object.parent.traverse((child) => {
          if (child.isMesh && child != this.selected) {
            this.selected = child
            this.selected.material.emissiveIntensity = 0.5
            this.selected.material.emissive = new Color(0xddddff)
          }
        })
      } else {
        this.selected = null
        this.removeName()
      }
    })
  }
  setName(index) {
    if (this.lastindex != index) {
      this.lastindex = index
      this.nameDOM.innerHTML = data[index].title
      anime({
        targets: this.nameDOM,
        opacity: [
          { value: 0, duration: 0 },
          { value: 1, duration: 250 },
        ],
        rotate: [
          { value: 6, duration: 0 },
          { value: 0, duration: 520 },
        ],
        translateY: [
          { value: '-20%', duration: 0 },
          { value: '-50%', duration: 520 },
        ],
        easing: 'easeOutQuad',
        duration: 320,
      })
    }
  }
  removeName() {
    if (this.lastindex != null) {
      this.lastindex = null
      anime({
        targets: this.nameDOM,
        opacity: [
          { value: 1, duration: 0 },
          { value: 0, duration: 250 },
        ],
        rotate: [
          { value: 0, duration: 0 },
          { value: -6, duration: 520 },
        ],
        translateY: [
          { value: '-50%', duration: 0 },
          { value: '-70%', duration: 520 },
        ],
        easing: 'easeOutQuad',
        duration: 320,
      })
    }
  }
  setInfos(index) {
    this.titleDOM.innerHTML = data[index].title
    this.descriptionDOM.innerHTML = data[index].description
    this.linkDOM.href = data[index].url
    anime({
      targets: this.infosDOM,
      opacity: [
        { value: 0, duration: 0 },
        { value: 1, duration: 250 },
      ],
      rotate: [
        { value: 6, duration: 0 },
        { value: 0, duration: 520 },
      ],
      translateY: [
        { value: '-20%', duration: 0 },
        { value: '-50%', duration: 520 },
      ],
      easing: 'easeOutQuad',
      duration: 320,
    })
  }
  removeInfos() {
    anime({
      targets: this.infosDOM,
      opacity: [
        { value: 0, duration: 0 },
        { value: 1, duration: 250 },
      ],
      rotate: [
        { value: 6, duration: 0 },
        { value: 0, duration: 520 },
      ],
      translateY: [
        { value: '-20%', duration: 0 },
        { value: '-50%', duration: 520 },
      ],
      easing: 'easeOutQuad',
      duration: 320,
    })
  }
  mouseClick() {
    document.addEventListener('click', () => {
      if (this.selected == null || this.about.isActive) return
      this.camera.startVisit(this.selected.parent.parent)
      this.selected == null
      this.houses.forEach((house) => {
        house.traverse((child) => {
          if (child.isMesh) {
            child.material.emissiveIntensity = 0
          }
        })
      })
    })
  }
}
