"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.93

/*
        Menu

        Dependencies :
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
        };

        mod.leave = function() {
                if (squish.gamedata.menu) {
                        if (register[squish.gamedata.menu].on_leave) {
                                register[squish.gamedata.menu].on_leave();
                        }
                        squish.gamedata.menu = "";
                };
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
        },
        on_leave: function() {
                squish.clickable.disable("AudioMute");
        }
});

squish.triggers.hook("load", function() {
        squish.menu.enter("prestart");
});
