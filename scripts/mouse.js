"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.92

/*
        Mouse

        Dependencies :
         - Gamedata : squish.VisualSwap
         - Colors : squish.colors.mouseCenter, squish.colors.mouseRotor, squish.colors.mouseCircle
         - Clickable : squish.clickable.register
         - Triggers : squish.triggers.call
*/

squish.mouse = (function() {
        // Mouse
        var mod = {
          y: squish.canvas.width / 2,
          x: squish.canvas.height / 2,
          rotary: 0,
          pressed: false,
          hovering: "",
          clicked: "",
          surround: 0,
          fradius: 15,
          sradius: 6,
        };

        // Lag profile : { max: 7, min: 0, avg: 0.6178845171180388, cnt: 9785 }
        mod.draw = function() {
                // Mouse stuff
                // From http://ncase.me/sight-and-light/

                var rad = mod.fradius;
                if (mod.pressed) {
                        rad = mod.sradius;
                        mod.rotary = (mod.rotary + 0.1) % 210;
                }

                squish.VisualSwap.setSecondFill(squish.colors.mouseCenter);
                squish.VisualSwap.setSecondStroke(squish.colors.mouseCircle);
                squish.VisualSwap.useSecondFill();
                squish.VisualSwap.useSecondStroke();

                squish.ctx.beginPath();
                squish.ctx.arc(mod.x, mod.y, 3, 0, 2 * Math.PI, false);
                squish.ctx.fill();
                squish.ctx.beginPath();
                squish.ctx.arc(mod.x, mod.y, rad, 0, 2 * Math.PI);
                squish.ctx.stroke();

                squish.VisualSwap.setSecondFill(squish.colors.mouseRotor);
                squish.VisualSwap.useSecondFill();
                squish.VisualSwap.setSecondStroke(squish.colors.mouseRotor);
                squish.VisualSwap.useSecondStroke();

                var angle = 0
                for (var i = 0; i < mod.surround; i+=1) {
                        var dx = Math.cos(angle + mod.rotary * Math.PI) * rad;
                        var dy = Math.sin(angle + mod.rotary * Math.PI) * rad;
                        squish.ctx.beginPath();
                        squish.ctx.arc(mod.x+dx, mod.y+dy, 2, 0, 2 * Math.PI, false);
                        squish.ctx.stroke();
                        squish.ctx.fill();
                        angle+=(2*Math.PI)/mod.surround;
                }
        };

        // Callbacks
        mod.onmousemove = function(event) {
                mod.x = event.clientX;
                mod.y = event.clientY;
                mod.rotary = (mod.rotary - 0.05);
                if (mod.rotary < -2) {
                        mod.rotary = mod.rotary % 2; // this way we don't reset wheeling
                }

                squish.triggers.call("mousemove");
        };


        mod.onmousedown = function(event) {
                mod.pressed = true;
                // Check clickables first

                if (mod.hovering) {
                        mod.clicked = mod.hovering;
                        if (squish.clickable.areas[mod.clicked].on_click) {
                                squish.clickable.areas[mod.clicked].on_click();
                        }
                }
                squish.triggers.call("mousedown");
        };


        mod.onmouseup = function(event) {
                mod.pressed = false;
                if (mod.clicked != "") {
                        if (squish.clickable.areas[mod.clicked].on_release) {
                                squish.clickable.areas[mod.clicked].on_release();
                        }
                        mod.clicked = "";
                }
                squish.triggers.call("mouseup");
        };

        squish.canvas.onmouseup = mod.onmouseup; // Lag : Avg 0.18ms on 1520
        squish.canvas.onmousedown = mod.onmousedown; // Lag : Avg 0.51ms on 1052
        // Lag profile : { max: 1, min: 1, avg: 0.05450070323488043, cnt: 2844 }
        squish.canvas.onmousemove = mod.onmousemove;

        return mod;
}());
