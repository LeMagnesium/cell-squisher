"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.94

/*
 * 	Levels
 *
 * 	Dependencies :
 * 		- Triggers : squish.triggers.hook
 */

squish.levels = (function() {
	var mod = {};
	mod.level = 0;
	mod.spawn_rate = 0;
	mod.initial_balance = 0;
	mod.decay = 0;
	mod.dead_decay = 0;

	const levels = [
		{next_level_at: 0, spawn_rate: 0, initial_balance: 0, decay: 0, dead_decay: 0},
		{next_level_at: 5000, spawn_rate: 0.01, initial_balance: -100, decay: 2, dead_decay: 4},
		{next_level_at: 25000, spawn_rate: 0.02, initial_balance: -1000, decay: 5, dead_decay: 8},
		{next_level_at: 9000000000, spawn_rate: 0.45, initial_balance: -100, decay: 4, dead_decay: 15},
	];

	mod.next_level = function() {
		mod.level += 1;
		if (levels[mod.level]) {
			mod.spawn_rate = levels[mod.level].spawn_rate;
			mod.initial_balance = levels[mod.level].initial_balance;
			mod.decay = levels[mod.level].decay;
			mod.dead_decay = levels[mod.level].dead_decay;
		}
	};

	squish.triggers.hook("score", function(score_mod) {
		if (levels[mod.level] && squish.gamedata.score >= levels[mod.level].next_level_at) {
			mod.next_level();
			(new squish.floaties.floaty("Level Up!", squish.mouse.x, squish.mouse.y, 2, 50, "25px Arial")).spawn();
		} else if (squish.gamedata.score == 0 && mod.level > 1) {
			// GAME OVER
			squish.menu.switch("gameover");
			squish.gameover = true;
			mod.spawn_rate = 0.7;
			mod.decay = 0;
			mod.dead_decay = 0;
		}
	});

	return mod;
})();

