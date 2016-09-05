"use strict";

// Cell Squisher ßÿ Lymkwi
// License WTFPL, CopyLEFT <(°-°<) Lymkwi 2016
// Version : 0.94

/*
        Slider

        Dependencies :
         - Colors : squish.colors.mainMenuFill, squish.colors.mainMenuStroke
         - Component : squish.components.draw
         - Gamedata : squish.VisualSwap
*/

squish.slider = (function() {
        var mod = {};

        // Slider Show Queue
        var showQueue = [];

        mod.slider = function(direction, start_x, start_y, width, length, slide_time, lifetime, children) {
                this.direction = direction;
                this.start_x = start_x;
                this.start_y = start_y;
                this.width = width;
                this.length = length;
                this.slide_time = slide_time;
                this.lifetime = lifetime;
                this.children = [];

                this.duration = slide_time * 2 + lifetime; // Total
                this.elapsed = 0;
                this.state = "idling";
                this.component = function() {
                        if (this.state == "idling") {
                                this.state = "unfolding";
                                children.unshift({
                                        class: "rect",
                                        xorg: 0,
                                        yorg: 0,
                                        width: width,
                                        height: length,
                                        visuals: {
                                                fill: squish.colors.mainMenuFill,
                                                stroke: squish.colors.mainMenuStroke,
                                        }
                                });
                                this.children = children;
                        }
                        var dx = start_x;
                        var curve = -2.5; // Good value for 20 frames

                        if (this.state == "unfolding") {
                                if (this.direction == "rtl") {
                                        dx -= width * (1 - Math.pow(this.elapsed , curve));
                                } else {
                                        dx += width * (1 - Math.pow(this.elapsed , curve));
                                }

                                if (this.elapsed == this.slide_time) {
                                        this.elapsed = 0;
                                        this.state = "static";
                                }

                        } else if (this.state == "static") {
                                if (this.direction == "rtl") {
                                        dx -= width;
                                } else {
                                        dx += width;
                                }

                                if (this.elapsed == this.lifetime) {
                                        this.elapsed = 0;
                                        this.state = "folding";
                                }

                        } else if (this.state == "folding") {
                                if (this.direction == "rtl") {
                                        dx -= width * Math.pow(this.elapsed , curve);
                                } else {
                                        dx += width * Math.pow(this.elapsed , curve);
                                }

                                if (this.elapsed == this.slide_time) {
                                        this.elapsed = 0;
                                        this.state = "dead";
                                }
                        }

                        return {
                                class: "canvas",
                                xorg: dx,
                                yorg: start_y,
                                width: width,
                                height: length,
                                children: this.children
                        };
                }
        }

        mod.push = function(sliderobj) {
                showQueue.push(sliderobj);
        };

        mod.draw = function() {
                if (showQueue.length == 0) {return;}

                var slider = showQueue[0];
                if (slider.state == "dead") {showQueue.shift(); return;}
                slider.elapsed += 1;
                var comp = slider.component();
                squish.components.draw([comp]);
                squish.VisualSwap.setMainFill(squish.colors.mainMenuFill);
                squish.VisualSwap.useMainFill();
        }

        return mod;
}())
