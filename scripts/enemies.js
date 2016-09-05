"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.94

/*
        Enemies

        Dependencies :
         - Colors : squish.colors.color
         - Gamedata : squish.VisualSwap
         - Floaties : squish.floaties.spawn
         - Triggers : squish.triggers.hook
*/

squish.enemies = (function() {
        var mod = {};
        const MaxColoursAllowed = 255 * 255 * 255;
        var enemies = [];

        mod.enemy = function() {
                this.posx = Math.random() * squish.canvas.width;
                this.posy = Math.random() * (squish.canvas.height-70) + 35;
                this.health = Math.ceil(Math.random()) * 170 + 200;
                this.color = new squish.colors.color();
                this.border_color = new squish.colors.color();
                this.squished = false;
                this.balance = -10;
                this.spawn = function() {
                        this.color.red = Math.ceil(Math.random() * 255);
                        this.color.green = Math.ceil(Math.random() * 255);
                        this.color.blue = Math.ceil(Math.random() * 255);

                        this.border_color = this.color.get_dark().hex();
                        this.color = this.color.hex(); // Overwrite
                        enemies.push(this);
                }
        };

        mod.draw_enemy = function(enemy, id, sum, sum2) {
                // FFFFFF is 255^3, so, a lot. We don't wanna compute that every time;
                squish.VisualSwap.setMainFill(enemy.color);
                squish.VisualSwap.useMainFill();
                squish.VisualSwap.setMainStroke(enemy.border_color);
                squish.VisualSwap.useMainStroke();
                squish.ctx.beginPath();
                squish.ctx.arc(enemy.posx, enemy.posy, enemy.health / 10, 0, 2 * Math.PI);
                squish.ctx.fill();
                squish.ctx.stroke();
        };

        mod.draw = function() {
                // Combo reset if no pellet squished
                // Lag : <1ms
                var somesquish = enemies.some(function(x){return x.squished;});
                if (squish.gamedata.combo > 0 && !somesquish) {
                        if (squish.gamedata.combo > 1) {
                                (new squish.floaties.floaty("Combo reset..", squish.mouse.x, squish.mouse.y, 5, 30, squish.colors.comboReset, "20px Arial", function() {return squish.gamedata.menu != "main";})).spawn();
                        }
			squish.gamedata.reset_combo();
		}

                // Cell decay
                // Lag : 7-18ms
                // HIGH LAG
                ////////////////////////////////////////////////////////////////
                for (var i=0; i<enemies.length; i++) {
                        // Grave shifting
                        if (enemies[i].health <= 0) {
                                squish.floaties.spawn(enemies[i].balance, enemies[i].posx, enemies[i].posy);
                                // The balance is only added now if the cell dies of natural causes; otherwise score has been added progressively
                                if (!enemies[i].squished) {
                                        squish.gamedata.increase_score(enemies[i].balance, true);
                                }
                                enemies.splice(i, 1);
                                continue;
                        }
                        mod.draw_enemy(enemies[i]);
                        if (enemies[i].squished) {
                                // The cell slowly shrinks and dies. "Slowly"
                                var h = Math.floor(Math.random() * 10);
                                var n = squish.gamedata.increase_score(h);
                                enemies[i].health -= h;
                                enemies[i].balance += n;
                        }
                        enemies[i].health -= Math.ceil(Math.random() * 4);
                }
                ////////////////////////////////////////////////////////////////
        };

        squish.triggers.hook("mousedown", function() {
                if (squish.gamedata.menu != "") {return;}
                squish.gamedata.overlap = 0;
                for (var i=0; i<enemies.length; i++) {
                        if (enemies[i].squished) {continue;}
                        var radius = enemies[i].health / 10;
                        // We want to return as soon as possible to avoid useless computing
                        if (squish.mouse.x < enemies[i].posx - radius - squish.mouse.sradius) {continue;} // Minus radius of hand
                        if (squish.mouse.x > enemies[i].posx + radius + squish.mouse.sradius) {continue;}
                        if (squish.mouse.y < enemies[i].posy - radius - squish.mouse.sradius) {continue;}
                        if (squish.mouse.y > enemies[i].posy + radius + squish.mouse.sradius) {continue;}

                        // We squished a pellet!
                        enemies[i].squished = true;
                        enemies[i].balance = 0; // this will be filled as the cell shrinks and dies

                        var col = new squish.colors.color();
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

                        squish.gamedata.combo += 1;
			squish.gamedata.combo_path.push([enemies[i].posx, enemies[i].posy, enemies[i].color]);
			enemies[i].color = squish.colors.deadEnemy;
                        squish.gamedata.increase_score(squish.gamedata.overlap * 50, enemies[i].posx, enemies[i].posy);
                        if (squish.gamedata.overlap > 0) {
                                squish.floaties.spawn(squish.gamedata.overlap * 50, enemies[i].posx, enemies[i].posy);
                        }
                       if (squish.gamedata.combo_path.length > 50) {
				squish.gamedata.combo_path.shift();
			}
                        squish.gamedata.overlap += 1;
                }
                if (squish.gamedata.overlap > 1) {
                        (new squish.floaties.floaty("Overlap! * " + squish.gamedata.overlap.toString(), squish.mouse.x, squish.mouse.y, 5, 30, squish.colors.overlapTag, "20px Arial Bold", function() {return squish.gamedata.menu != "main";})).spawn();
                } else if (squish.gamedata.overlap > 0 && squish.gamedata.combo > 1) {
                        (new squish.floaties.floaty("Combo " + squish.gamedata.combo.toString() + "!", squish.mouse.x, squish.mouse.y, 5, 30, squish.colors.comboTag, "20px Arial", function() {return squish.gamedata.menu != "main";})).spawn();
                }
        });

        return mod;
}());
