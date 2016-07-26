"use strict";

var canvas = document.getElementById('canvas0');
var ctx = canvas.getContext('2d');
var enemies = [];
var floaties = [];
var MaxColoursAllowed = 255 * 255 * 255;
var score = -1;
var combo = 0;
var menu = "start";
var menuButtonHovered = false;
var triggerLock = false;

// Config trash
var Config = {
  extrafloaties: true,
}

// Mouse stuff
var surround = 6;
var fradius = 15;
var sradius = 6;

var Mouse = {
  y: canvas.width / 2,
  x: canvas.height / 2,
  rotary: 0,
  pressed: false,
};

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
var bgm;

// Graphical elements
var menuButton = [
  ["rect", canvas.width - 35, canvas.height - 35, 30, 30, '#'],
  ["line", canvas.width - 30, canvas.height - 13, 20, 0],
  ["line", canvas.width - 30, canvas.height - 20, 20, 0],
  ["line", canvas.width - 30, canvas.height - 27, 20, 0]
]

var mainMenu = [
  ["rect", 5, 40, canvas.width - 10, canvas.height - 80]
]

// Triggers
var triggers = [];

// Achievements
var achievements = []
var showQueue = [];

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

    this.border_color = this.color.get_dark().hex();
    this.color = this.color.hex(); // Overwrite
  }
}

function color(r, g, b) {
  this.red = r;
  this.green = g;
  this.blue = b;

  this.get_dark = function() {
    var low = Math.min(this.red, Math.min(this.green, this.blue));
    var nc = new color(this.red - low, this.green - low, this.blue - low);
    return nc;
  }

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
  this.color = color || "#ffffff";
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

function achievement(name, trigger, icon, howto, desc, condition, runthrough) {
  this.name = name;
  this.icon = icon;
  this.howto = howto;
  this.description = desc;
  this.check = function() {
    if (this.triggered) {return;}
    var ret = condition();
    if (ret) {
      trigger_achievement(this);
    }
  };
  this.runthrough = function() {
    if (this.triggered) {return;}
    return runthrough();
  }
  
  this.trigger = trigger;
  this.triggered = false;
}

function slider_component(direction, start_x, start_y, width, length, slide_time, lifetime, children) {
  this.direction = direction;
  this.start_x = start_x;
  this.start_y = start_y;
  this.width = width;
  this.length = length;
  this.slide_time = slide_time;
  this.lifetime = lifetime;
  this.children = [];
  
  this.duration = slide_time * 2 + lifetime; // Total
  this.elapsed = 0;
  this.state = "idling";
  this.component = function() {
    if (this.state == "idling") {
      this.state = "unfolding";
      this.elapsed = 0;
      children.unshift(["rect", 0, 0, width, length]);
      this.children = children;
    }
    var dx = start_x;
    var curve = -2.5; // Good value for 20 frames  
  
    if (this.state == "unfolding") {
      if (this.direction == "rtl") {
        dx -= width * (1 - Math.pow(this.elapsed , curve));
      } else {
        dx += width * (1 - Math.pow(this.elapsed , curve));
      }

      if (this.elapsed == this.slide_time) {
        this.elapsed = 0;
        this.state = "static";
      }

    } else if (this.state == "static") {
      if (this.direction == "rtl") {
        dx -= width;
      } else {
        dx += width;
      }

      if (this.elapsed == this.lifetime) {
        this.elapsed = 0;
        this.state = "folding";
      }
    } else if (this.state == "folding") {
      if (this.direction == "rtl") {
        dx -= width * Math.pow(this.elapsed , curve);
      } else {
        dx += width * Math.pow(this.elapsed , curve);
      }

      if (this.elapsed == this.slide_time) {
        this.elapsed = 0;
        this.state = "dead";
      }    
    }

    return ["canvas", dx, start_y, width, length, this.children];
  }
}

// Other misc definitions

var bg = new color(255, 255, 255);

ctx.font = "20px Arial";
ctx.textAlign = "center";

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

// Triggers
function register_trigger(name) {
  triggers[name] = [];
  achievements[name] = [];
}

function register_hook(name, func) {
  triggers[name].push(func);
}

function call_trigger(name) {
  for (var i = 0; i < triggers[name].length; i++) {
    triggers[name][i]();
  }

  for (var u = 0; u < achievements[name].length; u++) {
    achievements[name][u].check();  
  }
}

register_trigger("mousemove");
register_trigger("step");
register_trigger("mousedown");
register_trigger("score");

// Achievement garbage
function register_achievement(name, trigger, icon, howto, desc, condition, runthrough) {
  var ach = new achievement(name, trigger, icon, howto, desc, condition, runthrough);
  achievements[trigger].push(ach);
}

function trigger_achievement(ach) {
  ach.triggered = true;
  
  // Do pre-graphical stuff here
  showQueue.push(new slider_component("rtl", canvas.width, canvas.height - 150, 250, 110, 20, 150, [
    ["image", ach.icon, 125, 20],
    ["text", ach.name, 125, 100, "20px Arial"]
  ]));
}

function cycle_through() {
  for (var i = 0; i < achievements.length; i++) {
    achievements[i].runthrough();
    achievements[i].check();
  }
}

// Score achievements
register_achievement("The Cell Slayer", "score", "images/game/slayer.gif",
                "You'll never see that text.. POOOP!",
                "Yes you have an achievement for squishing a cell. I am that desperate about filling my game with content",
                function () {
                  return score > 0;
}, null);

register_achievement("Over 9000", "score", "images/game/gt9000.gif",
                "Get 9000 of score. Yeah, lame.",
                "Pretty easy, duh",
                function () {
                 return score > 9000;
}, null);
  
register_achievement("A pet named Steve", "score", "images/game/steve.gif",
                "Kudos if you get the reference. Reach a certain score (circa 3.6*10^6)",
                "3,610,827 views in one week, good work",
                function() {
                  return score > 3610827;
}, null);
    
register_achievement("Over 9000*10^6", "score", "images/game/gtmore9000.gif",
                "You wanted something hard, didn't you?",
                "You have reached 4Chan senior levels. Poor you.",
                function() {
                  return score > 9000000000;
}, null);

// Mouse stuff
register_achievement("Nonsense of game design", "step", "images/game/mainmenu.gif",
                "LOLOLOLOLOL",
                "You just found the main menu, probably",
                function() {
                   return menu == "main";
}, null);

register_achievement("Trigonometric madness", "step", "images/game/trigomad.gif",
                "Spin the hand-weel around.. a 100 times",
                "Congrats, your finger is now permanently damaged",
                function () {
                   return Mouse.rotary >= 200;
}, null);

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
  call_trigger("score");
}

