# Element Specs

An element is a static or live graphical component drawn on the canvas in the game.
It follows the structure of an object, with specific fields detailed below.

```javascript
var MenuButton = {
        {
                class =  "rect",
                xorg: 5,
                yorg: 5,
                width: 40,
                length: 40,
                fill: false,
                visuals: {
                        stroke: '#44ffff'
                }
        }
};
```

This is an example of a very simple rectangle, draw from (5,5) to (45,45), without being filled.
We'll now explain all the fields an element can have so far :

# Fields
 - `class` : **MANDATORY**
   - This field tells the drawing function what kind of element it should be drawing. Supported values are :
     - "rect" : Rectangle
     - "image": Image (bitmap)
     - "line" : A segment
     - "canvas" : More on that below
     - "text" : Some text to write

   - A canvas element is a container for child elements to be drawn in it. The later part of this document explains the fields of a canvas, and how to fiddle with them

 - `xorg` : **MANDATORY**
   - Defines the x parameter of the position to start drawing at

 - `yorg` : **MANDATORY**
   - Defines the y parameter of the position to start drawing at

 - `width` : **REQUIRED BY : rect, line, image**
   - Defines the width of the element to be drawn. For images, resize to that width

 - `height` : **REQUIRED BY : rect, line, image**
   - Defines the height of the element to be drawn. For images, resize to that height

 - `live` : **OPTIONAL FOR : text, image**
   - States whether some fields like `text` are live, i.e. functions to be executed in order to retrieve the needed value
   - For text elements, live fields are : `text`
   - For image components, live fields are : `src`

 - `text` : **REQUIRED BY : text**
   - The string to be written on the canvas
   - If `live` is true, then text is a function returning the string

 - `src` : **REQUIRED BY : image**
   - States what bitmap to use
   - The image's path (src) must have been added to `record_images` in order for `register_images` to download and prepare the bitmap upon loading the window

 - `stroke` : **OPTIONAL FOR : rect, text**
   - States whether or not the object will have an outline (using stroke methods and the current strokeStyle)

 - `fill`: **OPTIONAL FOR : rect, text**
   - States whether or not the object will be filled (using fill methods and the current fillStyle)

 - `maxwidth` : **OPTIONAL FOR : text**
   - States how many pixels are allow in width for the text

 - `visuals` : **OPTIONAL FOR : rect, line, image, text**
   - A table of configuration fields on how to render the element
   - If a field is not specified, then the currently default value will be used instead
   - Fields :
     - live : If true, then fill and stroke, if provided, must be functions returning the string. This is used for variables holding values changing over time
     - fill : Style to use in order to fill the element (default: ctx.fillStyle // current fillStyle set by VisualSwap). If its value is "currentStroke" then the current strokeStyle value is applied. If live is true, must be a function returning the hexadecimal colour string.
     - stroke : Style to be used for the element's outline (default:isow ctx.strokeStyle // current strokeStyle set by VisualSwap) If its value is "currentFill" then the current fillStyle value is applied. If live is true, must be a function returning the hexadecimal colour string.
     - font : Text font for text elements to use (default: ctx.font // current font set by VisualSwap)

And that's it for now.
Please note that all elements are drawn in order (take that in account for overlaps).

#### A note on canvas
Canvas are a particular element, they only require a `xorg`, a `yorg`, their class and children.
When processing a canvas the `draw_element` function will translate all coordinates to the origin of the canvas, then call itself to draw the canvas' children.
Once everything is over the coordinates are fixed back to (0,0) as the origin.

# Examples

### The Menu button (a rectangle three lines, aka the sandwich)
```javascript
var MenuButton = [
    {
        class: "rect",
        xorg: canvas.width - 35,
        yorg: canvas.height - 35,
        width: 30,
        height: 30,
        visuals: {
                fill: '#dddddd',
                stroke: '#ff2222',
        }
    },
    {
        class: "line",
        xorg: canvas.width - 30,
        yorg: canvas.height - 13,
        width: 20,
        height: 0,
        visuals: {
                stroke: '#ff2222',
        }
    },
    {
        class: "line",
        xorg: canvas.width - 30,
        yorg: canvas.height - 20,
        width: 20,
        height: 0,
        visuals: {
                stroke: '#ff2222',
        }
    },
    {
        class: "line",
        xorg: canvas.width - 30,
        yorg: canvas.height - 27,
        width: 20,
        height: 0,
        visuals: {
                stroke: '#ff2222',
        }
    }
]
```

#### A score bar
```javascript
var ScoreBar = [
        {
                class: "rect",
                xorg: 5,
                yorg: 5,
                width: canvas.width - 10,
                height: 30,
                visuals: {
                        fill: colors.mainMenuFill,
                }
        },
        {
                class: "text",
                live: true,
                xorg: canvas.width / 2,
                yorg: 27,
                stroke: false,
                text: function() {
                        if (GameData.score == -1) { return ""; }
                        return GameData.score.toString();
                },
                visuals: {
                        fill: colors.textFill,
                }
        }
];
```
You can see here the anonymous function called, and returning the score (or nothing, to hide the score before the game starts)

#### A button with a label (essentially a rect and text)
```javascript
var StartButton = [
        {
                class: "rect",
                xorg: canvas.width / 16 * 7.5,
                yorg: canvas.height / 2 - 15,
                width: canvas.width / 16,
                height: 30,
                visuals: {
                        fill: colors.startButtonFill,
                }
        },
        {
                class: "text",
                text: "Play",
                xorg: canvas.width / 2,
                yorg: canvas.height / 2 + 5,
                stroke: false,
                visuals: {
                        fill: colors.startButtonLabel,
                }
        }
];
```
This time the text is static, and has no outline (hence `stroke` being `false`).

#### An achievement canvas
```javascript
var achievement_canvas = {
        class: "canvas",
        xorg: dx,
        yorg: start_y,
        width: width,
        height: length,
        children: [
                {
                        class: "rect",
                        xorg: 0,
                        yorg: 0,
                        width: width,
                        height: length,
                        visuals: {
                                fill: colors.mainMenuFill,
                                stroke: colors.mainMenuStroke,
                        }
                },
                {
                        class: "image",
                        src: "images/game/gt9000.gif", // this is a value in `recorded_images`
                        xorg: 93,
                        yorg: 13,
                        width: 64,
                        height: 64
                },
                {
                        class: "rect",
                        xorg: 93,
                        yorg: 13,
                        width: 64,
                        height: 64,
                        fill: false,
                        visuals: {
                                stroke: colors.red,
                        }
                },
                {
                        class: "text",
                        text: "Over 9000!",
                        xorg: 125,
                        yorg: 100,
                        stroke: true,
                        visuals: {
                                fill: "currentStroke",
                                font: "20px Arial",
                        }
                }
        ]
};
```
All children here are drawn with the canvas's origin as their own.
The text is static, it uses its own font, and the current strokeStyle for its fillStyle.
The image's bitmap is from "images/game/gt9000.gif". During `window.onload`, the script loaded that bitmap and stored it at images["images/game/gt9000.gif"] to be used by `draw_element`.
The rectangle here is simply a background, with the same origin, and the dimensions of the canvas.
