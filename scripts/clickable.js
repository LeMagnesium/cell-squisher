"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.94

/*
        Clickable

        Dependencies :
         - Components : squish.components.MenuButon
         - GameData : squish.gamedata.menu, squish.gamedata.score, squish.gamedata.last_cookie_save
         - Colors : squish.colors.cookieSaverFill
         - Slider : squish.slider.push, squish.slider.slider
         - Triggers : squish.triggers.hook
         - Cookies : squish.cookies.bake, squish.cookies.trash
         - Menu : squish.menu.switch, squish.menu.leave
	 - Volatile : squish.volatile.store, squish.memory.read
*/

squish.clickable = (function() {
        var mod = {};
        mod.areas = [];

        mod.register = function(def) {
                mod.areas[def.name] = def;
        };

        mod.enable = function(name) {
                if (mod.areas[name]) {
                        mod.areas[name].active = true;
                        if (mod.areas[name].on_enable) {
                                mod.areas[name].on_enable();
                        }
                }
        };

        mod.disable = function(name) {
                if (mod.areas[name]) {
                        mod.areas[name].active = false;
                        if (mod.areas[name].on_disable) {
                                mod.areas[name].on_disable();
                        }
                }
        };

	mod.is_enable = function(name) {
		return mod.areas[name] && mod.areas[name].active;
	};

        mod.delete = function(name) {
                delete mod.areas[name];
        };

        mod.detect = function() {
                var found = ""
                for (name in squish.clickable.areas) {
			if (!squish.clickable.areas[name].active) {continue;}
			if (squish.mouse.x < squish.clickable.areas[name].start.x - squish.mouse.sradius) {continue;}
			if (squish.mouse.x > squish.clickable.areas[name].end.x + squish.mouse.sradius) {continue;}
			if (squish.mouse.y < squish.clickable.areas[name].start.y - squish.mouse.sradius) {continue;}
			if (squish.mouse.y > squish.clickable.areas[name].end.y + squish.mouse.sradius) {continue;}

                        found = name;
                        break;
                }

		if (squish.mouse.hovering && squish.clickable.areas[squish.mouse.hovering].on_leave) {
			mod.areas[squish.mouse.hovering].on_leave();
		}
		squish.mouse.hovering = found;
		if (found) {
			if (squish.clickable.areas[name].on_enter) {
				squish.clickable.areas[name].on_enter();
			}
		} else if(squish.mouse.clicked) {
                        squish.mouse.clicked = ""; // We left the component, so it's not *technically* clicked any more
                }
        };

        return mod;
}());

// Clickable areas
squish.clickable.register({
        name: "MainMenu",
        start: {x: squish.components.MenuButton[0].xorg, y: squish.components.MenuButton[0].yorg},
        end: {
                x: squish.components.MenuButton[0].xorg + squish.components.MenuButton[0].width,
                y: squish.components.MenuButton[0].yorg + squish.components.MenuButton[0].height,
        },
        on_click: function() {
                if (squish.gamedata.menu == "main") {
                        squish.menu.leave("main");
                } else {
                        squish.menu.switch("main");
                }
        }
});

squish.clickable.register({
	name: "Tutorial",
	start: {x: squish.components.PrestartMenu[2].xorg, y: squish.components.PrestartMenu[2].yorg},
	end: {
		x: squish.components.PrestartMenu[2].xorg + squish.components.PrestartMenu[2].width,
		y: squish.components.PrestartMenu[2].yorg + squish.components.PrestartMenu[2].height,
	},
	on_click: function() {
		window.setTimeout(function() {window.location="./game.html";}, 172200);
		window.location = "./tutorial.html";
	},
});

squish.clickable.register({
        name: "StartButton",
        start: {x: squish.canvas.width / 16 * 7.5, y: squish.canvas.height / 2 - 15},
        end: {x: squish.canvas.width / 16 * 8.5, y: squish.canvas.height / 2 + 30},
        on_release: function() {
                // PLAY!
                if (squish.gamedata.score < 0) {
                        squish.gamedata.score = 0;
                }
  		if (squish.levels.level == 0) {
			squish.levels.next_level();
		}
	      	// Let's start the game!
		squish.menu.set_fallback("");
                squish.menu.leave("prestart");
                squish.triggers.call("start");
        }
});

squish.clickable.register({
        name: "SaveToCookie",
        start: {x: 10, y: squish.canvas.height - 80},
        end: {x: squish.canvas.width / 2 - 5, y: squish.canvas.height - 45},
        on_click: function() {
                // Call the baker
                squish.cookies.bake();
                (new squish.floaties.floaty("Data saved!", squish.mouse.x, squish.mouse.y, 3, 150, squish.colors.red)).spawn();
                squish.clickable.enable("ClearCookie");
		squish.clickable.detect();
        }
})

