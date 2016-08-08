"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.91

/*
        Floaties

        Dependencies :
         - Colors : squish.colors.white, squish.colors.negativeScoreFloaty, squish.colors.positiveScoreFloaty
         - Gamedata : squish.VisualSwap
*/

squish.floaties = (function() {
        var mod = {};
        var floaties = [];

        mod.floaty = function(text, posx, posy, speed, lifespan, color, font, show_condition) {
                this.text = text || "";
                this.posx = posx;
                this.posy = posy;
                this.speed = speed || 15;
                this.lifespan = lifespan || 200;
                this.font = font || squish.ctx.font;
                this.color = color || squish.colors.white;
                this.condition = show_condition || function() {return true;};
                this.dead = false;

                this.spawn = function() {
                        floaties.push(this);
                }

                this.draw = function() {
                        if (this.dead || !this.condition()) {return;}

                        squish.VisualSwap.setSecondFont(this.font);
                        squish.VisualSwap.useSecondFont();
                        squish.VisualSwap.setSecondFill(this.color);
                        squish.VisualSwap.useSecondFill();

                        squish.ctx.fillText(this.text, this.posx, this.posy);

                        squish.VisualSwap.useMainFont();
                        squish.VisualSwap.useMainFill();

                        this.posy -= this.speed;
                        this.lifespan -= 1;
                        if (this.lifespan == 0) {
                                this.dead = true;
                        }
                }
        };

        mod.spawn = function(int, posx, posy) {
                var fl = new mod.floaty(int.toString(), posx, posy, 5, 30, squish.colors.white, "20px Arial", function() {return squish.gamedata.menu != "main";});
                if (int > 0) {
                        fl.color = squish.colors.positiveScoreFloaty;
                } else {
                        fl.color = squish.colors.negativeScoreFloaty;
                }
                fl.spawn();
        };

        mod.draw = function() {
                for (var i = 0; i < floaties.length; i++) {
                        if (floaties[i].dead) {
                                floaties.splice(i, 1);
                        } else {
                                floaties[i].draw();
                        }
                }
        };

        return mod;
}());
