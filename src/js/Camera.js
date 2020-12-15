import { Color, Object3D, PerspectiveCamera, Raycaster, Vector2 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Camera {
  constructor(options) {
    // Set Options
    this.sizes = options.sizes
    this.renderer = options.renderer
    this.debug = options.debug
    this.houses = options.houses

    // Set up
    this.mouse = {}
    this.container = new Object3D()
    this.raycaster = new Raycaster()
    this.direction = new Vector2()

    this.setCamera()
    this.setPosition()
    this.setOrbitControls()
    this.mouseMove()
  }
  setCamera() {
    // Create camera
    this.camera = new PerspectiveCamera(
      75,
      this.sizes.viewport.width / this.sizes.viewport.height,
      0.1,
      1000
    )
    this.container.add(this.camera)
    // Change camera aspect on resize
    this.sizes.on('resize', () => {
      this.camera.aspect =
        this.sizes.viewport.width / this.sizes.viewport.height
      // Call this method because of the above change
      this.camera.updateProjectionMatrix()
    })
  }
  setPosition() {
    // Set camera position
    this.camera.position.x = 0
    this.camera.position.y = 3
    this.camera.position.z = 15
  }
  setOrbitControls() {
    // Set orbit control
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    )
    this.orbitControls.enabled = true
    this.orbitControls.enableKeys = true
    this.orbitControls.zoomSpeed = 1

    if (this.debug) {
      this.debugFolder = this.debug.addFolder('Camera')
      this.debugFolder.open()
      this.debugFolder
        .add(this.orbitControls, 'enabled')
        .name('Enable Orbit Control')
    }
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
            child.material.emissiveIntensity = 0
          }
        })
      })

      this.intersects = this.raycaster.intersectObjects( this.objects )

      if (this.intersects.length > 0) {
        this.intersects[0].object.parent.traverse((child) => {
          if (child.isMesh) {
            child.material.emissiveIntensity = 1
            child.material.emissive = new Color(0xff0000)
          }
        })
      }
    })
  }
}
