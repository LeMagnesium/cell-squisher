"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.93

/*
        Triggers

        Dependencies : None
*/

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

        mod.call = function(name, ...parameters) {
                for (var i = 0; i < triggers[name].length; i++) {
                        triggers[name][i](...parameters);
                }
        };

        return mod;
}());

// Triggers
squish.triggers.register("start");
squish.triggers.register("mousemove");
squish.triggers.register("step");
squish.triggers.register("mousedown");
squish.triggers.register("mouseup");
squish.triggers.register("score");
squish.triggers.register("load");
squish.triggers.register("menuenter");
squish.triggers.register("menuleave");
