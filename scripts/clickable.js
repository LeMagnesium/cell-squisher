"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.93

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
                y: squish.components.MenuButton[0].yorg + squish.components.MenuButton[0].length,
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
        name: "StartButton",
        start: {x: squish.canvas.width / 16 * 7.5, y: squish.canvas.height / 2 - 15},
        end: {x: squish.canvas.width / 16 * 8.5, y: squish.canvas.height / 2 + 30},
        on_release: function() {
                // PLAY!
                if (squish.gamedata.score < 0) {
                        squish.gamedata.score = 0;
                }
                // Let's start the game!
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
                squish.clickable.detect();
        }
})

squish.clickable.register({
        name: "ClearCookie",
        start: {x: 10, y: squish.canvas.height - 120},
        end: {x: squish.canvas.width / 2 - 5, y: squish.canvas.height - 85},
        on_disable: function() {
                squish.colors.cookieCleanerFill = '#323232';
        },
        on_enable: function() {
                squish.colors.cookieCleanerFill = '#db0000';
        },
        on_click: function() {
                // Call the garbage man
                squish.cookies.trash();
                (new squish.floaties.floaty("Data cleaned!", squish.mouse.x, squish.mouse.y, 3, 150, squish.colors.red)).spawn();
                squish.clickable.detect();
        }
})

// Audio menu
squish.clickable.register({
        name: "AudioMenu",
        start: {x: squish.components.AudioButton[0].xorg, y: squish.components.AudioButton[0].yorg},
        end: {
                x: squish.components.AudioButton[0].xorg + squish.components.AudioButton[0].width,
                y: squish.components.AudioButton[0].yorg + squish.components.AudioButton[0].length,
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
                y: squish.components.AudioMenu[1].yorg + squish.components.AudioMenu[1].length,
        },
        on_click: function() {
                if (squish.assets.bgm_get_volume()) {
			squish.volatile.store("memorized_bgm_volume", squish.assets.bgm_get_volume());
                        squish.assets.bgm_set_volume(0);
                } else {
                        squish.assets.bgm_set_volume(squish.volatile.read("memorized_bgm_volume"));
                }
        }
});

squish.clickable.register({
	name: "AudioMinus",
	start: {x: squish.components.AudioMenu[3].xorg, y: squish.components.AudioMenu[3].yorg},
	end: {
		x: squish.components.AudioMenu[3].xorg + squish.components.AudioMenu[3].width,
		y: squish.components.AudioMenu[3].yorg + squish.components.AudioMenu[3].length,
	},
	on_click: function() {
		squish.assets.bgm_set_volume(Math.floor(squish.assets.bgm_get_volume()*100 - 5)/100);
		if (squish.assets.bgm_get_volume() == 0) {
			memorized_bgm_volume = 0.05;
		}
	},
});

squish.clickable.register({
	name: "AudioPlus",
	start: {x: squish.components.AudioMenu[7].xorg, y: squish.components.AudioMenu[7].yorg},
	end: {
		x: squish.components.AudioMenu[7].xorg + squish.components.AudioMenu[7].width,
		y: squish.components.AudioMenu[7].yorg + squish.components.AudioMenu[7].length,
	},
	on_click: function() {
		squish.assets.bgm_set_volume(Math.floor(squish.assets.bgm_get_volume()*100 + 5)/100);
	},
});

// Hook to determine the hovered clickable
squish.triggers.hook("mousemove", squish.clickable.detect);

// Hook to activate the cookie cleaner
squish.triggers.hook("step", function() {
        if (squish.gamedata.menu == "main" && !squish.clickable.areas["ClearCookie"].active && squish.gamedata.last_cookie_save != 0) {
                squish.clickable.enable("ClearCookie");
        } else if (squish.clickable.areas["ClearCookie"] && (squish.gamedata.menu != "main" || squish.gamedata.last_cookie_save == 0)) {
                squish.clickable.disable("ClearCookie");
        }
})
