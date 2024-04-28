
let servoAngle = 0; // Angle initial du servo moteur
let distance = 0;
let max=40;
let porte = document.getElementById('porte-max');


let angle = 0;
let pixsDistance;
var r=0;
var g=0;
var b=255;
var ra=0;
var ga=255;
var ba=0;
var ri=255
var gi=255;
var bi=255;

const maxDistance = 400; // Distance maximale mesurée par le capteur ultrasonique
const detectionThreshold = 100; // Seuil de détection de l'objet
var containerWidth = document.getElementById('canvas-container').clientWidth;
var containerHeight = document.getElementById('canvas-container').clientHeight;
const colorInputs = document.querySelectorAll('.color-input');
const sliderContainers = document.querySelectorAll('.slider-container');
var inputColor = document.getElementById('radar-color');
var inputColor2 = document.getElementById('spin');
var inputColor3 = document.getElementById('back-color');



// Ajouter des écouteurs d'événement pour mettre à jour les valeurs des sliders
const sliders = document.querySelectorAll('input[type="range"]');
sliders.forEach(slider => {
    const output = slider.nextElementSibling;
    output.textContent = slider.value;

    slider.addEventListener('input', function() {
        output.textContent = this.value;

    });
});

// Afficher tous les éléments dès le chargement de la page
colorInputs.forEach(input => {
    input.style.display = 'block';
});
sliderContainers.forEach(container => {
    container.style.display = 'block';
});


