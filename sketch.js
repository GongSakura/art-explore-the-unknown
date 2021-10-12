/**
 * Player using text input, mouse drawing, microphone input to genernate artworks
 */

// ============= global config =============
// screen w/h
let w
let h
let background_noise 
let radius

// three scenes
let scene_1 = !true
let scene_2 = false
let scene_3 = !false

// all colors
let red_colors = ['#8c2f39', '#ad2831', '#b23a48', '#c9184a', '#f38375', '#fcb9b2', '#ffe3e0']
let green_colors = ['#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc']
let blue_colors = ['#01497c', '#014f86', '#2a6f97', '#2c7da0', '#468faf', '#61a5c2', '#89c2d9']
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
let alphabet = new Set()

let words = []
let textParticles = []
let words_len = 1

// depends on the number of words
let tentacle

// depends on the words length
let hearts

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
  let letter = sentences.charAt(0).toUpperCase()
  if (letter.charCodeAt() >= 65 && letter.charCodeAt() <= 90) {
    alphabet.add(sentences.charAt(0))

  }

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


// ============= scene three config =============
// ** to record the volumn of different speaking **
// if player's voice volumn can reach all levels, then it will gained all the blue colors
let voices =0
let voicesLevel= new Set()
let linkParticles=[]
let mic 
let currentLevel=0
let accumlate=0

function LinkParticle(x1,y1,x2,y2,frequency,amplitude){
  this.start=  createVector(x1,y1)
  this.end = createVector(x2,y2)
  this.frequency = frequency
  this.amplitude = amplitude
  // this.head = frequency*random(0.05,0.3)
  this.head = frequency*map(noise(x1,y1),0,1,0.05,0.3)
  // this.tail = frequency*random(0.7,0.95)
  this.tail = frequency*map(noise(x2,y2),0,1,0.7,0.95)
  this.isRandom = random(1)<0.5?true:false
  this.isRandom=false
  this.show=()=>{
    push()
    stroke(255)
    strokeWeight(4)
    noFill()
    beginShape()
    for (let i = 0; i < frequency; i++) {
      let d = p5.Vector.lerp(this.start,this.end,i/frequency)
      if(i>this.head  && i<this.tail){
        if(this.isRandom){
          vertex(d.x, sin(d.x+frameCount/5) * noise(i)*amplitude)
        }else{
          vertex(d.x, sin(d.x+frameCount/5)*amplitude)
        }
      }else{
        vertex(d.x,1)

      }
     
    }
    vertex(this.end.x,1)
    
   
    endShape()
    pop()
  }
}

// grainy effect for background
function setNoise(ctx) {
  ctx.background(230,227,225);
  ctx.loadPixels();
  for (let x = 0; x < ctx.width; x+=2) {
      for (let y = 0; y < ctx.height; y++) {
          if (random(1) > 0.95) {
              const index = (x + y * ctx.width) *36;
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
  background_noise= createGraphics(w, h)
  setNoise(background_noise)

  // mic
  mic = new p5.AudioIn(()=>{
    alert('cannot access your mic')
  })
  mic.amp(255)
}

function draw() {
  
  let wave = fft.waveform()
  // background(color('#222'))
  // background(20, 200)
  image(background_noise,0,0)

  frameRate(30)
  // ========================== scene one ==============================
  if (scene_1 == true) {
    textfield.show()
    // show text particles
    for (let i = 0; i < textParticles.length; i++) {
      textParticles[i].show()
    }

    // creature dance
    push()
    noStroke()
    rectMode(CENTER)
    translate(width / 2, height*0.45)

    push()
    fill(color('#222'))
    ellipse(0, 0, h / 2, h / 2)
    pop()

    if (window.canUseBlendMode) {
      blendMode(SCREEN)
    }

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
        // fill(map(alphabet.size,0,26,0,255),0,0,map(alphabet.size,0,26,50,200))
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
    text('Poems - the most romantic language in the world. Alphabet makes words vivid', w / 2 - 200, h * 0.82, 400, 150)
    pop()

    // random mouse
    // if (frameCount % 60 == 0) {
    //   mouseX = random(w)
    //   mouseY = 0
    // }


  }
  // ========================== scene two ==============================
  else if (scene_2 == true) {


  } 
   // ========================== scene three ==============================
  else if (scene_3 == true) {

    mic.start()
    let level = mic.getLevel()
    if(level>0.1){
      console.log(level);
    }
    if(level>currentLevel){
      accumlate = accumlate*5>80?80:accumlate*5
      currentLevel=level
    }else{
      accumlate=1
    }

    voicesLevel.add(int(level))
    voices=voicesLevel.size

    // electric connection
    push()

    rectMode(CENTER)
    translate(width / 2, height *0.4)

    noStroke()
    fill(0)
    ellipse(0, 0, h / 2-map(level,0,255,0,h/8), h / 2-map(level,0,255,0,h/8))


    rotate(frameCount/500)
    fill(0)
    let radius_voice =radius-map(level,0,255,0,h/8)
    // anchor
    for (i = 0; i < 12; i++) {
      rect(radius_voice * cos(i * TWO_PI / 12 ), radius_voice * sin(i * TWO_PI / 12 ),8)
    }
    // decoration
    rect(radius*1.12,0,20,5)
    rect(radius*1.12*cos(TWO_PI*6/12),radius*1.15*sin(TWO_PI*6/12),20,5)
    textSize(14)
    textStyle(BOLD)
    text('0°',radius*1.20,5)
    text('360°',-radius*1.35,5)
    
    let start = radius-map(level,0,100,1,50)
    let end = (radius-map(level,0,100,1,50)) * cos(6 * TWO_PI / 12)

    let lp = new LinkParticle(start,0,end,0,10+accumlate,map(level,0,100,1,50))
   
    lp.show()




    pop()




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

  push()
  noStroke()
  rectMode(CENTER)
 
  fill(map(alphabet.size, 0, 26, 20, 255), 0, 0, map(alphabet.size, 0, 26, 20, 200))
  rect(w / 2 - h * 0.05, h * 0.76, h * 0.03, h * 0.03)
  fill(0, map(paintings, 0, 10, 20, 255), 0, map(paintings, 0, 10,20, 200))
  rect(w / 2, h * 0.76, h * 0.03, h * 0.03)
  fill(0, 0, map(voices, 0, 100, 20, 255), map(voices, 0, 100, 20, 200))
  rect(w / 2 + h * 0.05, h * 0.76, h * 0.03, h * 0.03)
  pop()

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
