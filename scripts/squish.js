"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.9

var canvas = document.getElementById('canvas0');
var ctx = canvas.getContext('2d');
var enemies = [];
var floaties = [];
var MaxColoursAllowed = 255 * 255 * 255;
var menuButtonHovered = false;
var triggerLock = false;

var version = 0.9;

// Game Data
var GameData = {
    score: -1,
    combo: 0,
    menu: "start",
    overlap: 0,
}

// Config trash
var Config = {
  extrafloaties: true,
}

// Colors and Visuals
// Colors
var colors = {
    mainMenuFill: '#dddddd',
    mainMenuStroke: '#f00000',

    menuButtonHovered: '#dddd22',
    menuButtonPressed: '#dd2222',

    deadEnemy: '#000000',

    overlapTag: '#0000ff',
    comboTag: '#00ffff',
    textFill: '#2277ff',

    startButtonFill: '#ff6600',
    startButtonLabel: '#222288',

    positiveScoreFloaty: '#00ff00',
    negativeScoreFloaty: '#ff0000',

    mouseCenter: '#ff0000',
    mouseRotor: '#ff2222',
    mouseCircle: '#000000',

    // Some defaults
    red: '#ff0000',
    green: '#00ff00',
    blue: '#0000ff',
    yellow: '#ffff00',
    magenta: '#ff00ff',
    cyan: '#00ffff',
    black: '#000000',
    white: '#ffffff',
};

// Color and font swapper
var VisualSwap = {
    fill: "#000000",
    stroke: "#000000",
    secfill: "#ffffff",
    secstroke: "#ffffff",
    font: "Arial 20px",
    secfont: "Arial 14px",

    usedFill: true, // true for Main, false for Second
    usedStroke: true, // same
    usedFont: true, // same

    setMainFill: function(col) {
	this.fill = col;
	if (this.usedFill) {
	    ctx.fillStyle = col;
	}
    },
    useMainFill: function() {
	this.usedFill = true;
	ctx.fillStyle = this.fill;
    },

    setSecondFill: function(col) {
	this.secfill = col;
	if (!this.usedFill) {
	    ctx.fillStyle = col;
	}
    },
    useSecondFill: function(col) {
	this.usedFill = false
	ctx.fillStyle = this.secfill;
    },

    setMainStroke: function(col) {
	this.stroke = col;
	if (this.usedStroke) {
	    ctx.strokeStyle = col;
	}
    },
    useMainStroke: function() {
	this.usedStroke = true;
	ctx.strokeStyle = this.stroke;
    },

    setSecondStroke: function(col) {
	this.secstroke = col;
	if (!this.usedStroke) {
	    ctx.strokeStyle = col;
	}
    },
    useSecondStroke: function(col) {
	this.usedStroke = false;
	ctx.strokeStyle = this.secstroke;
    },

    setMainFont: function(font) {
	this.font = font;
	if (this.usedFont) {
	    ctx.font = font;
	}
    },
    useMainFont: function() {
	this.usedFont = true;
	ctx.font = this.font;
    },

    setSecondFont: function(font) {
	this.secfont = font;
	if (!this.usedFont) {
	    ctx.font = font
	}
    },
    useSecondFont: function() {
	this.usedFont = false;
	ctx.font = this.font;
    },
};

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

// Images
var record_images = [
    "images/game/slayer.gif",
    "images/game/gt9000.gif",
    "images/game/steve.gif",
    "images/game/genocide.gif",
    "images/game/mainmenu.gif",
    "images/game/trigonomad.gif",
    "images/game/king_combo.gif",
    "images/game/collateral.gif",
];

// Registered bitmaps go in there
var images = [];

