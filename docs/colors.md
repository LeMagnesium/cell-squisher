# Color manipulation module

# Summary
- Public:
 - Lots of colors
 - `squish.colors.color`
 - `squish.colors.toggle_theme`

# Public
### Namespaces
 - `squish.colors` : This namespace contains all public data from the color module

### functions
 - `squish.colors.color` : This is the constructor for a class of objects allowing you to manipulate colors. A color object possesses a `red`, `green`and `blue` fields, along with a few methods :
   - `get_dark` : Return another color object with the same difference between blue, red and green, except the lowest of them on `this` is now 0
   - `hex` : Return a string that is the hexadecimal RGB representation of the color held by the object
   - `decs` : Convert a string representing an hexadecimal RGB colour into the three values for red, green, and blue, and set the object's field to their values

 - `squish.colors.toggle_theme` : This function changes the values of some colours used as backgrounds for menus to fit with the general colour scheme of the style currently selected in the HTML page. This function can also be called using `window.toggle_theme`, to which it is bound.