function spawn_floaty(int, posx, posy) {
  var fl = new floaty(int.toString(), posx, posy, 5, 30, '#ffffff', "20px Arial");
  if (int > 0) {
    fl.color = '#00FF00';
  } else {
    fl.color = '#FF0000';
  }
  floaties.push(fl);
}

// Now some drawing
function draw_mouse() {
  // Mouse stuff
  // From http://ncase.me/sight-and-light/

  var rad = fradius;
  if (Mouse.pressed) {
    rad = sradius;
    Mouse.rotary = (Mouse.rotary + 0.1) % 210;
  }

  ctx.fillStyle = "#ff2222";
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.arc(Mouse.x, Mouse.y, 3, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(Mouse.x, Mouse.y, rad, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.strokeStyle = "#ff2222"
  for (var angle=0; angle<Math.PI*2; angle+=(2*Math.PI)/surround) {
    var dx = Math.cos(angle + Mouse.rotary * Math.PI) * rad;
    var dy = Math.sin(angle + Mouse.rotary * Math.PI) * rad;
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
    if (combo > 1) {
      var fl = new floaty("Combo reset..", Mouse.x, Mouse.y, 5, 30, '#FF00FF', "20px Arial");
      floaties.push(fl);
    }
    combo = 0;
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
  ctx.fillStyle = "#dddddd";
  ctx.fillRect(5, 5, canvas.width - 10, 30);
  //ctx.strokeType = "#222222";
  ctx.strokeRect(5, 5, canvas.width - 10, 30);
  if (score >= 0) {
    ctx.fillStyle = "#2277ff";
    ctx.fillText(score.toString(), canvas.width / 2, 27);
  }
}

function draw_sound() {
  ctx.fillStyle = "#dddddd";
  ctx.fillRect(5, canvas.height - 35, canvas.width - 45, 30);
  ctx.strokeRect(5, canvas.height - 35, canvas.width - 45, 30);
  if (nowPlaying >= 0) {
    ctx.fillStyle = "#2277ff";
    ctx.fillText("Now Playing : " + audio_titles[nowPlaying], canvas.width / 2 - 45, canvas.height - 13);
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

function draw_menu_button() {
  if (!menuButtonHovered) {
    ctx.fillStyle = '#dddddd';
  } else if (!Mouse.pressed) {
    ctx.fillStyle = '#dddd22';
  } else {
    ctx.fillStyle = '#dd2222';
    if (!triggerLock) {
       if (menu == "main") {
         menu = "";
         bgm.play();
      } else if (menu == "") {
         menu = "main";
         bgm.pause();
      }
      triggerLock = true;
    }
  }

  draw_element(menuButton, 0, 0);
  ctx.fillStyle = '#dddddd';
}

function draw_element(tab, x_off, y_off) {
  for (var i = 0; i < tab.length; i++) {
    if (tab[i][0] == "rect") {
      ctx.fillRect(tab[i][1]+x_off, tab[i][2]+y_off, tab[i][3], tab[i][4]);
      ctx.strokeRect(tab[i][1]+x_off, tab[i][2]+y_off, tab[i][3], tab[i][4]);
    } else if (tab[i][0] == "line") {
      ctx.beginPath();
      ctx.moveTo(tab[i][1]+x_off, tab[i][2]+y_off);
      ctx.lineTo(tab[i][1]+x_off + tab[i][3], tab[i][2]+y_off + tab[i][4]);
      ctx.stroke();
    } else if (tab[i][0] == "text") {
      var oldfont = ctx.font;
      ctx.font = tab[i][4];
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fillText(tab[i][1], tab[i][2]+x_off, tab[i][3]+y_off);
      ctx.strokeText(tab[i][1], tab[i][2]+x_off, tab[i][3]+y_off);
      ctx.fillStyle = "#ddddd";
      ctx.font = oldfont;
    } else if (tab[i][0] == "canvas") {
      draw_element(tab[i][5], tab[i][1], tab[i][2]);
    } 
  }
}

function draw_main_menu() {
  ctx.fillStyle = '#dddddd';
  draw_element(mainMenu, 0, 0);
}

function draw_ach() {
  if (showQueue.length == 0) {return;}
  
  var slider = showQueue[0];
  if (slider.state == "dead") {showQueue.shift(); return;}
  slider.elapsed += 1;
  var comp = slider.component();
  var moo = new color(0, 0, 0);
  moo.decs(ctx.strokeStyle);
  draw_element([comp], 0, 0);
  ctx.fillStyle = "#dddddd";
}

function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = bg.hex();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!menu) {
    // Enemies
    if (Math.random() < 0.3) {
      // New enemy at random coords
      var en = new enemy();
      en.spawn();
      enemies.push(en);
    }

    // Draw enemies
    draw_enemies();
  } else if (menu == "main") {
    draw_main_menu();
  }

  // Score
  draw_score();

  // Now Playing
  draw_sound();

  // Menu button
  draw_menu_button();
  
  // Achievements
  draw_ach();

  if (!menu) {
    // Draw floaties
    draw_floaties();
  }

  // Mouse
  draw_mouse();
  
  call_trigger("step");
}

function drawLoop() {
  requestAnimationFrame(drawLoop);
  draw();
}

canvas.onmousemove = function (event) {
  Mouse.x = event.clientX;
  Mouse.y = event.clientY;
  Mouse.rotary = (Mouse.rotary - 0.05);
  if (Mouse.rotary < -2) {
    Mouse.rotary = Mouse.rotary % 2; // this way we don't reset wheeling
  }

  if (Mouse.x > menuButton[0][1] && Mouse.x < menuButton[0][1] + menuButton[0][3] &&
      Mouse.y > menuButton[0][2] && Mouse.y < menuButton[0][2] + menuButton[0][4]) {
    menuButtonHovered = true;
  } else if (menuButtonHovered) {
    menuButtonHovered = false;
  }
}

canvas.onmousedown = function(event) {
  if (menu) {
    if (Mouse.x > canvas.width / 16 * 7.5 && Mouse.x < canvas.width / 16 * 8.5 && Mouse.y > canvas.height / 2 - 15 && Mouse.y < canvas.height / 2 + 30) {
      // PLAY!
      menu = "";
      score = 0;
      return;
    }
  }

  Mouse.pressed = true;
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
    var fl = new floaty("Overlap! * " + overlap.toString(), Mouse.x, Mouse.y, 5, 30, '#0000FF', "20px Arial Bold");
    floaties.push(fl);
  } else if (overlap > 0 && combo > 1) {
    var fl = new floaty("Combo " + combo.toString() + "!", Mouse.x, Mouse.y, 5, 30, '#00FFFF', "20px Arial");
    floaties.push(fl);
  }
  
  call_trigger("mousedown");
}

canvas.onmouseup = function(event) {
  Mouse.pressed = false;
  triggerLock = false;
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
  //this.sound.setAttribute("type", "audio/mpeg");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.start = function() {
    nowPlaying = Math.floor(Math.random() * sounds.length);
    this.sound.src = sounds[nowPlaying];
    this.sound.play();
  };
  this.play = function() {
    this.sound.play();
  }
  this.pause = function() {
    this.sound.pause();
  }
  this.sound.onended = function() {
    bgm = new bgm_music();
    bgm.start();
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

    // Menu button
    draw_menu_button();

    // Banner
    draw_banner();

    // Play Button
    ctx.fillStyle = "#ff6600";
    ctx.fillRect(canvas.width / 16 * 7.5, canvas.height / 2 - 15, canvas.width / 16, 30);
    ctx.fillStyle = "#222288";
    ctx.fillText("Play", canvas.width / 2, canvas.height / 2 + 5);

    // Mouse
    draw_mouse();


  } else {
    // Let's start the game!
    bgm = new bgm_music(-1);
    bgm.start();
    drawLoop();
  }
}


window.onload = function() {
  waitMenu();
}
