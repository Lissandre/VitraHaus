import { Object3D, PerspectiveCamera, Vector3, Quaternion, Euler, Mesh, SphereGeometry, MeshBasicMaterial } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Camera {
  constructor(options) {
    // Set Options
    this.sizes = options.sizes
    this.renderer = options.renderer
    this.debug = options.debug
    this.time = options.time
    this.houses = options.houses

    // Set up
    this.container = new Object3D()
    this.targetOrientation = new Vector3(0, 8, 0)
    this.lastTargetRotation = new Vector3(0, 0, 0)
    this.currentTargetOrientation = new Vector3(0, 8, 0)
    this.targetPosition = new Vector3(0, 3, 60)
    this.currentTargetPosition = new Vector3(0, 3, 60)
    this.verticalOffset = 1;

    this.selectMode = true;

    this.lookBack = false;
    this.lookValue = 0;
    this.target = undefined

    this.state = 0;

    this.setCamera()
    this.setPosition()
    this.setOrbitControls()
    this.moveCamera()
    this.stopVisitListen()
  }
  setCamera() {
    // Create camera
    this.camera = new PerspectiveCamera(
      30.3,
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
    this.camera.position.y = 8
    this.camera.position.z = 60
  }
  setOrbitControls() {
    // Set orbit control
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    )
    this.orbitControls.enabled = true
    this.orbitControls.enableKeys = true
    this.orbitControls.enableZoom = false
    this.orbitControls.enablePan = false

    this.orbitControls.minPolarAngle = Math.PI / 3
    this.orbitControls.maxPolarAngle = Math.PI / 2

    this.orbitControls.enableDamping = true
    this.orbitControls.dampingFactor = 0.05

    this.orbitControls.autoRotate = true
    this.orbitControls.autoRotateSpeed = 0.2

    this.orbitControls.target.set(0, 8, 0)
    this.camera.lookAt(0, 8, 0)

    this.orbitControls.saveState()

    if (this.debug) {
      this.debugFolder = this.debug.addFolder('Camera')
      this.debugFolder
        .add(this.orbitControls, 'enabled')
        .name('Enable Orbit Control')
    }
  }

  startVisit(target) {
    if (this.state == 1) return
    this.orbitControls.target.set(0, 0, 0)
    this.orbitControls.enabled = false;
    this.target = target
    this.selectMode = false;
    this.state = 1

    this.currentTargetOrientation.set(
      0,
      8,
      0
    )

    let t = new Vector3()

    t = target.originalPosition

    this.targetOrientation.set(t.x, t.y, t.z)

    let r = this.target.originalRotation.y

    this.targetPosition.set(
      t.x + Math.sin(r) * 50,
      t.y,
      t.z + Math.cos(r) * 50
    )

  }

  stopVisit() {
    if (this.state == 1) {
      this.selectMode = true;
      this.state = 2
      this.lookBack = false
      this.lastTargetRotation.set(
        this.target.rotation.x,
        this.target.rotation.y,
        this.target.rotation.z
      )
    }
  }

  moveCamera() {
    this.time.on('tick', () => {
      switch (this.state) {
        case 0:
          this.orbitControls.update()
          break
        case 1:
          this.lerpToCamera()
          this.lerpToTarget()
          break
        case 2:
          this.lerpToOrbit()
      }
      this.lerpToOriginal()
      this.lerpLookDirection()
    })
  }


  lerpLookDirection() {
    if (this.lookBack)
      this.lookValue = this.lookValue * (1 - 0.1)
    else
      this.lookValue = this.lookValue * (1 - 0.1) + Math.PI * 0.1

  }

  lerpToTarget() {
    let r = this.target.originalRotation.y
    let ori = new Vector3(
      this.targetPosition.x + Math.sin(r + this.lookValue) * 20,
      this.target.originalPosition.y + this.verticalOffset,
      this.targetPosition.z + Math.cos(r + this.lookValue) * 20
    )

    this.currentTargetOrientation.lerp(ori, 0.05)
    this.camera.lookAt(this.currentTargetOrientation)

    let pos = new Vector3(
      this.targetPosition.x,
      this.target.originalPosition.y + this.verticalOffset,
      this.targetPosition.z
    )

    this.currentTargetPosition.lerp(pos, 0.05)
    this.camera.position.lerp(pos, 0.05)
  }

  lerpToCamera() {
    let r = this.target.originalRotation.y
    let pos = new Vector3(
      this.targetPosition.x + Math.sin(r) * 3,
      this.targetPosition.y,
      this.targetPosition.z + Math.cos(r) * 3
    )
    this.target.position.lerp(pos, 0.02)
    let d = this.target.position.distanceTo(pos)
    if (d < 2 && this.state == 1) {
      this.lookBack = true
      this.target.plane.visible = true
    }
  }

  lerpToOrbit() {

    let r = this.lastTargetRotation.y
    let ori = new Vector3(
      this.targetPosition.x + Math.sin(r + this.lookValue) * 20,
      this.targetPosition.y + this.verticalOffset,
      this.targetPosition.z + Math.cos(r + this.lookValue) * 20
    )

    let pos = this.targetPosition

    if (this.lookValue > 3.1) {
      if (this.target) {
        this.target.plane.visible = false
        this.target = undefined
      }
      pos.set(
        60 * Math.sin(r),
        8,
        60 * Math.cos(r)
      )

      ori = new Vector3(
        0,
        8,
        0
      )

      this.currentTargetPosition.lerp(pos, 0.02)
      this.camera.position.set(
        this.currentTargetPosition.x,
        this.currentTargetPosition.y,
        this.currentTargetPosition.z
      )
    }

    this.currentTargetOrientation.lerp(ori, 0.05)
    this.camera.lookAt(ori)
    let d1 = this.camera.position.distanceTo(pos)
    let d2 = this.currentTargetOrientation.distanceTo(ori)
    if ((d1 + d2) < 1) {
      this.state = 0;
      this.camera.position.set(pos.x, pos.y, pos.z)
      this.orbitControls.enabled = true
      this.orbitControls.target.set(0, 8, 0)
      this.camera.lookAt(0, 8, 0)

    }

  }

  lerpToOriginal() {
    this.houses.forEach(house => {
      if (house != this.target)
        house.position.lerp(house.originalPosition, 0.03)
    });
    // this.target.position.lerp(this.target.originalPosition, 0.01)
  }

  stopVisitListen() {
    document.addEventListener("keydown", event => {
      if (event.isComposing || event.keyCode === 27) {
        this.stopVisit()
        return;
      }
    });
  }
}
