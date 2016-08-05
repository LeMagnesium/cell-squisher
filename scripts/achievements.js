"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.91

squish.achievements = (function(){
        var mod = {};

        var achievements = {};

        mod.register = function(name, trigger, def) {
                def.triggered = false;
                def.check = function() {//def) {
                        if (def.triggered) {return;}
                        var ret = def.condition();
                        if (ret) {
                                mod.trigger(def);
                        }
                };

                squish.triggers.hook(trigger, def.check);
                if (def.runthrough) {
                        squish.triggers.hook("step", def.runthrough);
                }
                achievements[name] = def;
        };

        mod.trigger = function(ach) {
                ach.triggered = true;


                // Dopre-graphical stuff here
                showQueue.push(new slider_component("rtl", canvas.width, canvas.height - 150, 250, 110, 20, 150, [
                        {
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
                        },
                        {
                                class: "text",
                                text: ach.title,
                                xorg: 125,
                                yorg: 100,
                                stroke: true,
                                visuals: {
                                        fill: "currentStroke",
                                        font: "20px Arial",
                                }
                        }
                ]));
        };

        mod.draw = function() {
                if (showQueue.length == 0) {return;}

                var slider = showQueue[0];
                if (slider.state == "dead") {showQueue.shift(); return;}
                slider.elapsed += 1;
                var comp = slider.component();
                draw_element([comp]);
                VisualSwap.setMainFill(squish.colors.mainMenuFill);
                VisualSwap.useMainFill();
        }

        return mod;
}());

// Score achievements
squish.achievements.register("slayer", "score", {
        title: "The Cell Slayer",
        icon: "images/game/slayer.gif",
        menu: {
                howto: "You'll never see that text.. POOOP!",
                desc: "Yes you have an achievement for squishing a cell. I am that desperate about filling my game with content",
        },
        condition: function () { return GameData.score > 0; },
});

squish.achievements.register("gt9000", "score", {
        title: "Over 9000",
        icon: "images/game/gt9000.gif",
        menu: {
                howto: "Get 9000 of score. Yeah, lame.",
                desc: "Pretty easy, duh",
        },
        condition: function () { return GameData.score > 9000; },
});

squish.achievements.register("steve", "score", {
        title: "A pet named Steve",
        icon: "images/game/steve.gif",
        menu: {
                howto: "Reach the view count in a week (circa 3.6*10^6)",
                desc: "Kudos if you get the reference. Also, have a surgery to free the doggo",
        },
        condition: function() { return GameData.score > 3610827; },
});

squish.achievements.register("genocide", "score", {
        title: "Genocidal Rampage",
        icon: "images/game/genocide.gif",
        menu: {
                howto: "You wanted something hard, didn't you?",
                desc: "You have earned the lethal injection of salty water for destroying scientifical progress",
        },
        condition: function() { return GameData.score > 9000000000; },
});

// Mouse stuff
squish.achievements.register("nonsense", "step", {
        title: "Nonsense of game design",
        icon: "images/game/mainmenu.gif",
        menu: {
                howto: "LOLOLOLOLOL",
                desc: "You just found the main menu, probably. That or you're reading the code.",
        },
        condition: function() { return GameData.menu == "main"; },
});


squish.achievements.register("trigomad", "step", {
        title: "Trigonometric madness",
        icon: "images/game/trigonomad.gif",
        menu: {
                howto: "Spin the hand-weel around.. 62 times",
                desc: "Congrats, your finger is now permanently damaged",
        },
        condition: function () { return Mouse.rotary >= 124; },
});

// Plain weird
squish.achievements.register("kingcombo", "step", {
        title: "KING COMBO!",
        icon: "images/game/king_combo.gif",
        menu: {
                howto: "Get a 100 combo",
                desc: "Hypactivity, amirite?",
        },
        condition: function () { return GameData.combo >= 100; },
});

squish.achievements.register("collateral", "mousedown", {
        title: "Collateral Damages",
        icon: "images/game/collateral.gif",
        menu: {
                howto: "Get a 4 overlap or more",
                desc: "Squish cells: check",
        },
        condition: function () { return GameData.overlap >= 4; },
});