squish.clickable.register({
        name: "ClearCookie",
        start: {x: 10, y: squish.canvas.height - 120},
        end: {x: squish.canvas.width / 2 - 5, y: squish.canvas.height - 85},
        on_release: function() {
                // Call the garbage man
                squish.cookies.trash();
                (new squish.floaties.floaty("Data cleaned!", squish.mouse.x, squish.mouse.y, 3, 150, squish.colors.red)).spawn();
        	squish.clickable.disable("ClearCookie");
                squish.clickable.detect();
	}
})

// Audio menu
squish.clickable.register({
        name: "AudioMenu",
        start: {x: squish.components.AudioButton[0].xorg, y: squish.components.AudioButton[0].yorg},
        end: {
                x: squish.components.AudioButton[0].xorg + squish.components.AudioButton[0].width,
                y: squish.components.AudioButton[0].yorg + squish.components.AudioButton[0].height,
        },
        on_click: function() {
                if (squish.gamedata.menu == "audio") {
                        squish.menu.leave("audio");
                } else {
                        squish.menu.switch("audio");
                }
                squish.clickable.detect();
        }
});

squish.volatile.store("memorized_bgm_volume", -1);
squish.clickable.register({
        name: "AudioMute",
        start: {x: squish.components.AudioMenu[1].xorg, y: squish.components.AudioMenu[1].yorg},
        end: {
                x: squish.components.AudioMenu[1].xorg + squish.components.AudioMenu[1].width,
                y: squish.components.AudioMenu[1].yorg + squish.components.AudioMenu[1].height,
        },
        on_click: function() {
                if (squish.assets.bgm_get_volume()) {
			squish.volatile.store("memorized_bgm_volume", squish.assets.bgm_get_volume());
                        squish.assets.bgm_set_volume(0);
			squish.clickable.disable("AudioMinus");
			squish.clickable.enable("AudioPlus");
                } else {
                        squish.assets.bgm_set_volume(squish.volatile.read("memorized_bgm_volume"));
			if (squish.assets.bgm_get_volume() == 1) {
				squish.clickable.disable("AudioPlus");
			}
			if (squish.assets.bgm_get_volume() > 0) {
				squish.clickable.enable("AudioMinus");
			}
                }
        }
});

squish.clickable.register({
	name: "AudioMinus",
	start: {x: squish.components.AudioMenu[2].xorg, y: squish.components.AudioMenu[2].yorg},
	end: {
		x: squish.components.AudioMenu[2].xorg + squish.components.AudioMenu[2].width,
		y: squish.components.AudioMenu[2].yorg + squish.components.AudioMenu[2].height,
	},
	on_click: function() {
		if (squish.assets.bgm_get_volume() <= 0) {return;}
		squish.assets.bgm_set_volume(Math.floor(squish.assets.bgm_get_volume()*100 - 5)/100);
		if (squish.assets.bgm_get_volume() == 0) {
			squish.volatile.store("memorized_bgm_volume", 0.05);
			squish.clickable.disable("AudioMinus");
		}
		if (!squish.clickable.is_enable("AudioPlus")) {
			squish.clickable.enable("AudioPlus");
		}
	},
});

squish.clickable.register({
	name: "AudioPlus",
	start: {x: squish.components.AudioMenu[5].xorg, y: squish.components.AudioMenu[5].yorg},
	end: {
		x: squish.components.AudioMenu[5].xorg + squish.components.AudioMenu[5].width,
		y: squish.components.AudioMenu[5].yorg + squish.components.AudioMenu[5].height,
	},
	on_click: function() {
		if (squish.assets.bgm_get_volume() >= 1) {return;}
		squish.assets.bgm_set_volume(Math.floor(squish.assets.bgm_get_volume()*100 + 5)/100);
		if (squish.assets.bgm_get_volume() == 1) {
			squish.clickable.disable("AudioPlus");
		}
		if (!squish.clickable.is_enable("AudioMinus")) {
			squish.clickable.enable("AudioMinus");
		}
	},
});

squish.clickable.register({
	name: "AudioModeSwitch",
	start: {x: squish.components.AudioMenu[6].xorg, y: squish.components.AudioMenu[6].yorg},
	end: {
		x: squish.components.AudioMenu[6].xorg + squish.components.AudioMenu[6].width,
		y: squish.components.AudioMenu[6].yorg + squish.components.AudioMenu[6].height,
	},
	on_click: function() {
		squish.assets.bgm_play_mode_switch();
	},
});

