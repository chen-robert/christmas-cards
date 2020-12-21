window.onload = () => {

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let mouseX = -100
let mouseY = -100

let width, height, lastNow
let snowflakes
const maxSnowflakes = 500

function init() {
  snowflakes = []
  resize()
  render(lastNow = performance.now())
}

function render(now) {
  requestAnimationFrame(render)
  
  const elapsed = now - lastNow
  lastNow = now
  
  ctx.clearRect(0, 0, width, height)
  if (snowflakes.length < maxSnowflakes)
    snowflakes.push(new Snowflake())
  
  ctx.fillStyle = ctx.strokeStyle = '#fff'

  snowflakes.forEach(snowflake => snowflake.update(elapsed, now))
}

function pause() {
  cancelAnimationFrame(render)
}
function resume() {
  lastNow = performance.now()
  requestAnimationFrame(render)
}


class Snowflake {
  constructor() {
    this.spawn()
  }
  
  spawn(anyY = false) {
    this.x = rand(0, width)
    this.y = anyY === true
      ? rand(-50, height + 50)
      : rand(-50, -10)
    this.xVel = rand(-.05, .05)
    this.yVel = rand(.02, .1)
    this.angle = rand(0, Math.PI * 2)
    this.angleVel = rand(-.001, .001)
    this.size = rand(2, 6)
    this.sizeOsc = rand(.01, .5)
  }
  
  update(elapsed, now) {
    const xForce = rand(-.001, .001);

    if (Math.abs(this.xVel + xForce) < .075) {
      this.xVel += xForce
    }

    this.yVel += 0.001

    const dx = this.x - mouseX
    const dy = this.y - mouseY
    const dist = Math.sqrt(dx**2 + dy**2)
    this.xVel += (dx / Math.abs(dx)) * Math.min(1000 / (Math.pow(dist, 3) + 10), 5)
    this.yVel += (dy / Math.abs(dy)) * Math.min(200 / (Math.pow(dist, 3) + 10), 5)

    if(this.xVel > 0.1) this.xVel = 0.1
    if(this.xVel < -0.1) this.xVel = -0.1
    if(this.yVel < -0.05) this.yVel = -0.05
    if(this.yVel > 0.4) this.yVel = 0.4
    
    this.x += this.xVel * elapsed
    this.y += this.yVel * elapsed
    this.angle += this.xVel * 0.05 * elapsed //this.angleVel * elapsed
    
    if (
      this.y - this.size > height ||
      this.x + this.size < 0 ||
      this.x - this.size > width
    ) {
      this.spawn()
    }
    
    this.render()
  }
  
  render() {
    ctx.save()
    const { x, y, angle, size } = this
    ctx.beginPath()
    ctx.arc(x, y, size * 0.2, 0, Math.PI * 2, false)
    ctx.fill()
    ctx.restore()
  }
}

// Utils
const rand = (min, max) => min + Math.random() * (max - min)

function resize() {
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight
}

window.addEventListener('resize', resize)
window.addEventListener('blur', pause)
window.addEventListener('focus', resume)
canvas.addEventListener('mousemove', e => {
  mouseX = e.clientX
  mouseY = e.clientY
}) 
init()

}
