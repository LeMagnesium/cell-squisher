"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.91

/*
        Clickable

        Dependencies :
         - Components : squish.components.MenuButon
         - GameData : squish.gamedata.menu, squish.gamedata.score, squish.gamedata.last_cookie_save
         - Colors : squish.colors.cookieSaverFill
         - Slider : squish.slider.push, squish.slider.slider
*/

squish.clickable = (function() {
        var mod = {};
        mod.areas = [];

        /*mod.clickableArea = function(name, posx, posy, endx, endy, action) {
                this.name = name;
                this.start = {x: posx, y: posy};
                this.end = {x: endx, y: endy};
                this.action = action;
                this.active = false;
        };*/

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
        }
});

squish.clickable.register({
        name: "StartButton",
        start: {x: squish.canvas.width / 16 * 7.5, y: squish.canvas.height / 2 - 15},
        end: {x: squish.canvas.width / 16 * 8.5, y: squish.canvas.height / 2 + 30},
        on_release: function() {
                // PLAY!
                squish.gamedata.menu = "";
                squish.gamedata.score = 0;
                // Let's start the game!
                squish.triggers.call("start");
                squish.clickable.enable("ToMenuButton");
                squish.clickable.disable("StartButton");
        }
});

squish.clickable.register({
        name: "SaveToCookie",
        start: {x: 10, y: 32},
        end: {x: squish.canvas.width / 2 - 5, y: squish.canvas.height - 45},
        on_disable: function() {
                squish.colors.cookieSaverFill = '#666666';
        },
        on_enable: function() {
                squish.colors.cookieSaverFill = '#db4540';
        },
        on_click: function() {
                // call compose_cookie
                squish.slider.push(new squish.slider.slider("rtl", squish.canvas.width, squish.canvas.height - 150, 250, 110, 20, 150, [
/*                        {
                                class: "image",
                                src: ach.icon,
                                xorg: 93,
                                yorg: 13,
                                width: 64,
                                height: 64
                        },
                        {
                                class: "rect",
                                xorg: 93,
                                yorg: 13,
                                width: 64,
                                height: 64,
                                fill: false,
                                visuals: {
                                        stroke: squish.colors.red,
                                }
                        },*/
                        {
                                class: "text",
                                text: "Data saved!",
                                xorg: 125,
                                yorg: 100,
                                stroke: true,
                                visuals: {
                                        fill: "currentStroke",
                                        font: "20px Arial",
                                }
                        }]));

                squish.gamedata.last_cookie_save = new Date().getTime();
                squish.clickable.disable("SaveToCookie");
        }
})
