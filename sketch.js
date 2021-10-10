
// screen w/h
let w
let h

// three scenes
let scene_1 = true
let scene_2 = false
let scene_3 = false

// all colors
let red_colors = ['#8c2f39', '#ad2831', '#b23a48', '#c9184a', '#f38375', '#fcb9b2', '#ffe3e0']
let green_colors = ['#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc']
let blue_colors = ['#01497c', '#014f86', '#2a6f97', '#2c7da0', '#468faf', '#61a5c2', '#89c2d9']

// bgm
let bgm_1
let fft


// ============= scene one config =============

// input
let textfield

// player gained colors
let colors = [...red_colors, ...green_colors, ...blue_colors]
let alphabet = new Set()
let words = []
let textParticles = []
let words_len = 1

// depends on the number of words
let tentacle

// depends on the words length
let hearts

// ============================================


function preload() {
  // load any assets (images, sounds, etc.) here
  bgm_1 = loadSound('assets/past-lives.mp3')
  fft = new p5.FFT()
}

function setup() {

  createCanvas(windowWidth, windowHeight);
  w = windowWidth
  h = windowHeight
  // drawingContext.shadowOffsetX = 2;
  // drawingContext.shadowOffsetY = -2;
  // drawingContext.shadowBlur = 5;
  // drawingContext.shadowColor = '#222';
  push()

  textfield = createInput('')
  textfield.size(w * 0.2)
  textfield.position(width * 0.392, height * 0.9)
  textfield.changed(inputText)
  pop()
  drawingContext.shadowBlur = 0
}

function draw() {


  let wave = fft.waveform()
  // background(color('#222'))
  // background(20, 200)
  background(255)


  frameRate(30)
  if (scene_1 == true) {


    // show text particles
    for (let i = 0; i < textParticles.length; i++) {
      textParticles[i].show()
    }



    // creature dance
    push()
    noStroke()
    rectMode(CENTER)
    translate(width / 2, height / 2)

    push()
    fill(color('#222'))
    ellipse(0, 0, h / 2, h / 2)
    pop()

    // if (window.canUseBlendMode) {
    //   blendMode(SCREEN)
    // }

    tentacle = words.length * 2 > 24 ? 24 : words.length * 2
    tentacle = tentacle == 0 ? 1 : tentacle
    if (tentacle != 1 && tentacle % 2 == 1) {
      tentacle++
    }
    // hearts = words_len > 20 ? 20 : words_len
    hearts = words_len % 20

    for (let j = 0; j < tentacle; j++) {
      rotate(TWO_PI * j / tentacle)
      push()
      // for (let i = 0; i < 20; i++) {
      for (let i = 0; i < hearts; i++) {
        translate(0, -height / 20)
        rotate(sin(i * 800 / (mouseX + 0.1)) + j / 50 + frameCount / 50 + i * 600 / (mouseY + 0.1))
        scale(noise(j, frameCount / 50) / 2 + 0.6 + map(mouseX, 0, width, -0.1, 0.2))
        // fill(red_colors[int(map(noise(i, j), 0, 1, 0, red_colors.length - 1))])
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
            // fill(255)
            // ellipse(map(noise(i,k),0,1,-50,50), map(noise(j,k),0,1,-20,30), 2)
            if (k % 2 == 0) {
              fill((red_colors[(red_colors.length - k) % red_colors.length]))
              rect(sin(frameCount / 20 + i + k) * 50, cos(frameCount / 20 + i + k) * 50, 2, 2)
            } else {
              fill((red_colors[(red_colors.length - k) % red_colors.length]))
              ellipse(sin(frameCount / 20 + i + k) * 50, cos(frameCount / 20 + i + k) * 50, 2, 2)
            }
          }
          pop()
        }
      }
      pop()
    }
    pop()



    // random mouse
    // if (frameCount % 60 == 0) {
    //   mouseX = random(w)
    //   mouseY = 0
    // }


  } else if (scene_2 == true) {

  } else if (scene_3 == true) {

    // push()
    // stroke(255)
    // noFill()
    // strokeWeight(5)
    // beginShape()
    // for (let j =0; j<width;j+=5){
    //   let index = floor(map(j, 0, width, 0, wave.length))
    //   let x = j
    //   let y = map(wave[index],-1,1,-50,50)+height/2

    //   vertex(x, y)
    // }
    // endShape()
    // pop()

  }



}

function TextParticle(str, x, y) {
  this.x = x
  this.y = y
  this.str = str
  this.opacity = random(100)
  this.size = random(30)
  this.color = random(blue_colors)

  this.direction = random(1) < 0.5 ? 1 : -1
  this.mouseThreshold =200
  this.increment_x = random(2) * this.direction
  this.increment_y = random(2) * this.direction
  this.increment_opacity = 3
  this.update = () => {
    let d = dist(mouseX, mouseY, this.x, this.y)
    if (d < this.mouseThreshold) {
     
      if (mouseY >= this.y) {
        this.y -= 20
        this.increment_y= this.increment_y<0?this.increment_y:-this.increment_y
      } else {
        this.y += 20
        this.increment_y= this.increment_y>0?this.increment_y:-this.increment_y
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

// input text
function inputText() {

  textParticles = []
  let sentences = textfield.value()
  words_len = sentences.length
  words = sentences.split(' ')
  alphabet.add(sentences.charAt(0))
  console.log(words, alphabet);
  textfield.value('')
  for (let i = 0; i < words.length; i++) {
    let limit =words.length > 6 ? 6 : words.length
    
    for (let j = 0; j < limit; j++) {
      if (j % 2 == 0) {
        textParticles.push(new TextParticle(words[i].toUpperCase(),random(w*0.3,w*0.7), random(h*0.3,h*0.7)))
      }
      textParticles.push(new TextParticle(words[i], random(w*0.3,w*0.7), random(h*0.3,h*0.7)))
    }
  }


  // mouseX = random(w / 2)
  // mouseY = h * 0.2
  if (!bgm_1.isPlaying()) {
    bgm_1.play()
  }
}


// function mouseClicked() {
//   if (bgm_1.isPlaying()) {
//     bgm_1.pause()
//   } else {
//     bgm_1.play()
//   }
// }


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
