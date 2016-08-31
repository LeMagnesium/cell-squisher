"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.93

/*
        Menu

        Dependencies :
	 - Triggers : squish.triggers.call, squish.triggers.hook
         - (Runtime) Clickable
*/

squish.menu = (function() {
        var mod = {};
        var register = {};

        mod.register = function(name, def) {
                register[name] = def;
        };

        mod.enter = function(name) {
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
                        squish.gamedata.menu = "";
                };
		squish.triggers.call("menuleave", name);
        };

        mod.switch = function(name) {
                mod.leave(squish.gamedata.menu);
                mod.enter(name);
        }

        return mod;
})();

squish.menu.register("main", {
        on_enter: function() {
                squish.clickable.enable("SaveToCookie");
        },
        on_leave: function() {
                squish.clickable.disable("SaveToCookie");
        },
})

squish.menu.register("prestart", {
        on_enter: function() {
                squish.clickable.enable("StartButton");
        },
        on_leave: function() {
                squish.clickable.enable("MainMenu");
                squish.clickable.enable("AudioMenu");
                squish.clickable.disable("StartButton");
        }
})

squish.menu.register("audio", {
        on_enter: function() {
                squish.clickable.enable("AudioMute");
		squish.clickable.enable("AudioPlus");
		squish.clickable.enable("AudioMinus");
        },
        on_leave: function() {
                squish.clickable.disable("AudioMute");
		squish.clickable.disable("AudioPlus");
		squish.clickable.disable("AudioMinus");
        }
});

// Trigger stuff
squish.triggers.hook("load", function() {
        squish.menu.enter("prestart");
});

