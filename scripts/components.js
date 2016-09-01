"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.93

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
                        class: "rect",
                        xorg: 5,
                        yorg: squish.canvas.height - 35,
                        width: 30,
                        height: 30,
                        visuals: {
                                live: true,
                                fill: function() {
                                        if (squish.mouse.clicked == "AudioMenu") {
                                                return squish.colors.menuButtonPressed;
                                        } else if (squish.mouse.hovering == "AudioMenu") {
                                                return squish.colors.menuButtonHovered;
                                        } else {
                                                return squish.colors.mainMenuFill;
                                        }
                                },
                        }
                },
                {
                        class: "image",
                        xorg: 5,
                        yorg: squish.canvas.height - 35,
                        width: 30,
                        height: 30,
                        src: "images/game/audio_menu.gif",
                }
        ],

        mod.MenuButton = [
            {
                class: "rect",
                xorg: squish.canvas.width - 35,
                yorg: squish.canvas.height - 35,
                width: 30,
                height: 30,
                visuals: {
                        live: true,
                        fill: function() {
                                if (squish.mouse.clicked == "MainMenu") {
                                        return squish.colors.menuButtonPressed;
                                } else if (squish.mouse.hovering == "MainMenu") {
                                        return squish.colors.menuButtonHovered;
                                } else {
                                        return squish.colors.mainMenuFill;
                                }
                        },
                }
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
                        class: "rect",
                        xorg: 10,
                        yorg: squish.canvas.height - 80,
                        width: squish.canvas.width / 2 - 15,
                        height: 35,
                        visuals: {
                                stroke: "#33cfdf",
                                fill: squish.colors.cookieSaverFill,
                       }
               },
               {
                       class: "text",
                       xorg: squish.canvas.width / 4 - 2.5,
                       yorg: squish.canvas.height - 55,
                       text: "Save game data",
                       visuals: {
                               fill: "#000000",
                               stroke: "#003322"
                       }
               },
               // Clear Game Data
               {
                       class: "rect",
                       xorg: 10,
                       yorg: squish.canvas.height - 120,
                       width: squish.canvas.width / 2 - 15,
                       height: 35,
                       visuals: {
                               live: true,
                               stroke: function() {return "#22cd64";},
                               fill: function() {return squish.colors.cookieCleanerFill;}
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
			class: "rect",
			xorg: 5,
			yorg: squish.canvas.height - 75,
			width: 30,
			height: 30,
			visuals: {
				live: true,
				fill: function() {
					if (squish.mouse.clicked == "AudioMute") {
						return squish.colors.menuButtonPressed;
					} else if (squish.mouse.hovering == "AudioMute") {
						return squish.colors.menuButtonHovered;
					} else {
						return squish.colors.mainMenuFill;
					}
				},
			}
		},
		{
			class: "image",
			xorg: 5,
			yorg: squish.canvas.height - 75,
			width: 30,
			height: 30,
			live: true,
			src: function() {
				if (squish.assets.bgm_get_volume() > 0) {
					return "images/game/audio_mute.gif";
				} else {
					return "images/game/audio_unmute.gif";
				}
			}
		},

		// Volume -
		{
			class: "rect",
			xorg: 5,
			yorg: squish.canvas.height - 110,
			width: 30,
			height: 30,
			visuals: {
				live: true,
				fill: function() {
					if (squish.assets.bgm_get_volume() == 0) {
						return squish.colors.menuButtonDisabled;
					} else if (squish.mouse.clicked == "AudioMinus") {
						return squish.colors.menuButtonPressed;
					} else if (squish.mouse.hovering == "AudioMinus") {
						return squish.colors.menuButtonHovered;
					} else {
						return squish.colors.mainMenuFill;
					}
				},
			}
		},
		{
			class: "text",
			xorg: 20,
			yorg: squish.canvas.height - 89,
			text: "-",
			fill: true,
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
			class: "rect",
			xorg: 105,
			yorg: squish.canvas.height - 110,
			width: 30,
			height: 30,
			visuals: {
				live: true,
				fill: function() {
					if (squish.assets.bgm_get_volume() == 1) {
						return squish.colors.menuButtonDisabled;
					} else if (squish.mouse.clicked == "AudioPlus") {
						return squish.colors.menuButtonPressed;
					} else if (squish.mouse.hovering == "AudioPlus") {
						return squish.colors.menuButtonHovered;
					} else {
						return squish.colors.mainMenuFill;
					}
				},
			}
		},
		{
			class: "text",
			xorg: 120,
			yorg: squish.canvas.height - 89,
			text: '+',
		},

		// Loop
		{
			class: "rect",
			xorg: 5,
			yorg: squish.canvas.height - 145,
			width: 30,
			height: 30,
			visuals: {
				live: true,
				fill: function() {
					if (squish.mouse.clicked == "AudioModeSwitch") {
						return squish.colors.menuButtonPressed;
					} else if (squish.mouse.hovering == "AudioModeSwitch") {
						return squish.colors.menuButtonHovered;
					} else {
						return squish.colors.mainMenuFill;
					}
				},
			}
		},
		{
			class: "image",
			xorg: 5,
			yorg: squish.canvas.height - 145,
			width: 30,
			height: 30,
			live: true,
			src: function() {
				if (squish.assets.bgm_play_mode() == "loop") {
					return "images/game/audio_random.gif";
				} else {
					return "images/game/audio_loop.gif";
				}
			},
		},

		// Next
		{
			class: "rect",
			xorg: 40,
			yorg: squish.canvas.height - 145,
			width: 30,
			height: 30,
			visuals: {
				live: true,
				fill: function() {
					if (squish.mouse.clicked == "AudioNext") {
						return squish.colors.menuButtonPressed;
					} else if (squish.mouse.hovering == "AudioNext") {
						return squish.colors.menuButtonHovered;
					} else {
						return squish.colors.mainMenuFill;
					}
				},
			},
		},
		{
			class: "image",
			xorg: 40,
			yorg: squish.canvas.height - 145,
			width: 30,
			height: 30,
			src: "images/game/audio_next.gif",
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
                       class: "rect",
                       xorg: squish.canvas.width / 16 * 7.5,
                       yorg: squish.canvas.height / 2 - 15,
                       width: squish.canvas.width / 16,
                       height: 30,
                       visuals: {
                               live: true,
                               fill: function() {
                                       if (squish.mouse.clicked == "StartButton") {
                                               return squish.colors.startButtonPressedFill;
                                       } else {
                                               return squish.colors.startButtonFill;
                                       }
                               }
                       }
               },
               {
                       class: "text",
                       text: "Play",
                       xorg: squish.canvas.width / 2,
                       yorg: squish.canvas.height / 2 + 5,
                       stroke: false,
                       visuals: {
                               fill: squish.colors.startButtonLabel,
                       }
               }
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
                        }
                }
                squish.VisualSwap.useMainFont();
                squish.VisualSwap.useMainFill();
                squish.VisualSwap.useMainStroke();
        };

       return mod;
}());
