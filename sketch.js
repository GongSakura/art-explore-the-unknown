
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

// input
let textfield

// player gained colors
let colors = [...red_colors, ...green_colors, ...blue_colors]
let alphabet = new Set()
let words = ['hi']
let words_len=1

function preload() {
  // load any assets (images, sounds, etc.) here
  bgm_1 = loadSound('assets/past-lives.mp3')
  fft = new p5.FFT()
}

function setup() {
  if (bgm_1.isPlaying()) {
    bgm_1.pause()
  } else {
    bgm_1.play()
  }
  createCanvas(windowWidth, windowHeight);
  w = windowWidth
  h = windowHeight
  // drawingContext.shadowOffsetX = 2;
  // drawingContext.shadowOffsetY = -2;
  // drawingContext.shadowBlur = 2;
  // drawingContext.shadowColor = '#222'; 
  push()

  textfield = createInput('')
  textfield.size(w*0.2)
  textfield.position(width*0.4,height*0.9)
  textfield.changed(inputText)
  pop()
}

function draw() {
  let wave = fft.waveform()
  background(color('#222'))
  // background(255)
  frameRate(30)
  if (scene_1 == true) {
    push()
    noStroke()
    rectMode(CENTER)
    translate(width / 2, height / 2)
    blendMode(SCREEN)
    for (let j = 0; j < (words.length); j++) {
      rotate(TWO_PI / (words.length) * j)
      push()
      // for (let i = 0; i < 20; i++) {
      for (let i = 0; i < words_len; i++) {

        translate(0, -height / 10)
        // rotate(map(noise(frameCount/100),0,1,0,PI*0.2 ))
        rotate(sin(i * 800 / (mouseX + 0.1)) + j / 16 + frameCount / 200 + i * 600 / (mouseY + 0.1))
        // rotate(sin(i / (frameCount / 500) + mouseX / 50 + j))
        scale(noise(j, frameCount / 50) / 2 + 0.6 + map(mouseX, 0, width, -0.1, 0.2))
        fill(red_colors[int(map(noise(i, j), 0, 1, 0, red_colors.length - 1))])
        push()
        scale(noise(i, j,frameCount / 50) * 0.5)
        rotate(-PI * 1 / 4)
        rect(0, -15, 30, 60, 40, 40, 0, 0)
        rotate(PI * 2 / 4)
        rect(0, -15, 30, 60, 40, 40, 0, 0)
        pop()
        // for(let k =0;k<5;k++){
        //   fill(random(red_colors))
        //   // fill(255)
        //   // ellipse(map(noise(i,k),0,1,-50,50), map(noise(j,k),0,1,-20,30), 2)
        //   ellipse(sin(frameCount/20+i+k)*50, cos(frameCount/20+i+k)*50, 2,2)
        // }
      }
      pop()
    }
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

  } else if (scene_2 == true) {

  } else if (scene_3 == true) {

  }



}

function inputText(){
  let sentences = textfield.value()
  words_len=sentences.length
  words = sentences.split(' ')
  alphabet.add(sentences.charAt(0))
  console.log(words,alphabet);
  textfield.value('')
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
