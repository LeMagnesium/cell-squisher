# Triggers Module Documentation

# Summary
 - Public :
  - `squish.triggers`
  - `squish.triggers.register`
  - `squish.triggers.hook`
  - `squish.triggers.call`
 - Private :
  - `triggers`

# Public
### Namespaces
 - `squish.triggers` : Namespace created for all trigger and hook functions

### Functions
 - `function squish.triggers.register(name)` : This function registers a trigger/hook, which is basically an entry in the private data array to store functions that are run whenever, somewhere in the code, `squish.triggers.call` is called with the same parameter `name`
 - `function squish.triggers.hook(name, func)` : Using this function you can 'hook' the function `func` on the trigger `name`. That way, when the trigger is called, the function `func` will be run.
 - `function squish.triggers.call(name)` : This function calls the trigger `name`, meaning runs all the functions hooked to `name`.

# Private
### Variables
 - `var triggers = []` : Array holding other arrays containing functions sorted by trigger name

# Registered hooks
 - Gameplay Events
  - **"load"** : Functions launched right upon calling `window.onload`. Calls are unique.
  - **"start"** : Functions called after clicking the Start button and entering the game. Calls are unique.
  - **"step"** : Functions called after each drawing step. Calls are periodic.
  - **"score"** : Functions called upon a score modification. They take one parameter, the score modification (it being positive or negative).
 - Mouse Events
  - **"mousemove"** : Functions called when the mouse is moved from `squish.canvas.mousemove`.
  - **"mousedown"** : Functions called when the mouse button is pressed, from `squish.canvas.mousedown`.
  - **"mouseup"** : Functions called when the mouse button is released, from `squish.canvas.mouseup`.
 - Menu Events
  - **"menuenter"** : Functions called upon entering a menu, called from `squish.canvas.menu.enter`. They take one parameter : the name of the menu we enter.
  - **"menuleave"** : Functions called upon leaving a menu, called from `squish.canvas.menu.leave`. They take one parameter : the name of the menu we left.