squish.clickable.register({
	name: "AudioNext",
	start: {x: squish.components.AudioMenu[7].xorg, y: squish.components.AudioMenu[7].yorg},
	end: {
		x: squish.components.AudioMenu[7].xorg + squish.components.AudioMenu[7].width,
		y: squish.components.AudioMenu[7].yorg + squish.components.AudioMenu[7].height,
	},
	on_click: function() {
		squish.assets.bgm_play_next();
	},
});

squish.clickable.register({
	name: "AchSubMenuLeave",
	start: {x: squish.components.AchSubMenu[1].xorg, y: squish.components.AchSubMenu[1].yorg},
	end: {
		x: squish.components.AchSubMenu[1].xorg + squish.components.AchSubMenu[1].width,
		y: squish.components.AchSubMenu[1].yorg + squish.components.AchSubMenu[1].height,
	},
	on_release: function() {
		squish.volatile.delete("mainmenu_ach_submenu");
		squish.clickable.disable("AchSubMenuLeave");
	},
});

squish.clickable.register({
	name: "BuyBoosterDoubleTrouble",
	start: {x: squish.components.MainMenu[12].xorg, y: squish.components.MainMenu[12].yorg},
	end: {
		x: squish.components.MainMenu[12].xorg + squish.components.MainMenu[12].width,
		y: squish.components.MainMenu[12].yorg + squish.components.MainMenu[12].height,
	},
	on_release: function() {
		squish.boosters.buy("doublethetrouble");
		squish.boosters.equip("doublethetrouble");
		squish.boosters.detect();
	},
});

squish.clickable.register({
	name: "BuyBoosterComboBreakerImmunity",
	start: {x: squish.components.MainMenu[8].xorg, y: squish.components.MainMenu[8].yorg},
	end: {
		x: squish.components.MainMenu[8].xorg + squish.components.MainMenu[8].width,
		y: squish.components.MainMenu[8].yorg + squish.components.MainMenu[8].height,
	},
	on_release: function() {
		squish.boosters.buy("combobreakerimmunity");
		squish.boosters.equip("combobreakerimmunity");
		squish.boosters.detect();
	},
});

squish.clickable.register({
	name: "BuyBoosterDeusExMachina",
	start: {x: squish.components.MainMenu[13].xorg, y: squish.components.MainMenu[13].yorg},
	end: {
		x: squish.components.MainMenu[13].xorg + squish.components.MainMenu[13].width,
		y: squish.components.MainMenu[13].yorg + squish.components.MainMenu[13].height,
	},
	on_release: function() {
		squish.boosters.buy("deusexmachina");
		squish.boosters.equip("deusexmachina");
		squish.boosters.detect();
	},
});

squish.clickable.register({
	name: "BuyBoosterNoNegative",
	start: {x: squish.components.MainMenu[9].xorg, y: squish.components.MainMenu[9].yorg},
	end: {
		x: squish.components.MainMenu[9].xorg + squish.components.MainMenu[9].width,
		y: squish.components.MainMenu[9].yorg + squish.components.MainMenu[9].height,
	},
	on_release: function() {
		squish.boosters.buy("nonegative");
		squish.boosters.equip("nonegative");
		squish.boosters.detect();
	},
});

squish.clickable.register({
	name: "BuyBoosterAssistance",
	start: {x: squish.components.MainMenu[16].xorg, y: squish.components.MainMenu[16].yorg},
	end: {
		x: squish.components.MainMenu[16].xorg + squish.components.MainMenu[16].width,
		y: squish.components.MainMenu[16].yorg + squish.components.MainMenu[16].height,
	},
	on_release: function() {
		squish.boosters.buy("assistance");
		squish.boosters.equip("assistance");
		squish.boosters.detect();
	},
});

squish.clickable.register({
	name: "BuyBoosterNobelPrize",
	start: {x: squish.components.MainMenu[17].xorg, y: squish.components.MainMenu[17].yorg},
	end: {
		x: squish.components.MainMenu[17].xorg + squish.components.MainMenu[17].width,
		y: squish.components.MainMenu[17].yorg + squish.components.MainMenu[17].height,
	},
	on_release: function() {
		squish.boosters.buy("nobelprize");
		squish.boosters.equip("nobelprize");
		squish.boosters.detect();
	},
});

squish.clickable.register({
	name: "GitGud",
	start: {x: squish.components.GameOverScreen[10].xorg, y: squish.components.GameOverScreen[10].yorg},
	end: {
		x: squish.components.GameOverScreen[10].xorg + squish.components.GameOverScreen[10].width,
		y: squish.components.GameOverScreen[10].yorg + squish.components.GameOverScreen[10].height,
	},
	on_release: function() {
		window.location = "http://fgtools.fr/file";
	},
});

// Hook to determine the hovered clickable
squish.triggers.hook("mousemove", squish.clickable.detect);

