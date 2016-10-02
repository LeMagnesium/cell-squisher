"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.94

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
        mod.achieved = [];
	mod.combo_path = [];

	/*mod.level_data = {
		spawnrate: 0.45,
		deaddecay: 15,
		decay: 5,
		start_balance: -100
	};*/

        /* Score */
        mod.increase_score = function(val, raw) {
                if (mod.combo > 1 && !raw) {
                        val *= mod.combo;
                }
		if (squish.boosters.doublethetrouble && val > 0) {
			val *= 2;
		}
                mod.score += val;

                if (mod.score < 0) {
			mod.score = 0;
                }
                squish.triggers.call("score", val);
                return val;
        };

	mod.scoreString = function() {
		var sc = mod.score.toString();
		//if (sc.length < 4) {return sc;}

		var ox = ((sc.length)%3) || 3; // If 0, it becomes 3, boom
		var nx = ox+3;
		var nc = sc.slice(0,ox);
		while (nx <= sc.length) {
			nc += "," + sc.slice(ox,nx);
			ox = nx;
			nx += 3;
		}
		return nc;
	};

	/* Combo Reset */
	mod.reset_combo = function() {
		mod.combo = 0;
		mod.combo_path = [];
	};

	/* Combo Path Drawing */
	mod.draw_combo_path = function() {
		if (mod.combo < 2) {return;}

		var point;
		//squish.ctx.beginPath();
		for (var i in mod.combo_path) {
			const npoint = mod.combo_path[i];
			squish.ctx.beginPath();
			squish.VisualSwap.setSecondFill(npoint[2]);
			squish.VisualSwap.useSecondFill();
			squish.ctx.arc(npoint[0], npoint[1], 2, 0, 2 * Math.PI, false);
			squish.ctx.fill();
			squish.ctx.stroke();
			if (point) {
				squish.ctx.beginPath();
				squish.ctx.moveTo(point[0], point[1]);
				squish.ctx.lineTo(npoint[0], npoint[1]);
				squish.ctx.stroke();
			}
			point = npoint;

		}
	};

	mod.theme = "day";

        // Config trash
        mod.config = {
          extrafloaties: true,
        };

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
    align: "center",
    secalign: "left",

    usedFill: true, // true for Main, false for Second
    usedStroke: true, // same
    usedFont: true, // same
    usedAlign: true, // same

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
        squish.ctx.font = this.secfont;
    },

    setMainAlign: function(align) {
    	this.align = align;
	if (this.usedAlign) {
		squish.ctx.textAlign = align;
	};
    },
    useMainAlign: function() {
    	this.usedAlign = true;
	squish.ctx.textAlign = this.align;
    },

    setSecondAlign: function(align) {
    	this.secalign = align;
	if (!this.usedAlign) {
		squish.ctx.textAlign = align;
	}
    },
    useSecondAlign: function() {
    	this.usedFont = false;
	squish.ctx.textAlign = this.secalign;
    },
};
