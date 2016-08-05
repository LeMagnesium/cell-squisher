"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.91

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
    last_cookie_save: 0,
    now: 0,
}

// Config trash
var Config = {
  extrafloaties: true,
  theme: "day",
}





// Registered bitmaps go in there
var images = [];

// Registered clickable areas to go there
var clickable = [];


// Mouse
var surround = 6;
var fradius = 15;
var sradius = 6;

var Mouse = {
  y: canvas.width / 2,
  x: canvas.height / 2,
  rotary: 0,
  pressed: false,
  hovering: "",
  clicked: "",
};

// VisualSwap
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


// Other misc definitions
var bg = new color(255, 255, 255);

VisualSwap.setMainFont("20px Arial");
VisualSwap.useMainFont();
VisualSwap.setMainFill(squish.colors.mainMenuFill);
VisualSwap.useMainFill();
VisualSwap.setMainStroke(squish.colors.mainMenuStroke);
VisualSwap.useMainStroke();
ctx.textAlign = "center";

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

/*
 *      Definitions of global data
 */


/* Game Assets*/

// Slider show Queue
var showQueue = [];


/* Visuals */
// Color class
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
    str += squish.hexa.dechex(this.red);
    str += squish.hexa.dechex(this.green);
    str += squish.hexa.dechex(this.blue);
    return str;
  }

  this.decs = function(col) {
    this.red = squish.hexa.hexdec(col.slice(1, 3));
    this.green = squish.hexa.hexdec(col.slice(3, 5));
    this.blue = squish.hexa.hexdec(col.slice(5, 7));
  }
}

// Current color scheme/theme
window.toggle_theme = function() {
        if (Config.theme == "day") {
                // Switch to night
                squish.colors.mainMenuFill = '#111111';
                squish.colors.mainMenuStroke = '#00f000';
                Config.theme = "night";
        } else if (Config.theme == "night") {
                // Switch to day
                squish.colors.mainMenuFill = '#dddddd';
                squish.colors.mainMenuStroke = '#f00000';
                Config.theme = "day";
        }
}

/* ACHIEVEMENTS */
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
                    fill: squish.colors.mainMenuFill,
                    stroke: squish.colors.mainMenuStroke,
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

/* CLICKABLE AREAS */
function clickable_area(name, posx, posy, endx, endy, action) {
        this.name = name;
        this.start = {x: posx, y: posy};
        this.end = {x: endx, y: endy};
        this.action = action;
        this.active = false;
}

// Clickable areas stuff
function register_clickable_area(def) {
        clickable[def.name] = def;
}

function enable_clickable_area(name) {
        if (clickable[name]) {
                clickable[name].active = true;
                if (clickable[name].on_enable) {
                        clickable[name].on_enable();
                }
        }
}

function disable_clickable_area(name) {
        if (clickable[name]) {
                clickable[name].active = false;
                if (clickable[name].on_disable) {
                        clickable[name].on_disable();
                }
        }
}

function delete_clickable_area(name) {
        delete clickable[name];
}

/* ELEMENTS */
// Graphical elements
var MenuButton = [
    {
        class: "rect",
        xorg: canvas.width - 35,
        yorg: canvas.height - 35,
        width: 30,
        height: 30,
        visuals: {
                live: true,
                fill: function() {
                        return squish.colors.mainMenuFill;
                },
        }
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
                        live: true,
                        stroke: function() {return squish.colors.mainMenuStroke;},
                        fill: function() {return squish.colors.mainMenuFill;},
                }
        },
        {
                class: "line",
                xorg: canvas.width/2,
                yorg: 40,
                width: 0,
                height: canvas.height - 80,
                visuals: {
                        live: true,
                        stroke: function() {return squish.colors.mainMenuStroke;},
                }
       },
       {
                class: "rect",
                xorg: 10,
                yorg: canvas.height - 80,
                width: canvas.width / 2 - 15,
                height: 35,
                visuals: {
                        live: true,
                        stroke: function() {return "#33cfdf";},
                        fill: function() {return squish.colors.cookieSaverFill},
               }
       },
       {
               class: "text",
               xorg: canvas.width / 4 - 2.5,
               yorg: canvas.height - 55,
               text: "Save game data",
               visuals: {
                       fill: "#000000",
                       stroke: "#003322"
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
                live: true,
                fill: function() {return squish.colors.mainMenuFill;},
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
            fill: squish.colors.textFill,
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
                live: true,
                fill: function() {return squish.colors.mainMenuFill;},
        }
    },
    {
        class: "text",
        live: true,
        xorg: canvas.width / 2 - 45,
        yorg: canvas.height - 13,
        stroke: false,
        text: function() {
                var np = squish.assets.now_playing();
                if (np.path == "") { return ""; }
                return "Now Playing : " + np.title;
        },
        visuals: {
            fill: squish.colors.textFill,
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
                live: true,
                fill: function() {return squish.colors.mainMenuFill;},
                stroke: function() {return squish.colors.mainMenuStroke;},
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
                        live: true,
                        fill: function() {
                                if (Mouse.clicked == "StartButton") {
                                        return squish.colors.startButtonPressedFill;
                                } else {
                                        return squish.colors.startButtonFill;
                                }
                        }
                }
        },
        {
                class: "text",
                text: "Play",
                xorg: canvas.width / 2,
                yorg: canvas.height / 2 + 5,
                stroke: false,
                visuals: {
                        fill: squish.colors.startButtonLabel,
                }
        }
];