function hexToRgb(hex) {
  // Supprimer le "#" de la chaîne hexadécimale si présent
  hex = hex.replace(/^#/, '');

  // Convertir la chaîne hexadécimale en valeurs RGB
  r = parseInt(hex.substring(0, 2), 16);
  g = parseInt(hex.substring(2, 4), 16);
  b = parseInt(hex.substring(4, 6), 16);

  // Retourner un objet contenant les valeurs R, G et B
 
}
function hexToRgb2(hex) {
  // Supprimer le "#" de la chaîne hexadécimale si présent
  hex = hex.replace(/^#/, '');

  // Convertir la chaîne hexadécimale en valeurs RGB
  ra = parseInt(hex.substring(0, 2), 16);
  ga = parseInt(hex.substring(2, 4), 16);
  ba = parseInt(hex.substring(4, 6), 16);

  // Retourner un objet contenant les valeurs R, G et B
 
}
function hexToRgb3(hex) {
  // Supprimer le "#" de la chaîne hexadécimale si présent
  hex = hex.replace(/^#/, '');

  // Convertir la chaîne hexadécimale en valeurs RGB
  ri = parseInt(hex.substring(0, 2), 16);
  gi = parseInt(hex.substring(2, 4), 16);
  bi = parseInt(hex.substring(4, 6), 16);

  // Retourner un objet contenant les valeurs R, G et B
 
}


const socket = io();
socket.on('data', (data) => {
           
  servoAngle=data.angg;
  distance=data.diss;
  
});

porte.addEventListener('input',function(){
  max=porte.value;
})
document.getElementById("toggleButton").addEventListener("click", function() {
  if (this.classList.contains("start")) {
      this.textContent = "RUN";
     
      this.classList.remove("start");
      this.classList.add("run");

  } else {
      this.textContent = "STOP";
      
      this.classList.remove("run");
      this.classList.add("start");
  }
});

function setup() {
    let canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent('canvas-container');
    
    smooth();
    //setInterval(getSensorData, 10);
}
function windowResized() {
  var containerWidth = document.getElementById('canvas-container').clientWidth;
  var containerHeight = document.getElementById('canvas-container').clientHeight;
  resizeCanvas(containerWidth, containerHeight);
}

inputColor.addEventListener('change', function() {
  // Récupération de la nouvelle valeur de couleur
  newColor=inputColor.value;
  hexToRgb(newColor);
  draw();
});

inputColor2.addEventListener('change', function() {
  // Récupération de la nouvelle valeur de couleur
  newColor2=inputColor2.value;
  hexToRgb2(newColor2);
  draw();
});

inputColor3.addEventListener('change', function() {
  // Récupération de la nouvelle valeur de couleur
  newColor3=inputColor3.value;
  hexToRgb3(newColor3);
  draw();
});



function draw() {
 
 fill(98,245,31);
 background(ri,gi,bi);
  // simulating motion blur and slow fade of the moving line
  noStroke();
  fill(0,4); 
  rect(0, 0, width, height-height*0.065); 
  
  fill(98,245,31); // green color
  // calls the functions for drawing the radar
  drawRadar(); 
  drawLine();
  drawObject();
  drawText();
  
}




function drawRadar() {
  push();
  translate(width/2,height-height*0.074); // moves the starting coordinats to new location
  noFill();
  strokeWeight(2);
  stroke(r,g,b);
  // draws the arc lines
  arc(0,0,(width-width*0.0625),(width-width*0.0625),PI,TWO_PI);
  arc(0,0,(width-width*0.27),(width-width*0.27),PI,TWO_PI);
  arc(0,0,(width-width*0.479),(width-width*0.479),PI,TWO_PI);
  arc(0,0,(width-width*0.687),(width-width*0.687),PI,TWO_PI);
  // draws the angle lines
  line(-width/2,0,width/2,0);
  line(0,0,(-width/2)*cos(radians(30)),(-width/2)*sin(radians(30)));
  line(0,0,(-width/2)*cos(radians(60)),(-width/2)*sin(radians(60)));
  line(0,0,(-width/2)*cos(radians(90)),(-width/2)*sin(radians(90)));
  line(0,0,(-width/2)*cos(radians(120)),(-width/2)*sin(radians(120)));
  line(0,0,(-width/2)*cos(radians(150)),(-width/2)*sin(radians(150)));
  line((-width/2)*cos(radians(30)),0,width/2,0);
  pop();
}

function drawObject() {
  push();
  translate(width/2,height-height*0.074); // moves the starting coordinats to new location
  strokeWeight(1);
  stroke(255,10,10); // red color
  pixsDistance = distance*((height-height*0.1666)*0.025); // covers the distance from the sensor from cm to pixels
  // limiting the range to 40 cms
  if(distance<max){
    // draws the object according to the angle and the distance
  line(pixsDistance*cos(radians(servoAngle)),-pixsDistance*sin(radians(servoAngle)),(width-width*0.505)*cos(radians(servoAngle)),-(width-width*0.505)*sin(radians(servoAngle)));
  }
  pop();
}

function drawLine() {
  push();
  strokeWeight(1);
  stroke(ra,ga,ba);
  translate(width/2,height-height*0.074); // moves the starting coordinats to new location
  line(0,0,(height-height*0.12)*cos(radians(servoAngle)),-(height-height*0.12)*sin(radians(servoAngle))); // draws the line according to the angle
  pop();
}

function drawText() { // draws the texts on the screen
  
  push();
  fill(0,0,0);
  noStroke();
  rect(0, height-height*0.0648, width, height);
  fill(0,0,0);
  textSize(15);
 
  
  text((max-30)+"cm",width-width*0.3854,height-height*0.0833);
  text((max-20)+"cm",width-width*0.281,height-height*0.0833);
  text((max-10)+"cm",width-width*0.177,height-height*0.0833);
  text((max)+"cm",width-width*0.0729,height-height*0.0833);
  textSize(20);
  textSize(15);
  fill(0,0,0);
  translate((width-width*0.4994)+width/2*cos(radians(30)),(height-height*0.0907)-width/2*sin(radians(30)));
  rotate(-radians(-60));
  text("30°",0,0);
  resetMatrix();
  translate((width-width*0.503)+width/2*cos(radians(60)),(height-height*0.0888)-width/2*sin(radians(60)));
  rotate(-radians(-30));
  text("60°",0,0);
  resetMatrix();
  translate((width-width*0.507)+width/2*cos(radians(90)),(height-height*0.0833)-width/2*sin(radians(90)));
  rotate(radians(0));
  text("90°",0,0);
  resetMatrix();
  translate(width-width*0.513+width/2*cos(radians(120)),(height-height*0.07129)-width/2*sin(radians(120)));
  rotate(radians(-30));
  text("120°",0,0);
  resetMatrix();
  translate((width-width*0.5104)+width/2*cos(radians(150)),(height-height*0.0574)-width/2*sin(radians(150)));
  rotate(radians(-60));
  text("150°",0,0);
  pop(); 
}

