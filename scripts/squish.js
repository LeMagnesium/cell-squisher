"use strict";

var canvas = document.getElementById('canvas0');
var ctx = canvas.getContext('2d');
var mousePressed = false;
var enemies = [];
var floaties = [];
var MaxColoursAllowed = 255 * 255 * 255;
var score = -1;
var combo = 0;
var menu = true;

// Mouse stuff
var surround = 6;
var fradius = 15;
var sradius = 6;
var rotary = 0;

// Audio
var sounds = ["audio/No Rocking in the Jazzhands Zone.mp3",
              "audio/Skipping Through the Orchestra Pit.mp3",
              "audio/Babylon.mp3",
              "audio/Club Diver.mp3"
             ];
var audio_titles = [
  "Peter Gresser - No Rocking the Jazzhands Zone",
  "Peter Gresser - Skipping Through the Orchestra Pit",
  "Kevin MacLeod - Babylon",
  "Kevin MacLeod - Club Diver"
];
var nowPlaying = -1;

// Classes
function enemy() {
  this.posx = Math.random() * canvas.width;
  this.posy = Math.random() * (canvas.height-70) + 35;
  this.health = Math.random() * 100 + 200;
  this.color = new color();
  this.border_color = new color();
  this.squished = false;
  this.spawn = function() {
    this.color.red = Math.ceil(Math.random() * 255);
    this.color.green = Math.ceil(Math.random() * 255);
    this.color.blue = Math.ceil(Math.random() * 255);
    
    // A darker colour for the outline
    var low = Math.min(this.color.red, Math.min(this.color.green, this.color.blue));
    this.border_color.red = this.color.red - low;
    this.border_color.green = this.color.green - low;
    this.border_color.blue = this.color.blue - low;
    
    this.color = this.color.hex(); // Overwrite
    this.border_color = this.border_color.hex();
  }
}

function color(r, g, b) {
  this.red = r;
  this.green = g;
  this.blue = b;
  
  this.hex = function() {
    var str = '#';
    str += dechex(this.red);
    str += dechex(this.green);
    str += dechex(this.blue);
    return str;
  }
  
  this.decs = function(col) {
    this.red = hexdec(col.slice(1, 3));
    this.green = hexdec(col.slice(3, 5));
    this.blue = hexdec(col.slice(5, 7));
  }
}

function floaty(text, posx, posy, speed, lifespan, color, font) {
  this.text = text || "";
  this.posx = posx;
  this.posy = posy;
  this.speed = speed || 15;
  this.lifespan = lifespan || 200;
  this.font = font || ctx.font;
  this.color = color || "#fff";
  this.dead = false;

  this.draw = function() {
    if (this.dead) {return;}
    
    var oldfont = ctx.font;
    var oldfill = ctx.fillStyle;
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.posx, this.posy);
    ctx.font = oldfont;
    ctx.fillStyle = oldfill;
    
    this.posy -= this.speed;
    this.lifespan -= 1;
    if (this.lifespan == 0) {
      this.dead = true;
    }
  }
}

var bg = new color(255, 255, 255);

ctx.font = "20px Arial";
ctx.textAlign = "center";

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

// Hexadecimal garbage
var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

function dechex(int) {
  return hex[int >> 4] + hex[int & 15];
}

function hexdec(he) {
  var dec = 0;
  for (var i = 0; i < he.length; i++) {
    dec = dec << 4;
    dec += hex.indexOf(he[i]);
  }
  return dec;
}

// Score
function increase_score(int, raw) {
  if (combo > 1 && !raw) {
    int *= combo;
  }
  score += int;
 
  if (score < 0) {
    score = 0;
  }
}

function spawn_floaty(int, posx, posy) {
  var fl = new floaty(int.toString(), posx, posy, 5, 30, '#fff', "20px Arial");
  if (int > 0) {
    fl.color = '#0F0';
  } else {
    fl.color = '#F00';
  }
  floaties.push(fl);
}