// Draw elements
function draw_element(tab) {
    for (var i = 0; i < tab.length; i++) {
        var obj = tab[i];

        if (obj.visuals) {
            if (obj.visuals.stroke) {
                if (obj.visuals.stroke == "currentFill") {
                        VisualSwap.setSecondStroke(ctx.fillStyle);
                } else if (obj.visuals.live) {
                        VisualSwap.setSecondStroke(obj.visuals.stroke());
                } else {
                        VisualSwap.setSecondStroke(obj.visuals.stroke);
                }
                VisualSwap.useSecondStroke();
            }
            if (obj.visuals.fill) {
                if (obj.visuals.fill == "currentStroke") {
                    VisualSwap.setSecondFill(ctx.strokeStyle);
                } else if (obj.visuals.live) {
                        VisualSwap.setSecondFill(obj.visuals.fill());
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

        } else if (obj.class == "image") {
                ctx.drawImage(squish.assets.get_image(obj.src), // img
                                obj.xorg, obj.yorg, // x, y
                                obj.width, obj.height // width height
                                );
        }

        VisualSwap.useMainFont();
        VisualSwap.useMainFill();
        VisualSwap.useMainStroke();
    }
}

/* Enemies */
/// Enemy
// Enemy class
function enemy() {
  this.posx = Math.random() * canvas.width;
  this.posy = Math.random() * (canvas.height-70) + 35;
  this.health = Math.ceil(Math.random()) * 120 + 200;
  this.color = new color();
  this.border_color = new color();
  this.squished = false;
  this.balance = -10;
  this.spawn = function() {
    this.color.red = Math.ceil(Math.random() * 255);
    this.color.green = Math.ceil(Math.random() * 255);
    this.color.blue = Math.ceil(Math.random() * 255);

    this.border_color = this.color.get_dark().hex();
    this.color = this.color.hex(); // Overwrite
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
                        spawn_floaty(enemies[i].balance, enemies[i].posx, enemies[i].posy);
                        // The balance is only added now if the cell dies of natural causes; otherwise score has been added progressively
                        if (!enemies[i].squished) {
                                increase_score(enemies[i].balance, true);
                        }
                        enemies.splice(i, 1);
                } else if (enemies[i].squished) {
                        nosquish = false;
                }
        }

        // Combo reset if no pellet squished
        if (GameData.combo > 0 && nosquish) {
                if (GameData.combo > 1) {
                        var fl = new floaty("Combo reset..", Mouse.x, Mouse.y, 5, 30, squish.colors.comboReset, "20px Arial");
                        floaties.push(fl);
                }
                GameData.combo = 0;
        }

        for (var i=0; i<enemies.length; i++) {
                if (enemies[i].health > 0) {draw_enemy(enemies[i]);}
                if (enemies[i].squished) {
                        // The cell slowly shrinks and dies. "Slowly"
                        var h = Math.floor(Math.random() * 10);
                        var n = increase_score(h);
                        enemies[i].health -= h;
                        enemies[i].balance += n;
                }
                enemies[i].health -= Math.ceil(Math.random() * 4);
        }
}

/* Floaties! */
// Floaties
function floaty(text, posx, posy, speed, lifespan, color, font) {
    this.text = text || "";
    this.posx = posx;
    this.posy = posy;
    this.speed = speed || 15;
    this.lifespan = lifespan || 200;
    this.font = font || ctx.font;
    this.color = color || squish.colors.white;
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

function spawn_floaty(int, posx, posy) {
  var fl = new floaty(int.toString(), posx, posy, 5, 30, squish.colors.white, "20px Arial");
  if (int > 0) {
    fl.color = squish.colors.positiveScoreFloaty;
  } else {
    fl.color = squish.colors.negativeScoreFloaty;
  }
  floaties.push(fl);
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

/* Score */
function increase_score(int, raw) {
        if (GameData.combo > 1 && !raw) {
                int *= GameData.combo;
        }
        GameData.score += int;

        if (GameData.score < 0) {
                GameData.score = 0;
        }
        squish.triggers.call("score");
        return int;
}

/* Menu things (main and wait) */
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
    squish.triggers.call("start");
    enable_clickable_area("ToMenuButton");
    delete_clickable_area("StartButton");

    drawLoop();
  }
}

function draw_menu_button() {
    if (!menuButtonHovered) {
        VisualSwap.setSecondFill(squish.colors.mainMenuFill);
    } else if (!Mouse.pressed) {
        VisualSwap.setSecondFill(squish.colors.menuButtonHovered);
    } else {
        VisualSwap.setSecondFill(squish.colors.menuButtonPressed);
        if (!triggerLock) {
            if (GameData.menu == "main") {
                squish.assets.pause_bgm();//bgm.play();
            } else if (GameData.menu == "") {
                squish.assets.start_bgm();//bgm.pause();
            }
            triggerLock = true;
        }
        VisualSwap.setMainFill(squish.colors.mainMenuFill);
        VisualSwap.setMainStroke(squish.colors.mainMenuStroke);
    }

    VisualSwap.useSecondFill();
    draw_element(MenuButton);
    VisualSwap.useMainFill();
    VisualSwap.useMainStroke();
}

/* Mouse methods and data */
// Mouse stuff
function draw_mouse() {
    // Mouse stuff
    // From http://ncase.me/sight-and-light/

    var rad = fradius;
    if (Mouse.pressed) {
        rad = sradius;
        Mouse.rotary = (Mouse.rotary + 0.1) % 210;
    }

    VisualSwap.setSecondFill(squish.colors.mouseCenter);
    VisualSwap.setSecondStroke(squish.colors.mouseCircle);
    VisualSwap.useSecondFill();
    VisualSwap.useSecondStroke();

    ctx.beginPath();
    ctx.arc(Mouse.x, Mouse.y, 3, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(Mouse.x, Mouse.y, rad, 0, 2 * Math.PI);
    ctx.stroke();

    VisualSwap.setSecondFill(squish.colors.mouseRotor);
    VisualSwap.useSecondFill();
    VisualSwap.setSecondStroke(squish.colors.mouseRotor);
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

// Callbacks
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
        Mouse.pressed = true;
        // Check clickables first
        for (name in clickable) {
                if (!clickable[name].active) {continue;}
                if (Mouse.x < clickable[name].start.x - sradius) {continue;}
                if (Mouse.x > clickable[name].end.x + sradius) {continue;}
                if (Mouse.y < clickable[name].start.y - sradius) {continue;}
                if (Mouse.y > clickable[name].end.y + sradius) {continue;}

                if (clickable[name].on_click) {
                        clickable[name].on_click();
                }
                Mouse.clicked = name;
                break;
        }

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
        enemies[i].balance = 0; // this will be filled as the cell shrinks and dies

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

        enemies[i].color = squish.colors.deadEnemy;
        increase_score(GameData.overlap * 50, enemies[i].posx, enemies[i].posy);
        if (GameData.overlap > 0) {
            spawn_floaty(GameData.overlap * 50, enemies[i].posx, enemies[i].posy);
        }
        GameData.combo += 1;
        GameData.overlap += 1;
    }
    if (GameData.overlap > 1) {
        var fl = new floaty("Overlap! * " + GameData.overlap.toString(), Mouse.x, Mouse.y, 5, 30, squish.colors.overlapTag, "20px Arial Bold");
        floaties.push(fl);
    } else if (GameData.overlap > 0 && GameData.combo > 1) {
        var fl = new floaty("Combo " + GameData.combo.toString() + "!", Mouse.x, Mouse.y, 5, 30, squish.colors.comboTag, "20px Arial");
        floaties.push(fl);
    }

    squish.triggers.call("mousedown");
}

canvas.onmouseup = function(event) {
    Mouse.pressed = false;
    triggerLock = false;
    if (Mouse.clicked != "") {
            if (clickable[Mouse.clicked].on_release) {
                    clickable[Mouse.clicked].on_release();
            }
            Mouse.clicked = "";
    }
}



// Bake us a cookie


// NOW CUSTOM DEFINITIONS USING THOSE PREVIOUS CLASS/METHODS //


// Achievement garbage



function cycle_through() {
  for (var i = 0; i < achievements.length; i++) {
    achievements[i].runthrough();
    achievements[i].check();
  }
}



// Clickable areas
register_clickable_area({
        name: "ToMenuButton",
        start: {x: MenuButton[0].xorg, y: MenuButton[0].yorg},
        end: {
                x: MenuButton[0].xorg + MenuButton[0].width,
                y: MenuButton[0].yorg + MenuButton[0].length,
        },
        on_click: function() {
                GameData.menu = "main";
                disable_clickable_area("ToMenuButton");
                enable_clickable_area("FromMenuButton");
                enable_clickable_area("SaveToCookie");
        }
});

register_clickable_area({
        name: "FromMenuButton",
        start: {x: MenuButton[0].xorg, y: MenuButton[0].yorg},
        end: {
                x: MenuButton[0].xorg + MenuButton[0].width,
                y: MenuButton[0].yorg + MenuButton[0].length,
        },
        on_click: function() {
                GameData.menu = "";
                disable_clickable_area("FromMenuButton");
                disable_clickable_area("SaveToCookie");
                enable_clickable_area("ToMenuButton");
        }
});

register_clickable_area({
        name: "StartButton",
        start: {x: canvas.width / 16 * 7.5, y: canvas.height / 2 - 15},
        end: {x: canvas.width / 16 * 8.5, y: canvas.height / 2 + 30},
        on_release: function() {
                // PLAY!
                GameData.menu = "";
                GameData.score = 0;
        }
});

register_clickable_area({
        name: "SaveToCookie",
        start: {x: 10, y: 32},
        end: {x: canvas.width / 2 - 5, y: canvas.height - 45},
        on_disable: function() {
                squish.colors.cookieSaverFill = '#666666';
        },
        on_enable: function() {
                squish.colors.cookieSaverFill = '#db4540';
        },
        on_click: function() {
                // call compose_cookie
                showQueue.push(new slider_component("rtl", canvas.width, canvas.height - 150, 250, 110, 20, 150, [
/*                        {
                                class: "image",
                                src: ach.icon,
                                xorg: 93,
                                yorg: 13,
                                width: 64,
                                height: 64
                        },
                        {
                                class: "rect",
                                xorg: 93,
                                yorg: 13,
                                width: 64,
                                height: 64,
                                fill: false,
                                visuals: {
                                        stroke: squish.colors.red,
                                }
                        },*/
                        {
                                class: "text",
                                text: "Data saved!",
                                xorg: 125,
                                yorg: 100,
                                stroke: true,
                                visuals: {
                                        fill: "currentStroke",
                                        font: "20px Arial",
                                }
                        }]));

                GameData.last_cookie_save = new Date().getTime();
                disable_clickable_area("SaveToCookie");
        }
})


function draw() {
        // Update game clock
        GameData.now = new Date().getTime();

        if (GameData.menu == "main" && !clickable["SaveToCookie"].active && GameData.now - GameData.last_cookie_save > 90000) {
                enable_clickable_area("SaveToCookie");
        }

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = bg.hex();
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!GameData.menu) {
                // Enemies
                if (Math.random() < 0.5) {
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
    squish.achievements.draw();

    if (!GameData.menu) {
        // Draw floaties
        draw_floaties();
    }

    // Mouse
    draw_mouse();

    squish.triggers.call("step");
}

function drawLoop() {
    requestAnimationFrame(drawLoop);
    draw();
}

window.onload = function() {
//    register_images();
    enable_clickable_area("StartButton");
    drawWaitMenu();
    squish.triggers.call("load");
}