// Graphical elements
var MenuButton = [
    {
	class: "rect",
	xorg: canvas.width - 35,
	yorg: canvas.height - 35,
	width: 30,
	height: 30,
    },
    {
	class: "line",
	xorg: canvas.width - 30,
	yorg: canvas.height - 13,
	width: 20,
	height: 0,
    },
    {
	class: "line",
	xorg: canvas.width - 30,
	yorg: canvas.height - 20,
	width: 20,
	height: 0,
    },
    {
	class: "line",
	xorg: canvas.width - 30,
	yorg: canvas.height - 27,
	width: 20,
	height: 0,
    }
]

var MainMenu = [
    {
	class: "rect",
	xorg: 5,
	yorg: 40,
	width: canvas.width - 10,
	height: canvas.height - 80,
	visuals: {
	    stroke: colors.mainMenuStroke,
	    fill: colors.mainMenuFill,
	}
    },
    {
	class: "line",
	xorg: canvas.width/2,
	yorg: 40,
	width: 0,
	height: canvas.height - 80,
	visuals: {
	    stroke: colors.mainMenuStroke,
	}
    }
]

var ScoreBar = [
    {
	class: "rect",
	xorg: 5,
	yorg: 5,
	width: canvas.width - 10,
	height: 30,
	visuals: {
	    fill: colors.mainMenuFill,
	}
    },
    {
	class: "text",
	live: true,
	xorg: canvas.width / 2,
	yorg: 27,
	stroke: false,
	text: function() {
	    if (GameData.score == -1) { return ""; }
	    return GameData.score.toString();
	},
	visuals: {
	    fill: colors.textFill,
	}
    }
];

var AudioBar = [
    {
	class: "rect",
	xorg: 5,
	yorg: canvas.height - 35,
	width: canvas.width - 45,
	height: 30,
	visuals: {
	    fill: colors.mainMenuFill,
	}
    },
    {
	class: "text",
	live: true,
	xorg: canvas.width / 2 - 45,
	yorg: canvas.height - 13,
	stroke: false,
	text: function() {
	    if (nowPlaying == -1) {return ""}
	    return "Now Playing : " + audio_titles[nowPlaying];
	},
	visuals: {
	    fill: colors.textFill,
	    font: "Arial 24px",
	}
    },
];

var Banner = [
    {
	class: "rect",
	xorg: 0,
	yorg: canvas.height / 2 - 45,
	width: canvas.width,
	height: 90,
	visuals: {
	    fill: colors.mainMenuFill,
	    stroke: colors.mainMenuStroke,
	}
    },
];

var StartButton = [
    {
	class: "rect",
	xorg: canvas.width / 16 * 7.5,
	yorg: canvas.height / 2 - 15,
	width: canvas.width / 16,
	height: 30,
	visuals: {
	    fill: colors.startButtonFill,
	}
    },
    {
	class: "text",
	text: "Play",
	xorg: canvas.width / 2,
	yorg: canvas.height / 2 + 5,
	stroke: false,
	visuals: {
	    fill: colors.startButtonLabel,
	}
    }
];

// Triggers
var triggers = [];

// Achievements
var achievements = []
var showQueue = [];

// Classes
function enemy() {
  this.posx = Math.random() * canvas.width;
  this.posy = Math.random() * (canvas.height-70) + 35;
  this.health = Math.ceil(Math.random()) * 100 + 200;
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
    this.color = color || colors.white;
    this.dead = false;

    this.draw = function() {
	if (this.dead) {return;}

	VisualSwap.setSecondFont(this.font);
	VisualSwap.useSecondFont();
	VisualSwap.setSecondFill(this.color);
	VisualSwap.useSecondFill();

	ctx.fillText(this.text, this.posx, this.posy);

	VisualSwap.useMainFont();
	VisualSwap.useMainFill();

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
	    children.unshift({
		class: "rect",
		xorg: 0,
		yorg: 0,
		width: width,
		height: length,
		visuals: {
		    fill: colors.mainMenuFill,
		    stroke: colors.mainMenuStroke,
		}
	    });
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

	return {
	    class: "canvas",
	    xorg: dx,
	    yorg: start_y,
	    width: width,
	    height: length,
	    children: this.children
	};
    }
}

