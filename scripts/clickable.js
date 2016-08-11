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

                        // Could be in jQuery, if it were in HTML
                        if (squish.clickable.areas[name].on_enter) {
                                squish.clickable.areas[name].on_enter();
                        }
                        found = name;
                        break;
                }

                squish.mouse.hovering = found;
                if (!squish.mouse.hovering && squish.mouse.clicked) {
                        squish.mouse.clicked = ""; // We left the component, so it's not *technically* clicked any more
                }
        };

        return mod;
}());

// Clickable areas
squish.clickable.register({
        name: "ToMenuButton",
        start: {x: squish.components.MenuButton[0].xorg, y: squish.components.MenuButton[0].yorg},
        end: {
                x: squish.components.MenuButton[0].xorg + squish.components.MenuButton[0].width,
                y: squish.components.MenuButton[0].yorg + squish.components.MenuButton[0].length,
        },
        on_click: function() {
                squish.gamedata.menu = "main";
                squish.clickable.disable("ToMenuButton");
                squish.clickable.enable("FromMenuButton");
                squish.clickable.enable("SaveToCookie");
                squish.clickable.detect();
        }
});

squish.clickable.register({
        name: "FromMenuButton",
        start: {x: squish.components.MenuButton[0].xorg, y: squish.components.MenuButton[0].yorg},
        end: {
                x: squish.components.MenuButton[0].xorg + squish.components.MenuButton[0].width,
                y: squish.components.MenuButton[0].yorg + squish.components.MenuButton[0].length,
        },
        on_click: function() {
                squish.gamedata.menu = "";
                squish.clickable.disable("FromMenuButton");
                squish.clickable.disable("SaveToCookie");
                squish.clickable.enable("ToMenuButton");
                squish.clickable.detect();
        }
});

squish.clickable.register({
        name: "StartButton",
        start: {x: squish.canvas.width / 16 * 7.5, y: squish.canvas.height / 2 - 15},
        end: {x: squish.canvas.width / 16 * 8.5, y: squish.canvas.height / 2 + 30},
        on_release: function() {
                // PLAY!
                squish.gamedata.menu = "";
                if (squish.gamedata.score < 0) {
                        squish.gamedata.score = 0;
                }
                // Let's start the game!
                squish.triggers.call("start");
                squish.clickable.enable("ToMenuButton");
                squish.clickable.disable("StartButton");
                squish.clickable.detect();
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

// Hook to determine the hovered clickable
squish.triggers.hook("mousemove", squish.mouse.hovering = squish.clickable.detect);

// Hook to activate the cookie cleaner
squish.triggers.hook("step", function() {
        if (squish.gamedata.menu == "main" && !squish.clickable.areas["ClearCookie"].active && squish.gamedata.last_cookie_save != 0) {
                squish.clickable.enable("ClearCookie");
        } else if (squish.clickable.areas["ClearCookie"] && (squish.gamedata.menu != "main" || squish.gamedata.last_cookie_save == 0)) {
                squish.clickable.disable("ClearCookie");
        }
})
