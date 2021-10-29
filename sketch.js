/**
 * Player using text input, mouse drawing, microphone input to genernate artworks
 */

// ============= global config =============
// screen w and h
let w = 0
let h = 0
let background_noise
let radius
let hideSingal = true
// five scenes, 0,1,2,3,4
let scene = 4

let sinParticles = []
// grainy effect for background
function setNoise(ctx) {
  ctx.background(230, 227, 225);
  ctx.loadPixels();
  for (let x = 0; x < ctx.width; x += 2) {
    for (let y = 0; y < ctx.height; y++) {
      if (random(1) > 0.95) {
        const index = (x + y * ctx.width) * 36;
        ctx.pixels[index] = 150; //red
        ctx.pixels[index + 1] = 0; //green
        ctx.pixels[index + 2] = 255; // blue
        ctx.pixels[index + 3] = 200; //alpha
      }
    }
  }
  ctx.updatePixels();
}

// all colors
const colorSet = [
  ['#586A6A', '#9DC5BB ', '#FFC857', '#FFFFFF'],
  ['#FED766', '#2C2C34', '#FF8E72', '#EFF1F3'],
]

const colorLength = colorSet.length
let red_colors = ['#ffcdb2', '#ffb4a2', '#e5989b', '#b5838d', '#6d6875']
let green_colors = ['#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc']
let blue_colors = ['#9AD1D4', '#80CED7', '#007EA7', '#003249', '#61a5c2', '#89c2d9']

// player gained colors
let red_colors_gained = [...red_colors]
let blue_colors_gained = [...blue_colors]
let green_colors_gained = [...green_colors]

function SinParticle(x, y, type) {
  this.o = createVector(x, y)
  this.r = random(5, 50)
  this.a = 0
  this.c = random(50, 100)
  this.opacity = 200
  this.s = random(5, 20)
  this.d = random(1) <= 0.5 ? -1 : 1
  this.update = () => {
    this.a += TWO_PI / 30 * this.d
    this.opacity = this.opacity < 0 ? 200 : this.opacity - 5
  }
  switch (type) {
    case 1:
  
      this.f =random(red_colors)
      break
    case 2:
      this.f=random(green_colors)
      break
    case 3:
      this.f=random(blue_colors)
     
      break

  }
  
  this.show = () => {
    push()
    noStroke()
    fill(this.f)
    ellipse(this.o.x + cos(this.a) * this.r, this.o.y + sin(this.a) * this.r, this.s, this.s)
    pop()
    this.update()
  }
}


// ============= scene zero config ============
let keyboard
let rollFilm_img
let macroPolo_img
let macroPoloMap_img
let magellan_img2
let magellan_img1
let magellanMap_img
let kite_img
let franklin_img1
let franklin_img2
let franklin_img3
let astronaut_img
let moon_img
let thunder_sound
let story_sound
let horse_sound
let ship_sound
let space_sound
let speech1
let speech2
let speech3
let speech4
let speech5
let speech6
let speech7
let speech8
let speechCount = 0
let tempCanvas
let unknowns = ["未知", "알려지지 않은", "わからない", "unknown", "わからない",]
let bubbles = []
let bubble_pop
let action = false
let startStory = false
let scene_0_start = 0
let startGame = false
let endIntro = false

