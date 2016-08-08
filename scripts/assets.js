"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.92

/*
        Assets

        Dependencies : none
*/

squish.assets = (function(){
        var mod = {};

        /* Images */
        // Images once loaded
        var images = [];

        mod.register_image = function(path) {
                var im = new Image();
                im.src = path;
                images[path] = im;
        }

        mod.get_image = function(path) {
                if (!images[path]) {
                        mod.register_image(path);
                }
                return images[path];
        }

        /* Sounds */
        // Audio
        var sounds = [
                "audio/No Rocking in the Jazzhands Zone.mp3",
                "audio/Skipping Through the Orchestra Pit.mp3",
                "audio/Babylon.mp3",
                "audio/Club Diver.mp3",
                "audio/The Missing Link - Funk-a-Dump.mp3",
                "audio/The Missing Link - Sugarcow.mp3"
        ];

        var audio_titles = [
                "Peter Gresser - No Rocking the Jazzhands Zone",
                "Peter Gresser - Skipping Through the Orchestra Pit",
                "Kevin MacLeod - Babylon",
                "Kevin MacLeod - Club Diver",
                "The Missing Link - Funk-a-Dump",
                "The Missing Link - Sugarcow"
        ];

        var nowPlaying = -1;
        var bgm;

        mod.sound = function() {
                this.sound = document.createElement("audio");
                this.sound.setAttribute("preload", "auto");
                this.sound.setAttribute("controls", "none");
                this.sound.style.display = "none";
                document.body.appendChild(this.sound);
                this.play = function(src) {
                        this.sound.src = src;
                        this.sound.play();
                }
        }

        mod.bgm_music = function() {
                this.sound = document.createElement("audio");
                this.sound.setAttribute("preload", "auto");
                this.sound.setAttribute("controls", "none");
                this.sound.style.display = "none";
                document.body.appendChild(this.sound);
                this.start = function() {
                        nowPlaying = Math.floor(Math.random() * sounds.length);
                        this.sound.src = sounds[nowPlaying];
                        this.sound.play();
                };
                this.play = function() {
                        this.sound.play();
                }
                this.pause = function() {
                        this.sound.pause();
                }
                this.sound.onended = function() {
                        bgm = new mod.bgm_music();
                        bgm.start();
                }
        }

        mod.pause_bgm = function() {
                bgm.pause();
        }
        mod.start_bgm = function() {
                bgm.start();
        }

        mod.now_playing = function() {
                if (nowPlaying == -1) {return {path: "", title: ""};}
                return {path: sounds[nowPlaying], title: audio_titles[nowPlaying]};
        }

        squish.triggers.hook("start", function() {
                bgm = new mod.bgm_music(-1);
                bgm.start();
        });

        return mod;
}());
