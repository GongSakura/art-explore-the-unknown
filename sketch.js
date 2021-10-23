/**
 * Player using text input, mouse drawing, microphone input to genernate artworks
 */

// ============= global config =============
// screen w and h
let w = 0
let h = 0
let background_noise
let radius
let speech1
let speech2
let speech3
let speech4
let keyboard 

// three scenes, 0,1,2,3,4
let scene = 4

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

// bgm
let bgm_1
let fft

// ============= scene zero config ============

let rollFilm_img
let macroPolo_img
let magellan_img
let action = false
let scene_0_start = 0
function typing() {
  // typing effect
  if(!keyboard.isPlaying()){
    keyboard.play()
  }
  push()
  translate(w / 2, h / 2)
  textSize(36)
  textStyle(BOLD)
  textAlign(CENTER)
  fill(0)
  let str = 'Human Exploration.'
  if(frameCount-scene_0_start<=90){
    text(str.substring(0,(frameCount-scene_0_start)/5+1),0,0,400,50)
  }else{
 
    text(str,0,0,400,50)
  }
  pop()
}

// ============= scene one config =============

// input
let textfield

// ** to record the first letter of each input **
// if player can enter up to 26, then it will gained all the red colors
let alphabet = 0

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

  // if (!bgm_1.isPlaying()) {
  //   bgm_1.play()
  // }
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
let cost = 0
let wealth = 0
let wealthRecord = new Set()
let canAdd = false
let gainRatio = 0

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




// ============= scene four config =============
let videoCapture
let videoH = 0
let videoW = 0
let videoMask
let hasReflection = false
let img
let reflectionCanvas
let renderCount = 0
let renderTimes = 300


function reflection(x, y,c, canvas) {


  canvas.push()
  canvas.stroke(c)
  canvas.strokeWeight(1.5)
  canvas.noFill()
  // curve(x1, y1, x2, y2, x3, y3, x4, y4)
  let r1 = random(words_len)
  let r2 = random(cost)
  let r3 = random(previousAccumlate)
  canvas.curve(x,y,x+r1,y+sin(x+r1),x+r2,y+sin(x+r2),x+r3,y+sin(r3+x))
  canvas.pop()

}


// ==============================================



function preload() {
  // load any assets (images, sounds, etc.) here
  bgm_1 = loadSound('assets/past-lives.mp3')
  rollFilm_img = loadImage('assets/rollfilm.png')
  macroPolo_img = loadImage('assets/MarcoPolo.jpg')
  speech1 = loadSound('assets/speech1.mp3')
  speech2 = loadSound('assets/speech2.mp3')
  speech3 = loadSound('assets/speech3.mp3')
  speech4 = loadSound('assets/speech4.mp3')
  keyboard= loadSound('assets/keyboard.mp3')
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
  // reflectionCanvas.translate(h/4,h/4)
  // reflectionCanvas.rectMode(CENTER)
}

