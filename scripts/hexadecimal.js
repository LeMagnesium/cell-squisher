"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.93

/*
        Hexadecimal

        Dependencies : None
*/
squish.hexa = (function() {
        var mod = {};

        // Hexadecimal garbage
        var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

        mod.dechex = function(int) {
                return hex[int >> 4] + hex[int & 15];
        };

        mod.hexdec = function(he) {
                var dec = 0;
                for (var i = 0; i < he.length; i++) {
                        dec = dec << 4;
                        dec += hex.indexOf(he[i]);
                }
                return dec;
        };

        return mod;
}());
