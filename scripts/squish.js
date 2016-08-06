"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.91

var version = 0.91;

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


// NOW CUSTOM DEFINITIONS USING THOSE PREVIOUS CLASS/METHODS //
function draw() {
        // Enemies
        if (Math.random() < 0.5) {
                // New enemy at random coords
                (new squish.enemies.enemy()).spawn();
        }

        // Draw enemies
        squish.enemies.draw();

        // Draw floaties
        squish.floaties.draw();
}

function mainloop() {
        requestAnimationFrame(mainloop);
        // Update game clock
        squish.gamedata.now = new Date().getTime();

        if (squish.gamedata.menu == "main" && !squish.clickable.areas["SaveToCookie"].active && squish.gamedata.now - squish.gamedata.last_cookie_save > 90000) {
                squish.clickable.enable("SaveToCookie");
        }

        // Clear
        squish.ctx.clearRect(0, 0, squish.canvas.width, squish.canvas.height);

        // Background
        squish.ctx.fillStyle = bg.hex();
        squish.ctx.fillRect(0, 0, squish.canvas.width, squish.canvas.height);

        switch (squish.gamedata.menu) {
                case "start":
                        draw_wait_menu();
                        break;
                case "main":
                        squish.components.draw(squish.components.MainMenu);
                        break;
                case "":
                        draw();
                        break;
        }

        // Score
        squish.components.draw(squish.components.ScoreBar);

        // Now Playing
        squish.components.draw(squish.components.AudioBar);

        // Menu button
        squish.components.draw(squish.components.MenuButton);

        // Sliding announces
        squish.slider.draw();

        // Mouse
        squish.mouse.draw();
        squish.triggers.call("step");
//        mainloop();
}


window.onload = function() {
        squish.clickable.enable("StartButton");
        squish.triggers.call("load");
        mainloop();
}