function typing() {
  // typing effect
  push()
  translate(w / 2, h / 2)
  textSize(36)
  textStyle(BOLD)
  textAlign(CENTER)
  fill(0)
  let str = 'Human Exploration.'
  if (frameCount - scene_0_start <= 90) {
    if (!keyboard.isPlaying()) {
      keyboard.play()
    }
    text(str.substring(0, (frameCount - scene_0_start) / 5 + 1), 0, 0, 400, 50)
  } else {

    text(str, 0, 0, 400, 50)
  }
  pop()
}
function marco() {
  push()
  if (frameCount - scene_0_start < 300 && !horse_sound.isPlaying()) {
    horse_sound.play()
  }
  switch (int((frameCount - scene_0_start - 120) / 30)) {
    case 0:
      translate(-h / 4, -h / 4)
      break
    case 1:
      translate(-h / 5, -h / 8)
      break
    case 2:
      translate(-h / 8, h / 20)
      break
    case 3:
      translate(-h / 8, 0)
      break
    case 4:
      translate(0, 0)
      break
    case 5:
      translate(h / 8, 0)
      break
    default:
      translate(h / 4, -h / 20)
      break
  }
  image(macroPolo_img, cos(frameCount / 5) * 5, sin(frameCount / 5) * 5, h / 8, h / 8)
  pop()
}
function magellan() {
  push()
  if (frameCount - scene_0_start < 550 && !ship_sound.isPlaying()) {
    ship_sound.play()
  }
  switch (int((frameCount - scene_0_start - 350) / 30)) {
    case 0:
      translate(-h / 8, -h / 8)
      break
    case 1:
      translate(-h / 6, h / 4)
      break
    case 2:
      translate(h / 3, 0)
      break
    case 3:
      translate(h / 6, h / 8)
      break
    case 4:
      translate(-h / 8, h / 8)
      break
    default:
      translate(-h / 10, -h / 8)
      break
  }
  if (int((frameCount - scene_0_start - 350) / 30) < 2) {
    image(magellan_img2, cos(frameCount / 5) * 5, sin(frameCount / 5) * 5, h / 8, h / 8)
  } else {
    image(magellan_img1, cos(frameCount / 5) * 5, sin(frameCount / 5) * 5, h / 8, h / 8)
  }
  pop()
}
function franklin() {
  push()
  imageMode(CENTER)
  image(kite_img, map(noise(frameCount / 50), 0, 1, -w / 4, w / 4), -h / 5, 150, 100)
  if ((frameCount - scene_0_start - 560) < 240) {
    if (frameCount % 30 > 15 && random(1) < 0.3) {
      if (!thunder_sound.isPlaying()) {
        thunder_sound.play()
      }
      push()
      noFill()
      stroke(20)
      strokeWeight(1.5)
      const start = createVector(map(noise(frameCount / 50), 0, 1, -w / 4, w / 4) + 30, -h / 5)
      const end = createVector(0, h / 6)
      beginShape()
      for (let i = 0; i < 20; i++) {
        let d = p5.Vector.lerp(start, end, i / 20)
        vertex(5 * cos(d.y) + d.x, d.y)
      }
      endShape()
      pop()
      image(franklin_img2, cos(frameCount / 10) * 5, h / 6 + sin(frameCount / 10) * 5, 150, 150)

    } else {
      push()
      noFill()
      stroke(20)
      strokeWeight(1.5)
      line(map(noise(frameCount / 50), 0, 1, -w / 4, w / 4) + 30, -h / 5, 0, h / 6)
      pop()
      image(franklin_img1, cos(frameCount / 10) * 5, h / 6 + sin(frameCount / 10) * 5, 150, 150)
    }

  } else {
    push()
    noFill()
    stroke(20)
    strokeWeight(1.5)
    line(map(noise(frameCount / 50), 0, 1, -w / 4, w / 4) + 30, -h / 5, 0, h / 6)
    pop()
    image(franklin_img3, cos(frameCount / 10) * 5, h / 6 + sin(frameCount / 10) * 5, 150, 150)
  }
  pop()
}
function armstrong() {
  push()
  imageMode(CENTER)
  if (frameCount - scene_0_start <= 900) {
    const size = map(frameCount - scene_0_start, 870, 900, 0, 150)
    image(moon_img, 0, map(frameCount - scene_0_start, 870, 900, h / 4, 0), size, size)
  } else if (frameCount - scene_0_start <= 930) {
    image(moon_img, 0, 0, 150, 150)
    const size = map(frameCount - scene_0_start, 900, 930, 0, 50)
    image(astronaut_img, 0, map(frameCount - scene_0_start, 900, 930, 0, -105), size, 1.3 * size)
  } else {
    rotate((frameCount - scene_0_start - 930) / 50)
    image(moon_img, 0, 0, 150, 150)
    rotate((-frameCount + scene_0_start + 930) / 20)
    image(astronaut_img, 0, -105, 50, 65)
    // const size = map(frameCount-scene_0_start,870,900,0,200)
  }
  pop()
}
function RandomBubble(x, y) {
  this.pos = createVector(x, y)
  this.size = random(5, 10)
  this.vel = createVector(0, -random(5))
  this.opacity = 255
  this.hasBloomed = false
  this.r1 = random(8, 10)
  this.r2 = random(12, 15)
  this.a = TWO_PI / 5
  this.ha = this.a / 2
  this.update = () => {
    this.opacity -= 2
    if (!this.hasBloomed) {
      this.size += 0.5
      this.vel = createVector(map(noise(this.pos.x, this.pos.y), 0, 1, -5, 5), this.vel.y)
    } else {
      this.vel = createVector(map(noise(this.pos.x, this.pos.y), 0, 1, -5, 5), this.vel.y / 2)
    }
    if (this.size > 30 && !this.hasBloomed) {
      this.hasBloomed = true
      bubble_pop.play()

    }


    this.pos.add(this.vel)
  }
  this.show = () => {

    push()
    noStroke()
    if (this.hasBloomed) {
      fill(20, this.opacity)
      beginShape();
      for (let i = 0; i < TWO_PI; i += this.a) {
        let sx = this.pos.x + cos(i) * this.r2;
        let sy = this.pos.y + sin(i) * this.r2;
        vertex(sx, sy);
        sx = this.pos.x + cos(i + this.ha) * this.r1;
        sy = this.pos.y + sin(i + this.ha) * this.r1;
        vertex(sx, sy);
      }
      endShape(CLOSE);
    } else {

      fill(10, this.opacity)
      ellipse(this.pos.x, this.pos.y, this.size, this.size)
    }
    pop()
    this.update()
  }

}

// ============= scene one config =============

// input
let textfield
let scene_1_start = 0
let speech9
let bgm_1
// ** to record the first letter of each input **
// if player can enter up to 26, then it will gained all the red colors
let alphabet = 0
let responses = ['Honey, say something.',
  'I can’t wait to spend the rest of our lives together',
  'Did you know that you make the world a better place?',
  'You made my heart sing with those words!',
  'I’m not a hoarder, but I want to keep you forever.',
  'Can you say that again? I want to relive the feeling!',
  'I can’t believe how hopelessly I’ve fallen for you.',
  'I would do anything and everything for you as long as we’re together',
  'I love you a little more than I did a minute ago!']
let responseNumber = 0
let words = []
let textParticles = []
let words_len = 1

// depends on the number of words
let tentacle

// depends on the words length
let hearts

// draw a random heart
function TextParticle(str, x, y) {
  this.x = x
  this.y = y
  this.str = str
  this.opacity = random(100)
  this.size = random(30)
  this.color = random(blue_colors)

  this.direction = random(1) < 0.5 ? 1 : -1
  this.mouseThreshold = 200
  this.increment_x = random(2) * this.direction
  this.increment_y = random(2) * this.direction
  this.increment_opacity = 3
  this.update = () => {
    let d = dist(mouseX, mouseY, this.x, this.y)
    if (d < this.mouseThreshold) {

      if (mouseY >= this.y) {
        this.y -= 20
        this.increment_y = this.increment_y < 0 ? this.increment_y : -this.increment_y
      } else {
        this.y += 20
        this.increment_y = this.increment_y > 0 ? this.increment_y : -this.increment_y
      }
    } else {
      this.y += this.increment_y
      this.x += this.increment_x
    }

    this.opacity += this.increment_opacity
    if (this.opacity > 150) {
      this.increment_opacity = -6
    }
    if (this.opacity <= 0) {

      this.x = random(w)
      this.y = random(h)

      this.size = random(30)
      this.opacity = 5
      this.increment_y = random(2) * (-this.direction)
      this.increment_opacity = 6
    }
  }
  this.show = () => {
    push()
    noStroke()
    fill(random(30), this.opacity)
    textSize(this.size)
    textAlign(CENTER, CENTER)
    textStyle(BOLD)
    // text(str, this.x + cos(this.angle) * this.r, this.y + sin(this.angle) * this.r)
    text(str, this.x, this.y)
    pop()
    this.update()
  }
}
function inputText() {

  textParticles = []
  let sentences = textfield.value()
  words_len = sentences.length
  words = sentences.split(' ')
  alphabet = alphabet > 26 ? 26 : alphabet + 1

  textfield.value('')
  let limit = words_len > 200 ? 1 : words.length > 6 ? 6 : words.length
  // console.log(limit,words_len)
  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < limit; j++) {
      if (j % 2 == 0) {
        textParticles.push(new TextParticle(words[i].toUpperCase(), random(w * 0.3, w * 0.7), random(h * 0.3, h * 0.7)))
      }
      textParticles.push(new TextParticle(words[i], random(w * 0.3, w * 0.7), random(h * 0.3, h * 0.7)))
    }
  }

  mouseX = random(1) < 0.5 ? random(w * 0.8, w) : random(w * 0.2)
  mouseY = random(h * 0.8, h)
  responseNumber = int(random(responses.length))
  if (!bgm_1.isPlaying()) {
    bgm_1.play()
  }
}

