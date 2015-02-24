#Color.js

Contributers&ensp;·&ensp;[Hunter Larco](http://larcolabs.com)

> Color.js is a class providing basic color functionality ranging from hex to rgb conversions and distinguishable color generation.

## Example

```javascript
new Color();
new Color(4,60,255);
new Color([4,60,255]);
new Color({r:4,g:60,b:255});
new Color('#0f0');
new Color('f04ff0');

Color.random();
var color = Color.smartRandom();

console.log(color.toHex());
console.log(color.toRawHex());
console.log(color.toRGB());
console.log(color.toRGBArray());
console.log(color.toRGBString());
console.log(color.invert().toRGB());
```

## Installation
Download [color.min.js](./build/color.min.js) and place it in your project's root directory
```html
<script type='text/javascript' src='color.min.js'></script>
```

## Methods

* Constructors
	* `new Color()` Default value is #000000.
	* `new Color(r, g, b)`
	* `new Color({r:\_, g:\_, b:\_})`
	* `new Color([r, g, b])`
	* `new Color(#rrggbb)` The *#* is optional
	* `new Color(#rgb)` The *#* is optional
* Class Methods
  * `Color.random()` Generates a random color
  * `Color.smartRandom()` Generates a color that will be easily distinguishable from any prior smart randomized colors and not a shade of black (or white).
* Instance Methods
  * `.toHex` #rrggbb
  * `.toRawHex` rrggbb
  * `.toRGB` {r:\_, g:\_, b:\_}
  * `.toRGBArray` [r, g, b]
  * `.toRGBString` "rgb(r,g,b)"
  * `.invert()` Returns the inverse color
  * `.distance(color)` Returns the distance via pythagorian theorem between the two colors
  * `.getR()`
  * `.getG()`
  * `.getB()`