// Other misc definitions
var bg = new color(255, 255, 255);

VisualSwap.setMainFont("20px Arial");
VisualSwap.useMainFont();
VisualSwap.setMainFill(colors.mainMenuFill);
VisualSwap.useMainFill();
VisualSwap.setMainStroke(colors.mainMenuStroke);
VisualSwap.useMainStroke();
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
	{
	    class: "image",
	    src: ach.icon,
	    xorg: 125,
	    yorg: 20
	},
	{
	    class: "text",
	    text: ach.name,
	    xorg: 125,
	    yorg: 100,
	    stroke: true,
	    visuals: {
		fill: "currentStroke",
		font: "20px Arial",
	    }
	}
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
                     function () { return GameData.score > 0; },
		     null);

register_achievement("Over 9000", "score", "images/game/gt9000.gif",
                     "Get 9000 of score. Yeah, lame.",
                     "Pretty easy, duh",
                     function () { return GameData.score > 9000; },
		     null);

register_achievement("A pet named Steve", "score", "images/game/steve.gif",
                     "Kudos if you get the reference. Reach a certain score (circa 3.6*10^6)",
                     "3,610,827 views in one week, good work",
                     function() { return GameData.score > 3610827; },
		     null);

register_achievement("Genocidal Rampage", "score", "images/game/genocide.gif",
		     "You wanted something hard, didn't you?",
                     "You have earned the lethal injection of salty water for destroying scientifical progress",
                     function() { return GameData.score > 9000000000; },
		     null);

// Mouse stuff
register_achievement("Nonsense of game design", "step", "images/game/mainmenu.gif",
                     "LOLOLOLOLOL",
                     "You just found the main menu, probably",
                     function() { return GameData.menu == "main"; },
		     null);


register_achievement("Trigonometric madness", "step", "images/game/trigomad.gif",
                     "Spin the hand-weel around.. a 100 times",
                     "Congrats, your finger is now permanently damaged",
                     function () { return Mouse.rotary >= 200; },
		     null);

// Plain weird
register_achievement("KING COMBO!", "step", "images/game/king_combo.gif",
		     "Get a 100 combo",
		     "Hypactivity, amirite?",
		     function () { return GameData.combo >= 100; },
		     null);

register_achievement("Collateral Damages", "mousedown", "images/game/collateral.gif",
		     "Get a 4 overlap or more",
		     "Squish: check",
		     function () { return GameData.overlap >= 4; },
		     null);



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
  if (GameData.combo > 1 && !raw) {
    int *= GameData.combo;
  }
  GameData.score += int;

  if (GameData.score < 0) {
    GameData.score = 0;
  }
  call_trigger("score");
}

