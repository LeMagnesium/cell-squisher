"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.94

/*
        Spiders
	
	Dependencies :
	 - Enemies
*/

squish.spiders = (function() {
	var mod = {};

	mod.spiders = [];

	function spider() {
		this.posx = squish.canvas.width / 2;
		this.posy = squish.canvas.height / 2;
		this.active = false;
		this.move = 15;
		this.findtarget = function() {
			for (var x = 0; x <= squish.enemies.enemies.length; x++) {
				var ind = Math.floor(Math.random() * squish.enemies.enemies.length);
				var en = squish.enemies.enemies[ind];
				if (!en.squished && en.health > 100) {
					this.target = ind;
					this.active = true;
					break;
				}
			}
		};

		this.bite = function() {
			var oldmouse = [squish.mouse.x, squish.mouse.y];
			squish.mouse.x = this.posx;
			squish.mouse.y = this.posy;
			squish.enemies.mousedown();
			squish.mouse.x = oldmouse[0];
			squish.mouse.y = oldmouse[1];
		};

		this.routine = function() {
			if (!this.target) {
				this.findtarget();
			} else {
				var target = squish.enemies.enemies[this.target]
				if (!target || target.squished) {
					this.active = false;
					this.target = null;
					this.findtarget();
				} else {
					if (this.posx == target.posx && this.posy == target.posy) {
						this.bite();
						this.active = false;
						this.target = null;
						return;
					}
					if (Math.abs(this.posx - target.posx) <= this.move) {
						this.posx = target.posx;
					} else if (this.posx > target.posx) {
						this.posx -= this.move;
					} else {
						this.posx += this.move;
					}

					if (Math.abs(this.posy - target.posy) <= this.move) {
						this.posy = target.posy;
					} else if (this.posy > target.posy) {
						this.posy -= this.move;
					} else {
						this.posy += this.move;
					}
				}
			}
		};

		this.draw = function() {
			var matrix = [
				[-5,-3,+5,-3,0,+6],
				[0,-6,+5,+3,-5,+3],
			];
			for (var x in matrix) {
				var en = matrix[x];
				squish.ctx.beginPath();
				squish.ctx.moveTo(this.posx + en[0], this.posy + en[1]);
				squish.ctx.lineTo(this.posx + en[2], this.posy + en[3]);
				squish.ctx.lineTo(this.posx + en[4], this.posy + en[5]);
				squish.ctx.closePath();
				squish.ctx.fill();
			}
		}
	}

	mod.spawn = function() {
		var kb = new spider()
		mod.spiders.push(kb);
	};

	mod.flush = function() {
		mod.spiders = []; // Discard everything
	};

	mod.draw = function() {
		for (var x in mod.spiders) {
			mod.spiders[x].draw();
		}
	};

	squish.triggers.hook("step", function() {
		for (var x in mod.spiders) {
			mod.spiders[x].routine();
		}
	});

	return mod;
})();
