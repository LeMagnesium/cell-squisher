"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.94

/*
        Assets

        Dependencies : none
*/

squish.assets = (function(){
        var mod = {};

	var audio_mode = "shuffle";
	/* Images */
        // Images once loaded
        var images = [];

        var preload = [
		"images/game/audio_loop.gif",
		"images/game/audio_random.gif",
		"images/game/audio_next.gif",
                "images/game/audio_mute.gif",
                "images/game/audio_unmute.gif",
                "images/game/audio_menu.gif",
		"images/game/nonsense.gif",
		"images/game/slayer.gif",
        ];

	var bgm_playmode = "random";

        mod.register_image = function(path) {
                var im = new Image();
                im.src = path;
                images[path] = im;
        };

        mod.get_image = function(path) {
                if (!images[path]) {
                        mod.register_image(path);
                }
                return images[path];
        };

        for (var x in preload) {
                mod.register_image(preload[x]);
        }

        /* Sounds */
        // Audio
        var sounds = [
                "audio/No Rocking in the Jazzhands Zone.mp3",
                "audio/Skipping Through the Orchestra Pit.mp3",
                "audio/Club Diver.mp3",
                "audio/The Missing Link - Funk-a-Dump.mp3",
                "audio/The Missing Link - Sugarcow.mp3"
        ];

        var audio_titles = [
                "Peter Gresser - No Rocking the Jazzhands Zone",
                "Peter Gresser - Skipping Through the Orchestra Pit",
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
        };

        mod.bgm_music = function() {
                this.sound = document.createElement("audio");
                this.sound.setAttribute("preload", "auto");
                this.sound.setAttribute("controls", "none");
                this.sound.style.display = "none";
                document.body.appendChild(this.sound);
                this.start = function() {
                        if (bgm_playmode == "random") {
				nowPlaying = Math.floor(Math.random() * sounds.length);
				this.sound.src = sounds[nowPlaying];
			}
			this.sound.load();
                        this.sound.play();
                };
                this.play = function() {
                        this.sound.play();
                }
                this.pause = function() {
                        this.sound.pause();
                }
		this.stop = function() {
			this.sound.pause();
			nowPlaying = -1;
			delete this;
		}
                this.sound.onended = function() {
                        bgm.start();
                }
                this.getvolume = function() {
                        return this.sound.volume;
                }
                this.setvolume = function(v) {
                        this.sound.volume = v;
                }
        };

        mod.pause_bgm = function() {
                bgm.pause();
        };
        mod.start_bgm = function() {
                bgm.start();
        };
	mod.stop_bgm = function() {
		bgm.stop();
	};

        mod.now_playing = function() {
                if (nowPlaying == -1) {return {path: "", title: ""};}
                return {path: sounds[nowPlaying], title: audio_titles[nowPlaying]};
        };

        mod.bgm_get_volume = function() {
                return bgm.getvolume();
        };

        mod.bgm_set_volume = function(v) {
                bgm.setvolume(v);
        };

	mod.bgm_play_mode_switch = function() {
		switch (bgm_playmode) {
			case "random": {bgm_playmode = "loop"; break;}
			case "loop": {bgm_playmode = "random"; break;}
		}
	};

	mod.bgm_play_mode = function() {
		return bgm_playmode;
	};

	mod.bgm_play_next = function() {
		bgm.start();
	};

        squish.triggers.hook("load", function() {
                bgm = new mod.bgm_music(-1);
        });
	squish.triggers.hook("start", function() {
		bgm.start();
        });

        return mod;
}());