function typing2() {

  push()
  // translate(w / 2, h / 2)
  textSize(36)
  textStyle(BOLD)
  textAlign(CENTER)
  fill(23, 50, 50)
  let str = 'Chapter 1 - Love'
  if (frameCount - scene_1_start <= 60) {
    if (!keyboard.isPlaying()) {
      keyboard.play()
    }
    text(str.substring(0, int(map(frameCount - scene_1_start, 0, 60, 1, 16))), w / 2 - 200, h / 2 - 18, 400, 36)
  } else {
    text(str, w / 2 - 200, h / 2 - 18, 400, 36)
  }
  pop()
}

// ============= scene two config =============

// ** to record the number of different draws **
// if next one is more complicated than last one, if plyer can draw up to 10 complex painting, it will gained all the green colors
let paintings = 0
let paintCanvas
let perlinCanvas
let paintTracks = new Set()
let previousDist = 0
let perlinParticles = []
let scene_2_start = 0
let wealth_start = 0
let cost = 0
let wealth = 0
let wealthRecord = new Set()
let canAdd = false
let gainRatio = 0
let gainSound
let drawSound
let speech10
let tip = "Someone can always cost the least to gain the greatest."

function PerlinParticle(x, y) {
  this.pos = createVector(x, y)
  this.speed = random(0.004, 0.006)

  this.update = () => {
    this.r = 4
    // let angle = noise(this.pos.x*0.005, this.pos.y*0.005)*TWO_PI+PI*random(50);
    // let angle = map(noise(this.pos.x * this.speed, this.pos.y * this.speed), 0, 1, 0, 2*TWO_PI);
    let angle = map(noise(this.pos.x * this.speed, this.pos.y * this.speed), 0, 1, 0, 480);
    let dir = createVector(sin(angle), cos(angle))
    this.pos.add(dir)
  }
  this.hasDone = false
  this.show = (c) => {
    if (random(1) < 0.005) {
      gainSound.play()
    }
    wealthRecord.add(int(this.pos.x))
    // check edge
    if (dist(this.pos.x, this.pos.y, 0, 0) > h / 4.2) {
      return this.hasDone = true
    }
    push()
    perlinCanvas.noStroke()
    perlinCanvas.fill(color(c))
    perlinCanvas.ellipse(this.pos.x, this.pos.y, 5, 5)
    pop()
    this.update()
  }
}

function drawTrack(x, y) {
  push()
  rectMode(CENTER)
  noStroke()
  const r_1 = noise(x, y)
  const r_2 = int(map(noise(x, y), 0, 1, 0, colorLength))
  const r_3 = int(map(noise(x, y), 0, 1, 0, 4))
  fill(colorSet[r_2][r_3])
  translate(x, y)
  // scale(map(noise(x, y), 0, 1, 0.05, 0.6))
  if (r_1 < 0.3) {
    rect(0, 0, 10, 10)
  } else if (r_1 < 0.6) {
    ellipse(0, 0, 10, 10)
  } else {
    triangle(0, 0, 10, 10, 10, -10)
  }
  pop()
}

