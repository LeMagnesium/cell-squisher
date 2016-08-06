"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.91

/*
        Game Data

        Dependencies :
         - Triggers : squish.triggers.call
         */

squish.gamedata = (function() {
        var mod = {};
        mod.score = -1;
        mod.combo = 0;
        mod.menu = "start";
        mod.overlap = 0;
        mod.last_cookie_save = 0;
        mod.now = 0;

        /* Score */
        mod.increase_score = function(int, raw) {
                if (mod.combo > 1 && !raw) {
                        int *= mod.combo;
                }
                mod.score += int;

                if (mod.score < 0) {
                        mod.score = 0;
                }
                squish.triggers.call("score");
                return int;
        };

        // Config trash
        mod.config = {
          extrafloaties: true,
          theme: "day",
        }

        return mod;
}());

// VisualSwap
// Color and font swapper
squish.VisualSwap = {
    fill: "#000000",
    stroke: "#000000",
    secfill: "#ffffff",
    secstroke: "#ffffff",
    font: "Arial 20px",
    secfont: "Arial 14px",

    usedFill: true, // true for Main, false for Second
    usedStroke: true, // same
    usedFont: true, // same

    setMainFill: function(col) {
        this.fill = col;
        if (this.usedFill) {
            squish.ctx.fillStyle = col;
        }
    },
    useMainFill: function() {
        this.usedFill = true;
        squish.ctx.fillStyle = this.fill;
    },

    setSecondFill: function(col) {
        this.secfill = col;
        if (!this.usedFill) {
            squish.ctx.fillStyle = col;
        }
    },
    useSecondFill: function(col) {
        this.usedFill = false
        squish.ctx.fillStyle = this.secfill;
    },

    setMainStroke: function(col) {
        this.stroke = col;
        if (this.usedStroke) {
            squish.ctx.strokeStyle = col;
        }
    },
    useMainStroke: function() {
        this.usedStroke = true;
        squish.ctx.strokeStyle = this.stroke;
    },

    setSecondStroke: function(col) {
        this.secstroke = col;
        if (!this.usedStroke) {
            squish.ctx.strokeStyle = col;
        }
    },
    useSecondStroke: function(col) {
        this.usedStroke = false;
        squish.ctx.strokeStyle = this.secstroke;
    },

    setMainFont: function(font) {
        this.font = font;
        if (this.usedFont) {
            squish.ctx.font = font;
        }
    },
    useMainFont: function() {
        this.usedFont = true;
        squish.ctx.font = this.font;
    },

    setSecondFont: function(font) {
        this.secfont = font;
        if (!this.usedFont) {
            squish.ctx.font = font
        }
    },
    useSecondFont: function() {
        this.usedFont = false;
        squish.ctx.font = this.font;
    },
};