function spawn_floaty(int, posx, posy) {
  var fl = new floaty(int.toString(), posx, posy, 5, 30, colors.white, "20px Arial");
  if (int > 0) {
    fl.color = colors.positiveScoreFloaty;
  } else {
    fl.color = colors.negativeScoreFloaty;
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

    VisualSwap.setSecondFill(colors.mouseCenter);
    VisualSwap.setSecondStroke(colors.mouseCircle);
    VisualSwap.useSecondFill();
    VisualSwap.useSecondStroke();

    ctx.beginPath();
    ctx.arc(Mouse.x, Mouse.y, 3, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(Mouse.x, Mouse.y, rad, 0, 2 * Math.PI);
    ctx.stroke();

    VisualSwap.setSecondFill(colors.mouseRotor);
    VisualSwap.useSecondFill();
    VisualSwap.setSecondStroke(colors.mouseRotor);
    VisualSwap.useSecondStroke();
    for (var angle=0; angle<Math.PI*2; angle+=(2*Math.PI)/surround) {
	var dx = Math.cos(angle + Mouse.rotary * Math.PI) * rad;
	var dy = Math.sin(angle + Mouse.rotary * Math.PI) * rad;
	ctx.beginPath();
	ctx.arc(Mouse.x+dx, Mouse.y+dy, 2, 0, 2 * Math.PI, false);
	ctx.stroke();
	ctx.fill();
    }
}

function draw_enemy(enemy, id, sum, sum2) {
    // FFFFFF is 255^3, so, a lot. We don't wanna compute that every time;
    VisualSwap.setMainFill(enemy.color);
    VisualSwap.useMainFill();
    VisualSwap.setMainStroke(enemy.border_color);
    VisualSwap.useMainStroke();
    ctx.beginPath();
    ctx.arc(enemy.posx, enemy.posy, enemy.health / 10, 0, 2 * Math.PI);
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
    if (GameData.combo > 0 && nosquish) {
	if (GameData.combo > 1) {
	    var fl = new floaty("Combo reset..", Mouse.x, Mouse.y, 5, 30, '#FF00FF', "20px Arial");
	    floaties.push(fl);
	}
	GameData.combo = 0;
    }

    for (var i=0; i<enemies.length; i++) {
	if (enemies[i].health > 0) {draw_enemy(enemies[i]);}
	if (enemies[i].squished) {
	    var h = Math.floor(Math.random() * 6);
	    increase_score(h);
	    enemies[i].health -= h;
	}
	enemies[i].health -= Math.ceil(Math.random() * 2);
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
	VisualSwap.setSecondFill(colors.mainMenuFill);
    } else if (!Mouse.pressed) {
	VisualSwap.setSecondFill(colors.menuButtonHovered);
    } else {
	VisualSwap.setSecondFill(colors.menuButtonPressed);
	if (!triggerLock) {
	    if (GameData.menu == "main") {
		GameData.menu = "";
		bgm.play();
	    } else if (GameData.menu == "") {
		GameData.menu = "main";
		bgm.pause();
	    }
	    triggerLock = true;
	}
	VisualSwap.setMainFill(colors.mainMenuFill);
	VisualSwap.setMainStroke(colors.mainMenuStroke);
    }

    VisualSwap.useSecondFill();
    draw_element(MenuButton);
    VisualSwap.useMainFill();
    VisualSwap.useMainStroke();
}

function draw_element(tab) {
    for (var i = 0; i < tab.length; i++) {
	var obj = tab[i];

	if (obj.visuals) {
	    if (obj.visuals.stroke) {
		if (obj.visuals.stroke == "currentFill") {
		    VisualSwap.setSecondStroke(ctx.fillStyle);
		} else {
		    VisualSwap.setSecondStroke(obj.visuals.stroke);
		}
		VisualSwap.useSecondStroke();
	    }
	    if (obj.visuals.fill) {
		if (obj.visuals.fill == "currentStroke") {
		    VisualSwap.setSecondFill(ctx.strokeStyle);
		} else {
		    VisualSwap.setSecondFill(obj.visuals.fill);
		}
		VisualSwap.useSecondFill();
	    }
	    if (obj.visuals.font) {
		VisualSwap.setSecondFont(obj.visuals.font);
		VisualSwap.useSecondFont();
	    }
	}

	if (obj.class == "rect") {
	    if (obj.stroke == null || obj.stroke == true) {
		ctx.strokeRect(obj.xorg, obj.yorg, obj.width, obj.height);
	    }

	    if (obj.fill == null || obj.fill == true) {
		ctx.fillRect(obj.xorg, obj.yorg, obj.width, obj.height);
	    }

	} else if (obj.class == "line") {
	    ctx.beginPath();
	    ctx.moveTo(obj.xorg, obj.yorg);
	    ctx.lineTo(obj.xorg + obj.width, obj.yorg + obj.height);
	    ctx.stroke();

	} else if (obj.class == "text") {
	    var txt;
	    if (obj.live == true) {
		txt = "" + obj.text();
	    } else {
		txt = obj.text;
	    }

	    if (obj.fill == null || obj.fill == true) {
		ctx.fillText(txt, obj.xorg, obj.yorg);
	    }
	    if (obj.stroke == null || obj.stroke == true) {
		ctx.strokeText(txt, obj.xorg, obj.yorg);
	    }

	} else if (obj.class == "canvas") {
	    // We translate 0, 0 to the canvas's origin point, then fix it
	    ctx.translate(obj.xorg, obj.yorg);
	    draw_element(obj.children);
	    ctx.translate(-obj.xorg, -obj.yorg);
	}

	VisualSwap.useMainFont();
	VisualSwap.useMainFill();
	VisualSwap.useMainStroke();
    }
}

function draw_ach() {
    if (showQueue.length == 0) {return;}

    var slider = showQueue[0];
    if (slider.state == "dead") {showQueue.shift(); return;}
    slider.elapsed += 1;
    var comp = slider.component();
    draw_element([comp]);
    VisualSwap.setMainFill(colors.mainMenuFill);
    VisualSwap.useMainFill();
}

function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = bg.hex();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!GameData.menu) {
	// Enemies
	if (Math.random() < 0.3) {
	    // New enemy at random coords
	    var en = new enemy();
	    en.spawn();
	    enemies.push(en);
	}

	// Draw enemies
	draw_enemies();
    } else if (GameData.menu == "main") {
	draw_element(MainMenu);
    }

    // Score
    draw_element(ScoreBar);

    // Now Playing
    draw_element(AudioBar);

    // Menu button
    draw_menu_button();

    // Achievements
    draw_ach();

    if (!GameData.menu) {
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

    if (Mouse.x > MenuButton[0].xorg && Mouse.x < MenuButton[0].xorg + MenuButton[0].width &&
	Mouse.y > MenuButton[0].yorg && Mouse.y < MenuButton[0].yorg + MenuButton[0].height) {
	menuButtonHovered = true;
    } else if (menuButtonHovered) {
	menuButtonHovered = false;
    }
}

canvas.onmousedown = function(event) {
    if (GameData.menu) {
	if (Mouse.x > canvas.width / 16 * 7.5 && Mouse.x < canvas.width / 16 * 8.5 && Mouse.y > canvas.height / 2 - 15 && Mouse.y < canvas.height / 2 + 30) {
	    // PLAY!
	    GameData.menu = "";
	    GameData.score = 0;
	    return;
	}
    }

    Mouse.pressed = true;
    GameData.overlap = 0;
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

	enemies[i].color = colors.deadEnemy;
	increase_score(GameData.overlap * 50, enemies[i].posx, enemies[i].posy);
	if (GameData.overlap > 0) {
	    spawn_floaty(GameData.overlap * 50, enemies[i].posx, enemies[i].posy);
	}
	GameData.combo += 1;
	GameData.overlap += 1;
    }
    if (GameData.overlap > 1) {
	var fl = new floaty("Overlap! * " + GameData.overlap.toString(), Mouse.x, Mouse.y, 5, 30, colors.overlapTag, "20px Arial Bold");
	floaties.push(fl);
    } else if (GameData.overlap > 0 && GameData.combo > 1) {
	var fl = new floaty("Combo " + GameData.combo.toString() + "!", Mouse.x, Mouse.y, 5, 30, colors.comboTag, "20px Arial");
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

// Waiting menu
function drawWaitMenu() {
  if (GameData.menu) {
    requestAnimationFrame(drawWaitMenu);

      // Menu
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = bg.hex();
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Score
      draw_element(ScoreBar);

      // Now Playing
      draw_element(AudioBar);

      // Menu button
      draw_element(MenuButton);

      // Banner
      draw_element(Banner);

      // Play Button
      draw_element(StartButton);

      // Mouse
      draw_mouse();


  } else {
    // Let's start the game!
    bgm = new bgm_music(-1);
    bgm.start();
    drawLoop();
  }
}

function register_images() {
    for (var i = 0; i < record_images.length; i++) {
	var im = new Image();
	im.src = record_images[i];
	images[record_images[i]] = im;
    }
}

window.onload = function() {
    register_images();

    drawWaitMenu();
}