// Now some drawing
function draw_mouse() {
  // Mouse stuff
  // From http://ncase.me/sight-and-light/

  var rad = fradius;
  if (mousePressed) {
    rad = sradius;
    rotary = (rotary + 0.1) % 2;
   /* ctx.fillStyle = "#ee2";
    ctx.beginPath();
    ctx.arc(Mouse.x, Mouse.y, 10, 0, 2 * Math.PI, false);
    ctx.fill()*/
  }

  ctx.fillStyle = "#f22";
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.arc(Mouse.x, Mouse.y, 3, 0, 2 * Math.PI, false);
  ctx.fill(); 
  ctx.beginPath();
  ctx.arc(Mouse.x, Mouse.y, rad, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.strokeStyle = "#f22"
  for (var angle=0; angle<Math.PI*2; angle+=(2*Math.PI)/surround) {
    var dx = Math.cos(angle + rotary * Math.PI) * rad;
    var dy = Math.sin(angle + rotary * Math.PI) * rad;
    ctx.beginPath();
    ctx.arc(Mouse.x+dx, Mouse.y+dy, 2, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
}

function draw_enemy(enemy) {
  // FFFFFF is 255^3, so, a lot. We don't wanna compute that every time;
  ctx.fillStyle = enemy.color;
  ctx.strokeStyle = enemy.border_color;
  ctx.beginPath();
  // FIXME
  try {
    ctx.arc(enemy.posx, enemy.posy, enemy.health / 10, 0, 2 * Math.PI);
  } catch (IndexSizeError) {
    ;
  }
  ctx.fill();
  ctx.stroke();
}

function draw_enemies() {
  // Bring out yer dead!
  var nosquish = true;
  for (var i=0; i<enemies.length; i++) {
    if (enemies[i].health <= 0) {
      if (!enemies[i].squished) {
        increase_score(-10, true);
        spawn_floaty(-10, enemies[i].posx, enemies[i].posy);
      }
      enemies.splice(i, 1);
    } else if (enemies[i].squished) {
      nosquish = false;
    }
  }
  // Combo reset if no pellet squished
  if (combo > 0 && nosquish) {
    combo = 0;
    var fl = new floaty("Combo reset..", Mouse.x, Mouse.y, 5, 30, '#F0F', "20px Arial");
    floaties.push(fl);
  }

  for (var i=0; i<enemies.length; i++) {
    draw_enemy(enemies[i]);
    if (enemies[i].squished) {
      var h = Math.random() * 6;
      increase_score(Math.floor(h));
      enemies[i].health -= h;
    }
    enemies[i].health -= Math.random() * 2;
  }
}

function draw_score() {
  ctx.fillStyle = "#ddd";
  ctx.fillRect(5, 5, canvas.width - 10, 30);
  //ctx.strokeType = "#222";
  ctx.strokeRect(5, 5, canvas.width - 10, 30);
  if (score >= 0) {
    ctx.fillStyle = "#27f";
    ctx.fillText(score.toString(), canvas.width / 2, 27);    
  }
}

function draw_sound() {
  ctx.fillStyle = "#ddd";
  ctx.fillRect(5, canvas.height - 35, canvas.width - 10, 30);
  ctx.strokeRect(5, canvas.height - 35, canvas.width - 10, 30);
  if (nowPlaying >= 0) {
    ctx.fillStyle = "#27f";
    ctx.fillText("Now Playing : " + audio_titles[nowPlaying], canvas.width / 2, canvas.height - 13);
  }
}

function draw_floaties() {
  for (var i = 0; i < floaties.length; i++) {
     if (floaties[i].dead) {
       floaties.splice(i, 1);
     } else {
       floaties[i].draw();
     }
  }
}

function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Background
  ctx.fillStyle = bg.hex();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Enemies
  if (Math.random() < 0.3) {
    // New enemy at random coords
    var en = new enemy();
    en.spawn();
    enemies.push(en);
  }
  
  // Draw enemies
  draw_enemies();
  
  // Score
  draw_score();
  
  // Now Playing
  draw_sound();
      
  // Draw floaties
  draw_floaties();

  // Mouse
  draw_mouse();
}

function drawLoop() {
  requestAnimationFrame(drawLoop);
  draw();
}

var Mouse = {
  y: canvas.width / 2,
  x: canvas.height / 2,
}

canvas.onmousemove = function (event) {
  Mouse.x = event.clientX;
  Mouse.y = event.clientY;
}

canvas.onmousedown = function(event) {
  if (menu) {
    if (Mouse.x > canvas.width / 16 * 7.5 && Mouse.x < canvas.width / 16 * 8.5 && Mouse.y > canvas.height / 2 - 15 && Mouse.y < canvas.height / 2 + 30) {
      // PLAY!
      menu = false;
      score = 0;
      return;
    }
  }

  mousePressed = true;
  var overlap = 0;
  for (var i=0; i<enemies.length; i++) {
    if (enemies[i].squished) {continue;}
    var radius = enemies[i].health / 10;
    // We want to return as soon as possible to avoid useless computing
    if (Mouse.x < enemies[i].posx - radius - sradius) {continue;} // Minus radius of hand
    if (Mouse.x > enemies[i].posx + radius + sradius) {continue;}
    if (Mouse.y < enemies[i].posy - radius - sradius) {continue;}
    if (Mouse.y > enemies[i].posy + radius + sradius) {continue;}
    
    // We squished a pellet!
    enemies[i].squished = true;
    spawn_floaty(Math.floor(enemies[i].health), enemies[i].posx, enemies[i].posy)
    
    var col = new color();
    col.decs(enemies[i].color);
    
    if (bg.red < col.red) {
      bg.red += 4;
    } else if (bg.red > col.red) {
      bg.red -= 4;
    }
    
    if (bg.green < col.green) {
      bg.green += 4;
    } else if (bg.green > col.green) {
      bg.green -= 4;
    }

    if (bg.blue < col.blue) {
      bg.blue += 4;
    } else if (bg.blue > col.blue) {
      bg.blue -= 4;
    }

    enemies[i].color = "#000000";
    increase_score(overlap * 50, enemies[i].posx, enemies[i].posy);
    if (overlap > 0) {
      spawn_floaty(overlap * 50, enemies[i].posx, enemies[i].posy);
    }
    combo += 1;
    overlap += 1;
  }
  if (overlap > 1) {
    var fl = new floaty("Overlap! * " + overlap.toString(), Mouse.x, Mouse.y, 5, 30, '#00F', "20px Arial Bold");
    floaties.push(fl);
  }
  if (combo > 1) {
    var fl = new floaty("Combo " + combo.toString() + "!", Mouse.x, Mouse.y, 5, 30, '#0FF', "20px Arial");
    floaties.push(fl);
  }
}

canvas.onmouseup = function(event) {
  mousePressed = false;
}

function sound() {
  this.sound = document.createElement("audio");
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(src) {
    this.sound.src = src;
    this.sound.play();
  }
}

function bgm_music() {
  this.sound = document.createElement("audio");
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
    nowPlaying = Math.floor(Math.random() * sounds.length);
    this.sound.src = sounds[nowPlaying];
    this.sound.play();
  }
  this.sound.onended = function() {
    var bgm = new bgm_music();
    bgm.play();
  }
}

function draw_banner() {
  ctx.fillStyle = "#d0d0d0";
  ctx.fillRect(0, canvas.height / 2 - 45, canvas.width, 90);
  ctx.strokeType = "#f00000";
  ctx.strokeRect(0, canvas.height / 2 - 46, canvas.width, 92); 
}

function waitMenu() {
  if (menu) {
    requestAnimationFrame(waitMenu);
  
    // Menu
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Background
    ctx.fillStyle = bg.hex();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Score
    draw_score();
  
    // Now Playing
    draw_sound();
    
    // Banner
    draw_banner();
    
    // Play Button
    ctx.fillStyle = "#f60";
    ctx.fillRect(canvas.width / 16 * 7.5, canvas.height / 2 - 15, canvas.width / 16, 30);
    ctx.fillStyle = "#228";
    ctx.fillText("Play", canvas.width / 2, canvas.height / 2 + 5);
  
    // Mouse
    draw_mouse();

  
  } else {
    // Let's start the game!
    var bgm = new bgm_music();
    bgm.play();
    drawLoop();
  }
}


window.onload = function() {
  waitMenu();
}