function typing3() {

  push()
  // translate(w / 2, h / 2)
  textSize(36)
  textStyle(BOLD)
  textAlign(CENTER)
  fill(23, 50, 50)
  let str = 'Chapter 2 - Wealth'
  if (frameCount - scene_2_start <= 60) {
    if (!keyboard.isPlaying()) {
      keyboard.play()
    }
    text(str.substring(0, int(map(frameCount - scene_2_start, 0, 60, 1, 19))), w / 2 - 200, h / 2 - 18, 400, 36)
  } else {
    text(str, w / 2 - 200, h / 2 - 18, 400, 36)
  }
  pop()
}
// ============= scene three config =============
// ** to record the volumn of different speaking **
// if player's voice volumn can reach all levels, then it will gained all the blue colors
let voices = 0
let voicesLevel = new Set()
let linkParticles = []
let mic = null
let previousLevel = 4
let previousAccumlate = 3
let currentLevel = 0
let accumlate_low = 1
let accumlate_high = 1
let micIsActive = false
let scene_3_start=0
let voiceRecord = new Map()
let circleParticles = []
let main_lp_2 = new LinkParticle("#F4F4F6", 4)
let main_lp_1 = new LinkParticle('#E6E6E9', 4)
function LinkParticle(c, sw) {
  this.sw = sw
  this.c = c
  this.show = (x1, y1, x2, y2, frequency, amplitude, c) => {
    if (c) {
      this.c = c
    }
    let start = createVector(x1, y1)
    let end = createVector(x2, y2)
    let head = frequency * map(noise(x1, y1), 0, 1, 0.05, 0.2)
    let tail = frequency * map(noise(x2, y2), 0, 1, 0.8, 0.95)
    push()
    stroke(color(this.c))
    strokeWeight(sw)
    noFill()
    beginShape()
    // vertex(start.x, 1)
    for (let i = 0; i < frequency; i += 1) {
      let d = p5.Vector.lerp(start, end, i / frequency)
      if (i > head && i < tail) {
        curveVertex(d.x, sin(d.x + frameCount / 10) * amplitude)
      } else {
        // curveVertex(d.x, 1)
        vertex(d.x, 1)
      }
      // curveVertex(d.x, sin(d.x+ frameCount / 10) * this.amplitude)
      // curveVertex(d.x, sin(map(d.x,this.start.x,this.end.x,0, this.range)+ frameCount / 10) * this.amplitude)
    }
    // vertex(end.x, 1)
    vertex(end.x, 1)
    endShape()
    pop()
  }
}
function CircleParticle(level) {
  this.level = level

  this.opacity = 255
  this.size = h / 2.5
  this.update = () => {
    this.opacity -= 5
    this.size += 4
    this.sw = map(this.size, h / 2, h, 4, 0)
    if (this.opacity < 0) {
      this.opacity = 255
      this.size = h / 2.5
    }
  }
  this.show = () => {
    this.update()
    push()
    translate(width / 2, height * 0.4)
    noStroke()
    fill(map(this.level, 0, 255, 50, 80), map(this.level, 0, 255, 50, 80), map(this.level, 0, 255, 50, 200), this.opacity)
    ellipse(0, 0, this.size, this.size)
    pop()
  }
}
function typing4() {
  push()
  textSize(36)
  textStyle(BOLD)
  textAlign(CENTER)
  fill(23, 50, 50)
  let str = 'Chapter 3 - Power'
  if (frameCount - scene_3_start <= 60) {
    if (!keyboard.isPlaying()) {
      keyboard.play()
    }
    text(str.substring(0, int(map(frameCount - scene_3_start, 0, 60, 1, 18))), w / 2 - 200, h / 2 - 18, 400, 36)
  } else {
    text(str, w / 2 - 200, h / 2 - 18, 400, 36)
  }
  pop()
}
// ============= scene four config =============
let videoCapture
let videoH = 0
let videoW = 0
let videoMask
let hasReflection = false
let img
let reflectionCanvas
let renderCount = 0
let renderTimes = 330
let previousVector=null
let faceRotate=0
let masks = []
let maskIndex = 0
var facePoints = null
let danceMonkeySound
function reflection(x, y, c, canvas) {
  canvas.push()
  canvas.stroke(c)
  canvas.strokeWeight(0.5)
  canvas.noFill()
  canvas.translate(x,y)
  canvas.curve(x, y, sin(x)*random(60), cos(x)*sin(x)*40, 0,0,cos(y)*sin(x)*random(140) ,cos(x)*sin(x)*50)
  canvas.pop()

}


// ================= main program ===================

function preload() {
  // load any assets (images, sounds, etc.) here
  rollFilm_img = loadImage('assets/rollfilm.png')
  macroPolo_img = loadImage('assets/MarcoPolo.png')
  macroPoloMap_img = loadImage('assets/MarcoPoloMap.jpg')
  magellanMap_img = loadImage('assets/FerdinandMagellanMap.jpg')
  magellan_img1 = loadImage('assets/FerdinandMagellan.png')
  magellan_img2 = loadImage('assets/FerdinandMagellan2.png')
  kite_img = loadImage('assets/kite.png')
  franklin_img3 = loadImage('assets/Franklin.png')
  franklin_img1 = loadImage('assets/Franklin2.png')
  franklin_img2 = loadImage('assets/Franklin3.png')
  astronaut_img = loadImage('assets/astronaut.png')
  moon_img = loadImage('assets/moon.png')
  for(let i =1; i<=6 ;i++){
    masks.push(loadImage(`assets/mask${i}.png`))
  }
 
  thunder_sound = loadSound('assets/thunder.mp3')
  story_sound = loadSound('assets/story.mp3')
  ship_sound = loadSound('assets/ship.mp3')
  speech1 = loadSound('assets/speech1.mp3')
  speech2 = loadSound('assets/speech2.mp3')
  speech3 = loadSound('assets/speech3.mp3')
  speech4 = loadSound('assets/speech4.mp3')
  speech5 = loadSound('assets/speech5.mp3')
  speech6 = loadSound('assets/speech6.mp3')
  speech7 = loadSound('assets/speech7.mp3')
  speech8 = loadSound('assets/speech8.mp3')
  speech9 = loadSound('assets/speech9.mp3')
  speech10 = loadSound('assets/speech10.mp3')
  speech11 = loadSound('assets/speech11.mp3')
  horse_sound = loadSound('assets/horse.mp3')
  keyboard = loadSound('assets/keyboard.mp3')
  bubble_pop = loadSound('assets/bubble_pop.mp3')
  gainSound = loadSound('assets/gain.mp3')
  drawSound = loadSound('assets/draw.mp3')
  danceMonkeySound = loadSound('assets/danceMonkey.mp3')
  bgm_1 = loadSound('assets/past-lives.mp3')
  startGame = loadSound('assets/start.mp3')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  w = windowWidth
  h = windowHeight

  radius = h / 4

  push()
  textfield = createInput('')
  textfield.size(w * 0.2)
  textfield.position(w * 0.385, h * 0.86)
  textfield.changed(inputText)
  textfield.hide()
  pop()

  // background noise
  background_noise = createGraphics(w, h)
  setNoise(background_noise)
  paintCanvas = createGraphics(w, h)
  perlinCanvas = createGraphics(h / 2, h / 2)
  perlinCanvas.translate(h / 4, h / 4)
  videoMask = createGraphics(h / 2, h / 2)
  videoMask.translate(h / 4, h / 4)
  videoMask.rectMode(CENTER)

  reflectionCanvas = createGraphics(h / 2, h / 2)
  tempCanvas = createGraphics(w, h * 0.7)
}


