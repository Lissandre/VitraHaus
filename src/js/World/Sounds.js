import { Audio, AudioListener } from "three"

export default class Sounds {
  constructor(options) {
    // Set options
    this.assets = options.assets
    this.camera = options.camera

    // Set up
    this.listener = new AudioListener
    this.camera.add(this.listener)

    this.setBackgroundAudio()
  }
  setBackgroundAudio() {
    this.backgroundSound = new Audio(this.listener)
    this.backgroundSound.setBuffer(this.assets.sounds.background)

    this.backgroundSound.setLoop(true)
    this.backgroundSound.setLoopEnd(this.assets.sounds.background.duration - 22)

    this.backgroundSound.setVolume(0.2)
    this.backgroundSound.play()

    this.setLoop()
  }
  setLoop() {
    this.backgroundSound.gain.gain.setValueAtTime(0, this.backgroundSound.gain.context.currentTime)
    this.backgroundSound.gain.gain.linearRampToValueAtTime(0.08, this.backgroundSound.gain.context.currentTime + 10)
    this.backgroundSound.gain.gain.linearRampToValueAtTime(0.02, this.assets.sounds.background.duration - 22)
    setTimeout(() => {this.setLoop()},(this.assets.sounds.background.duration - 22)*1000)
  }
}