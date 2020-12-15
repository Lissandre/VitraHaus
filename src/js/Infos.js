import EventEmitter from '@tools/EventEmitter'
import { Color, Raycaster, Vector2 } from 'three'
import data from '@/data.json'

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

    this.mouse = {}
    this.raycaster = new Raycaster()
    this.direction = new Vector2()

    this.mouseMove()
  }
  mouseMove() {
    document.addEventListener('mousemove', (event) => {
      this.mouse.x = ( event.clientX / this.sizes.viewport.width ) * 2 - 1
      this.mouse.y = - ( event.clientY / this.sizes.viewport.height ) * 2 + 1
      this.raycaster.setFromCamera( this.mouse, this.camera )

      this.objects = []
      this.houses.forEach(house => {
        house.traverse((child) => {
          if(child.isMesh){
            this.objects.push(child)
          }
        })
      })

      this.intersects = this.raycaster.intersectObjects( this.objects )

      if (this.intersects.length > 0) {
        this.setInfos(this.houses.indexOf(this.intersects[0].object.parent.parent))
        this.houses.forEach(house => {
          house.traverse((child) => {
            if(child.isMesh){
              child.material.emissiveIntensity = 0
            }
          })
        })
        this.intersects[0].object.parent.traverse((child) => {
          if (child.isMesh) {
            child.material.emissiveIntensity = 1
            child.material.emissive = new Color(0xff0000)
          }
        })
      }
    })
  }
  setInfos(index) {
    if(this.infosDOM.classList.contains('hidden')){
      this.infosDOM.classList.remove('hidden')
    }
    this.titleDOM.innerHTML = data[index].title
    // this.descriptionDOM.innerHTML = data[index].description
    // this.linkDOM.href = data[index].url
  }
}