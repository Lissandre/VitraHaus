import EventEmitter from '@tools/EventEmitter'
import { Color, Raycaster, Vector2 } from 'three'
import data from '@/data.json'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Controls extends EventEmitter {
  constructor(options) {
    super()

    // Set options
    this.sizes = options.sizes
    this.houses = options.houses
    this.camera = options.camera

    // Set up
    this.infosDOM = document.querySelector('.infos')
    this.titleDOM = this.infosDOM.querySelector('h2.title')
    this.descriptionDOM = this.infosDOM.querySelector('p.description')
    this.linkDOM = this.infosDOM.querySelector('a.action')

    this.mouse = {}
    this.raycaster = new Raycaster()
    this.direction = new Vector2()


    this.selected = null;

    this.mouseMove()
    this.mouseClick()
  }
  mouseMove() {
    document.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / this.sizes.viewport.width) * 2 - 1

      this.mouse.y = - (event.clientY / this.sizes.viewport.height) * 2 + 1
      this.raycaster.setFromCamera(this.mouse, this.camera.camera)

      this.objects = []
      this.houses.forEach((house) => {
        house.traverse((child) => {
          if (child.isMesh && child.name != "Plane") {
            this.objects.push(child)
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

      if (this.intersects.length > 0 && this.camera.selectMode) {
        this.setInfos(
          this.houses.indexOf(this.intersects[0].object.parent.parent)
        )

        this.intersects[0].object.parent.traverse((child) => {
          if (child.isMesh && child != this.selected) {
            this.selected = child
            this.selected.material.emissiveIntensity = 0.5
            this.selected.material.emissive = new Color(0xddddff)
          }
        })
      }
      else
        this.selected = null

    })
  }

  mouseClick() {
    document.addEventListener('click', (event) => {
      if (this.selected == null) return
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

  setInfos(index) {
    if (this.infosDOM.classList.contains('hidden')) {
      this.infosDOM.classList.remove('hidden')
    }

    if (data[index])
      this.titleDOM.innerHTML = data[index].title
    // this.descriptionDOM.innerHTML = data[index].description
    // this.linkDOM.href = data[index].url
  }
}
