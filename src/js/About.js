import anime from 'animejs'

export default class About{
  constructor(options) {
    // Set options
    // Set up
    this.isActive = false
    this.close = document.querySelector('.closeAbout')
    console.log(this.close);
    this.about = document.querySelector('.about')
    this.aboutContent = document.querySelector('.aboutContent')
    this.text = this.aboutContent.querySelectorAll('div')

    this.setEvents()
  }
  createBackground() {
    this.isActive = !this.isActive
    if(this.isActive) {
      this.close.classList.remove('hidden')
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
      this.close.classList.add('hidden')
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
  }
  setEvents() {
    this.about.addEventListener('click', () => {
      this.createBackground()
    })
    this.close.addEventListener('click', () => {
      this.createBackground()
    })
  }
}