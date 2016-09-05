"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.94

/*
        Components

        Dependencies :
         - Colors : squish.colors.menuButtonPressed, squish.colors.menuButtonHovered, squish.colors.mainMenuFill, squish.colors.mainMenuStroke, squish.colors.cookieSaverFill, squish.colors.startButtonLabel, squish.colors.startButtonPressedFill, squish.colors.startButtonPressedLabel, squish.colors.textFill
         - Assets : squish.assets.get_image, squish.assets.now_playing
         - Gamedata : squish.gamedata.score, squish.VisualSwap

*/
squish.components = (function() {
        var mod = {};

        mod.AudioButton = [
                {
                        class: "button",
                        xorg: 5,
                        yorg: squish.canvas.height - 35,
                        width: 30,
                        height: 30,
                        carea: "AudioMenu",
			icon: {
				src: "images/game/audio_menu.gif",
                	}
		}
        ],

        mod.MenuButton = [
            {
                class: "button",
                xorg: squish.canvas.width - 35,
                yorg: squish.canvas.height - 35,
                width: 30,
                height: 30,
                carea: "MainMenu"
            },
            {
                class: "line",
                xorg: squish.canvas.width - 30,
                yorg: squish.canvas.height - 13,
                width: 20,
                height: 0,
            },
            {
                class: "line",
                xorg: squish.canvas.width - 30,
                yorg: squish.canvas.height - 20,
                width: 20,
                height: 0,
            },
            {
                class: "line",
                xorg: squish.canvas.width - 30,
                yorg: squish.canvas.height - 27,
                width: 20,
                height: 0,
            }
        ];

        mod.MainMenu = [
                // Base
                {
                        class: "rect",
                        xorg: 5,
                        yorg: 40,
                        width: squish.canvas.width - 10,
                        height: squish.canvas.height - 80,
                        visuals: {
                                live: true,
                                stroke: function() {return squish.colors.mainMenuStroke;},
                                fill: function() {return squish.colors.mainMenuFill;},
                        }
                },
                {
                        class: "line",
                        xorg: squish.canvas.width/2,
                        yorg: 40,
                        width: 0,
                        height: squish.canvas.height - 80,
                        visuals: {
                                live: true,
                                stroke: function() {return squish.colors.mainMenuStroke;},
                        }
               },
               // Save Game Data
               {
                        class: "button",
                        xorg: 10,
                        yorg: squish.canvas.height - 80,
                        width: squish.canvas.width / 2 - 15,
                        height: 35,
			carea: "SaveToCookie",
                        visuals: {
                                stroke: "#33cfdf",
                                nothing: squish.colors.cookieSaver,
				hovered: squish.colors.cookieSaverHovered,
				pressed: squish.colors.cookieSaverPressed,
                       },
		       label: {
	                       text: "Save game data",
	                       visuals: {
	                               fill: "#000000",
	                               stroke: "#003322"
	                       }
			}
               },
               // Clear Game Data
		{
			class: "button",
			xorg: 10,
			yorg: squish.canvas.height - 120,
			width: squish.canvas.width / 2 - 15,
			height: 35,
			carea: "ClearCookie",
			visuals: {
				stroke: "#22cd64",
//                               fill: function() {return squish.colors.cookieCleanerFill;}
				nothing: squish.colors.cookieCleaner,
				hovered: squish.colors.cookieCleanerHovered,
				pressed: squish.colors.cookieCleanerPressed,
                       }
               },
               {
                       class: "text",
                       xorg: squish.canvas.width / 4 - 2.5,
                       yorg: squish.canvas.height - 95,
                       text: "Clear game data",
                       visuals: {
                               fill: "#000000",
                               stroke: "#008787"
                       }
               }
       ];

       mod.AudioMenu = [
		{
			class: "line",
			xorg: 5,
			yorg: squish.canvas.height - 40,
			width: 30,
			height: 0,
		},

		// Mute Button
		{
			class: "button",
			xorg: 5,
			yorg: squish.canvas.height - 75,
			width: 30,
			height: 30,
			carea: "AudioMute",
			icon: {
				live: true,
				src: function() {
					if (squish.assets.bgm_get_volume() > 0) {
						return "images/game/audio_mute.gif";
					} else {
						return "images/game/audio_unmute.gif";
					}
				}
			}
		},

		// Volume -
		{
			class: "button",
			xorg: 5,
			yorg: squish.canvas.height - 110,
			width: 30,
			height: 30,
			carea: "AudioMinus",
			label: {
				text: "-",
				fill: true,
			}
		},

		// Volume Level
		{
			class: "rect",
			xorg: 40,
			yorg: squish.canvas.height - 110,
			width: 60,
			height: 30,
			visuals: {
				fill: squish.colors.mainMenuFill,
			},
		},
		{
			class: "text",
			xorg: 70,
			yorg: squish.canvas.height - 89,
			text: function() {
				return Math.ceil(squish.assets.bgm_get_volume() / 1 * 100).toString() + "%";
			},
			live: true,
		},

		// Volume +
		{
			class: "button",
			xorg: 105,
			yorg: squish.canvas.height - 110,
			width: 30,
			height: 30,
			carea: "AudioPlus",
			label: {
				text: '+',
			}
		},

		// Loop
		{
			class: "button",
			xorg: 5,
			yorg: squish.canvas.height - 145,
			width: 30,
			height: 30,
			carea: "AudioModeSwitch",
			icon: {
				live: true,
				src: function() {
					if (squish.assets.bgm_play_mode() == "loop") {
						return "images/game/audio_random.gif";
					} else {
						return "images/game/audio_loop.gif";
					}
				}
			},
		},

		// Next
		{
			class: "button",
			xorg: 40,
			yorg: squish.canvas.height - 145,
			width: 30,
			height: 30,
			carea: "AudioNext",
			icon: {
				src: "images/game/audio_next.gif",
			}
		}
	];

	mod.AchSubMenu = [
		{
			class: "rect",
			xorg: squish.canvas.width/2 - 350,
			yorg: squish.canvas.height/2 - 150,
			width: 700,
			height: 300,
			visuals: {
				live: true,
				fill: function() {return squish.colors.mainMenuFill;},
			}
		},
		{
			class: "button",
			xorg: squish.canvas.width/2 - 30,
			yorg: squish.canvas.height/2 + 125,
			width: 60,
			height: 20,
			carea: "AchSubMenuLeave",
			label: {
				text: "Exit",
				y_proportion: 0.8,
				fill: true,
				visuals: {
					live: true,
					stroke: function() {return squish.ctx.strokeStyle;},
					fill: function() {
						var orcol = new squish.colors.color(0,0,0)
						orcol.decs(squish.ctx.strokeStyle);
						return orcol.get_dark().hex();
					}
				}
					
			}
		},
		{
			class: "rect",
			xorg: squish.canvas.width/2 - 64,
			yorg: squish.canvas.height/2 - 135,
			width: 128,
			height: 128,
			visuals: {
				fill: squish.colors.achListEven,
				stroke: squish.colors.black,
			}
		},
		{
			class: "image",
			xorg: squish.canvas.width/2 - 64,
			width: 128,
			yorg: squish.canvas.height/2 - 135,
			height: 128,
			live: true,
			src: function() {
				const ach = squish.volatile.read("mainmenu_ach_submenu");
				if (squish.achievements.is_triggered(ach)) {
					return squish.achievements.get_data(ach).icon;
				} else {
					return "./images/game/notthereyet.gif";
				}
			}
		},
		{
			class: "line",
			xorg: squish.canvas.width/2 - 345,
			yorg: squish.canvas.height/2,
			width: 680,
			height: 0,
		},
		{
			class: "text",
			xorg: squish.canvas.width/2,
			yorg: squish.canvas.height/2 + 25,
			live: true,
			text: function() {
				return squish.achievements.get_data(squish.volatile.read("mainmenu_ach_submenu")).title;
			},
			fill: true,
			visuals: {
				fill: squish.colors.red,
				stroke: squish.colors.pink,
				font: "25px Arial",
			}
		},
		{
			class: "line",
			xorg: squish.canvas.width/2 - 345,
			yorg: squish.canvas.height/2 + 35,
			width: 680,
			height: 0
		},
		{
			class: "text",
			xorg: squish.canvas.width/2,
			yorg: squish.canvas.height/2 + 80,
			live: true,
			text: function() {
				const ach = squish.volatile.read("mainmenu_ach_submenu");
				if (squish.achievements.is_triggered(ach)) {
					return squish.achievements.get_data(ach).menu.desc;
				} else {
					return squish.achievements.get_data(ach).menu.howto;
				}
			},
			fill: true,
			stroke: false,
			visuals: {
				font: "15px Arial",
				fill: squish.colors.red,
			}
		},
		{
			class: "line",
			xorg: squish.canvas.width/2 - 345,
			yorg: squish.canvas.height/2 + 120,
			width: 680,
			height: 0,
		}
	];

       	mod.ScoreBar = [
           {
               class: "rect",
               xorg: 5,
               yorg: 5,
               width: squish.canvas.width - 10,
               height: 30,
               visuals: {
                       live: true,
                       fill: function() {return squish.colors.mainMenuFill;},
               }
           },
           {
               class: "text",
               live: true,
               xorg: squish.canvas.width / 2,
               yorg: 27,
               stroke: false,
               text: function() {
                   if (squish.gamedata.score == -1) { return ""; }
                   return squish.gamedata.score.toString();
               },
               visuals: {
                   fill: squish.colors.textFill,
               }
           }
       ];

       mod.AudioBar = [
           {
               class: "rect",
               xorg: 40,
               yorg: squish.canvas.height - 35,
               width: squish.canvas.width - 80,
               height: 30,
               visuals: {
                       live: true,
                       fill: function() {return squish.colors.mainMenuFill;},
               }
           },
           {
               class: "text",
               live: true,
               xorg: squish.canvas.width / 2,
               yorg: squish.canvas.height - 13,
               stroke: false,
               text: function() {
                       var np = squish.assets.now_playing();
                       if (np.path == "") { return ""; }
                       return "Now Playing : " + np.title;
               },
               visuals: {
                   fill: squish.colors.textFill,
                   font: "Arial 24px",
               }
           },
       ];

       mod.Banner = [
           {
               class: "rect",
               xorg: 0,
               yorg: squish.canvas.height / 2 - 45,
               width: squish.canvas.width,
               height: 90,
               visuals: {
                       live: true,
                       fill: function() {return squish.colors.mainMenuFill;},
                       stroke: function() {return squish.colors.mainMenuStroke;},
               }
           },
       ];

	mod.StartButton = [
		{
			class: "button",
			xorg: squish.canvas.width / 16 * 7.5,
			yorg: squish.canvas.height / 2 - 15,
			width: squish.canvas.width / 16,
			height: 30,
			carea: "StartButton",
			visuals: {
				pressed: squish.colors.startButtonPressedFill,
				nothing: squish.colors.startButtonFill,
			},
			label: {
				text: "Play",
				stroke: false,
				visuals: {
					fill: squish.colors.startButtonLabel,
				}
			},
		},
       ];

       // Methods
       // Draw elements
       mod.draw = function(tab) {
               for (var i = 0; i < tab.length; i++) {
                       var obj = tab[i];

                       if (obj.visuals) {
                               if (obj.visuals.stroke) {
                                       if (obj.visuals.stroke == "currentFill") {
                                               squish.VisualSwap.setSecondStroke(squish.ctx.fillStyle);
                                       } else if (obj.visuals.live) {
                                               squish.VisualSwap.setSecondStroke(obj.visuals.stroke());
                                       } else {
                                               squish.VisualSwap.setSecondStroke(obj.visuals.stroke);
                                       }
                                       squish.VisualSwap.useSecondStroke();
                               }

                               if (obj.visuals.fill) {
                                       if (obj.visuals.fill == "currentStroke") {
                                               squish.VisualSwap.setSecondFill(squish.ctx.strokeStyle);
                                       } else if (obj.visuals.live) {
                                               squish.VisualSwap.setSecondFill(obj.visuals.fill());
                                       } else {
                                               squish.VisualSwap.setSecondFill(obj.visuals.fill);
                                       }
                                       squish.VisualSwap.useSecondFill();
                               }

                               if (obj.visuals.font) {
                                       squish.VisualSwap.setSecondFont(obj.visuals.font);
                                       squish.VisualSwap.useSecondFont();
                               }
                       }

                       if (obj.class == "rect") {
                               if (obj.stroke == null || obj.stroke == true) {
                                       squish.ctx.strokeRect(obj.xorg, obj.yorg, obj.width, obj.height);
                               }

                               if (obj.fill == null || obj.fill == true) {
                                       squish.ctx.fillRect(obj.xorg, obj.yorg, obj.width, obj.height);
                               }

                       } else if (obj.class == "line") {
                               squish.ctx.beginPath();
                               squish.ctx.moveTo(obj.xorg, obj.yorg);
                               squish.ctx.lineTo(obj.xorg + obj.width, obj.yorg + obj.height);
                               squish.ctx.stroke();

                       } else if (obj.class == "text") {
                               var txt;
                               if (obj.live == true) {
                                       txt = "" + obj.text();
                               } else {
                                       txt = obj.text;
                               }

                               if (obj.fill == null || obj.fill == true) {
                                       squish.ctx.fillText(txt, obj.xorg, obj.yorg, obj.maxwidth);
                               }
                               if (obj.stroke == null || obj.stroke == true) {
                                       squish.ctx.strokeText(txt, obj.xorg, obj.yorg, obj.maxwidth);
                               }

                       } else if (obj.class == "canvas") {
                               // We translate 0, 0 to the squish.canvas's origin point, then fix it
                               squish.ctx.translate(obj.xorg, obj.yorg);
                               mod.draw(obj.children);
                               squish.ctx.translate(-obj.xorg, -obj.yorg);

                       } else if (obj.class == "image") {
                               var src = obj.src;
                               if (obj.live) {
                                       src = src();
                               }
                               squish.ctx.drawImage(squish.assets.get_image(src), // img
                                        obj.xorg, obj.yorg, // x, y
                                        obj.width, obj.height // width height
                                        );
                        } else if (obj.class == "button") {
				if (!obj.visuals) {
					obj.visuals = {};
				}
				var compdraw = [{
					class: "rect",
					xorg: obj.xorg,
					width: obj.width,
					yorg: obj.yorg,
					height: obj.height,
					fill: obj.fill,
					stroke: obj.stroke,
					visuals: {
						live: true,
						stroke: function() {return obj.visuals.stroke;},
						fill: function() {
							if (!squish.clickable.is_enable(obj.carea)) {
								return obj.visuals.disabled || squish.colors.menuButtonDisabled;
							} else if (squish.mouse.clicked == obj.carea) {
								return obj.visuals.pressed || squish.colors.menuButtonPressed;
							} else if (squish.mouse.hovering == obj.carea) {
								return obj.visuals.hovered || squish.colors.menuButtonHovered;
							} else {
								return obj.visuals.nothing || squish.colors.mainMenuFill;
							}
						}
					},
				}];
				if (obj.label) {
					obj.label.class = "text";
					obj.label.yorg = obj.yorg + obj.height * (obj.label.y_proportion || 0.7);
					obj.label.xorg = obj.xorg + obj.width * 0.5;
					compdraw.push(obj.label);
				}
				if (obj.icon) {
					obj.icon.class = "image";
					obj.icon.height = obj.height;
					obj.icon.width = obj.width;
					obj.icon.xorg = obj.xorg;
					obj.icon.yorg = obj.yorg;
					compdraw.push(obj.icon);
				}
				mod.draw(compdraw);
			}

                }
                squish.VisualSwap.useMainFont();
                squish.VisualSwap.useMainFill();
                squish.VisualSwap.useMainStroke();
        };

       return mod;
}());