function draw() {
  image(background_noise, 0, 0)
  frameRate(30)
  // ========================== scene zero ==============================
  if (scene == 0 && !startStory) {
    push()
    rectMode(CENTER)
    // roll film
    if (!action) {
      translate(w / 2, h / 2)

      image(rollFilm_img, -80, -20 + sin(frameCount / 8) * 10, 180, 150)
    } else {
      // action !!!!
      push()
      fill(50)
      rect(w / 2, h * 0.15, w, 50)
      rect(w / 2, h * 0.85, w, 50)
      pop()
      const intervel = w / 24
      push()
      for (let i = 0; i < 24; i++) {
        rect((i * intervel + frameCount * 2) % w, h * 0.15, 30, 30, 4)
        rect((i * intervel + frameCount * 2) % w, h * 0.85, 30, 30, 4)
      }
      pop()
      // opening 
      if (frameCount - scene_0_start <= 120) {
        typing()
      }
      // macro polo
      else if (frameCount - scene_0_start <= 350) {
        if (keyboard.isPlaying()) {
          keyboard.stop()
        }
        if (!speech2.isPlaying() && speechCount == 1) {
          speech2.play()
          speechCount++
        }
        push()
        translate(w / 2, h / 2)
        imageMode(CENTER)
        image(macroPoloMap_img, 0, 0, h / 2, h / 2)
        marco()
        pop()
      } else if (frameCount - scene_0_start <= 560) {
        if (!speech3.isPlaying() && speechCount == 2) {
          speech3.play()
          speechCount++
        }
        push()
        translate(w / 2, h / 2)
        imageMode(CENTER)
        image(magellanMap_img, 0, 0, h / 1.5, h / 2)
        magellan()
        pop()
      } else if (frameCount - scene_0_start <= 870) {
        if (!speech4.isPlaying() && speechCount == 3) {
          speech4.play()
          speechCount++
        }
        push()
        translate(w / 2, h / 2)
        franklin()
        pop()
      } else if (frameCount - scene_0_start <= 1140) {
        if (!speech5.isPlaying() && speechCount == 4) {
          speechCount++
          speech5.play()
        }
        translate(w / 2, h / 2)
        armstrong()

      } else if (frameCount - scene_0_start <= 1560) {
        if (!speech6.isPlaying() && speechCount == 5) {
          speechCount++
          speech6.play()
        }
        if (!speech6.isPlaying() && !speech7.isPlaying() && speechCount == 6) {
          speech7.play()
          speechCount++
        }
        if (frameCount - scene_0_start <= 1230) {
          push()
          imageMode(CENTER)
          tempCanvas.push()
          tempCanvas.translate(w / 2, 0)
          tempCanvas.textAlign(CENTER)
          tempCanvas.textSize(random(50))
          tempCanvas.textStyle(BOLD)
          tempCanvas.fill(0, 100)
          tempCanvas.rotate(random(-PI * 0.2, PI * 0.2))
          tempCanvas.text(random(unknowns), random(-h / 2, h / 2), random(h * 0.7), 100, 50)
          tempCanvas.pop()
          image(tempCanvas, w / 2, h / 2, w, h * 0.7)
          pop()
        } else if (frameCount - scene_0_start <= 1350) {
          if (random(1) < 0.5) {
            bubbles.push(new RandomBubble(random(w * 0.1, w * 0.9), random(h * 0.3, h * 0.75)))
          }
          for (const b of bubbles) {
            b.show()
          }
        } else {
          push()
          rectMode(CENTER)
          fill(20)
          const choice = int((frameCount - scene_0_start - 1350) / 30)
          if (choice % 3 == 0) {
            ellipse(w / 2, h / 2, map((frameCount - scene_0_start - 1350) % 30, 0, 30, 50, 200))
          } else if (choice % 3 == 1) {
            rect(w / 2, h / 2, map((frameCount - scene_0_start - 1350) % 30, 0, 30, 50, 200), map((frameCount - scene_0_start - 1350) % 30, 0, 30, 50, 200))
          } else {
            triangle(w / 2, h / 2 - map((frameCount - scene_0_start - 1350) % 30, 0, 30, 50, 100), w / 2 - map((frameCount - scene_0_start - 1350) % 30, 0, 30, 50, 100), h / 2 + map((frameCount - scene_0_start - 1350) % 30, 0, 30, 50, 100),
              w / 2 + map((frameCount - scene_0_start - 1350) % 30, 0, 30, 50, 100), h / 2 + map((frameCount - scene_0_start - 1350) % 30, 0, 30, 50, 100))
          }
          pop()

        }
      }
      else {
        if (!speech8.isPlaying() && speechCount == 7) {
          speechCount++
          speech8.play()
        }
        push()
        if (frameCount - scene_0_start <= 1690) {
          fill(20)
          noStroke()
          rectMode(CORNER)
          rect(w / 2 - h * 0.2, h / 2 - 12, map(frameCount - scene_0_start - 1560, 0, 140, 20, h * 0.4), 24, 12, 0, 0, 12)
          rectMode(CENTER)
          noFill()
          strokeWeight(2)
          stroke(20)
          rect(w / 2, h / 2, h * 0.4, 24, 12)

        } else {
          noStroke()
          if (!endIntro) {
            fill(128)
          } else {
            fill(50)
          }

          rectMode(CENTER)
          rect(w / 2, h / 2, 300, 50, 4, 4, 4, 4)
          textAlign(CENTER)
          textStyle(BOLD)
          textSize(24)
          fill(230)
          text('Start your story', w / 2, h / 2, 300, 24)
          if (!speech8.isPlaying() && !endIntro) {
            endIntro = true
            startGame.play()
          }

        }
        pop()
      }
    }


    pop()
  }

  // ========================== scene one ==============================
  if (scene === 1) {
    push()
    if (frameCount - scene_1_start < 240) {
      if (!speech9.isPlaying() && speechCount == 8) {
        speech9.play()
        speechCount++
      }
      typing2()
      if (random(1) < 0.2) {
        sinParticles.push(new SinParticle(w / 2 + random(-h * 0.5, h * 0.5), random(h * 0.2, h * 0.8), 1))
      }

      for (const p of sinParticles) {
        p.show()
      }
    } else {
      if (hideSingal) {
        hideSingal = false
      }
      textfield.show()
      // show text particles
      for (let i = 0; i < textParticles.length; i++) {
        textParticles[i].show()
      }
      // creature dance
      push()
      noStroke()
      rectMode(CENTER)
      translate(width / 2, height * 0.4)

      push()
      fill(22)
      ellipse(0, 0, h / 2, h / 2)
      pop()

      tentacle = words.length * 2 > 24 ? 24 : words.length * 2
      tentacle = tentacle == 0 ? 1 : tentacle
      if (tentacle != 1 && tentacle % 2 == 1) {
        tentacle++
      }

      hearts = words_len % 20
      hearts = hearts == 0 ? 1 : hearts

      for (let j = 0; j < tentacle; j++) {
        rotate(TWO_PI * j / tentacle)
        push()

        for (let i = 0; i < hearts; i++) {
          translate(0, -height / 20)
          rotate(sin(i * 800 / (mouseX + 0.1)) + j / 50 + frameCount / 50 + i * 600 / (mouseY + 0.1))
          scale(noise(j, frameCount / 50) / 2 + 0.6 + map(mouseX, 0, width, -0.1, 0.2))
          fill(red_colors[i % red_colors.length])

          push()
          scale(noise(i, j, frameCount / 50) * map(hearts, 1, 50, 0.7, 0.5))
          rotate(-PI * 1 / 4)
          rect(0, -15, 30, 60, 40, 40, 0, 0)
          rotate(PI * 2 / 4)
          rect(0, -15, 30, 60, 40, 40, 0, 0)
          pop()

          if (hearts > 12) {
            push()
            for (let k = 0; k < 2; k++) {
              fill((red_colors[(red_colors.length - k) % red_colors.length]))
              if (k % 2 == 0) {
                rect(sin(frameCount / 20 + i + k) * 50, cos(frameCount / 20 + i + k) * 50, 2, 2)
              } else {
                ellipse(sin(frameCount / 20 + i + k) * 50, cos(frameCount / 20 + i + k) * 50, 2, 2)
              }
            }
            pop()
          }
        }
        pop()
      }
      pop()

      // hint
      push()
      textSize(16)
      textAlign(CENTER)
      fill(color('#222'))
      text(responses[responseNumber], w / 2 - 200, h * 0.82, 400, 150)
      pop()
    }
    pop()
  }
  // ========================== scene two ==============================
  else if (scene === 2) {

    textfield.hide()
    push()
    if (frameCount - scene_2_start < 240) {
      if (!speech10.isPlaying() && speechCount == 9) {
        speech10.play()
        speechCount++
      }
      typing3()
      if (random(1) < 0.5) {
        sinParticles.push(new SinParticle(w / 2 + random(-h * 0.5, h * 0.5), random(h * 0.2, h * 0.8), 2))
      }
      for (const p of sinParticles) {
        p.show()
      }
    } else {
      if (hideSingal) {
        hideSingal = false
      }

      image(paintCanvas, 0, 0)
      if (mouseIsPressed) {
        paintTracks.add(int(mouseX) + '-' + int(mouseY))
      }

      push()
      noStroke()
      rectMode(CENTER)
      translate(width / 2, height * 0.4)

      push()
      fill(22)
      ellipse(0, 0, h / 2, h / 2)
      pop()

      // draw user's paint
      if (frameCount - wealth_start < 150) {
        for (let i = perlinParticles.length - 1; i >= 0; i--) {
          perlinParticles[i].show(random(green_colors))
          if (perlinParticles[i].hasDone) {
            perlinParticles.splice(i, 1)
          }
        }
      } else {
        if (canAdd && wealth / cost > gainRatio) {
          gainRatio = wealth / cost
          canAdd = false
          paintings++
          console.log(gainRatio);

          // play gain sound
        }
      }
      wealth = wealthRecord.size
      image(perlinCanvas, -h / 4, -h / 4)

      pop()

      push()
      for (const pos of paintTracks) {
        const x_y = pos.split('-')
        drawTrack(int(x_y[0]), int(x_y[1]))
      }
      pop()

      // hint
      push()
      textSize(16)
      textAlign(CENTER)
      fill(color('#222'))
      text('Draw down your wealth.', w / 2 - 150, h * 0.81, 300, 150)
      text(tip, w / 2 - 250, h * 0.84, 500, 150)
      text(`Cost:${cost} - Wealth:${wealth}`, w / 2 - 200, h * 0.87, 400, 150)
      pop()
    }
    pop()
  }
  // ========================== scene three ==============================
  else if (scene === 3) {
    textfield.hide()
    push()
    if (frameCount - scene_3_start < 240) {
      if (!speech11.isPlaying() && speechCount == 10) {
        speech11.play()
        speechCount++
      }
      typing4()
      if (random(1) < 0.5) {
        sinParticles.push(new SinParticle(w / 2 + random(-h * 0.5, h * 0.5), random(h * 0.2, h * 0.8), 3))
      }
      for (const p of sinParticles) {
        p.show()
      }
    } else {
      if(hideSingal){
        hideSingal=false
      }
      const level = mic?.getLevel() ? int(mic.getLevel()) : 0
      if (level >= 100) {
        accumlate_high = (accumlate_high + 4) % 84
      } else if (level >= 25) {
        accumlate_low = (accumlate_low + 2) % 32
      }
      const accumlate = level >= 100 ? accumlate_high : accumlate_low

      // record vol and freq
      if (level >= 25) {
        if (voiceRecord.has(level)) {
          const obj = voiceRecord.get(level)
          obj.count++
          obj.accumlate = (obj.accumlate + accumlate) / 2
        } else {
          voiceRecord.set(level, { "count": 1, "accumlate": accumlate })
        }
      }

      // pick up the vol and freq which show up mostly
      if (level < 25 && voiceRecord.size != 0) {
        let most = 0
        let freq = 0
        let vol = 0
        for (key of voiceRecord.keys()) {
          const value = voiceRecord.get(key)
          if (value.count > most) {
            freq = value.accumlate
            vol = key
            most = value.count
          }
        }
        previousLevel = vol
        previousAccumlate = freq
        voiceRecord.clear()
      }

      // gain blue colors
      voicesLevel.add(int(level))
      voices = voicesLevel.size

      // electric connection, circle background
      push()
      rectMode(CENTER)
      translate(width / 2, height * 0.4)
      noStroke()
      if (micIsActive) {
        rotate(frameCount / 500)
      }



      // circle background

      fill(22)
      if (level > 25) {
        ellipse(0, 0, h / 2 - map(level, 30, 255, 0, h / 8), h / 2 - map(level, 30, 255, 0, h / 8))
      } else {
        ellipse(0, 0, h / 2, h / 2)
      }



      // anchor decoration and text annoation 
      let radius_voice = level > 25 ? radius - map(level, 30, 255, 0, h / 8) : radius
      fill(0)
      for (i = 0; i < 12; i++) {
        rect(radius_voice * cos(i * TWO_PI / 12), radius_voice * sin(i * TWO_PI / 12), 8)
      }

      rect(radius * 1.12, 0, 20, 5)
      rect(radius * 1.12 * cos(TWO_PI * 6 / 12), radius * 1.15 * sin(TWO_PI * 6 / 12), 20, 5)
      textSize(14)
      textStyle(BOLD)
      text('0°', radius * 1.20, 5)
      text('180°', -radius * 1.35, 5)


      const start = level > 25? (radius - map(level, 30, 200, 1, 50)) : radius
      const end = level > 25 ? (radius - map(level, 30, 200, 1, 50)) * -1 : -radius

   

      // main axis  
      push()
      drawingContext.shadowOffsetX = 0;
      drawingContext.shadowOffsetY = -2;
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = '#eeeeee77';

        main_lp_2.show(start, 0, end, 0, 10 + previousAccumlate, map(previousLevel, 0, 255, 0, 100),blue_colors[blue_colors.length-1])
        main_lp_1.show(start, 0, end, 0, 10, 2, blue_colors[blue_colors.length-2])
      

      pop()

      // hint
      pop()
      push()
      textSize(16)
      textAlign(CENTER)
      fill(color('#222'))
      text('Speak out your eager to power', w / 2 - 200, h * 0.82, 400, 150)
      text(`Vol: ${previousLevel - 4} - Freq: ${previousAccumlate - 3}`, w / 2, h * 0.86)
      pop()
    }
    pop()
  }

  // ========================== scene four ==============================
  else if (scene === 4) {
    if (!videoCapture) {
      videoCapture = createCapture(VIDEO)
      videoCapture.hide()
      videoW = h / 2
      videoH = h / 3
    }


    if (!hasReflection) {
      push()
      translate(w / 2, h / 2)
      rectMode(CENTER)
      noStroke()
      // set up mask
      videoMask.clear()
      videoMask.push()
      videoMask.fill(0, 50)
      videoMask.noStroke()
      videoMask.ellipse(0, 0, h / 3, h / 2)
      videoMask.pop()

      imageMode(CENTER)
      img = videoCapture.get(videoW / 4, videoH / 4, videoW, videoH)
      img.mask(videoMask)
      image(img, 0, 0, videoW, videoH)
      if (mouseX >= w / 2 - 100 && mouseX <= w / 2 + 100 && mouseY <= h * 0.8 && mouseY >= h * 0.8 - 30 && scene === 4) {
        fill(100)
      } else {
        fill(0)
      }
      rect(0, h * 0.3 - 18, 200, 30, 8, 8, 8, 8)
      textAlign(CENTER)
      textSize(16)
      fill(255)
      text('REFLECTION', 0, h * 0.3, 200, 50)
      fill(0)
      text('Mirror, mirror tell me how I look like', 0, h * 0.25, 400, 50)
      pop()
    } 
    else{
      if(facePoints){
        push()
        // fill(20)
        // stroke(20)
        // strokeWeight(2)
        // for(let i =0;i<facePoints.length;i++){
        //   point(facePoints[i].x*800,facePoints[i].y*600)
        // }
        let faceH = Math.abs(facePoints[10].y-facePoints[152].y) *600
        let faceW = Math.abs(facePoints[234].x-facePoints[454].x) *800
        let origin = facePoints[5]
        translate(w/2-320,h/2-240)
        if(previousVector==null){
          previousVector = createVector((facePoints[5].x-facePoints[10].x),(facePoints[5].y-facePoints[10].y))
          previousVector = p5.Vector.normalize(previousVector)
        }else{
          let cur = createVector((facePoints[5].x-facePoints[10].x),(facePoints[5].y-facePoints[10].y))
          cur = p5.Vector.normalize(cur)
          faceRotate=Math.acos(cur.x*previousVector.x+cur.y*previousVector.y)
          if(cur.x<0){
            faceRotate*=-1
          }
        }
        rectMode(CENTER)
        imageMode(CENTER)
        
        push()
        translate(origin.x*800-faceW/2,origin.y*600-faceH/2)
        rotate(faceRotate)
        image(maskIndex,0,0,faceW,faceH)
        pop()
  
        pop()
       
      }
      
    }
    


  }

  if (scene !== 0 && !hideSingal) {
    if (scene !== 4) {
      // =============== color signal =================
      push()
      noStroke()
      rectMode(CENTER)
      fill(map(alphabet, 0, 26, 20, 180), 0, 0, map(alphabet, 0, 26, 20, 180))
      rect(w / 2 - h * 0.05, h * 0.76, h * 0.03, h * 0.03)
      fill(0, map(paintings, 0, 10, 20, 180), 0, map(paintings, 0, 10, 20, 180))
      rect(w / 2, h * 0.76, h * 0.03, h * 0.03)
      fill(0, 0, map(voices, 0, 255, 20, 180), map(voices, 0, 255, 20, 180))
      rect(w / 2 + h * 0.05, h * 0.76, h * 0.03, h * 0.03)
      pop()
    }

    // =============== switch button =================
    push()
    rectMode(CENTER)
    fill(50, 255)
    noStroke()
    rect(w * 0.95, h / 2, 10, 50, 20)
    pop()
  }

  // mouse hover 
  if (mouseX >= w / 2 - h / 4 && mouseX <= w / 2 + h / 4 && mouseY >= h * 0.15 && mouseY <= h * 0.65 && scene == 3 && !hideSingal) {
    cursor(HAND)
  } else if (mouseX >= w * 0.95 - 10 && mouseX <= w * 0.95 + 10 && mouseY >= h / 2 - 30 && mouseY <= h / 2 + 30 && scene !== 0 && !hideSingal) {
    push()
    rectMode(CENTER)
    fill(50, 255)
    noStroke()
    rect(w * 0.95, h / 2, 15, 50, 20)
    pop()
    cursor(HAND)

  }
  else if (mouseX >= w / 2 - 100 && mouseX <= w / 2 + 100 && mouseY <= h * 0.8 && mouseY >= h * 0.8 - 30 && scene === 4 && !hasReflection) {
    cursor(HAND)
  } else if (mouseX <= w / 2 + 100 && mouseX >= w / 2 - 60 && mouseY >= h / 2 - 20 && mouseY <= h / 2 + 120 && scene === 0 && !action) {
    cursor(HAND)
  } else if (mouseX <= w / 2 + 150 && mouseX >= w / 2 - 150 && mouseY >= h / 2 - 25 && mouseY <= h / 2 + 25 && scene === 0 && !startStory && endIntro) {
    cursor(HAND)
  }
  else {
    cursor(ARROW)
  }
}

