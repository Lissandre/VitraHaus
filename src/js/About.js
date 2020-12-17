import anime from 'animejs'

export default class About{
  constructor(options) {
    // Set options
    // Set up
    this.isActive = false
    this.about = document.querySelector('.about')
    this.aboutContent = document.querySelector('.aboutContent')
    this.text = this.aboutContent.querySelectorAll('div')

    this.createBackground()
  }
  createBackground() {
    this.about.addEventListener('click', () => {
      this.isActive = !this.isActive
      if(this.isActive) {
        anime({
          targets: this.aboutContent,
          opacity: [
            { value: 0, duration: 0 },
            { value: 1, duration: 250 },
          ],
          easing: 'easeOutQuad',
          duration: 250,
        })
        this.text.forEach(p => {
          anime({
            targets: p,
            opacity: [
              { value: 0, duration: 0 },
              { value: 1, duration: 250 },
            ],
            rotate: [
              { value: 6, duration: 0 },
              { value: 0, duration: 520 },
            ],
            translateY: [
              { value: '10%', duration: 0 },
              { value: '0%', duration: 520 },
            ],
            easing: 'easeOutQuad',
            duration: 320,
            delay: 250,
          })
        })
      } else {
        this.text.forEach(p => {
          anime({
            targets: p,
            opacity: [
              { value: 1, duration: 0 },
              { value: 0, duration: 250 },
            ],
            rotate: [
              { value: 0, duration: 0 },
              { value: -6, duration: 520 },
            ],
            translateY: [
              { value: '0%', duration: 0 },
              { value: '-10%', duration: 520 },
            ],
            easing: 'easeOutQuad',
            duration: 320,
          })
        })
        anime({
          targets: this.aboutContent,
          opacity: [
            { value: 1, duration: 0 },
            { value: 0, duration: 250 },
          ],
          easing: 'easeOutQuad',
          duration: 250,
          delay: 320,
        })
      }
    })
  }
}