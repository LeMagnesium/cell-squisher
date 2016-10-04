"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.94

// Memory
// Dependencies : None

squish.volatile = (function() {
	var mod = {}

	var register = {}

	mod.store = function(name, val) {
		register[name] = val;
	};

	mod.read = function(name) {
		return register[name];
	};

	mod.exists = function(name) {
		return register[name] != null;
	};

	mod.delete = function(name) {
		delete register[name];
	};

	return mod;
})();
