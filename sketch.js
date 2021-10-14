/**
 * Player using text input, mouse drawing, microphone input to genernate artworks
 */

// ============= global config =============
// screen w/h
let w = 0
let h = 0
let background_noise
let radius

// three scenes, 1,2,3
let scene = 2

// all colors
// let red_colors = ['#ffcdb2', '#DB6C79', '#b23a48', '#c9184a', '#f38375', '#fcb9b2', '#ffe3e0']
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
function drawHeart(x,y){
  push()
  rectMode(CENTER)
  noStroke()
  // fill( red_colors_gained[int(map(noise(y,x),0,1,0,red_colors_gained.length))])
  fill( color('#6d6875'))
  translate(x,y)
  rotate(sin(x))
  scale(map(noise(x,y),0,1,0.05,0.6))
  rotate(-PI * 1 / 4)
  rect(0, -15, 30, 60, 40, 40, 0, 0)
  rotate(PI * 2 / 4)
  rect(0, -15, 30, 60, 40, 40, 0, 0)
  pop()
}

function inputText() {

  textParticles = []
  let sentences = textfield.value()
  words_len = sentences.length
  words = sentences.split(' ')
  alphabet = alphabet>26?26:alphabet+1

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
let paintTracks=new Map()
let previousDist=0


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
let main_lp_2 = new LinkParticle(blue_colors_gained[blue_colors_gained.length - 1], 4)
let main_lp_1 = new LinkParticle(blue_colors_gained[blue_colors_gained.length - 2] ? blue_colors_gained[blue_colors_gained.length - 2] : '#eeeeeeaa', 4)
function LinkParticle(c, sw) {
  this.sw = sw
  this.c = c
  this.show = (x1, y1, x2, y2, frequency, amplitude) => {
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


// ==============================================

function preload() {
  // load any assets (images, sounds, etc.) here
  bgm_1 = loadSound('assets/past-lives.mp3')
  fft = new p5.FFT()
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  w = windowWidth
  h = windowHeight

  radius = h / 4

  push()
  textfield = createInput('')
  textfield.size(w * 0.2)
  textfield.position(w * 0.385, h * 0.9)
  textfield.changed(inputText)
  textfield.hide()
  pop()


  // background noise
  background_noise = createGraphics(w, h)
  setNoise(background_noise)
  paintCanvas = createGraphics(w,h)

}

function draw() {
  image(background_noise, 0, 0)

  frameRate(30)
  // ========================== scene one ==============================
  if (scene == 1) {
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
    hearts = hearts==0? 1: hearts

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
    text('The same word can be heartrending or exhilarating. That is unexpected.', w / 2 - 200, h * 0.82, 400, 150)
    pop()

  }
  // ========================== scene two ==============================
  else if (scene == 2) {
    textfield.hide()
    image(paintCanvas,0,0)
    if (mouseIsPressed){
      paintTracks.set(int(mouseX),int(mouseY))
    }
    push()
    // paintCanvas.strokeWeight(2)
    // paintCanvas.stroke(0)
    // paintCanvas.noFill()
    // paintCanvas.beginShape()
    drawHeart
    for(let [k,v] of paintTracks.entries()){
      drawHeart(k,v)
    }
    // for(let i=0; i<paintTracks.length; i++){
    //   drawHeart(paintTracks[i][0],paintTracks[i][1])
    //   // paintCanvas.curveVertex(paintTracks[i][0],paintTracks[i][1])
    // }
    // paintCanvas.endShape()
    pop()
  

  }
  // ========================== scene three ==============================
  else if (scene == 3) {
    textfield.hide()

    let level = mic?.getLevel() ? int(mic.getLevel()) : 0
    if (level >= 80) {
      accumlate_high = accumlate_high + 8 > 84 ? 84 : accumlate_high + 8
    } else if (level > 10) {
      accumlate_low = accumlate_low + 4 > 32 ? 32 : accumlate_low + 4
    } else {
      accumlate_high = 1
      accumlate_low = 1
    }

    let accumlate = level >= 80 ? accumlate_high : accumlate_low
    // record vol and freq
    if (level > 10) {
      if (voiceRecord.has(level)) {
        let obj = voiceRecord.get(level)
        obj.count++
        obj.accumlate = (obj.accumlate + accumlate) / 2
      } else {
        voiceRecord.set(level, { "count": 1, "accumlate": accumlate })
      }
    }

    // pick up the vol and freq which show up mostly
    if (level < 10 && voiceRecord.size != 0) {
      let largest = 0
      let freq = 0
      let vol = 0
      for (key of voiceRecord.keys()) {
        let value = voiceRecord.get(key)
        console.log(key, value);
        if (value.count > largest) {
          freq = value.accumlate
          vol = key
          largest = value.count
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
    fill(22)
    ellipse(0, 0, h / 2 - map(level, 0, 255, 0, h / 8), h / 2 - map(level, 0, 255, 0, h / 8))
    fill(0)

    // anchor decoration and text annoation 
    let radius_voice = level > 10 ? radius - map(level, 0, 255, 0, h / 8) : radius
    for (i = 0; i < 12; i++) {
      rect(radius_voice * cos(i * TWO_PI / 12), radius_voice * sin(i * TWO_PI / 12), 8)
    }

    rect(radius * 1.12, 0, 20, 5)
    rect(radius * 1.12 * cos(TWO_PI * 6 / 12), radius * 1.15 * sin(TWO_PI * 6 / 12), 20, 5)
    textSize(14)
    textStyle(BOLD)
    text('0°', radius * 1.20, 5)
    text('360°', -radius * 1.35, 5)


    let start = level > 10 ? (radius - map(level, 0, 100, 1, 50)) : radius
    let end = level > 10 ? (radius - map(level, 0, 100, 1, 50)) * -1 : -radius

    // main axis  
    push()
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = -2;
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = '#eeeeee77';
    main_lp_2.show(start, 0, end, 0, 10 + previousAccumlate, map(previousLevel, 0, 255, 0, 100))
    main_lp_1.show(start, 0, end, 0, 10, 2)
    pop()

    // hint
    pop()
    push()
    textSize(16)
    textAlign(CENTER)
    fill(color('#222'))
    text('Yelling or whispering, that is a question!', w / 2 - 200, h * 0.82, 400, 150)
    text(`Vol: ${previousLevel - 4} - Freq: ${previousAccumlate - 3}`, w / 2, h * 0.88)
    pop()

  }

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
  if (mouseX >= w * 0.05 - 10 && mouseX <= w * 0.05 + 10 && mouseY >= h / 2 - 30 && mouseY <= h / 2 + 30) {
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
        scene = 1
        break

    }

  }


}

function mouseReleased(){
  if(scene==2){
    let x = paintTracks.keys()
    let avg_x= 0
    x.map((e)=> avg_x+e)
    console.log(avg_x);
    // let y  =paintTracks.values()
    console.log(x);
    // alert(avg_x,avg_y)
    paintCanvas.clear()
    paintTracks.clear()
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
