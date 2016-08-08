"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.92

// Other misc definitions
var bg = new squish.colors.color(255, 255, 255);

squish.VisualSwap.setMainFont("20px Arial");
squish.VisualSwap.useMainFont();
squish.VisualSwap.setMainFill(squish.colors.mainMenuFill);
squish.VisualSwap.useMainFill();
squish.VisualSwap.setMainStroke(squish.colors.mainMenuStroke);
squish.VisualSwap.useMainStroke();
squish.ctx.textAlign = "center";

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

/*
 *      Definitions of global data
 */


/* Menu things (main and wait) */
// Waiting menu
function draw_wait_menu() {
        // Score
        squish.components.draw(squish.components.ScoreBar);

        // Now Playing
        squish.components.draw(squish.components.AudioBar);

        // Menu button
        squish.components.draw(squish.components.MenuButton);

        // Banner
        squish.components.draw(squish.components.Banner);

        // Play Button
        squish.components.draw(squish.components.StartButton);

        // Mouse
        squish.mouse.draw();
}

// Bake us a cookie


function draw() {
        // Enemies spawn
        // Lag : <1ms
        if (Math.random() < 0.45) {
                // New enemy at random coords
                (new squish.enemies.enemy()).spawn();
        }

        // Draw enemies
        // Lag profile : { max: 30, min: 1, avg: 13.154655119084435, cnt: 6466 }
        // HIGH LAG
        squish.enemies.draw();

        // Draw floaties
        // Lag : 1-2ms
        squish.floaties.draw();
}

function mainloop() {
        requestAnimationFrame(mainloop);
        // Update game clock
        // <1ms
        squish.gamedata.now = new Date().getTime();

        // FIXME
        if (squish.gamedata.menu == "main" && !squish.clickable.areas["SaveToCookie"].active && squish.gamedata.now - squish.gamedata.last_cookie_save > 90000) {
                squish.clickable.enable("SaveToCookie");
        }

        // Clear
        // Lag : <1ms;
        squish.ctx.clearRect(0, 0, squish.canvas.width, squish.canvas.height);

        // Background
        // Lag : <1ms;
        squish.ctx.fillStyle = bg.hex();
        squish.ctx.fillRect(0, 0, squish.canvas.width, squish.canvas.height);

        switch (squish.gamedata.menu) {
                case "start":
                        // Lag : 1ms
                        draw_wait_menu();
                        break;
                case "main":
                        // Lag : 3-5ms
                        // Moderate lag
                        squish.components.draw(squish.components.MainMenu);
                        squish.floaties.draw();
                        break;
                case "":
                        // Lag : 7-19ms
                        // HIGH LAG
                        draw();
                        break;
        }

        // Score
        // Lag: ~1ms
        squish.components.draw(squish.components.ScoreBar);

        // Now Playing
        // Lag: ~1ms
        squish.components.draw(squish.components.AudioBar);

        // Menu button
        // Lag : ~1ms
        squish.components.draw(squish.components.MenuButton);

        // Sliding announces -- Moderatee lag
        // None : <1ms
        // Idling : 4ms<x<7ms
        // Active : 1ms<x<4ms
        squish.slider.draw();

        // Mouse
        // Lag : 1ms<x<2ms
        squish.mouse.draw();

        // Step trigger
        // Lag : <1ms
        squish.triggers.call("step");
}


window.onload = function() {
        squish.clickable.enable("StartButton");
        squish.triggers.call("load");
        mainloop();
}
