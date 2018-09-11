/**
 * Get the elapsed amount of seconds between 1 Jan 1970 00:00:00 UTC and a Date object (or now).
 * @param  {Date}   [time] Date object to use (optional, will use new Date() if not provided).
 * @return {Number}        Amount of seconds elapsed.
 */
function getUnixTime(time) {
  // GAS doesn't support ES6 yet, no default value parameters.
  if (time === undefined)
    time = new Date();

  return Math.floor(time.getTime() / 1000);
}
