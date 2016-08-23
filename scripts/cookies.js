"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.93

/*
        Cookies

        Dependencies :
         - Gamedata : squish.gamedata.score, squish.gamedata.achieved, squish.gamedata.config.extrafloaties
         - Achievements : squish.achievements.triggers
         - Triggers : squish.triggers.hook
*/

squish.cookies = (function() {
        var mod = {};

        // Store the cookies
        mod.store = function(name, val, exp) {
                document.cookie = name + "=" + val + "; " + exp;
        }

        // Bake/Make us cookies
        mod.bake = function() {
                // Expiration
                var d = new Date();
                squish.gamedata.last_cookie_save = d.getTime();
                d.setTime(d.getTime() + (100*24*60*60*1000));
                var exp = "expires=" + d.toUTCString();

                // Achieved
                mod.store("achieved", squish.gamedata.achieved, exp);

                // Config
                // Extrafloaties
                mod.store("config.extrafloaties", squish.gamedata.config.extrafloaties, exp);

                // Score
                mod.store("score", squish.gamedata.score, exp);
        }

        // Eat/Load cookies
        mod.eat = function() {
                var str = document.cookie;
                var strs = str.split("; ");
                if (strs.length > 0) {
                        squish.gamedata.last_cookie_save = (new Date()).getTime();
                }

                for (var x in strs) {
                        var name = strs[x].split("=")[0];
                        var data = strs[x].split("=")[1];
                        switch (name) {
                                case "score":
                                        squish.gamedata.score = Number(data);
                                        break;

                                case "achieved":
                                        var achs = data.split(',');
                                        for (var ach in achs) {
                                                var d = squish.achievements.trigger(achs[ach], true);
                                        }

                                case "config.extrafloaties":
                                        squish.gamedata.config.extrafloaties = data || true;
                        }
                }
        }

        // Trash/Clear cookies
        mod.trash = function() {
                document.cookie = "score=; expires=Wed, 01 Jan 1970";
                document.cookie = "achieved=; expires=Wed, 01 Jan 1970";
                document.cookie = "config.extrafloaties=; expires=Wed, 01 Jan 1970";
                document.cookie = "lcs=; expires=Wed, 01 Jan 1970";
                squish.gamedata.last_cookie_save = 0; // Literally 0s from Epoch
        }

        return mod;
})();

squish.triggers.hook("load", function() {
        squish.cookies.eat();
});
