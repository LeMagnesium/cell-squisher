"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.91

squish.triggers = (function(){
        var mod = {};

        // Triggers
        var triggers = [];

        // Trigger functions
        mod.register = function(name) {
                triggers[name] = [];
        }

        mod.hook = function(name, func) {
          triggers[name].push(func);
        }

        mod.call = function(name) {
                for (var i = 0; i < triggers[name].length; i++) {
                        triggers[name][i]();
                }
        };

        return mod;
}());

// Triggers
squish.triggers.register("start");
squish.triggers.register("mousemove");
squish.triggers.register("step");
squish.triggers.register("mousedown");
squish.triggers.register("score");
squish.triggers.register("load")