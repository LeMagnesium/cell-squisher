# Hexadecimal Module's Documentation

Last modification on 02/07/2016 by Lymkwi

# Summary
 - Public :
  - `squish.hexa`
  - `squish.hexa.dechex`
  - `squish.hexa.hexdec`
 - Private :
  - `hex`

# Public
### Namespaces
 - `squish.hexa` : The module's namespace is `squish.hexa`. It includes 2 utility methods designed to simplify the handling of hexadecimal values.

### Functions
 - `function squish.hexa.dechex(int)` : This method takes one mandatory parameter, an Integer (`int`), to be converted into an hexadecimal string of length 2 (eg. f(12) = "0B")
 - `function squish.hexa.hexdec(he)` : This method takes one mendatory parameter, a String representing an hexadecimal value. The string's length doesn't matter. The returned value is the decimal equivalent to the inputed string, returned as an Integer

# Private
### Variables
 - `var hex = ['0', '1', ....]` : This array serves as a table to match the hexadecimal values to their integer equivalents

# Examples
### *Using DecHex to convert RGB values to a 12-bit-per-colour colour string (#RRRGGGBBB)*
```javascript
// Adapted from squish.color.hex in colors.js
function hexcolor(red, green, blue) {
        var str = '#';
        str += squish.hexa.dechex(red);
        str += squish.hexa.dechex(green);
        str += squish.hexa.dechex(blue);
        return str;
}
```

### *Using HexDec to get the red level from a colour string*
```javascript
// Adapted from squish.color.decs in colors.js
// We use the same kind of strings returned by the previous example
function redlevel(colstr) {
        return squish.hexa.hexdec(colstr.slice(1, 3));
}
```
