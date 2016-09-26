"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.94

/*
        Achievement

        Dependencies :
         - Triggers : squish.triggers.hook
         - Mouse : squish.mouse.surround, squish.mouse.rotary
         - Slider : squish.slider.slider, squish.slider.push
         - Gamedata : squish.gamedata.score, squish.gamedata.overlap, squish.gamedata.combo
	 - Volatile : squish.volatile.store, squish.volatile.exists, squish.volatile.delete
*/

squish.achievements = (function(){
        var mod = {};

        var achievements = {};
        var achamount = 0;

        mod.register = function(name, trigger, def) {
                def.triggered = false;
                def.check = function() {
                        if (def.triggered) {return;}
                        var ret = def.condition();
                        if (ret) {
                                mod.trigger(name);
                        }
                };

                squish.triggers.hook(trigger, def.check);
                if (def.runthrough) {
                        squish.triggers.hook("step", function() {
                                if (def.triggered) {return;}
                                def.runthrough();
                        });
                }
                achievements[name] = def;
                achamount += 1;
        };

	mod.is_triggered = function(name) {
		return achievements[name] && achievements[name].triggered;
	};

	mod.get_data = function(name) {
		if (!achievements[name]) {return {};}
		const achdata = {
			icon: achievements[name].icon,
			title: achievements[name].title,
			menu: achievements[name].menu,
		};
		return achdata;
	};

        // Trigger function
        mod.trigger = function(name, silent) {
                if (!achievements[name]) {return false;}
                var ach = achievements[name];
                ach.triggered = true;
                squish.mouse.surround += 1;
                squish.gamedata.achieved.push(name);

                if (!silent) {
                        // Dopre-graphical stuff here
                        squish.slider.push(new squish.slider.slider("rtl", squish.canvas.width, squish.canvas.height - 150, 250, 110, 20, 150, [
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
                }
                return true;
        };

	squish.volatile.store("mainmenu_ach_careas_created_control", true);
        mod.build_main_menu_component = function() {
                var comp = [
                        {
                                class: "rect",
                                xorg: squish.canvas.width / 2 + 5,
                                yorg: 45,
                                width: squish.canvas.width / 2 - 15,
                                height: squish.canvas.height - 90,
                                fill: false,
                                stroke: true,
                        }
                ];

                var heightperach = (squish.canvas.height - (90 + (achamount-1)*2))/achamount;
                var i = 0;
                for (var x in achievements) {
                        var ach = achievements[x];

                        var desc;
                        var imgsrc;
                        var bgcolor;

                        if (ach.triggered) {
                                desc = ach.menu.desc;
                                imgsrc = ach.icon;
                        } else {
                                desc = ach.menu.howto;
                                imgsrc = "images/game/notthereyet.gif";
                        }

                        if (i%2) {
                                bgcolor = squish.colors.achListOdd;
                        } else {
                                bgcolor = squish.colors.achListEven;
                        }

                        var titlelen = squish.ctx.measureText(ach.title).width;
			if (squish.volatile.exists("mainmenu_ach_careas_created_control")) {
				// Time to register the Clickable Area
				const achname = x; // Bind that thing..
				squish.clickable.register({
					name: "mainmenu_ach_" + achname,
					start: {x: squish.canvas.width/2+5, y: 45 + (i*(heightperach+2))},
					end: {
						x: squish.canvas.width/2+5 + squish.canvas.width/2-15,
						y: 45 + (i*(heightperach+2)) + heightperach,
					},
					on_click: function() {
						squish.volatile.store("mainmenu_ach_submenu", achname);
						squish.clickable.enable("AchSubMenuLeave");
					}
				});

				// One for now...
				squish.clickable.enable("mainmenu_ach_" + achname);
				// ... two for later.
				squish.triggers.hook("menuenter", function(name) {
					if (name == "main") {
						squish.clickable.enable("mainmenu_ach_" + achname);
					}
				});
				squish.triggers.hook("menuleave", function(name) {
					if (name == "main") {
						squish.clickable.disable("mainmenu_ach_" + achname);
					}
				});
			}

                        comp.push({
                                class: "rect",
                                xorg: squish.canvas.width/2+5,
                                yorg: 45 + (i*(heightperach+2)),
                                height: heightperach,
                                width: squish.canvas.width/2-15,
                                visuals: {
                                        fill: bgcolor,
                                }
                        })
                        comp.push({
                                class: "image",
                                src: imgsrc,
                                xorg: squish.canvas.width/2+5,
                                yorg: 45 + (i*(heightperach+2)),
                                height: heightperach,
                                width: heightperach,
                        });
                        comp.push({
                                class: "text",
                                text: ach.title,
                                xorg: squish.canvas.width / 2 + 17 + heightperach + (titlelen/2),
                                yorg: 45 + (heightperach/2+5) + (i*(heightperach+2)),
                                maxwidth: squish.canvas.width/2-12-heightperach,
                                fill: true,
                                stroke: false,
                                visuals: {
                                        fill: "currentStroke",
                                }
                        });

                        i+=1;
        	}
		if (squish.volatile.exists("mainmenu_ach_careas_created_control")) {
			squish.volatile.delete("mainmenu_ach_careas_created_control");
		}
 
                return comp;
        };

        return mod;
}());

squish.achievements.register("nonsense", "step", {
        title: "Nonsense of game design",
        icon: "images/game/mainmenu.gif",
        menu: {
                howto: "LOLOLOLOLOL",
                desc: "You just found the main menu, probably. That or you're reading the code.",
        },
        condition: function() { return squish.gamedata.menu == "main"; },
});

squish.achievements.register("slayer", "score", {
        title: "The Cell Slayer",
        icon: "images/game/slayer.gif",
        menu: {
                howto: "You'll never see that text.. POOOP! Wait, you can access the menu without squishing first? Uhoh..",
                desc: "Yes you have an achievement for squishing a cell.\nI am that desperate about filling my game with content",
        },
        condition: function () { return squish.gamedata.score > 0; },
});

squish.achievements.register("gt9000", "score", {
        title: "Over 9000",
        icon: "images/game/gt9000.gif",
        menu: {
                howto: "Get 9000 of score. Yeah, lame.",
                desc: "Pretty easy, duh",
        },
        condition: function () { return squish.gamedata.score > 9000; },
});

squish.achievements.register("collateral", "mousedown", {
        title: "Collateral Damages",
        icon: "images/game/collateral.gif",
        menu: {
                howto: "Get a 4 overlap or more",
                desc: "Squish cells: check",
        },
        condition: function () { return squish.gamedata.overlap >= 4; },
});

squish.achievements.register("steve", "score", {
        title: "A pet named Steve",
        icon: "images/game/steve.gif",
        menu: {
                howto: "Reach the view count in a week (circa 3.6*10^6)",
                desc: "Kudos if you get the reference. Also, have a surgery to free the doggo",
        },
        condition: function() { return squish.gamedata.score > 3610827; },
});

squish.achievements.register("kingcombo", "step", {
        title: "KING COMBO!",
        icon: "images/game/king_combo.gif",
        menu: {
                howto: "Get a 100 combo",
                desc: "Hypactivity, amirite?",
        },
        condition: function () { return squish.gamedata.combo >= 100; },
});


squish.achievements.register("trigomad", "step", {
        title: "Trigonometric madness",
        icon: "images/game/trigonomad.gif",
        menu: {
                howto: "Spin the hand-weel around.. 62 times",
                desc: "Congrats, your finger is now permanently damaged",
        },
        condition: function () { return squish.mouse.rotary >= 124; },
});


squish.achievements.register("genocide", "score", {
        title: "Genocidal Rampage",
        icon: "images/game/genocide.gif",
        menu: {
                howto: "You wanted something hard, didn't you?",
                desc: "You have earned the lethal injection of salty water for destroying scientifical progress",
        },
        condition: function() { return squish.gamedata.score > 900000000; },
});
