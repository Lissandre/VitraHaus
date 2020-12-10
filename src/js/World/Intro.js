import SplitTextJS from 'split-text-js'
import anime from 'animejs'

export default class Intro {
  constructor() {
    // Set options

    // Set up
    this.introDOM = document.querySelector('.intro')
    this.title = 'VitraHaus'
    this.sentences = [
      "La VitraHaus est le magasin phare de Vitra. Les meubles de la collection y sont présentés au gré d'agréments.",
      "La VitraHaus est le magasin phare de Vitra. Les meubles de la collection y sont présentés au gré d'agréments."
    ]

    this.setTitleAnim()
  }
  setTitleAnim() {
    // Create title
    this.titleDOM = document.createElement('h1')
    this.titleDOM.innerText = this.title
    this.introDOM.append(this.titleDOM)
    // Split title text
    this.splittedText = new SplitTextJS(this.titleDOM).chars
    // Characters animation
    this.order = [ 7, 6, 2, 3, 9, 8, 5, 4, 1]
    this.splittedText.forEach((char, index) => {
      anime({
        targets: char,
        translateY: [
          { value: 150, duration: 0 },
          { value: 0, duration: 800 }
        ],
        opacity: [
          { value: 0, duration: 0 },
          { value: 1, duration: 800 },
          { value: 1, duration: 3600 },
          { value: 0, duration: 600 }
        ],
        easing: 'easeOutQuad',
        duration: 4200,
        delay: this.order[index] * 150
      })
    })
    setTimeout(() => {
      this.titleDOM.remove()
      this.setSentencesAnim()
    }, this.order[this.order.length-1] * 100 + 6000)
  }
  setSentencesAnim() {
    this.sentenceDOM = document.createElement('p')
    this.sentences.forEach((sentence, index) => {
      setTimeout(() => {
        // Create sentence
        this.sentenceDOM.innerText = sentence
        this.introDOM.append(this.sentenceDOM)
        // Text Animation
        anime({
          targets: this.sentenceDOM,
          opacity: [
            { value: 0, duration: 0 },
            { value: 1, duration: 2000 },
            { value: 1, duration: 1000 },
            { value: 0, duration: 1000 }
          ],
          easing: 'linear',
          duration: 4000
        })
      }, 1000 * (index === 0 ? index+1 : index*6))
    })
  }
}