function mouseClicked() {
  if (mouseX >= w / 2 - h / 4 && mouseX <= w / 2 + h / 4 && mouseY >= h * 0.15 && mouseY <= h * 0.65 && scene == 3 && !hideSingal) {
    micIsActive = !micIsActive

    // todo: play sound
    if (micIsActive) {
      if (!mic) {
        mic = new p5.AudioIn(() => {
          alert('cannot access your mic')
        })
        getAudioContext().resume();
        mic.amp(255)
      }
      mic.start()
    } else {

      mic.stop()
    }

  }
  if (mouseX >= w * 0.95 - 10 && mouseX <= w * 0.95 + 10 && mouseY >= h / 2 - 30 && mouseY <= h / 2 + 30 && !hideSingal) {
    switch (scene) {
      case 1:
        scene = 2;
        bgm_1.stop()
        scene_2_start = frameCount
        break
      case 2:
        scene = 3;
        scene_3_start = frameCount
        break
      case 3:
        scene = 4
        break
    }
    sinParticles = []
    hideSingal = true

  }
  if (mouseX <= w / 2 + 100 && mouseX >= w / 2 - 60 && mouseY >= h / 2 - 20 && mouseY <= h / 2 + 120 && scene === 0 && !action) {
    action = true

    scene_0_start = frameCount
    speech1.play()
    keyboard.play()
    story_sound.play()
    speechCount++
  }
  if (mouseX >= w / 2 - 100 && mouseX <= w / 2 + 100 && mouseY <= h * 0.8 && mouseY >= h * 0.8 - 30 && scene === 4 && !hasReflection) {
    hasReflection = true
    // img = videoCapture.get(videoW / 4, videoH / 4, videoW, videoH)
    window.getFace(videoCapture.elt)
    maskIndex=random(masks)
    danceMonkeySound.play()
  }
  if (mouseX <= w / 2 + 150 && mouseX >= w / 2 - 150 && mouseY >= h / 2 - 25 && mouseY <= h / 2 + 25 && scene === 0 && !startStory && endIntro) {
    startStory = true
    scene = 1
    speech8.stop()
    scene_1_start = frameCount
  }
}


