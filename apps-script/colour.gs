/**
 * Convert an HSV colour into HEX format.
 * @param  {Number} h Hue.
 * @param  {Number} s Saturation.
 * @param  {Number} v Value/Lightness/Brightness.
 * @return {String}   HEX colour code (e.g. #FFFFFF).
 */
function hsvToHex(h, s, v) {
  var i, f, p, q, t, r, g, b;
  
  // Convert HSV values.
  h /= 360;
  s /= 100;
  v /= 100;
  i = Math.floor(h * 6);
  f = (h * 6) - i;
  p = v * (1 - s);
  q = v * (1 - (f * s));
  t = v * (1 - ((1 - f) * s));


  switch (i % 6) {
    case 0:
      r = v, g = t, b = p;
      break;
    case 1:
      r = q, g = v, b = p;
      break;
    case 2:
      r = p, g = v, b = t;
      break;
    case 3:
      r = p, g = q, b = v;
      break;
    case 4:
      r = t, g = p, b = v;
      break;
    case 5:
      r = v, g = p, b = q;
      break;
  }

  // Return the calculated RGB values in HEX format (e.g. #FFFFFF).
  return "#" + ((1 << 24) + ((r * 255) << 16) + ((g * 255) << 8) + (b * 255)).toString(16).slice(1);
}

/**
 * Generate an array of hue values between two given hue values using linear interpolation.
 * @param  {Number} h1     Hue 1.
 * @param  {Number} h2     Hue 2.
 * @param  {Number} points Amount of values between {h1} and {h2} to generate.
 * @return {Array}         Array of generated hue values between {h1} and {h2}.
 */
function interpolateHue(h1, h2, points) {
  var delta = h2 - h1;
  var result = (delta + ((Math.abs(delta) > 180) ? ((delta < 0) ? 360 : -360) : 0)) / (points + 1.0);

  var turns = [];
  for (var i = 1; delta && i <= points; ++i)
    turns.push(((h1 + (result * i)) + 360) % 360);

  return turns;
}
