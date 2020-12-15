import EventEmitter from '@tools/EventEmitter'
import SplitTextJS from 'split-text-js'
import anime from 'animejs'

export default class Intro extends EventEmitter {
  constructor(options) {
    // Set options
    super()
    this.introStatus = options.introStatus

    // Set up
    if(this.introStatus === true) {
      this.title = 'VitraHaus'
      this.sentences = [
        "Welcome to the virtual generative Museum of generative works, generated.",
        "Based on the architecture of Herzog & de Meuron’s VitraHaus, this building exhibits the work of several visual artists.",
        "Enjoy a visit from your sofa or office chair.",
        "Take a minute to explore the museum with your mouse or your trackpad.",
        "And scroll to navigate between the different masterpieces.",
      ]
      document.querySelector('#_canvas').classList.add('blur')

      // Create intro div
      this.introDOM = document.createElement('div')
      this.introDOM.classList.add('intro')
      document.body.prepend(this.introDOM)
      setTimeout(() => {
        this.setTitleAnim()
      }, 1400)
    } else {
      setTimeout(() => {
      this.trigger('endIntro')
      document.querySelector('.logo.hidden').classList.remove('hidden')
      }, 1400)
    }
  }
  setTitleAnim() {
    // Create title
    this.titleDOM = document.createElement('h1')
    this.titleDOM.innerText = this.title
    this.introDOM.append(this.titleDOM)
    // Split title text
    this.splittedText = new SplitTextJS(this.titleDOM).chars
    // Characters animation
    this.order = [7, 6, 2, 3, 9, 8, 5, 4, 1]
    this.splittedText.forEach((char, index) => {
      anime({
        targets: char,
        translateY: [
          { value: 150, duration: 0 },
          { value: 0, duration: 800 },
        ],
        opacity: [
          { value: 0, duration: 0 },
          { value: 1, duration: 800 },
          { value: 1, duration: 3600 },
          { value: 0, duration: 600 },
        ],
        easing: 'easeOutQuad',
        duration: 4200,
        delay: this.order[index] * 150,
      })
    })
    setTimeout(() => {
      this.titleDOM.remove()
      this.setSentencesAnim()
    }, this.order[this.order.length - 1] * 100 + 6000)
  }
  setSentencesAnim() {
    this.sentenceDOM = document.createElement('p')
    this.sentences.forEach((sentence, index) => {
      setTimeout(
        () => {
          // Create sentence
          this.sentenceDOM.innerText = sentence
          this.introDOM.append(this.sentenceDOM)
          // Text Animation
          anime({
            targets: this.sentenceDOM,
            opacity: [
              { value: 0, duration: 0 },
              { value: 1, duration: 2000 },
              { value: 1, duration: 2000 },
              { value: 0, duration: 1000 },
            ],
            easing: 'linear',
            duration: 5000,
          })
        },
        index === 0 ? 1000 : index * 6000
      )
    })
    setTimeout(() => {
      anime({
        targets: this.introDOM,
        opacity: [
          { value: 1, duration: 0 },
          { value: 0, duration: 2000 },
        ],
        easing: 'linear',
        duration: 2000,
      })
      document.querySelector('#_canvas').style.transition = '2s filter linear'
      document.querySelector('.blur').classList.remove('blur')
      setTimeout(() => {
        this.introDOM.remove()
        document.querySelector('.logo.hidden').classList.remove('hidden')
        this.trigger('endIntro')
      }, 2000)
    }, 6000 * this.sentences.length - 2000)
  }
}