function mouseReleased() {
  if (scene == 2 &&
    !(mouseX >= w * 0.05 - 10 && mouseX <= w * 0.05 + 10 &&
      mouseY >= h / 2 - 30 && mouseY <= h / 2 + 30) &&
    !(mouseX >= w * 0.95 - 10 && mouseX <= w * 0.95 + 10 &&
      mouseY >= h / 2 - 30 && mouseY <= h / 2 + 30)) {
    // remove all perlin particles
    perlinParticles = []
    // for (let i = perlinParticles.length - 1; i >= 0; i++) {
    //   // delete perlinParticles[i]
    // }
    let sum_x = 0
    let sum_y = 0
    let largest_x = 0
    let largest_y = 0
    let smallest_x = 9999
    let smallest_y = 9999
    for (const pos of paintTracks) {
      let x_y = pos.split('-')
      let x = int(x_y[0])
      let y = int(x_y[1])
      sum_x += x
      sum_y += y
      largest_x = x > largest_x ? x : largest_x
      largest_y = y > largest_y ? y : largest_y
      smallest_x = x < smallest_x ? x : smallest_x
      smallest_y = y < smallest_y ? y : smallest_y
    }
    let avg_x = sum_x / paintTracks.size
    let avg_y = sum_y / paintTracks.size
    for (const pos of paintTracks) {
      let x_y = pos.split('-')
      let x = (int(x_y[0]) - avg_x) / (largest_x - smallest_x) * h / 2
      let y = (int(x_y[1]) - avg_y) / (largest_y - smallest_y) * h / 2
      perlinParticles.push(new PerlinParticle(x, y))

    }
    cost = paintTracks.size
    paintTracks.clear()
    paintCanvas.clear()
    perlinCanvas.clear()
    wealthRecord.clear()
    wealth_start = frameCount
    canAdd = true
    drawSound.play()
    tip = 'Are you satisfied how you gain? if not, keep trying!'
  }
}


// when you hit the spacebar, what's currently on the canvas will be saved (as
// a "thumbnail.png" file) to your downloads folder. this is a good starting
// point for the final thumbnail of your project (this allows us to make a
// showcase of everyone's work like we did for the nametag assignment).

// remember that you need to resize the file to 1280x720, and you will probably
// want to delete this bit for your final submission.
function keyTyped() {
  if (key === " ") {
    saveCanvas("thumbnail.png");
  }
}
