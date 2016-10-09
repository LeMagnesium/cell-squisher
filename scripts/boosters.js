"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.94

/*
 * Boosters
 *
 */

squish.boosters = (function() {
	var mod = {};

	mod.doublethetrouble = false;
	mod.combobreakerimmunity = false;
	mod.nonegative = false;
	mod.deusexmachina = false;
	mod.assistance = false;
	mod.nobelprize = false;

	function slide_announce(message) {
		squish.slider.push(new squish.slider.slider("rtl", squish.canvas.width, squish.canvas.height - 100, 250, 40, 200, 20, [
			{
				class: "text",
				xorg: 125,
				yorg: 23,
				stroke: true,
				text: message,
				maxwidth: 230,
			}
		]));
	};

	var boosters = {
		doublethetrouble: {
			price: 5000000,
			carea: "BuyBoosterDoubleTrouble",
			duration: 45,
			equip: function() {
				mod.doublethetrouble = true;
				slide_announce("Double The Trouble Enabled!");
			},
			unequip: function() {
				mod.doublethetrouble = false;
				slide_announce("Double The Trouble Disabled!");
			}
		},
		combobreakerimmunity: {
			price: 1000000,
			carea: "BuyBoosterComboBreakerImmunity",
			duration: 30,
			equip: function() {
				mod.combobreakerimmunity = true;
				slide_announce("Combo Breaker Immunity Enabled!");
			},
			unequip: function() {
				mod.combobreakerimmunity = false;
				slide_announce("Combo Breaker Immunity Disabled!");
			}
		},
		nonegative: {
			price: 250000,
			carea: "BuyBoosterNoNegative",
			duration: 60,
			equip: function() {
				mod.nonegative = true;
				slide_announce("No Negative Enabled!");
			},
			unequip: function() {
				mod.nonegative = false;
				slide_announce("No Negative Disabled!");
			}
		},
		deusexmachina: {
			price: 25000000,
			duration: 15,
			carea: "BuyBoosterDeusExMachina",
			equip: function() {
				mod.deusexmachina = true;
				slide_announce("Deus Ex Machina Enabled!");
			},
			unequip: function() {
				mod.deusexmachina = false;
				slide_announce("Deus Ex Machina Disabled!");
			}
		},
		assistance: {
			price: 75000000,
			duration: 60,
			carea: "BuyBoosterAssistance",
			equip: function() {
				mod.assistance = true;
				for (var i = 0; i < 3; i++) {
					squish.spiders.spawn();
				}
				slide_announce("Assistance Enabled!");
			},
			unequip: function() {
				mod.assistance = false;
				squish.spiders.flush();
				slide_announce("Assistance Disabled!");
			}
		},
		nobelprize: {
			price: 9000000000,
			duration: 10,
			carea: "BuyBoosterNobelPrize",
			equip: function() {
				mod.nobelprize = true;
				squish.assets.stop_bgm();
			}
		}
	};
	squish.volatile.store("prestart_boosterlock", true);

	squish.triggers.hook("step", function() {
		if (squish.boosters.deusexmachina && squish.gamedata.menu == "main" && squish.mouse.clicked) {
			//console.log("Move");
			//squish.canvas.onmousedown({x: squish.mouse.x, y: squish.mouse.y});
		}
	});

	mod.detect = function() {
		if (squish.volatile.exists("prestart_boosterlock")) {return;}
		var score = squish.gamedata.score;
		var menu = squish.gamedata.menu;
		for (var bst in boosters) {
			var bstdata = boosters[bst];
			if (menu == "main" && score > bstdata.price && !mod[bst]) {
				if (!squish.clickable.is_enable(bstdata.carea)) {
					squish.clickable.enable(bstdata.carea);
				}
			} else if (squish.clickable.is_enable(bstdata.carea)) {
				squish.clickable.disable(bstdata.carea);
			}
		}
	};

	mod.buy = function(name) {
		if (!boosters[name]) {return;}

		squish.gamedata.increase_score(-boosters[name].price, true);
	};

	mod.equip = function(name) {
		if (!boosters[name]) {return;}

		(function() {
			boosters[name].equip();
			window.setTimeout(mod.unequip, boosters[name].duration * 1000, name);
		} || function() {;})();
	};

	mod.unequip = function(name) {
		if (!boosters[name]) {return;}

		(boosters[name].unequip || function() {;})();
		mod.detect();
	};

	squish.triggers.hook("menuenter", function() {
		squish.boosters.detect();
	});
	
	squish.triggers.hook("menuleave", function() {
		squish.boosters.detect();
	});

	squish.triggers.hook("start", function() {
		squish.volatile.delete("prestart_boosterlock");
	});

	return mod;
}());

