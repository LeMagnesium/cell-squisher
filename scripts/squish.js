"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.94

// Other misc definitions
var bg = new squish.colors.color(255, 255, 255);

squish.VisualSwap.setMainFont("20px Arial");
squish.VisualSwap.useMainFont();
squish.VisualSwap.setMainFill(squish.colors.mainMenuFill);
squish.VisualSwap.useMainFill();
squish.VisualSwap.setMainStroke(squish.colors.mainMenuStroke);
squish.VisualSwap.useMainStroke();
squish.VisualSwap.setMainAlign("center");
squish.VisualSwap.useMainAlign();

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;


function draw() {
	// Draw the combo path
	squish.gamedata.draw_combo_path();

        var d = Math.floor(squish.gamedata.combo / 200) * 2;
        var x = Math.ceil(Math.random() * d) - d/2;
        var y = Math.ceil(Math.random() * d) - d/2;

        squish.ctx.translate(x, y);

        // Draw enemies
        // Lag profile : { max: 30, min: 1, avg: 13.154655119084435, cnt: 6466 }
        // HIGH LAG
        squish.enemies.draw();
        squish.ctx.translate(-x, -y);
	
	squish.spiders.draw();

        // Draw floaties
        // Lag : 1-2ms
        squish.floaties.draw();
}


// Lag profile : { max: 40, min: 1, avg: 7.461604619732151, cnt: 16278 }
var FPS=90;
function mainloop() {
	window.setTimeout(mainloop, 1000/FPS);
	//requestAnimationFrame(mainloop);

        // Clear
        // Lag : <1ms;
        squish.ctx.clearRect(0, 0, squish.canvas.width, squish.canvas.height);

	// Background
        // Lag : <1ms;
        squish.ctx.fillStyle = bg.hex();
        squish.ctx.fillRect(0, 0, squish.canvas.width, squish.canvas.height);

        switch (squish.gamedata.menu) {
                case "":
                        // Lag profile : Object { max: 31, min: 1, avg: 14.992790500424082, cnt: 2358 }
                        // HIGH LAG
                        draw();
                        break;
		default:
			squish.menu.draw(squish.gamedata.menu);
			break;
        }

	// Evergreen components
	// Score
        // Lag: ~1ms
        squish.components.draw(squish.components.ScoreBar);

        // Now Playing
        // Lag: ~1ms
        squish.components.draw(squish.components.AudioBar);

        // Menu button
        // Lag : ~1ms
        squish.components.draw(squish.components.MenuButton);

        // Audio button
        // Lag profile : unknown
        squish.components.draw(squish.components.AudioButton);

        // Sliding announces
        // Lag profile : { max: 8, min: 0, avg: 0.18591913961362197, cnt: 20084 }
        squish.slider.draw();

        // Mouse
        // Lag : 1ms<x<2ms
        squish.mouse.draw();

        // Step trigger
        // Lag : <1ms
        squish.triggers.call("step");

	if (squish.boosters.nobelprize) {
		if (!squish.volatile.exists("ending_transition")) {
			squish.volatile.store("ending_transition", 0);
		} else {
			squish.volatile.store("ending_transition", squish.volatile.read("ending_transition") + 1);
			if (squish.volatile.read("ending_transition") == 255) {
				squish.game_finished = true;
				squish.boosters.nobelprize = false;
				squish.menu.switch("game_end");
			}
		}

		squish.VisualSwap.setSecondFill("rgba(255, 255, 255, " + (squish.volatile.read("ending_transition")/255).toString() + ")");
		squish.VisualSwap.useSecondFill();
		squish.ctx.fillRect(0, 0, squish.canvas.width, squish.canvas.height);
	}
}


window.onload = function() {
        squish.triggers.call("load");
        mainloop();
}