function draw() {
  image(background_noise, 0, 0)
  frameRate(30)

  if (scene == 0) {
    // roll film

    if (!action) {
      translate(w / 2, h / 2)
      rectMode(CENTER)
      image(rollFilm_img, -80, -20 + sin(frameCount / 8) * 10, 180, 150)
      if (mouseX <= w / 2 + 100 && mouseX >= w / 2 - 60 && mouseY >= h / 2 - 20 && mouseY <= h / 2 + 120) {
        cursor(HAND)
      } else {
        cursor(ARROW)
      }
    } else {
    
      push()
      fill(50)
      rect(w / 2, h * 0.15, w, 50)
      rect(w / 2, h * 0.85, w, 50)
      pop()
      const intervel = w / 24
      push()
      rectMode(CENTER)
      for (let i = 0; i < 24; i++) {
        rect((i * intervel + frameCount * 2) % w, h * 0.15, 30, 30, 4)
        rect((i * intervel + frameCount * 2) % w, h * 0.85, 30, 30, 4)
      }
      pop()
    
      if (frameCount - scene_0_start <= 100) {
        typing()
      }else if (frameCount - scene_0_start <= 15000) {
        if(keyboard.isPlaying()){
          keyboard.stop()
        }
        push()
        translate(-h/2,h/2)
        let interval = w/4
        for(let i =0;i<4; i++){
          image(macroPolo_img,(i*interval+frameCount*5)%(w+h*0.5),-h*0.25,h*0.5,h*0.5)
          console.log(i*interval+h*0.5);
        }
       
       
        pop()
      }

    }
  }

  // ========================== scene one ==============================
  if (scene === 1) {
    textfield.show()
    videoCapture.hide()

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
    text('Honey, say something, bad or good, everything is ok.', w / 2 - 200, h * 0.82, 400, 150)
    pop()

  }
  // ========================== scene two ==============================
  else if (scene === 2) {
    textfield.hide()
    videoCapture.hide()
    image(paintCanvas, 0, 0)
    if (mouseIsPressed) {
      paintTracks.add(int(mouseX)+'-'+int(mouseY))
    }

    push()
    noStroke()
    rectMode(CENTER)
    translate(width / 2, height * 0.4)

    push()
    fill(22)
    ellipse(0, 0, h / 2, h / 2)
    pop()
    //  perlinCanvas.background(255)
    // draw user's paint
    if (frameCount - scene_2_start < 150) {
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
      const x_y= pos.split('-')
     drawTrack(int(x_y[0]), int(x_y[1]))
    }
    pop()

    // hint
    push()
    textSize(16)
    textAlign(CENTER)
    fill(color('#222'))
    text('Draw down your wealth.', w / 2 - 150, h * 0.81, 300, 150)
    text('Someone can always cost the least to gain the greatest', w / 2 - 200, h * 0.84, 400, 150)
    text(`Cost:${cost} - Wealth:${wealth}`, w / 2 - 200, h * 0.87, 400, 150)
    pop()


  }
  // ========================== scene three ==============================
  else if (scene === 3) {
    textfield.hide()
    videoCapture.hide()
    const level = mic?.getLevel() ? int(mic.getLevel()) : 0
    if (level >= 80) {
      accumlate_high = (accumlate_high + 4) %84
    } else if (level >= 20) {
      accumlate_low = (accumlate_low + 2) %32
    }
    const accumlate = level >= 80 ? accumlate_high : accumlate_low

    // record vol and freq
    if (level >= 20) {
      if (voiceRecord.has(level)) {
        const obj = voiceRecord.get(level)
        obj.count++
        obj.accumlate = (obj.accumlate + accumlate) / 2
      } else {
        voiceRecord.set(level, { "count": 1, "accumlate": accumlate })
      }
    }

    // pick up the vol and freq which show up mostly
    if (level < 20 && voiceRecord.size != 0) {
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
    if (level > 20) {
      ellipse(0, 0, h / 2 - map(level, 30, 255, 0, h / 8), h / 2 - map(level, 30, 255, 0, h / 8))
    } else {
      ellipse(0, 0, h / 2, h / 2)
    }



    // anchor decoration and text annoation 
    let radius_voice = level > 20 ? radius - map(level, 30, 255, 0, h / 8) : radius
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


    const start = level > 20 ? (radius - map(level, 30, 200, 1, 50)) : radius
    const end = level > 20 ? (radius - map(level, 30, 200, 1, 50)) * -1 : -radius

    const r_1 = int(map(noise(previousLevel, previousAccumlate), 0, 1, 0, colorLength))
    const r_2 = int(map(noise(previousAccumlate, previousLevel), 0, 1, 0, 4))

    // main axis  
    push()
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = -2;
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = '#eeeeee77';
    if (level > 0) {
      main_lp_2.show(start, 0, end, 0, 10 + previousAccumlate, map(previousLevel, 0, 255, 0, 100), colorSet[r_1][r_2])
      main_lp_1.show(start, 0, end, 0, 10, 2, colorSet[r_1][(r_2 + 1) % 4])
    } else {
      main_lp_2.show(start, 0, end, 0, 10 + previousAccumlate, map(previousLevel, 0, 255, 0, 100), "#F4F4F6")
      main_lp_1.show(start, 0, end, 0, 10, 2, '#E6E6E9')
    }

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
      if (mouseX >= w / 2 - 100 && mouseX <= w / 2 + 100 && mouseY <= h * 0.75 && mouseY >= h * 0.75 - 30 && scene === 4) {
        fill(100)
      } else {
        fill(0)
      }
      rect(0, h * 0.25 - 17, 200, 30, 8, 8, 8, 8)
      textAlign(CENTER)
      textSize(18)
      fill(255)
      text('REFLECTION', 0, h * 0.25, 200, 50)

      pop()
    } else {
      push()
      translate(w / 2, h / 2)
      noStroke()
      rectMode(CENTER)
      imageMode(CENTER)
      if (renderCount < renderTimes) {
        // set up mask
        videoMask.clear()
        videoMask.push()
        videoMask.fill(0)
        videoMask.noStroke()
        videoMask.ellipse(0, 0, h / 3, h / 2)
        videoMask.pop()
        img.mask(videoMask)
        reflectionCanvas.noStroke()
        for (let i = 0; i < 100; i++) {
          let x = random(videoW)
          let y = random(videoH)
          let c = img.get(x, y)
          if (c[0] < 1) {
            continue
          }
          reflection(x, y, c[0]*0.3+c[1]*0.6+c[2]*0.1, reflectionCanvas)
       
        }
        renderCount++
        image(reflectionCanvas, 0, h * 0.1, h / 2, h / 2)
      } else {
        image(reflectionCanvas, 0, h * 0.1, h / 2, h / 2)
      }

      pop()
    }


  }

  // if (scene !== 4 && scene !== 0) {
  if (scene !== 0) {
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

    // =============== switch button =================
    push()
    rectMode(CENTER)
    fill(50, 255)
    noStroke()
    rect(w * 0.05, h / 2, 10, 50, 20)
    rect(w * 0.95, h / 2, 10, 50, 20)
    pop()
  }


  // mouse effect
  if (mouseX >= w / 2 - h / 4 && mouseX <= w / 2 + h / 4 && mouseY >= h * 0.15 && mouseY <= h * 0.65 && scene == 3) {
    cursor(HAND)
  } else if (mouseX >= w * 0.05 - 10 && mouseX <= w * 0.05 + 10 && mouseY >= h / 2 - 30 && mouseY <= h / 2 + 30) {
    push()
    rectMode(CENTER)
    fill(50, 255)
    noStroke()
    rect(w * 0.05, h / 2, 15, 50, 20)
    pop()
    cursor(HAND)
  } else if (mouseX >= w * 0.95 - 10 && mouseX <= w * 0.95 + 10 && mouseY >= h / 2 - 30 && mouseY <= h / 2 + 30) {
    push()
    rectMode(CENTER)
    fill(50, 255)
    noStroke()
    rect(w * 0.95, h / 2, 15, 50, 20)
    pop()
    cursor(HAND)
    
  }
  else if (mouseX >= w / 2 - 100 && mouseX <= w / 2 + 100 && mouseY <= h * 0.75 && mouseY >= h * 0.75 - 30 && scene === 4 && !hasReflection) {
    cursor(HAND)

  }
  else {
    cursor(ARROW)
  }
}

