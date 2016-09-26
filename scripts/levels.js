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
		/* Level 0  */	{next_level_at: 0		, spawn_rate: 0,	initial_balance: 0,		decay: 0,	dead_decay: 0.0},
		/* Level 1  */	{next_level_at: 5000		, spawn_rate: 0.010,	initial_balance: -100,		decay: 1.0,	dead_decay: 4.0},
		/* Level 2  */	{next_level_at: 25000		, spawn_rate: 0.020,	initial_balance: -500,		decay: 1.5,	dead_decay: 8.0},
		/* Level 3  */	{next_level_at: 200000		, spawn_rate: 0.080,	initial_balance: -500,		decay: 1.8,	dead_decay: 8.0},
		/* Level 4  */	{next_level_at: 500000		, spawn_rate: 0.095,	initial_balance: -450,		decay: 2.0,	dead_decay: 9.0},
		/* Level 5  */	{next_level_at: 1000000		, spawn_rate: 0.120,	initial_balance: -425,		decay: 2.1,	dead_decay: 9.0},
		/* Level 6  */	{next_level_at: 1500000		, spawn_rate: 0.145,	initial_balance: -410,		decay: 2.1,	dead_decay: 9.5},
		/* Level 7  */	{next_level_at: 2500000		, spawn_rate: 0.160,	initial_balance: -400,		decay: 2.2,	dead_decay: 9.9},
		/* Level 8  */	{next_level_at: 5000000		, spawn_rate: 0.180,	initial_balance: -390,		decay: 2.2,	dead_decay: 10.3}, 
		/* Level 9  */	{next_level_at: 8000000		, spawn_rate: 0.195,	initial_balance: -385,		decay: 2.3,	dead_decay: 10.5},
		/* Level 10 */	{next_level_at: 10000000	, spawn_rate: 0.220,	initial_balance: -375,		decay: 2.4,	dead_decay: 10.9},
		/* Level 11 */	{next_level_at: 10500000	, spawn_rate: 0.250,	initial_balance: -350,		decay: 2.6,	dead_decay: 11.6},
		/* Level 12 */	{next_level_at: 15000000	, spawn_rate: 0.272,	initial_balance: -315,		decay: 2.9,	dead_decay: 12.1},
		/* Level 13 */	{next_level_at: 20000000	, spawn_rate: 0.290,	initial_balance: -200,		decay: 3.5,	dead_decay: 12.4},
		/* Level 14 */	{next_level_at: 40000000	, spawn_rate: 0.325,	initial_balance: -170,		decay: 3.6,	dead_decay: 12.7},
		/* Level 15 */	{next_level_at: 60000000	, spawn_rate: 0.355,	initial_balance: -160,		decay: 3.8,	dead_decay: 13.0},
		/* Level 16 */	{next_level_at: 80000000	, spawn_rate: 0.380,	initial_balance: -150,		decay: 4.1,	dead_decay: 13.4},
		/* Level 17 */	{next_level_at: 100000000	, spawn_rate: 0.400,	initial_balance: -100,		decay: 4.5,	dead_decay: 13.7},
		/* Level 18 */	{next_level_at: 200000000	, spawn_rate: 0.445,	initial_balance: -85,		decay: 5.0,	dead_decay: 14.2},
		/* Level 19 */	{next_level_at: 300000000	, spawn_rate: 0.500,	initial_balance: -80,		decay: 5.5,	dead_decay: 14.8},
		/* Level 20 */	{next_level_at: 400000000	, spawn_rate: 0.550,	initial_balance: -75,		decay: 5.9,	dead_decay: 15.4},
		/* Level 21 */	{next_level_at: 500000000	, spawn_rate: 0.610,	initial_balance: -70,		decay: 6.3,	dead_decay: 16.0},
		/* Level 22 */	{next_level_at: 1000000000	, spawn_rate: 0.680,	initial_balance: -65,		decay: 6.8,	dead_decay: 16.5},
		/* Level 23 */	{next_level_at:	2000000000	, spawn_rate: 0.725,	initial_balance: -60,		decay: 7.0,	dead_decay: 17.3},
		/* Level 24 */	{next_level_at: 4500000000	, spawn_rate: 0.760,	initial_balance: -55,		decay: 7.3,	dead_decay: 18.0},
		/* Level 25 */	{next_level_at: 9000000000	, spawn_rate: 0.800,	initial_balance: -50,		decay: 8.0,	dead_decay: 19.5},
		/* Level ∞  */	{next_level_at: -1		, spawn_rate: 0.450,	initial_balance: -10,		decay: 4.0,	dead_decay: 15},
	];

	mod.next_level = function() {
		mod.level += 1;
		if (levels[mod.level]) {
			mod.spawn_rate = levels[mod.level].spawn_rate;
			mod.initial_balance = levels[mod.level].initial_balance;
			mod.decay = levels[mod.level].decay;
			mod.dead_decay = levels[mod.level].dead_decay;
			mod.next_level_at = levels[mod.level].next_level_at;
		}
	};

	squish.triggers.hook("score", function(score_mod) {
		if (levels[mod.level] && levels[mod.level].next_level_at >= 0 && squish.gamedata.score >= levels[mod.level].next_level_at) {
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

