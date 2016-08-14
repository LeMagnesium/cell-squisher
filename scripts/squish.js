"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.93

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

// Lag profile : { max: 40, min: 1, avg: 7.461604619732151, cnt: 16278 }
function mainloop() {
        requestAnimationFrame(mainloop);

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
                case "audio":
                        squish.components.draw(squish.components.AudioMenu);
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
}


window.onload = function() {
        squish.cookies.eat();
        squish.clickable.enable("StartButton");
        squish.triggers.call("load");
        mainloop();
}