function mouseClicked() {
  if (mouseX >= w / 2 - h / 4 && mouseX <= w / 2 + h / 4 && mouseY >= h * 0.15 && mouseY <= h * 0.65 && scene == 3) {
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
  if (mouseX >= w * 0.05 - 10 && mouseX <= w * 0.05 + 10 && mouseY >= h / 2 - 30 && mouseY <= h / 2 + 30 && scene !== 0) {
    switch (scene) {
      case 1:
        scene = 3;
        break
      case 2:
        scene = 1;
        break
      case 3:
        scene = 2
        break
      case 4:
        scene = 3
        break
    }


  }
  if (mouseX >= w * 0.95 - 10 && mouseX <= w * 0.95 + 10 && mouseY >= h / 2 - 30 && mouseY <= h / 2 + 30) {
    switch (scene) {
      case 1:
        scene = 2;
        break
      case 2:
        scene = 3;
        break
      case 3:
        scene = 4
        break
      case 4:
        scene = 1
        break

    }

  }
  if (mouseX <= w / 2 + 100 && mouseX >= w / 2 - 60 && mouseY >= h / 2 - 20 && mouseY <= h / 2 + 120 && scene === 0 && action === false) {
    action = true
    cursor(ARROW)
    scene_0_start = frameCount
 
    speech1.play()
 
    keyboard.play()
    
  if (mouseX >= w / 2 - 100 && mouseX <= w / 2 + 100 && mouseY <= h * 0.75 && mouseY >= h * 0.75 - 30 && scene === 4) {
    hasReflection = true
    img = videoCapture.get(videoW / 4, videoH / 4, videoW, videoH)
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
      largest_y = y> largest_y ? y : largest_y
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
    scene_2_start = frameCount
    canAdd = true

  }
}
// when you hit the spacebar, what's currently on the canvas will be saved (as
// a "thumbnail.png" file) to your downloads folder. this is a good starting
// point for the final thumbnail of your project (this allows us to make a
// showcase of everyone's work like we did for the nametag assignment).
//
// remember that you need to resize the file to 1280x720, and you will probably
// want to delete this bit for your final submission.
// function keyTyped() {
//   if (key === " ") {
//     saveCanvas("thumbnail.png");
//   }
// }
