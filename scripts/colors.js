"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.93

/*
        Colors

        Dependencies :
         - Hexadecimal : squish.hexa.dechex, squish.hexa.hexdec
         - Gamedata : squish.gamedata.config.theme
*/

squish.colors = (function() {
        var mod = {
                mainMenuFill: '#dddddd',
                mainMenuStroke: '#f00000',

                menuButtonHovered: '#dddd22',
                menuButtonPressed: '#dd2222',

                cookieSaverFill: '#db4540',
                cookieCleanerFill: '#db0000',

                deadEnemy: '#000000',

                overlapTag: '#0000ff',
                comboTag: '#00ffff',
                comboReset: '#ff00ff',
                textFill: '#2277ff',

                startButtonFill: '#ff6600',
                startButtonLabel: '#222288',
                startButtonPressedFill: '#66ff00',
                startButtonPressedLabel: '#888822',

                positiveScoreFloaty: '#00ff00',
                negativeScoreFloaty: '#ff0000',

                mouseCenter: '#ff0000',
                mouseRotor: '#ff2222',
                mouseCircle: '#000000',

                // Some defaults
                red: '#ff0000',
                green: '#00ff00',
                blue: '#0000ff',
                yellow: '#ffff00',
                magenta: '#ff00ff',
                cyan: '#00ffff',
                black: '#000000',
                white: '#ffffff',
        };

        // Color class
        mod.color = function(r, g, b) {
                this.red = r;
                this.green = g;
                this.blue = b;

                this.get_dark = function() {
                        var low = Math.min(this.red, Math.min(this.green, this.blue));
                        var nc = new mod.color(this.red - low, this.green - low, this.blue - low);
                        return nc;
                }

                this.hex = function() {
                        var str = '#';
                        str += squish.hexa.dechex(this.red);
                        str += squish.hexa.dechex(this.green);
                        str += squish.hexa.dechex(this.blue);
                        return str;
                }

                this.decs = function(col) {
                        this.red = squish.hexa.hexdec(col.slice(1, 3));
                        this.green = squish.hexa.hexdec(col.slice(3, 5));
                        this.blue = squish.hexa.hexdec(col.slice(5, 7));
                }
        };

        // Current color scheme/theme
        mod.toggle_theme = function() {
                if (squish.gamedata.config.theme == "day") {
                        // Switch to night
                        squish.colors.mainMenuFill = '#111111';
                        squish.colors.mainMenuStroke = '#00f000';
                        squish.gamedata.config.theme = "night";
                } else if (squish.gamedata.config.theme == "night") {
                        // Switch to day
                        squish.colors.mainMenuFill = '#dddddd';
                        squish.colors.mainMenuStroke = '#f00000';
                        squish.gamedata.config.theme = "day";
                }
        };
        window.toggle_theme = mod.toggle_theme;

        return mod;
}());
