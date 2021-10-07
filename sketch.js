


// three scenes
let scene_1=true
let scene_2=false
let scene_3=false




function preload() {
  // load any assets (images, sounds, etc.) here
}

function setup() {
   createCanvas(windowWidth,windowHeight);

  // add your setup code here
}

function draw() {
  background(color('#222'))
  if(scene_1){

  }else{
    
  }



}

















// when you hit the spacebar, what's currently on the canvas will be saved (as
// a "thumbnail.png" file) to your downloads folder. this is a good starting
// point for the final thumbnail of your project (this allows us to make a
// showcase of everyone's work like we did for the nametag assignment).
//
// remember that you need to resize the file to 1280x720, and you will probably
// want to delete this bit for your final submission.
function keyTyped() {
  if (key === " ") {
    saveCanvas("thumbnail.png");
  }
}
