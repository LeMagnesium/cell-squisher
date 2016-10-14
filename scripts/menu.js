"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.94

/*
        Menu

        Dependencies :
	 - Triggers : squish.triggers.call, squish.triggers.hook
         - (Runtime) Clickable
	 - (Runtime) Achievements
*/

squish.menu = (function() {
        var mod = {};
        var register = {};

        mod.register = function(name, def) {
                register[name] = def;
        };

        mod.enter = function(name) {
		if (squish.gamedata.menu == name) {return;}
                squish.gamedata.menu = name;

                if (register[name].on_enter) {
                        register[name].on_enter();
                }
		squish.triggers.call("menuenter", name);
        };

        mod.leave = function() {
                if (squish.gamedata.menu) {
                        if (register[squish.gamedata.menu].on_leave) {
                                register[squish.gamedata.menu].on_leave();
                        }
			var oldmenu = squish.gamedata.menu;
			squish.gamedata.menu = mod.fallback_menu;
			squish.triggers.call("menuleave", oldmenu);
			if (register[mod.fallback_menu] && register[mod.fallback_menu].on_enter) {
				register[mod.fallback_menu].on_enter();
			}
                };
        };

        mod.switch = function(name) {
		if (squish.gamedata.menu == name) {return;}
                mod.leave(squish.gamedata.menu);
		if (register[mod.fallback_menu] && register[mod.fallback_menu].on_leave) {
			register[mod.fallback_menu].on_leave();
		}
		mod.enter(name);
        };

	mod.draw = function(name) {
		if (register[name] && register[name].draw) {
			register[name].draw();
		}
	};

	mod.set_fallback = function(name) {
		mod.fallback_menu = name;
	};

	mod.get_fallback = function() {
		return mod.fallback_menu;
	};

        return mod;
})();

squish.menu.register("main", {
        on_enter: function() {
                if (squish.gamedata.score >= 0) {
			squish.clickable.enable("SaveToCookie");
			if (squish.gamedata.last_cookie_save > 0) {
				squish.clickable.enable("ClearCookie");
			}
		}
        },
        on_leave: function() {
                squish.clickable.disable("SaveToCookie");
		if (squish.clickable.is_enable("ClearCookie")) {
			squish.clickable.disable("ClearCookie");
		}
        },
	draw: function() {
		// Lag : 3-5ms
		// Moderate lag
		squish.components.draw(squish.components.MainMenu);
		squish.floaties.draw();
		squish.components.draw(squish.achievements.build_main_menu_component());

		// If we clicked an achievement area we should have something in the VMM
		if (squish.volatile.exists("mainmenu_ach_submenu")) {
			squish.components.draw(squish.components.AchSubMenu);
		}
	},
})

squish.menu.register("prestart", {
        on_enter: function() {
                squish.clickable.enable("StartButton");
		squish.clickable.enable("AudioMenu");
		squish.clickable.enable("MainMenu");
		squish.clickable.enable("Tutorial");
		squish.menu.set_fallback("prestart");
	},
	on_leave: function() {
		squish.clickable.disable("Tutorial");
		squish.clickable.disable("StartButton");
	},
	draw: function() {
		// Lag : 1ms
		draw_wait_menu();
	},
})

squish.menu.register("audio", {
        on_enter: function() {
                squish.clickable.enable("AudioMute");
		if (squish.assets.bgm_get_volume() < 1) {
			squish.clickable.enable("AudioPlus");
		}
		if (squish.assets.bgm_get_volume() > 0) {
			squish.clickable.enable("AudioMinus");
		}
		squish.clickable.enable("AudioModeSwitch");
		squish.clickable.enable("AudioNext");
        },
        on_leave: function() {
                squish.clickable.disable("AudioMute");
		squish.clickable.disable("AudioPlus");
		squish.clickable.disable("AudioMinus");
		squish.clickable.disable("AudioModeSwitch");
		squish.clickable.disable("AudioNext");
        },
	draw: function() {
		squish.components.draw(squish.components.AudioMenu);
	},
});

squish.menu.register("gameover", {
	on_enter: function() {
		if (squish.gameover) {return;} // We've done that already
		squish.assets.stop_bgm();
		squish.clickable.disable("AudioMenu");
		squish.clickable.enable("GitGud");
		var damnson = new squish.assets.sound();
		damnson.sound.volume = 0.5;
		var sadviolin = new squish.assets.sound();
		sadviolin.sound.volume = 0.4;
		damnson.play("audio/dayum_son.mp3");
		sadviolin.play("audio/sad_violins.mp3");
	},
	draw: function() {
		squish.enemies.draw();
		squish.floaties.draw();
		squish.components.draw(squish.components.GameOverScreen);
	}
});

squish.menu.register("game_end", {
	on_enter: function() {
		squish.clickable.disable("AudioMenu");
		squish.clickable.disable("MainMenu");
		var arcadia = new squish.assets.sound();
		arcadia.sound.volume = squish.assets.bgm_get_volume();
		arcadia.play("audio/Arcadia.mp3");
		squish.gamedata.score = -1;
		squish.levels.level = 0;
	},
	draw: function() {
		squish.components.draw(squish.components.Game_End);
	}
});

// Trigger stuff
squish.triggers.hook("load", function() {
        squish.menu.enter("prestart");
});

