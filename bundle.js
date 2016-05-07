(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var countdown = require('countdown');

function update() {
  var ts = countdown(new Date(2000, 0, 1));
  countElement = document.getElementById("count");
  countElement.innerHTML = ts.toString();

  setTimeout(function() {
    requestAnimationFrame(update);
  }, 1000); //delay
}
update();

},{"countdown":2}],2:[function(require,module,exports){
/*global window */
/**
 * @license countdown.js v2.6.0 http://countdownjs.org
 * Copyright (c)2006-2014 Stephen M. McKamey.
 * Licensed under The MIT License.
 */
/*jshint bitwise:false */

/**
 * @public
 * @type {Object|null}
 */
var module;

/**
 * API entry
 * @public
 * @param {function(Object)|Date|number} start the starting date
 * @param {function(Object)|Date|number} end the ending date
 * @param {number} units the units to populate
 * @return {Object|number}
 */
var countdown = (

/**
 * @param {Object} module CommonJS Module
 */
function(module) {
	/*jshint smarttabs:true */

	'use strict';

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLISECONDS	= 0x001;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var SECONDS			= 0x002;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MINUTES			= 0x004;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var HOURS			= 0x008;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DAYS			= 0x010;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var WEEKS			= 0x020;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MONTHS			= 0x040;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var YEARS			= 0x080;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DECADES			= 0x100;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var CENTURIES		= 0x200;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLENNIA		= 0x400;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DEFAULTS		= YEARS|MONTHS|DAYS|HOURS|MINUTES|SECONDS;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLISECONDS_PER_SECOND = 1000;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var SECONDS_PER_MINUTE = 60;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MINUTES_PER_HOUR = 60;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var HOURS_PER_DAY = 24;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MILLISECONDS_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DAYS_PER_WEEK = 7;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var MONTHS_PER_YEAR = 12;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var YEARS_PER_DECADE = 10;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var DECADES_PER_CENTURY = 10;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var CENTURIES_PER_MILLENNIUM = 10;

	/**
	 * @private
	 * @param {number} x number
	 * @return {number}
	 */
	var ceil = Math.ceil;

	/**
	 * @private
	 * @param {number} x number
	 * @return {number}
	 */
	var floor = Math.floor;

	/**
	 * @private
	 * @param {Date} ref reference date
	 * @param {number} shift number of months to shift
	 * @return {number} number of days shifted
	 */
	function borrowMonths(ref, shift) {
		var prevTime = ref.getTime();

		// increment month by shift
		ref.setMonth( ref.getMonth() + shift );

		// this is the trickiest since months vary in length
		return Math.round( (ref.getTime() - prevTime) / MILLISECONDS_PER_DAY );
	}

	/**
	 * @private
	 * @param {Date} ref reference date
	 * @return {number} number of days
	 */
	function daysPerMonth(ref) {
		var a = ref.getTime();

		// increment month by 1
		var b = new Date(a);
		b.setMonth( ref.getMonth() + 1 );

		// this is the trickiest since months vary in length
		return Math.round( (b.getTime() - a) / MILLISECONDS_PER_DAY );
	}

	/**
	 * @private
	 * @param {Date} ref reference date
	 * @return {number} number of days
	 */
	function daysPerYear(ref) {
		var a = ref.getTime();

		// increment year by 1
		var b = new Date(a);
		b.setFullYear( ref.getFullYear() + 1 );

		// this is the trickiest since years (periodically) vary in length
		return Math.round( (b.getTime() - a) / MILLISECONDS_PER_DAY );
	}

	/**
	 * Applies the Timespan to the given date.
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {Date=} date
	 * @return {Date}
	 */
	function addToDate(ts, date) {
		date = (date instanceof Date) || ((date !== null) && isFinite(date)) ? new Date(+date) : new Date();
		if (!ts) {
			return date;
		}

		// if there is a value field, use it directly
		var value = +ts.value || 0;
		if (value) {
			date.setTime(date.getTime() + value);
			return date;
		}

		value = +ts.milliseconds || 0;
		if (value) {
			date.setMilliseconds(date.getMilliseconds() + value);
		}

		value = +ts.seconds || 0;
		if (value) {
			date.setSeconds(date.getSeconds() + value);
		}

		value = +ts.minutes || 0;
		if (value) {
			date.setMinutes(date.getMinutes() + value);
		}

		value = +ts.hours || 0;
		if (value) {
			date.setHours(date.getHours() + value);
		}

		value = +ts.weeks || 0;
		if (value) {
			value *= DAYS_PER_WEEK;
		}

		value += +ts.days || 0;
		if (value) {
			date.setDate(date.getDate() + value);
		}

		value = +ts.months || 0;
		if (value) {
			date.setMonth(date.getMonth() + value);
		}

		value = +ts.millennia || 0;
		if (value) {
			value *= CENTURIES_PER_MILLENNIUM;
		}

		value += +ts.centuries || 0;
		if (value) {
			value *= DECADES_PER_CENTURY;
		}

		value += +ts.decades || 0;
		if (value) {
			value *= YEARS_PER_DECADE;
		}

		value += +ts.years || 0;
		if (value) {
			date.setFullYear(date.getFullYear() + value);
		}

		return date;
	}

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_MILLISECONDS	= 0;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_SECONDS		= 1;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_MINUTES		= 2;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_HOURS			= 3;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_DAYS			= 4;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_WEEKS			= 5;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_MONTHS		= 6;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_YEARS			= 7;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_DECADES		= 8;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_CENTURIES		= 9;

	/**
	 * @private
	 * @const
	 * @type {number}
	 */
	var LABEL_MILLENNIA		= 10;

	/**
	 * @private
	 * @type {Array}
	 */
	var LABELS_SINGLUAR;

	/**
	 * @private
	 * @type {Array}
	 */
	var LABELS_PLURAL;

	/**
	 * @private
	 * @type {string}
	 */
	var LABEL_LAST;

	/**
	 * @private
	 * @type {string}
	 */
	var LABEL_DELIM;

	/**
	 * @private
	 * @type {string}
	 */
	var LABEL_NOW;

	/**
	 * Formats a number & unit as a string
	 * 
	 * @param {number} value
	 * @param {number} unit
	 * @return {string}
	 */
	var formatter;

	/**
	 * Formats a number as a string
	 * 
	 * @private
	 * @param {number} value
	 * @return {string}
	 */
	var formatNumber;

	/**
	 * @private
	 * @param {number} value
	 * @param {number} unit unit index into label list
	 * @return {string}
	 */
	function plurality(value, unit) {
		return formatNumber(value)+((value === 1) ? LABELS_SINGLUAR[unit] : LABELS_PLURAL[unit]);
	}

	/**
	 * Formats the entries with singular or plural labels
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @return {Array}
	 */
	var formatList;

	/**
	 * Timespan representation of a duration of time
	 * 
	 * @private
	 * @this {Timespan}
	 * @constructor
	 */
	function Timespan() {}

	/**
	 * Formats the Timespan as a sentence
	 * 
	 * @param {string=} emptyLabel the string to use when no values returned
	 * @return {string}
	 */
	Timespan.prototype.toString = function(emptyLabel) {
		var label = formatList(this);

		var count = label.length;
		if (!count) {
			return emptyLabel ? ''+emptyLabel : LABEL_NOW;
		}
		if (count === 1) {
			return label[0];
		}

		var last = LABEL_LAST+label.pop();
		return label.join(LABEL_DELIM)+last;
	};

	/**
	 * Formats the Timespan as a sentence in HTML
	 * 
	 * @param {string=} tag HTML tag name to wrap each value
	 * @param {string=} emptyLabel the string to use when no values returned
	 * @return {string}
	 */
	Timespan.prototype.toHTML = function(tag, emptyLabel) {
		tag = tag || 'span';
		var label = formatList(this);

		var count = label.length;
		if (!count) {
			emptyLabel = emptyLabel || LABEL_NOW;
			return emptyLabel ? '<'+tag+'>'+emptyLabel+'</'+tag+'>' : emptyLabel;
		}
		for (var i=0; i<count; i++) {
			// wrap each unit in tag
			label[i] = '<'+tag+'>'+label[i]+'</'+tag+'>';
		}
		if (count === 1) {
			return label[0];
		}

		var last = LABEL_LAST+label.pop();
		return label.join(LABEL_DELIM)+last;
	};

	/**
	 * Applies the Timespan to the given date
	 * 
	 * @param {Date=} date the date to which the timespan is added.
	 * @return {Date}
	 */
	Timespan.prototype.addTo = function(date) {
		return addToDate(this, date);
	};

	/**
	 * Formats the entries as English labels
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @return {Array}
	 */
	formatList = function(ts) {
		var list = [];

		var value = ts.millennia;
		if (value) {
			list.push(formatter(value, LABEL_MILLENNIA));
		}

		value = ts.centuries;
		if (value) {
			list.push(formatter(value, LABEL_CENTURIES));
		}

		value = ts.decades;
		if (value) {
			list.push(formatter(value, LABEL_DECADES));
		}

		value = ts.years;
		if (value) {
			list.push(formatter(value, LABEL_YEARS));
		}

		value = ts.months;
		if (value) {
			list.push(formatter(value, LABEL_MONTHS));
		}

		value = ts.weeks;
		if (value) {
			list.push(formatter(value, LABEL_WEEKS));
		}

		value = ts.days;
		if (value) {
			list.push(formatter(value, LABEL_DAYS));
		}

		value = ts.hours;
		if (value) {
			list.push(formatter(value, LABEL_HOURS));
		}

		value = ts.minutes;
		if (value) {
			list.push(formatter(value, LABEL_MINUTES));
		}

		value = ts.seconds;
		if (value) {
			list.push(formatter(value, LABEL_SECONDS));
		}

		value = ts.milliseconds;
		if (value) {
			list.push(formatter(value, LABEL_MILLISECONDS));
		}

		return list;
	};

	/**
	 * Borrow any underflow units, carry any overflow units
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {string} toUnit
	 */
	function rippleRounded(ts, toUnit) {
		switch (toUnit) {
			case 'seconds':
				if (ts.seconds !== SECONDS_PER_MINUTE || isNaN(ts.minutes)) {
					return;
				}
				// ripple seconds up to minutes
				ts.minutes++;
				ts.seconds = 0;

				/* falls through */
			case 'minutes':
				if (ts.minutes !== MINUTES_PER_HOUR || isNaN(ts.hours)) {
					return;
				}
				// ripple minutes up to hours
				ts.hours++;
				ts.minutes = 0;

				/* falls through */
			case 'hours':
				if (ts.hours !== HOURS_PER_DAY || isNaN(ts.days)) {
					return;
				}
				// ripple hours up to days
				ts.days++;
				ts.hours = 0;

				/* falls through */
			case 'days':
				if (ts.days !== DAYS_PER_WEEK || isNaN(ts.weeks)) {
					return;
				}
				// ripple days up to weeks
				ts.weeks++;
				ts.days = 0;

				/* falls through */
			case 'weeks':
				if (ts.weeks !== daysPerMonth(ts.refMonth)/DAYS_PER_WEEK || isNaN(ts.months)) {
					return;
				}
				// ripple weeks up to months
				ts.months++;
				ts.weeks = 0;

				/* falls through */
			case 'months':
				if (ts.months !== MONTHS_PER_YEAR || isNaN(ts.years)) {
					return;
				}
				// ripple months up to years
				ts.years++;
				ts.months = 0;

				/* falls through */
			case 'years':
				if (ts.years !== YEARS_PER_DECADE || isNaN(ts.decades)) {
					return;
				}
				// ripple years up to decades
				ts.decades++;
				ts.years = 0;

				/* falls through */
			case 'decades':
				if (ts.decades !== DECADES_PER_CENTURY || isNaN(ts.centuries)) {
					return;
				}
				// ripple decades up to centuries
				ts.centuries++;
				ts.decades = 0;

				/* falls through */
			case 'centuries':
				if (ts.centuries !== CENTURIES_PER_MILLENNIUM || isNaN(ts.millennia)) {
					return;
				}
				// ripple centuries up to millennia
				ts.millennia++;
				ts.centuries = 0;
				/* falls through */
			}
	}

	/**
	 * Ripple up partial units one place
	 * 
	 * @private
	 * @param {Timespan} ts timespan
	 * @param {number} frac accumulated fractional value
	 * @param {string} fromUnit source unit name
	 * @param {string} toUnit target unit name
	 * @param {number} conversion multiplier between units
	 * @param {number} digits max number of decimal digits to output
	 * @return {number} new fractional value
	 */
	function fraction(ts, frac, fromUnit, toUnit, conversion, digits) {
		if (ts[fromUnit] >= 0) {
			frac += ts[fromUnit];
			delete ts[fromUnit];
		}

		frac /= conversion;
		if (frac + 1 <= 1) {
			// drop if below machine epsilon
			return 0;
		}

		if (ts[toUnit] >= 0) {
			// ensure does not have more than specified number of digits
			ts[toUnit] = +(ts[toUnit] + frac).toFixed(digits);
			rippleRounded(ts, toUnit);
			return 0;
		}

		return frac;
	}

	/**
	 * Ripple up partial units to next existing
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {number} digits max number of decimal digits to output
	 */
	function fractional(ts, digits) {
		var frac = fraction(ts, 0, 'milliseconds', 'seconds', MILLISECONDS_PER_SECOND, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'seconds', 'minutes', SECONDS_PER_MINUTE, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'minutes', 'hours', MINUTES_PER_HOUR, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'hours', 'days', HOURS_PER_DAY, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'days', 'weeks', DAYS_PER_WEEK, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'weeks', 'months', daysPerMonth(ts.refMonth)/DAYS_PER_WEEK, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'months', 'years', daysPerYear(ts.refMonth)/daysPerMonth(ts.refMonth), digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'years', 'decades', YEARS_PER_DECADE, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'decades', 'centuries', DECADES_PER_CENTURY, digits);
		if (!frac) { return; }

		frac = fraction(ts, frac, 'centuries', 'millennia', CENTURIES_PER_MILLENNIUM, digits);

		// should never reach this with remaining fractional value
		if (frac) { throw new Error('Fractional unit overflow'); }
	}

	/**
	 * Borrow any underflow units, carry any overflow units
	 * 
	 * @private
	 * @param {Timespan} ts
	 */
	function ripple(ts) {
		var x;

		if (ts.milliseconds < 0) {
			// ripple seconds down to milliseconds
			x = ceil(-ts.milliseconds / MILLISECONDS_PER_SECOND);
			ts.seconds -= x;
			ts.milliseconds += x * MILLISECONDS_PER_SECOND;

		} else if (ts.milliseconds >= MILLISECONDS_PER_SECOND) {
			// ripple milliseconds up to seconds
			ts.seconds += floor(ts.milliseconds / MILLISECONDS_PER_SECOND);
			ts.milliseconds %= MILLISECONDS_PER_SECOND;
		}

		if (ts.seconds < 0) {
			// ripple minutes down to seconds
			x = ceil(-ts.seconds / SECONDS_PER_MINUTE);
			ts.minutes -= x;
			ts.seconds += x * SECONDS_PER_MINUTE;

		} else if (ts.seconds >= SECONDS_PER_MINUTE) {
			// ripple seconds up to minutes
			ts.minutes += floor(ts.seconds / SECONDS_PER_MINUTE);
			ts.seconds %= SECONDS_PER_MINUTE;
		}

		if (ts.minutes < 0) {
			// ripple hours down to minutes
			x = ceil(-ts.minutes / MINUTES_PER_HOUR);
			ts.hours -= x;
			ts.minutes += x * MINUTES_PER_HOUR;

		} else if (ts.minutes >= MINUTES_PER_HOUR) {
			// ripple minutes up to hours
			ts.hours += floor(ts.minutes / MINUTES_PER_HOUR);
			ts.minutes %= MINUTES_PER_HOUR;
		}

		if (ts.hours < 0) {
			// ripple days down to hours
			x = ceil(-ts.hours / HOURS_PER_DAY);
			ts.days -= x;
			ts.hours += x * HOURS_PER_DAY;

		} else if (ts.hours >= HOURS_PER_DAY) {
			// ripple hours up to days
			ts.days += floor(ts.hours / HOURS_PER_DAY);
			ts.hours %= HOURS_PER_DAY;
		}

		while (ts.days < 0) {
			// NOTE: never actually seen this loop more than once

			// ripple months down to days
			ts.months--;
			ts.days += borrowMonths(ts.refMonth, 1);
		}

		// weeks is always zero here

		if (ts.days >= DAYS_PER_WEEK) {
			// ripple days up to weeks
			ts.weeks += floor(ts.days / DAYS_PER_WEEK);
			ts.days %= DAYS_PER_WEEK;
		}

		if (ts.months < 0) {
			// ripple years down to months
			x = ceil(-ts.months / MONTHS_PER_YEAR);
			ts.years -= x;
			ts.months += x * MONTHS_PER_YEAR;

		} else if (ts.months >= MONTHS_PER_YEAR) {
			// ripple months up to years
			ts.years += floor(ts.months / MONTHS_PER_YEAR);
			ts.months %= MONTHS_PER_YEAR;
		}

		// years is always non-negative here
		// decades, centuries and millennia are always zero here

		if (ts.years >= YEARS_PER_DECADE) {
			// ripple years up to decades
			ts.decades += floor(ts.years / YEARS_PER_DECADE);
			ts.years %= YEARS_PER_DECADE;

			if (ts.decades >= DECADES_PER_CENTURY) {
				// ripple decades up to centuries
				ts.centuries += floor(ts.decades / DECADES_PER_CENTURY);
				ts.decades %= DECADES_PER_CENTURY;

				if (ts.centuries >= CENTURIES_PER_MILLENNIUM) {
					// ripple centuries up to millennia
					ts.millennia += floor(ts.centuries / CENTURIES_PER_MILLENNIUM);
					ts.centuries %= CENTURIES_PER_MILLENNIUM;
				}
			}
		}
	}

	/**
	 * Remove any units not requested
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {number} units the units to populate
	 * @param {number} max number of labels to output
	 * @param {number} digits max number of decimal digits to output
	 */
	function pruneUnits(ts, units, max, digits) {
		var count = 0;

		// Calc from largest unit to smallest to prevent underflow
		if (!(units & MILLENNIA) || (count >= max)) {
			// ripple millennia down to centuries
			ts.centuries += ts.millennia * CENTURIES_PER_MILLENNIUM;
			delete ts.millennia;

		} else if (ts.millennia) {
			count++;
		}

		if (!(units & CENTURIES) || (count >= max)) {
			// ripple centuries down to decades
			ts.decades += ts.centuries * DECADES_PER_CENTURY;
			delete ts.centuries;

		} else if (ts.centuries) {
			count++;
		}

		if (!(units & DECADES) || (count >= max)) {
			// ripple decades down to years
			ts.years += ts.decades * YEARS_PER_DECADE;
			delete ts.decades;

		} else if (ts.decades) {
			count++;
		}

		if (!(units & YEARS) || (count >= max)) {
			// ripple years down to months
			ts.months += ts.years * MONTHS_PER_YEAR;
			delete ts.years;

		} else if (ts.years) {
			count++;
		}

		if (!(units & MONTHS) || (count >= max)) {
			// ripple months down to days
			if (ts.months) {
				ts.days += borrowMonths(ts.refMonth, ts.months);
			}
			delete ts.months;

			if (ts.days >= DAYS_PER_WEEK) {
				// ripple day overflow back up to weeks
				ts.weeks += floor(ts.days / DAYS_PER_WEEK);
				ts.days %= DAYS_PER_WEEK;
			}

		} else if (ts.months) {
			count++;
		}

		if (!(units & WEEKS) || (count >= max)) {
			// ripple weeks down to days
			ts.days += ts.weeks * DAYS_PER_WEEK;
			delete ts.weeks;

		} else if (ts.weeks) {
			count++;
		}

		if (!(units & DAYS) || (count >= max)) {
			//ripple days down to hours
			ts.hours += ts.days * HOURS_PER_DAY;
			delete ts.days;

		} else if (ts.days) {
			count++;
		}

		if (!(units & HOURS) || (count >= max)) {
			// ripple hours down to minutes
			ts.minutes += ts.hours * MINUTES_PER_HOUR;
			delete ts.hours;

		} else if (ts.hours) {
			count++;
		}

		if (!(units & MINUTES) || (count >= max)) {
			// ripple minutes down to seconds
			ts.seconds += ts.minutes * SECONDS_PER_MINUTE;
			delete ts.minutes;

		} else if (ts.minutes) {
			count++;
		}

		if (!(units & SECONDS) || (count >= max)) {
			// ripple seconds down to milliseconds
			ts.milliseconds += ts.seconds * MILLISECONDS_PER_SECOND;
			delete ts.seconds;

		} else if (ts.seconds) {
			count++;
		}

		// nothing to ripple milliseconds down to
		// so ripple back up to smallest existing unit as a fractional value
		if (!(units & MILLISECONDS) || (count >= max)) {
			fractional(ts, digits);
		}
	}

	/**
	 * Populates the Timespan object
	 * 
	 * @private
	 * @param {Timespan} ts
	 * @param {?Date} start the starting date
	 * @param {?Date} end the ending date
	 * @param {number} units the units to populate
	 * @param {number} max number of labels to output
	 * @param {number} digits max number of decimal digits to output
	 */
	function populate(ts, start, end, units, max, digits) {
		var now = new Date();

		ts.start = start = start || now;
		ts.end = end = end || now;
		ts.units = units;

		ts.value = end.getTime() - start.getTime();
		if (ts.value < 0) {
			// swap if reversed
			var tmp = end;
			end = start;
			start = tmp;
		}

		// reference month for determining days in month
		ts.refMonth = new Date(start.getFullYear(), start.getMonth(), 15, 12, 0, 0);
		try {
			// reset to initial deltas
			ts.millennia = 0;
			ts.centuries = 0;
			ts.decades = 0;
			ts.years = end.getFullYear() - start.getFullYear();
			ts.months = end.getMonth() - start.getMonth();
			ts.weeks = 0;
			ts.days = end.getDate() - start.getDate();
			ts.hours = end.getHours() - start.getHours();
			ts.minutes = end.getMinutes() - start.getMinutes();
			ts.seconds = end.getSeconds() - start.getSeconds();
			ts.milliseconds = end.getMilliseconds() - start.getMilliseconds();

			ripple(ts);
			pruneUnits(ts, units, max, digits);

		} finally {
			delete ts.refMonth;
		}

		return ts;
	}

	/**
	 * Determine an appropriate refresh rate based upon units
	 * 
	 * @private
	 * @param {number} units the units to populate
	 * @return {number} milliseconds to delay
	 */
	function getDelay(units) {
		if (units & MILLISECONDS) {
			// refresh very quickly
			return MILLISECONDS_PER_SECOND / 30; //30Hz
		}

		if (units & SECONDS) {
			// refresh every second
			return MILLISECONDS_PER_SECOND; //1Hz
		}

		if (units & MINUTES) {
			// refresh every minute
			return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE;
		}

		if (units & HOURS) {
			// refresh hourly
			return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
		}
		
		if (units & DAYS) {
			// refresh daily
			return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;
		}

		// refresh the rest weekly
		return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK;
	}

	/**
	 * API entry point
	 * 
	 * @public
	 * @param {Date|number|Timespan|null|function(Timespan,number)} start the starting date
	 * @param {Date|number|Timespan|null|function(Timespan,number)} end the ending date
	 * @param {number=} units the units to populate
	 * @param {number=} max number of labels to output
	 * @param {number=} digits max number of decimal digits to output
	 * @return {Timespan|number}
	 */
	function countdown(start, end, units, max, digits) {
		var callback;

		// ensure some units or use defaults
		units = +units || DEFAULTS;
		// max must be positive
		max = (max > 0) ? max : NaN;
		// clamp digits to an integer between [0, 20]
		digits = (digits > 0) ? (digits < 20) ? Math.round(digits) : 20 : 0;

		// ensure start date
		var startTS = null;
		if ('function' === typeof start) {
			callback = start;
			start = null;

		} else if (!(start instanceof Date)) {
			if ((start !== null) && isFinite(start)) {
				start = new Date(+start);
			} else {
				if ('object' === typeof startTS) {
					startTS = /** @type{Timespan} */(start);
				}
				start = null;
			}
		}

		// ensure end date
		var endTS = null;
		if ('function' === typeof end) {
			callback = end;
			end = null;

		} else if (!(end instanceof Date)) {
			if ((end !== null) && isFinite(end)) {
				end = new Date(+end);
			} else {
				if ('object' === typeof end) {
					endTS = /** @type{Timespan} */(end);
				}
				end = null;
			}
		}

		// must wait to interpret timespans until after resolving dates
		if (startTS) {
			start = addToDate(startTS, end);
		}
		if (endTS) {
			end = addToDate(endTS, start);
		}

		if (!start && !end) {
			// used for unit testing
			return new Timespan();
		}

		if (!callback) {
			return populate(new Timespan(), /** @type{Date} */(start), /** @type{Date} */(end), /** @type{number} */(units), /** @type{number} */(max), /** @type{number} */(digits));
		}

		// base delay off units
		var delay = getDelay(units),
			timerId,
			fn = function() {
				callback(
					populate(new Timespan(), /** @type{Date} */(start), /** @type{Date} */(end), /** @type{number} */(units), /** @type{number} */(max), /** @type{number} */(digits)),
					timerId
				);
			};

		fn();
		return (timerId = setInterval(fn, delay));
	}

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.MILLISECONDS = MILLISECONDS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.SECONDS = SECONDS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.MINUTES = MINUTES;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.HOURS = HOURS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.DAYS = DAYS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.WEEKS = WEEKS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.MONTHS = MONTHS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.YEARS = YEARS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.DECADES = DECADES;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.CENTURIES = CENTURIES;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.MILLENNIA = MILLENNIA;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.DEFAULTS = DEFAULTS;

	/**
	 * @public
	 * @const
	 * @type {number}
	 */
	countdown.ALL = MILLENNIA|CENTURIES|DECADES|YEARS|MONTHS|WEEKS|DAYS|HOURS|MINUTES|SECONDS|MILLISECONDS;

	/**
	 * Customize the format settings.
	 * @public
	 * @param {Object} format settings object
	 */
	var setFormat = countdown.setFormat = function(format) {
		if (!format) { return; }

		if ('singular' in format || 'plural' in format) {
			var singular = format.singular || [];
			if (singular.split) {
				singular = singular.split('|');
			}
			var plural = format.plural || [];
			if (plural.split) {
				plural = plural.split('|');
			}

			for (var i=LABEL_MILLISECONDS; i<=LABEL_MILLENNIA; i++) {
				// override any specified units
				LABELS_SINGLUAR[i] = singular[i] || LABELS_SINGLUAR[i];
				LABELS_PLURAL[i] = plural[i] || LABELS_PLURAL[i];
			}
		}

		if ('string' === typeof format.last) {
			LABEL_LAST = format.last;
		}
		if ('string' === typeof format.delim) {
			LABEL_DELIM = format.delim;
		}
		if ('string' === typeof format.empty) {
			LABEL_NOW = format.empty;
		}
		if ('function' === typeof format.formatNumber) {
			formatNumber = format.formatNumber;
		}
		if ('function' === typeof format.formatter) {
			formatter = format.formatter;
		}
	};

	/**
	 * Revert to the default formatting.
	 * @public
	 */
	var resetFormat = countdown.resetFormat = function() {
		LABELS_SINGLUAR = ' millisecond| second| minute| hour| day| week| month| year| decade| century| millennium'.split('|');
		LABELS_PLURAL = ' milliseconds| seconds| minutes| hours| days| weeks| months| years| decades| centuries| millennia'.split('|');
		LABEL_LAST = ' and ';
		LABEL_DELIM = ', ';
		LABEL_NOW = '';
		formatNumber = function(value) { return value; };
		formatter = plurality;
	};

	/**
	 * Override the unit labels.
	 * @public
	 * @param {string|Array=} singular a pipe ('|') delimited list of singular unit name overrides
	 * @param {string|Array=} plural a pipe ('|') delimited list of plural unit name overrides
	 * @param {string=} last a delimiter before the last unit (default: ' and ')
	 * @param {string=} delim a delimiter to use between all other units (default: ', ')
	 * @param {string=} empty a label to use when all units are zero (default: '')
	 * @param {function(number):string=} formatNumber a function which formats numbers as a string
	 * @param {function(number,number):string=} formatter a function which formats a number/unit pair as a string
	 * @deprecated since version 2.6.0
	 */
	countdown.setLabels = function(singular, plural, last, delim, empty, formatNumber, formatter) {
		setFormat({
			singular: singular,
			plural: plural,
			last: last,
			delim: delim,
			empty: empty,
			formatNumber: formatNumber,
			formatter: formatter
		});
	};

	/**
	 * Revert to the default unit labels.
	 * @public
	 * @deprecated since version 2.6.0
	 */
	countdown.resetLabels = resetFormat;

	resetFormat();

	if (module && module.exports) {
		module.exports = countdown;

	} else if (typeof window.define === 'function' && typeof window.define.amd !== 'undefined') {
		window.define('countdown', [], function() {
			return countdown;
		});
	}

	return countdown;

})(module);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3VudGRvd24vY291bnRkb3duLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY291bnRkb3duID0gcmVxdWlyZSgnY291bnRkb3duJyk7XG5cbmZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgdmFyIHRzID0gY291bnRkb3duKG5ldyBEYXRlKDIwMDAsIDAsIDEpKTtcbiAgY291bnRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb3VudFwiKTtcbiAgY291bnRFbGVtZW50LmlubmVySFRNTCA9IHRzLnRvU3RyaW5nKCk7XG5cbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgfSwgMTAwMCk7IC8vZGVsYXlcbn1cbnVwZGF0ZSgpO1xuIiwiLypnbG9iYWwgd2luZG93ICovXG4vKipcbiAqIEBsaWNlbnNlIGNvdW50ZG93bi5qcyB2Mi42LjAgaHR0cDovL2NvdW50ZG93bmpzLm9yZ1xuICogQ29weXJpZ2h0IChjKTIwMDYtMjAxNCBTdGVwaGVuIE0uIE1jS2FtZXkuXG4gKiBMaWNlbnNlZCB1bmRlciBUaGUgTUlUIExpY2Vuc2UuXG4gKi9cbi8qanNoaW50IGJpdHdpc2U6ZmFsc2UgKi9cblxuLyoqXG4gKiBAcHVibGljXG4gKiBAdHlwZSB7T2JqZWN0fG51bGx9XG4gKi9cbnZhciBtb2R1bGU7XG5cbi8qKlxuICogQVBJIGVudHJ5XG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCl8RGF0ZXxudW1iZXJ9IHN0YXJ0IHRoZSBzdGFydGluZyBkYXRlXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCl8RGF0ZXxudW1iZXJ9IGVuZCB0aGUgZW5kaW5nIGRhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSB1bml0cyB0aGUgdW5pdHMgdG8gcG9wdWxhdGVcbiAqIEByZXR1cm4ge09iamVjdHxudW1iZXJ9XG4gKi9cbnZhciBjb3VudGRvd24gPSAoXG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IG1vZHVsZSBDb21tb25KUyBNb2R1bGVcbiAqL1xuZnVuY3Rpb24obW9kdWxlKSB7XG5cdC8qanNoaW50IHNtYXJ0dGFiczp0cnVlICovXG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBNSUxMSVNFQ09ORFNcdD0gMHgwMDE7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIFNFQ09ORFNcdFx0XHQ9IDB4MDAyO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBNSU5VVEVTXHRcdFx0PSAweDAwNDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgSE9VUlNcdFx0XHQ9IDB4MDA4O1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBEQVlTXHRcdFx0PSAweDAxMDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgV0VFS1NcdFx0XHQ9IDB4MDIwO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBNT05USFNcdFx0XHQ9IDB4MDQwO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBZRUFSU1x0XHRcdD0gMHgwODA7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIERFQ0FERVNcdFx0XHQ9IDB4MTAwO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBDRU5UVVJJRVNcdFx0PSAweDIwMDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTUlMTEVOTklBXHRcdD0gMHg0MDA7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIERFRkFVTFRTXHRcdD0gWUVBUlN8TU9OVEhTfERBWVN8SE9VUlN8TUlOVVRFU3xTRUNPTkRTO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBNSUxMSVNFQ09ORFNfUEVSX1NFQ09ORCA9IDEwMDA7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIFNFQ09ORFNfUEVSX01JTlVURSA9IDYwO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBNSU5VVEVTX1BFUl9IT1VSID0gNjA7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIEhPVVJTX1BFUl9EQVkgPSAyNDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTUlMTElTRUNPTkRTX1BFUl9EQVkgPSBIT1VSU19QRVJfREFZICogTUlOVVRFU19QRVJfSE9VUiAqIFNFQ09ORFNfUEVSX01JTlVURSAqIE1JTExJU0VDT05EU19QRVJfU0VDT05EO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBEQVlTX1BFUl9XRUVLID0gNztcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTU9OVEhTX1BFUl9ZRUFSID0gMTI7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIFlFQVJTX1BFUl9ERUNBREUgPSAxMDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgREVDQURFU19QRVJfQ0VOVFVSWSA9IDEwO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBDRU5UVVJJRVNfUEVSX01JTExFTk5JVU0gPSAxMDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtudW1iZXJ9IHggbnVtYmVyXG5cdCAqIEByZXR1cm4ge251bWJlcn1cblx0ICovXG5cdHZhciBjZWlsID0gTWF0aC5jZWlsO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge251bWJlcn0geCBudW1iZXJcblx0ICogQHJldHVybiB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIGZsb29yID0gTWF0aC5mbG9vcjtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtEYXRlfSByZWYgcmVmZXJlbmNlIGRhdGVcblx0ICogQHBhcmFtIHtudW1iZXJ9IHNoaWZ0IG51bWJlciBvZiBtb250aHMgdG8gc2hpZnRcblx0ICogQHJldHVybiB7bnVtYmVyfSBudW1iZXIgb2YgZGF5cyBzaGlmdGVkXG5cdCAqL1xuXHRmdW5jdGlvbiBib3Jyb3dNb250aHMocmVmLCBzaGlmdCkge1xuXHRcdHZhciBwcmV2VGltZSA9IHJlZi5nZXRUaW1lKCk7XG5cblx0XHQvLyBpbmNyZW1lbnQgbW9udGggYnkgc2hpZnRcblx0XHRyZWYuc2V0TW9udGgoIHJlZi5nZXRNb250aCgpICsgc2hpZnQgKTtcblxuXHRcdC8vIHRoaXMgaXMgdGhlIHRyaWNraWVzdCBzaW5jZSBtb250aHMgdmFyeSBpbiBsZW5ndGhcblx0XHRyZXR1cm4gTWF0aC5yb3VuZCggKHJlZi5nZXRUaW1lKCkgLSBwcmV2VGltZSkgLyBNSUxMSVNFQ09ORFNfUEVSX0RBWSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7RGF0ZX0gcmVmIHJlZmVyZW5jZSBkYXRlXG5cdCAqIEByZXR1cm4ge251bWJlcn0gbnVtYmVyIG9mIGRheXNcblx0ICovXG5cdGZ1bmN0aW9uIGRheXNQZXJNb250aChyZWYpIHtcblx0XHR2YXIgYSA9IHJlZi5nZXRUaW1lKCk7XG5cblx0XHQvLyBpbmNyZW1lbnQgbW9udGggYnkgMVxuXHRcdHZhciBiID0gbmV3IERhdGUoYSk7XG5cdFx0Yi5zZXRNb250aCggcmVmLmdldE1vbnRoKCkgKyAxICk7XG5cblx0XHQvLyB0aGlzIGlzIHRoZSB0cmlja2llc3Qgc2luY2UgbW9udGhzIHZhcnkgaW4gbGVuZ3RoXG5cdFx0cmV0dXJuIE1hdGgucm91bmQoIChiLmdldFRpbWUoKSAtIGEpIC8gTUlMTElTRUNPTkRTX1BFUl9EQVkgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0RhdGV9IHJlZiByZWZlcmVuY2UgZGF0ZVxuXHQgKiBAcmV0dXJuIHtudW1iZXJ9IG51bWJlciBvZiBkYXlzXG5cdCAqL1xuXHRmdW5jdGlvbiBkYXlzUGVyWWVhcihyZWYpIHtcblx0XHR2YXIgYSA9IHJlZi5nZXRUaW1lKCk7XG5cblx0XHQvLyBpbmNyZW1lbnQgeWVhciBieSAxXG5cdFx0dmFyIGIgPSBuZXcgRGF0ZShhKTtcblx0XHRiLnNldEZ1bGxZZWFyKCByZWYuZ2V0RnVsbFllYXIoKSArIDEgKTtcblxuXHRcdC8vIHRoaXMgaXMgdGhlIHRyaWNraWVzdCBzaW5jZSB5ZWFycyAocGVyaW9kaWNhbGx5KSB2YXJ5IGluIGxlbmd0aFxuXHRcdHJldHVybiBNYXRoLnJvdW5kKCAoYi5nZXRUaW1lKCkgLSBhKSAvIE1JTExJU0VDT05EU19QRVJfREFZICk7XG5cdH1cblxuXHQvKipcblx0ICogQXBwbGllcyB0aGUgVGltZXNwYW4gdG8gdGhlIGdpdmVuIGRhdGUuXG5cdCAqIFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1RpbWVzcGFufSB0c1xuXHQgKiBAcGFyYW0ge0RhdGU9fSBkYXRlXG5cdCAqIEByZXR1cm4ge0RhdGV9XG5cdCAqL1xuXHRmdW5jdGlvbiBhZGRUb0RhdGUodHMsIGRhdGUpIHtcblx0XHRkYXRlID0gKGRhdGUgaW5zdGFuY2VvZiBEYXRlKSB8fCAoKGRhdGUgIT09IG51bGwpICYmIGlzRmluaXRlKGRhdGUpKSA/IG5ldyBEYXRlKCtkYXRlKSA6IG5ldyBEYXRlKCk7XG5cdFx0aWYgKCF0cykge1xuXHRcdFx0cmV0dXJuIGRhdGU7XG5cdFx0fVxuXG5cdFx0Ly8gaWYgdGhlcmUgaXMgYSB2YWx1ZSBmaWVsZCwgdXNlIGl0IGRpcmVjdGx5XG5cdFx0dmFyIHZhbHVlID0gK3RzLnZhbHVlIHx8IDA7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyB2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gZGF0ZTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9ICt0cy5taWxsaXNlY29uZHMgfHwgMDtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGRhdGUuc2V0TWlsbGlzZWNvbmRzKGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCkgKyB2YWx1ZSk7XG5cdFx0fVxuXG5cdFx0dmFsdWUgPSArdHMuc2Vjb25kcyB8fCAwO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0ZGF0ZS5zZXRTZWNvbmRzKGRhdGUuZ2V0U2Vjb25kcygpICsgdmFsdWUpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gK3RzLm1pbnV0ZXMgfHwgMDtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGRhdGUuc2V0TWludXRlcyhkYXRlLmdldE1pbnV0ZXMoKSArIHZhbHVlKTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9ICt0cy5ob3VycyB8fCAwO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0ZGF0ZS5zZXRIb3VycyhkYXRlLmdldEhvdXJzKCkgKyB2YWx1ZSk7XG5cdFx0fVxuXG5cdFx0dmFsdWUgPSArdHMud2Vla3MgfHwgMDtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdHZhbHVlICo9IERBWVNfUEVSX1dFRUs7XG5cdFx0fVxuXG5cdFx0dmFsdWUgKz0gK3RzLmRheXMgfHwgMDtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIHZhbHVlKTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9ICt0cy5tb250aHMgfHwgMDtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpICsgdmFsdWUpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gK3RzLm1pbGxlbm5pYSB8fCAwO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0dmFsdWUgKj0gQ0VOVFVSSUVTX1BFUl9NSUxMRU5OSVVNO1xuXHRcdH1cblxuXHRcdHZhbHVlICs9ICt0cy5jZW50dXJpZXMgfHwgMDtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdHZhbHVlICo9IERFQ0FERVNfUEVSX0NFTlRVUlk7XG5cdFx0fVxuXG5cdFx0dmFsdWUgKz0gK3RzLmRlY2FkZXMgfHwgMDtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdHZhbHVlICo9IFlFQVJTX1BFUl9ERUNBREU7XG5cdFx0fVxuXG5cdFx0dmFsdWUgKz0gK3RzLnllYXJzIHx8IDA7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRkYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSArIHZhbHVlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGF0ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBMQUJFTF9NSUxMSVNFQ09ORFNcdD0gMDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTEFCRUxfU0VDT05EU1x0XHQ9IDE7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIExBQkVMX01JTlVURVNcdFx0PSAyO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBMQUJFTF9IT1VSU1x0XHRcdD0gMztcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTEFCRUxfREFZU1x0XHRcdD0gNDtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTEFCRUxfV0VFS1NcdFx0XHQ9IDU7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIExBQkVMX01PTlRIU1x0XHQ9IDY7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dmFyIExBQkVMX1lFQVJTXHRcdFx0PSA3O1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHZhciBMQUJFTF9ERUNBREVTXHRcdD0gODtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTEFCRUxfQ0VOVFVSSUVTXHRcdD0gOTtcblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgTEFCRUxfTUlMTEVOTklBXHRcdD0gMTA7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB0eXBlIHtBcnJheX1cblx0ICovXG5cdHZhciBMQUJFTFNfU0lOR0xVQVI7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB0eXBlIHtBcnJheX1cblx0ICovXG5cdHZhciBMQUJFTFNfUExVUkFMO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdHlwZSB7c3RyaW5nfVxuXHQgKi9cblx0dmFyIExBQkVMX0xBU1Q7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqL1xuXHR2YXIgTEFCRUxfREVMSU07XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB0eXBlIHtzdHJpbmd9XG5cdCAqL1xuXHR2YXIgTEFCRUxfTk9XO1xuXG5cdC8qKlxuXHQgKiBGb3JtYXRzIGEgbnVtYmVyICYgdW5pdCBhcyBhIHN0cmluZ1xuXHQgKiBcblx0ICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB1bml0XG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cdHZhciBmb3JtYXR0ZXI7XG5cblx0LyoqXG5cdCAqIEZvcm1hdHMgYSBudW1iZXIgYXMgYSBzdHJpbmdcblx0ICogXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZVxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXHR2YXIgZm9ybWF0TnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcblx0ICogQHBhcmFtIHtudW1iZXJ9IHVuaXQgdW5pdCBpbmRleCBpbnRvIGxhYmVsIGxpc3Rcblx0ICogQHJldHVybiB7c3RyaW5nfVxuXHQgKi9cblx0ZnVuY3Rpb24gcGx1cmFsaXR5KHZhbHVlLCB1bml0KSB7XG5cdFx0cmV0dXJuIGZvcm1hdE51bWJlcih2YWx1ZSkrKCh2YWx1ZSA9PT0gMSkgPyBMQUJFTFNfU0lOR0xVQVJbdW5pdF0gOiBMQUJFTFNfUExVUkFMW3VuaXRdKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGb3JtYXRzIHRoZSBlbnRyaWVzIHdpdGggc2luZ3VsYXIgb3IgcGx1cmFsIGxhYmVsc1xuXHQgKiBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtUaW1lc3Bhbn0gdHNcblx0ICogQHJldHVybiB7QXJyYXl9XG5cdCAqL1xuXHR2YXIgZm9ybWF0TGlzdDtcblxuXHQvKipcblx0ICogVGltZXNwYW4gcmVwcmVzZW50YXRpb24gb2YgYSBkdXJhdGlvbiBvZiB0aW1lXG5cdCAqIFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdGhpcyB7VGltZXNwYW59XG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKi9cblx0ZnVuY3Rpb24gVGltZXNwYW4oKSB7fVxuXG5cdC8qKlxuXHQgKiBGb3JtYXRzIHRoZSBUaW1lc3BhbiBhcyBhIHNlbnRlbmNlXG5cdCAqIFxuXHQgKiBAcGFyYW0ge3N0cmluZz19IGVtcHR5TGFiZWwgdGhlIHN0cmluZyB0byB1c2Ugd2hlbiBubyB2YWx1ZXMgcmV0dXJuZWRcblx0ICogQHJldHVybiB7c3RyaW5nfVxuXHQgKi9cblx0VGltZXNwYW4ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oZW1wdHlMYWJlbCkge1xuXHRcdHZhciBsYWJlbCA9IGZvcm1hdExpc3QodGhpcyk7XG5cblx0XHR2YXIgY291bnQgPSBsYWJlbC5sZW5ndGg7XG5cdFx0aWYgKCFjb3VudCkge1xuXHRcdFx0cmV0dXJuIGVtcHR5TGFiZWwgPyAnJytlbXB0eUxhYmVsIDogTEFCRUxfTk9XO1xuXHRcdH1cblx0XHRpZiAoY291bnQgPT09IDEpIHtcblx0XHRcdHJldHVybiBsYWJlbFswXTtcblx0XHR9XG5cblx0XHR2YXIgbGFzdCA9IExBQkVMX0xBU1QrbGFiZWwucG9wKCk7XG5cdFx0cmV0dXJuIGxhYmVsLmpvaW4oTEFCRUxfREVMSU0pK2xhc3Q7XG5cdH07XG5cblx0LyoqXG5cdCAqIEZvcm1hdHMgdGhlIFRpbWVzcGFuIGFzIGEgc2VudGVuY2UgaW4gSFRNTFxuXHQgKiBcblx0ICogQHBhcmFtIHtzdHJpbmc9fSB0YWcgSFRNTCB0YWcgbmFtZSB0byB3cmFwIGVhY2ggdmFsdWVcblx0ICogQHBhcmFtIHtzdHJpbmc9fSBlbXB0eUxhYmVsIHRoZSBzdHJpbmcgdG8gdXNlIHdoZW4gbm8gdmFsdWVzIHJldHVybmVkXG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cdFRpbWVzcGFuLnByb3RvdHlwZS50b0hUTUwgPSBmdW5jdGlvbih0YWcsIGVtcHR5TGFiZWwpIHtcblx0XHR0YWcgPSB0YWcgfHwgJ3NwYW4nO1xuXHRcdHZhciBsYWJlbCA9IGZvcm1hdExpc3QodGhpcyk7XG5cblx0XHR2YXIgY291bnQgPSBsYWJlbC5sZW5ndGg7XG5cdFx0aWYgKCFjb3VudCkge1xuXHRcdFx0ZW1wdHlMYWJlbCA9IGVtcHR5TGFiZWwgfHwgTEFCRUxfTk9XO1xuXHRcdFx0cmV0dXJuIGVtcHR5TGFiZWwgPyAnPCcrdGFnKyc+JytlbXB0eUxhYmVsKyc8LycrdGFnKyc+JyA6IGVtcHR5TGFiZWw7XG5cdFx0fVxuXHRcdGZvciAodmFyIGk9MDsgaTxjb3VudDsgaSsrKSB7XG5cdFx0XHQvLyB3cmFwIGVhY2ggdW5pdCBpbiB0YWdcblx0XHRcdGxhYmVsW2ldID0gJzwnK3RhZysnPicrbGFiZWxbaV0rJzwvJyt0YWcrJz4nO1xuXHRcdH1cblx0XHRpZiAoY291bnQgPT09IDEpIHtcblx0XHRcdHJldHVybiBsYWJlbFswXTtcblx0XHR9XG5cblx0XHR2YXIgbGFzdCA9IExBQkVMX0xBU1QrbGFiZWwucG9wKCk7XG5cdFx0cmV0dXJuIGxhYmVsLmpvaW4oTEFCRUxfREVMSU0pK2xhc3Q7XG5cdH07XG5cblx0LyoqXG5cdCAqIEFwcGxpZXMgdGhlIFRpbWVzcGFuIHRvIHRoZSBnaXZlbiBkYXRlXG5cdCAqIFxuXHQgKiBAcGFyYW0ge0RhdGU9fSBkYXRlIHRoZSBkYXRlIHRvIHdoaWNoIHRoZSB0aW1lc3BhbiBpcyBhZGRlZC5cblx0ICogQHJldHVybiB7RGF0ZX1cblx0ICovXG5cdFRpbWVzcGFuLnByb3RvdHlwZS5hZGRUbyA9IGZ1bmN0aW9uKGRhdGUpIHtcblx0XHRyZXR1cm4gYWRkVG9EYXRlKHRoaXMsIGRhdGUpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBGb3JtYXRzIHRoZSBlbnRyaWVzIGFzIEVuZ2xpc2ggbGFiZWxzXG5cdCAqIFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1RpbWVzcGFufSB0c1xuXHQgKiBAcmV0dXJuIHtBcnJheX1cblx0ICovXG5cdGZvcm1hdExpc3QgPSBmdW5jdGlvbih0cykge1xuXHRcdHZhciBsaXN0ID0gW107XG5cblx0XHR2YXIgdmFsdWUgPSB0cy5taWxsZW5uaWE7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRsaXN0LnB1c2goZm9ybWF0dGVyKHZhbHVlLCBMQUJFTF9NSUxMRU5OSUEpKTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9IHRzLmNlbnR1cmllcztcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGxpc3QucHVzaChmb3JtYXR0ZXIodmFsdWUsIExBQkVMX0NFTlRVUklFUykpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gdHMuZGVjYWRlcztcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGxpc3QucHVzaChmb3JtYXR0ZXIodmFsdWUsIExBQkVMX0RFQ0FERVMpKTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9IHRzLnllYXJzO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0bGlzdC5wdXNoKGZvcm1hdHRlcih2YWx1ZSwgTEFCRUxfWUVBUlMpKTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9IHRzLm1vbnRocztcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGxpc3QucHVzaChmb3JtYXR0ZXIodmFsdWUsIExBQkVMX01PTlRIUykpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gdHMud2Vla3M7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRsaXN0LnB1c2goZm9ybWF0dGVyKHZhbHVlLCBMQUJFTF9XRUVLUykpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gdHMuZGF5cztcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGxpc3QucHVzaChmb3JtYXR0ZXIodmFsdWUsIExBQkVMX0RBWVMpKTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9IHRzLmhvdXJzO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0bGlzdC5wdXNoKGZvcm1hdHRlcih2YWx1ZSwgTEFCRUxfSE9VUlMpKTtcblx0XHR9XG5cblx0XHR2YWx1ZSA9IHRzLm1pbnV0ZXM7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRsaXN0LnB1c2goZm9ybWF0dGVyKHZhbHVlLCBMQUJFTF9NSU5VVEVTKSk7XG5cdFx0fVxuXG5cdFx0dmFsdWUgPSB0cy5zZWNvbmRzO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0bGlzdC5wdXNoKGZvcm1hdHRlcih2YWx1ZSwgTEFCRUxfU0VDT05EUykpO1xuXHRcdH1cblxuXHRcdHZhbHVlID0gdHMubWlsbGlzZWNvbmRzO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0bGlzdC5wdXNoKGZvcm1hdHRlcih2YWx1ZSwgTEFCRUxfTUlMTElTRUNPTkRTKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGxpc3Q7XG5cdH07XG5cblx0LyoqXG5cdCAqIEJvcnJvdyBhbnkgdW5kZXJmbG93IHVuaXRzLCBjYXJyeSBhbnkgb3ZlcmZsb3cgdW5pdHNcblx0ICogXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7VGltZXNwYW59IHRzXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0b1VuaXRcblx0ICovXG5cdGZ1bmN0aW9uIHJpcHBsZVJvdW5kZWQodHMsIHRvVW5pdCkge1xuXHRcdHN3aXRjaCAodG9Vbml0KSB7XG5cdFx0XHRjYXNlICdzZWNvbmRzJzpcblx0XHRcdFx0aWYgKHRzLnNlY29uZHMgIT09IFNFQ09ORFNfUEVSX01JTlVURSB8fCBpc05hTih0cy5taW51dGVzKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyByaXBwbGUgc2Vjb25kcyB1cCB0byBtaW51dGVzXG5cdFx0XHRcdHRzLm1pbnV0ZXMrKztcblx0XHRcdFx0dHMuc2Vjb25kcyA9IDA7XG5cblx0XHRcdFx0LyogZmFsbHMgdGhyb3VnaCAqL1xuXHRcdFx0Y2FzZSAnbWludXRlcyc6XG5cdFx0XHRcdGlmICh0cy5taW51dGVzICE9PSBNSU5VVEVTX1BFUl9IT1VSIHx8IGlzTmFOKHRzLmhvdXJzKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyByaXBwbGUgbWludXRlcyB1cCB0byBob3Vyc1xuXHRcdFx0XHR0cy5ob3VycysrO1xuXHRcdFx0XHR0cy5taW51dGVzID0gMDtcblxuXHRcdFx0XHQvKiBmYWxscyB0aHJvdWdoICovXG5cdFx0XHRjYXNlICdob3Vycyc6XG5cdFx0XHRcdGlmICh0cy5ob3VycyAhPT0gSE9VUlNfUEVSX0RBWSB8fCBpc05hTih0cy5kYXlzKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyByaXBwbGUgaG91cnMgdXAgdG8gZGF5c1xuXHRcdFx0XHR0cy5kYXlzKys7XG5cdFx0XHRcdHRzLmhvdXJzID0gMDtcblxuXHRcdFx0XHQvKiBmYWxscyB0aHJvdWdoICovXG5cdFx0XHRjYXNlICdkYXlzJzpcblx0XHRcdFx0aWYgKHRzLmRheXMgIT09IERBWVNfUEVSX1dFRUsgfHwgaXNOYU4odHMud2Vla3MpKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHJpcHBsZSBkYXlzIHVwIHRvIHdlZWtzXG5cdFx0XHRcdHRzLndlZWtzKys7XG5cdFx0XHRcdHRzLmRheXMgPSAwO1xuXG5cdFx0XHRcdC8qIGZhbGxzIHRocm91Z2ggKi9cblx0XHRcdGNhc2UgJ3dlZWtzJzpcblx0XHRcdFx0aWYgKHRzLndlZWtzICE9PSBkYXlzUGVyTW9udGgodHMucmVmTW9udGgpL0RBWVNfUEVSX1dFRUsgfHwgaXNOYU4odHMubW9udGhzKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyByaXBwbGUgd2Vla3MgdXAgdG8gbW9udGhzXG5cdFx0XHRcdHRzLm1vbnRocysrO1xuXHRcdFx0XHR0cy53ZWVrcyA9IDA7XG5cblx0XHRcdFx0LyogZmFsbHMgdGhyb3VnaCAqL1xuXHRcdFx0Y2FzZSAnbW9udGhzJzpcblx0XHRcdFx0aWYgKHRzLm1vbnRocyAhPT0gTU9OVEhTX1BFUl9ZRUFSIHx8IGlzTmFOKHRzLnllYXJzKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyByaXBwbGUgbW9udGhzIHVwIHRvIHllYXJzXG5cdFx0XHRcdHRzLnllYXJzKys7XG5cdFx0XHRcdHRzLm1vbnRocyA9IDA7XG5cblx0XHRcdFx0LyogZmFsbHMgdGhyb3VnaCAqL1xuXHRcdFx0Y2FzZSAneWVhcnMnOlxuXHRcdFx0XHRpZiAodHMueWVhcnMgIT09IFlFQVJTX1BFUl9ERUNBREUgfHwgaXNOYU4odHMuZGVjYWRlcykpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gcmlwcGxlIHllYXJzIHVwIHRvIGRlY2FkZXNcblx0XHRcdFx0dHMuZGVjYWRlcysrO1xuXHRcdFx0XHR0cy55ZWFycyA9IDA7XG5cblx0XHRcdFx0LyogZmFsbHMgdGhyb3VnaCAqL1xuXHRcdFx0Y2FzZSAnZGVjYWRlcyc6XG5cdFx0XHRcdGlmICh0cy5kZWNhZGVzICE9PSBERUNBREVTX1BFUl9DRU5UVVJZIHx8IGlzTmFOKHRzLmNlbnR1cmllcykpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gcmlwcGxlIGRlY2FkZXMgdXAgdG8gY2VudHVyaWVzXG5cdFx0XHRcdHRzLmNlbnR1cmllcysrO1xuXHRcdFx0XHR0cy5kZWNhZGVzID0gMDtcblxuXHRcdFx0XHQvKiBmYWxscyB0aHJvdWdoICovXG5cdFx0XHRjYXNlICdjZW50dXJpZXMnOlxuXHRcdFx0XHRpZiAodHMuY2VudHVyaWVzICE9PSBDRU5UVVJJRVNfUEVSX01JTExFTk5JVU0gfHwgaXNOYU4odHMubWlsbGVubmlhKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyByaXBwbGUgY2VudHVyaWVzIHVwIHRvIG1pbGxlbm5pYVxuXHRcdFx0XHR0cy5taWxsZW5uaWErKztcblx0XHRcdFx0dHMuY2VudHVyaWVzID0gMDtcblx0XHRcdFx0LyogZmFsbHMgdGhyb3VnaCAqL1xuXHRcdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJpcHBsZSB1cCBwYXJ0aWFsIHVuaXRzIG9uZSBwbGFjZVxuXHQgKiBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtUaW1lc3Bhbn0gdHMgdGltZXNwYW5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGZyYWMgYWNjdW11bGF0ZWQgZnJhY3Rpb25hbCB2YWx1ZVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZnJvbVVuaXQgc291cmNlIHVuaXQgbmFtZVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdG9Vbml0IHRhcmdldCB1bml0IG5hbWVcblx0ICogQHBhcmFtIHtudW1iZXJ9IGNvbnZlcnNpb24gbXVsdGlwbGllciBiZXR3ZWVuIHVuaXRzXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBkaWdpdHMgbWF4IG51bWJlciBvZiBkZWNpbWFsIGRpZ2l0cyB0byBvdXRwdXRcblx0ICogQHJldHVybiB7bnVtYmVyfSBuZXcgZnJhY3Rpb25hbCB2YWx1ZVxuXHQgKi9cblx0ZnVuY3Rpb24gZnJhY3Rpb24odHMsIGZyYWMsIGZyb21Vbml0LCB0b1VuaXQsIGNvbnZlcnNpb24sIGRpZ2l0cykge1xuXHRcdGlmICh0c1tmcm9tVW5pdF0gPj0gMCkge1xuXHRcdFx0ZnJhYyArPSB0c1tmcm9tVW5pdF07XG5cdFx0XHRkZWxldGUgdHNbZnJvbVVuaXRdO1xuXHRcdH1cblxuXHRcdGZyYWMgLz0gY29udmVyc2lvbjtcblx0XHRpZiAoZnJhYyArIDEgPD0gMSkge1xuXHRcdFx0Ly8gZHJvcCBpZiBiZWxvdyBtYWNoaW5lIGVwc2lsb25cblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblxuXHRcdGlmICh0c1t0b1VuaXRdID49IDApIHtcblx0XHRcdC8vIGVuc3VyZSBkb2VzIG5vdCBoYXZlIG1vcmUgdGhhbiBzcGVjaWZpZWQgbnVtYmVyIG9mIGRpZ2l0c1xuXHRcdFx0dHNbdG9Vbml0XSA9ICsodHNbdG9Vbml0XSArIGZyYWMpLnRvRml4ZWQoZGlnaXRzKTtcblx0XHRcdHJpcHBsZVJvdW5kZWQodHMsIHRvVW5pdCk7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cblx0XHRyZXR1cm4gZnJhYztcblx0fVxuXG5cdC8qKlxuXHQgKiBSaXBwbGUgdXAgcGFydGlhbCB1bml0cyB0byBuZXh0IGV4aXN0aW5nXG5cdCAqIFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1RpbWVzcGFufSB0c1xuXHQgKiBAcGFyYW0ge251bWJlcn0gZGlnaXRzIG1heCBudW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgdG8gb3V0cHV0XG5cdCAqL1xuXHRmdW5jdGlvbiBmcmFjdGlvbmFsKHRzLCBkaWdpdHMpIHtcblx0XHR2YXIgZnJhYyA9IGZyYWN0aW9uKHRzLCAwLCAnbWlsbGlzZWNvbmRzJywgJ3NlY29uZHMnLCBNSUxMSVNFQ09ORFNfUEVSX1NFQ09ORCwgZGlnaXRzKTtcblx0XHRpZiAoIWZyYWMpIHsgcmV0dXJuOyB9XG5cblx0XHRmcmFjID0gZnJhY3Rpb24odHMsIGZyYWMsICdzZWNvbmRzJywgJ21pbnV0ZXMnLCBTRUNPTkRTX1BFUl9NSU5VVEUsIGRpZ2l0cyk7XG5cdFx0aWYgKCFmcmFjKSB7IHJldHVybjsgfVxuXG5cdFx0ZnJhYyA9IGZyYWN0aW9uKHRzLCBmcmFjLCAnbWludXRlcycsICdob3VycycsIE1JTlVURVNfUEVSX0hPVVIsIGRpZ2l0cyk7XG5cdFx0aWYgKCFmcmFjKSB7IHJldHVybjsgfVxuXG5cdFx0ZnJhYyA9IGZyYWN0aW9uKHRzLCBmcmFjLCAnaG91cnMnLCAnZGF5cycsIEhPVVJTX1BFUl9EQVksIGRpZ2l0cyk7XG5cdFx0aWYgKCFmcmFjKSB7IHJldHVybjsgfVxuXG5cdFx0ZnJhYyA9IGZyYWN0aW9uKHRzLCBmcmFjLCAnZGF5cycsICd3ZWVrcycsIERBWVNfUEVSX1dFRUssIGRpZ2l0cyk7XG5cdFx0aWYgKCFmcmFjKSB7IHJldHVybjsgfVxuXG5cdFx0ZnJhYyA9IGZyYWN0aW9uKHRzLCBmcmFjLCAnd2Vla3MnLCAnbW9udGhzJywgZGF5c1Blck1vbnRoKHRzLnJlZk1vbnRoKS9EQVlTX1BFUl9XRUVLLCBkaWdpdHMpO1xuXHRcdGlmICghZnJhYykgeyByZXR1cm47IH1cblxuXHRcdGZyYWMgPSBmcmFjdGlvbih0cywgZnJhYywgJ21vbnRocycsICd5ZWFycycsIGRheXNQZXJZZWFyKHRzLnJlZk1vbnRoKS9kYXlzUGVyTW9udGgodHMucmVmTW9udGgpLCBkaWdpdHMpO1xuXHRcdGlmICghZnJhYykgeyByZXR1cm47IH1cblxuXHRcdGZyYWMgPSBmcmFjdGlvbih0cywgZnJhYywgJ3llYXJzJywgJ2RlY2FkZXMnLCBZRUFSU19QRVJfREVDQURFLCBkaWdpdHMpO1xuXHRcdGlmICghZnJhYykgeyByZXR1cm47IH1cblxuXHRcdGZyYWMgPSBmcmFjdGlvbih0cywgZnJhYywgJ2RlY2FkZXMnLCAnY2VudHVyaWVzJywgREVDQURFU19QRVJfQ0VOVFVSWSwgZGlnaXRzKTtcblx0XHRpZiAoIWZyYWMpIHsgcmV0dXJuOyB9XG5cblx0XHRmcmFjID0gZnJhY3Rpb24odHMsIGZyYWMsICdjZW50dXJpZXMnLCAnbWlsbGVubmlhJywgQ0VOVFVSSUVTX1BFUl9NSUxMRU5OSVVNLCBkaWdpdHMpO1xuXG5cdFx0Ly8gc2hvdWxkIG5ldmVyIHJlYWNoIHRoaXMgd2l0aCByZW1haW5pbmcgZnJhY3Rpb25hbCB2YWx1ZVxuXHRcdGlmIChmcmFjKSB7IHRocm93IG5ldyBFcnJvcignRnJhY3Rpb25hbCB1bml0IG92ZXJmbG93Jyk7IH1cblx0fVxuXG5cdC8qKlxuXHQgKiBCb3Jyb3cgYW55IHVuZGVyZmxvdyB1bml0cywgY2FycnkgYW55IG92ZXJmbG93IHVuaXRzXG5cdCAqIFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1RpbWVzcGFufSB0c1xuXHQgKi9cblx0ZnVuY3Rpb24gcmlwcGxlKHRzKSB7XG5cdFx0dmFyIHg7XG5cblx0XHRpZiAodHMubWlsbGlzZWNvbmRzIDwgMCkge1xuXHRcdFx0Ly8gcmlwcGxlIHNlY29uZHMgZG93biB0byBtaWxsaXNlY29uZHNcblx0XHRcdHggPSBjZWlsKC10cy5taWxsaXNlY29uZHMgLyBNSUxMSVNFQ09ORFNfUEVSX1NFQ09ORCk7XG5cdFx0XHR0cy5zZWNvbmRzIC09IHg7XG5cdFx0XHR0cy5taWxsaXNlY29uZHMgKz0geCAqIE1JTExJU0VDT05EU19QRVJfU0VDT05EO1xuXG5cdFx0fSBlbHNlIGlmICh0cy5taWxsaXNlY29uZHMgPj0gTUlMTElTRUNPTkRTX1BFUl9TRUNPTkQpIHtcblx0XHRcdC8vIHJpcHBsZSBtaWxsaXNlY29uZHMgdXAgdG8gc2Vjb25kc1xuXHRcdFx0dHMuc2Vjb25kcyArPSBmbG9vcih0cy5taWxsaXNlY29uZHMgLyBNSUxMSVNFQ09ORFNfUEVSX1NFQ09ORCk7XG5cdFx0XHR0cy5taWxsaXNlY29uZHMgJT0gTUlMTElTRUNPTkRTX1BFUl9TRUNPTkQ7XG5cdFx0fVxuXG5cdFx0aWYgKHRzLnNlY29uZHMgPCAwKSB7XG5cdFx0XHQvLyByaXBwbGUgbWludXRlcyBkb3duIHRvIHNlY29uZHNcblx0XHRcdHggPSBjZWlsKC10cy5zZWNvbmRzIC8gU0VDT05EU19QRVJfTUlOVVRFKTtcblx0XHRcdHRzLm1pbnV0ZXMgLT0geDtcblx0XHRcdHRzLnNlY29uZHMgKz0geCAqIFNFQ09ORFNfUEVSX01JTlVURTtcblxuXHRcdH0gZWxzZSBpZiAodHMuc2Vjb25kcyA+PSBTRUNPTkRTX1BFUl9NSU5VVEUpIHtcblx0XHRcdC8vIHJpcHBsZSBzZWNvbmRzIHVwIHRvIG1pbnV0ZXNcblx0XHRcdHRzLm1pbnV0ZXMgKz0gZmxvb3IodHMuc2Vjb25kcyAvIFNFQ09ORFNfUEVSX01JTlVURSk7XG5cdFx0XHR0cy5zZWNvbmRzICU9IFNFQ09ORFNfUEVSX01JTlVURTtcblx0XHR9XG5cblx0XHRpZiAodHMubWludXRlcyA8IDApIHtcblx0XHRcdC8vIHJpcHBsZSBob3VycyBkb3duIHRvIG1pbnV0ZXNcblx0XHRcdHggPSBjZWlsKC10cy5taW51dGVzIC8gTUlOVVRFU19QRVJfSE9VUik7XG5cdFx0XHR0cy5ob3VycyAtPSB4O1xuXHRcdFx0dHMubWludXRlcyArPSB4ICogTUlOVVRFU19QRVJfSE9VUjtcblxuXHRcdH0gZWxzZSBpZiAodHMubWludXRlcyA+PSBNSU5VVEVTX1BFUl9IT1VSKSB7XG5cdFx0XHQvLyByaXBwbGUgbWludXRlcyB1cCB0byBob3Vyc1xuXHRcdFx0dHMuaG91cnMgKz0gZmxvb3IodHMubWludXRlcyAvIE1JTlVURVNfUEVSX0hPVVIpO1xuXHRcdFx0dHMubWludXRlcyAlPSBNSU5VVEVTX1BFUl9IT1VSO1xuXHRcdH1cblxuXHRcdGlmICh0cy5ob3VycyA8IDApIHtcblx0XHRcdC8vIHJpcHBsZSBkYXlzIGRvd24gdG8gaG91cnNcblx0XHRcdHggPSBjZWlsKC10cy5ob3VycyAvIEhPVVJTX1BFUl9EQVkpO1xuXHRcdFx0dHMuZGF5cyAtPSB4O1xuXHRcdFx0dHMuaG91cnMgKz0geCAqIEhPVVJTX1BFUl9EQVk7XG5cblx0XHR9IGVsc2UgaWYgKHRzLmhvdXJzID49IEhPVVJTX1BFUl9EQVkpIHtcblx0XHRcdC8vIHJpcHBsZSBob3VycyB1cCB0byBkYXlzXG5cdFx0XHR0cy5kYXlzICs9IGZsb29yKHRzLmhvdXJzIC8gSE9VUlNfUEVSX0RBWSk7XG5cdFx0XHR0cy5ob3VycyAlPSBIT1VSU19QRVJfREFZO1xuXHRcdH1cblxuXHRcdHdoaWxlICh0cy5kYXlzIDwgMCkge1xuXHRcdFx0Ly8gTk9URTogbmV2ZXIgYWN0dWFsbHkgc2VlbiB0aGlzIGxvb3AgbW9yZSB0aGFuIG9uY2VcblxuXHRcdFx0Ly8gcmlwcGxlIG1vbnRocyBkb3duIHRvIGRheXNcblx0XHRcdHRzLm1vbnRocy0tO1xuXHRcdFx0dHMuZGF5cyArPSBib3Jyb3dNb250aHModHMucmVmTW9udGgsIDEpO1xuXHRcdH1cblxuXHRcdC8vIHdlZWtzIGlzIGFsd2F5cyB6ZXJvIGhlcmVcblxuXHRcdGlmICh0cy5kYXlzID49IERBWVNfUEVSX1dFRUspIHtcblx0XHRcdC8vIHJpcHBsZSBkYXlzIHVwIHRvIHdlZWtzXG5cdFx0XHR0cy53ZWVrcyArPSBmbG9vcih0cy5kYXlzIC8gREFZU19QRVJfV0VFSyk7XG5cdFx0XHR0cy5kYXlzICU9IERBWVNfUEVSX1dFRUs7XG5cdFx0fVxuXG5cdFx0aWYgKHRzLm1vbnRocyA8IDApIHtcblx0XHRcdC8vIHJpcHBsZSB5ZWFycyBkb3duIHRvIG1vbnRoc1xuXHRcdFx0eCA9IGNlaWwoLXRzLm1vbnRocyAvIE1PTlRIU19QRVJfWUVBUik7XG5cdFx0XHR0cy55ZWFycyAtPSB4O1xuXHRcdFx0dHMubW9udGhzICs9IHggKiBNT05USFNfUEVSX1lFQVI7XG5cblx0XHR9IGVsc2UgaWYgKHRzLm1vbnRocyA+PSBNT05USFNfUEVSX1lFQVIpIHtcblx0XHRcdC8vIHJpcHBsZSBtb250aHMgdXAgdG8geWVhcnNcblx0XHRcdHRzLnllYXJzICs9IGZsb29yKHRzLm1vbnRocyAvIE1PTlRIU19QRVJfWUVBUik7XG5cdFx0XHR0cy5tb250aHMgJT0gTU9OVEhTX1BFUl9ZRUFSO1xuXHRcdH1cblxuXHRcdC8vIHllYXJzIGlzIGFsd2F5cyBub24tbmVnYXRpdmUgaGVyZVxuXHRcdC8vIGRlY2FkZXMsIGNlbnR1cmllcyBhbmQgbWlsbGVubmlhIGFyZSBhbHdheXMgemVybyBoZXJlXG5cblx0XHRpZiAodHMueWVhcnMgPj0gWUVBUlNfUEVSX0RFQ0FERSkge1xuXHRcdFx0Ly8gcmlwcGxlIHllYXJzIHVwIHRvIGRlY2FkZXNcblx0XHRcdHRzLmRlY2FkZXMgKz0gZmxvb3IodHMueWVhcnMgLyBZRUFSU19QRVJfREVDQURFKTtcblx0XHRcdHRzLnllYXJzICU9IFlFQVJTX1BFUl9ERUNBREU7XG5cblx0XHRcdGlmICh0cy5kZWNhZGVzID49IERFQ0FERVNfUEVSX0NFTlRVUlkpIHtcblx0XHRcdFx0Ly8gcmlwcGxlIGRlY2FkZXMgdXAgdG8gY2VudHVyaWVzXG5cdFx0XHRcdHRzLmNlbnR1cmllcyArPSBmbG9vcih0cy5kZWNhZGVzIC8gREVDQURFU19QRVJfQ0VOVFVSWSk7XG5cdFx0XHRcdHRzLmRlY2FkZXMgJT0gREVDQURFU19QRVJfQ0VOVFVSWTtcblxuXHRcdFx0XHRpZiAodHMuY2VudHVyaWVzID49IENFTlRVUklFU19QRVJfTUlMTEVOTklVTSkge1xuXHRcdFx0XHRcdC8vIHJpcHBsZSBjZW50dXJpZXMgdXAgdG8gbWlsbGVubmlhXG5cdFx0XHRcdFx0dHMubWlsbGVubmlhICs9IGZsb29yKHRzLmNlbnR1cmllcyAvIENFTlRVUklFU19QRVJfTUlMTEVOTklVTSk7XG5cdFx0XHRcdFx0dHMuY2VudHVyaWVzICU9IENFTlRVUklFU19QRVJfTUlMTEVOTklVTTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZW1vdmUgYW55IHVuaXRzIG5vdCByZXF1ZXN0ZWRcblx0ICogXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7VGltZXNwYW59IHRzXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB1bml0cyB0aGUgdW5pdHMgdG8gcG9wdWxhdGVcblx0ICogQHBhcmFtIHtudW1iZXJ9IG1heCBudW1iZXIgb2YgbGFiZWxzIHRvIG91dHB1dFxuXHQgKiBAcGFyYW0ge251bWJlcn0gZGlnaXRzIG1heCBudW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgdG8gb3V0cHV0XG5cdCAqL1xuXHRmdW5jdGlvbiBwcnVuZVVuaXRzKHRzLCB1bml0cywgbWF4LCBkaWdpdHMpIHtcblx0XHR2YXIgY291bnQgPSAwO1xuXG5cdFx0Ly8gQ2FsYyBmcm9tIGxhcmdlc3QgdW5pdCB0byBzbWFsbGVzdCB0byBwcmV2ZW50IHVuZGVyZmxvd1xuXHRcdGlmICghKHVuaXRzICYgTUlMTEVOTklBKSB8fCAoY291bnQgPj0gbWF4KSkge1xuXHRcdFx0Ly8gcmlwcGxlIG1pbGxlbm5pYSBkb3duIHRvIGNlbnR1cmllc1xuXHRcdFx0dHMuY2VudHVyaWVzICs9IHRzLm1pbGxlbm5pYSAqIENFTlRVUklFU19QRVJfTUlMTEVOTklVTTtcblx0XHRcdGRlbGV0ZSB0cy5taWxsZW5uaWE7XG5cblx0XHR9IGVsc2UgaWYgKHRzLm1pbGxlbm5pYSkge1xuXHRcdFx0Y291bnQrKztcblx0XHR9XG5cblx0XHRpZiAoISh1bml0cyAmIENFTlRVUklFUykgfHwgKGNvdW50ID49IG1heCkpIHtcblx0XHRcdC8vIHJpcHBsZSBjZW50dXJpZXMgZG93biB0byBkZWNhZGVzXG5cdFx0XHR0cy5kZWNhZGVzICs9IHRzLmNlbnR1cmllcyAqIERFQ0FERVNfUEVSX0NFTlRVUlk7XG5cdFx0XHRkZWxldGUgdHMuY2VudHVyaWVzO1xuXG5cdFx0fSBlbHNlIGlmICh0cy5jZW50dXJpZXMpIHtcblx0XHRcdGNvdW50Kys7XG5cdFx0fVxuXG5cdFx0aWYgKCEodW5pdHMgJiBERUNBREVTKSB8fCAoY291bnQgPj0gbWF4KSkge1xuXHRcdFx0Ly8gcmlwcGxlIGRlY2FkZXMgZG93biB0byB5ZWFyc1xuXHRcdFx0dHMueWVhcnMgKz0gdHMuZGVjYWRlcyAqIFlFQVJTX1BFUl9ERUNBREU7XG5cdFx0XHRkZWxldGUgdHMuZGVjYWRlcztcblxuXHRcdH0gZWxzZSBpZiAodHMuZGVjYWRlcykge1xuXHRcdFx0Y291bnQrKztcblx0XHR9XG5cblx0XHRpZiAoISh1bml0cyAmIFlFQVJTKSB8fCAoY291bnQgPj0gbWF4KSkge1xuXHRcdFx0Ly8gcmlwcGxlIHllYXJzIGRvd24gdG8gbW9udGhzXG5cdFx0XHR0cy5tb250aHMgKz0gdHMueWVhcnMgKiBNT05USFNfUEVSX1lFQVI7XG5cdFx0XHRkZWxldGUgdHMueWVhcnM7XG5cblx0XHR9IGVsc2UgaWYgKHRzLnllYXJzKSB7XG5cdFx0XHRjb3VudCsrO1xuXHRcdH1cblxuXHRcdGlmICghKHVuaXRzICYgTU9OVEhTKSB8fCAoY291bnQgPj0gbWF4KSkge1xuXHRcdFx0Ly8gcmlwcGxlIG1vbnRocyBkb3duIHRvIGRheXNcblx0XHRcdGlmICh0cy5tb250aHMpIHtcblx0XHRcdFx0dHMuZGF5cyArPSBib3Jyb3dNb250aHModHMucmVmTW9udGgsIHRzLm1vbnRocyk7XG5cdFx0XHR9XG5cdFx0XHRkZWxldGUgdHMubW9udGhzO1xuXG5cdFx0XHRpZiAodHMuZGF5cyA+PSBEQVlTX1BFUl9XRUVLKSB7XG5cdFx0XHRcdC8vIHJpcHBsZSBkYXkgb3ZlcmZsb3cgYmFjayB1cCB0byB3ZWVrc1xuXHRcdFx0XHR0cy53ZWVrcyArPSBmbG9vcih0cy5kYXlzIC8gREFZU19QRVJfV0VFSyk7XG5cdFx0XHRcdHRzLmRheXMgJT0gREFZU19QRVJfV0VFSztcblx0XHRcdH1cblxuXHRcdH0gZWxzZSBpZiAodHMubW9udGhzKSB7XG5cdFx0XHRjb3VudCsrO1xuXHRcdH1cblxuXHRcdGlmICghKHVuaXRzICYgV0VFS1MpIHx8IChjb3VudCA+PSBtYXgpKSB7XG5cdFx0XHQvLyByaXBwbGUgd2Vla3MgZG93biB0byBkYXlzXG5cdFx0XHR0cy5kYXlzICs9IHRzLndlZWtzICogREFZU19QRVJfV0VFSztcblx0XHRcdGRlbGV0ZSB0cy53ZWVrcztcblxuXHRcdH0gZWxzZSBpZiAodHMud2Vla3MpIHtcblx0XHRcdGNvdW50Kys7XG5cdFx0fVxuXG5cdFx0aWYgKCEodW5pdHMgJiBEQVlTKSB8fCAoY291bnQgPj0gbWF4KSkge1xuXHRcdFx0Ly9yaXBwbGUgZGF5cyBkb3duIHRvIGhvdXJzXG5cdFx0XHR0cy5ob3VycyArPSB0cy5kYXlzICogSE9VUlNfUEVSX0RBWTtcblx0XHRcdGRlbGV0ZSB0cy5kYXlzO1xuXG5cdFx0fSBlbHNlIGlmICh0cy5kYXlzKSB7XG5cdFx0XHRjb3VudCsrO1xuXHRcdH1cblxuXHRcdGlmICghKHVuaXRzICYgSE9VUlMpIHx8IChjb3VudCA+PSBtYXgpKSB7XG5cdFx0XHQvLyByaXBwbGUgaG91cnMgZG93biB0byBtaW51dGVzXG5cdFx0XHR0cy5taW51dGVzICs9IHRzLmhvdXJzICogTUlOVVRFU19QRVJfSE9VUjtcblx0XHRcdGRlbGV0ZSB0cy5ob3VycztcblxuXHRcdH0gZWxzZSBpZiAodHMuaG91cnMpIHtcblx0XHRcdGNvdW50Kys7XG5cdFx0fVxuXG5cdFx0aWYgKCEodW5pdHMgJiBNSU5VVEVTKSB8fCAoY291bnQgPj0gbWF4KSkge1xuXHRcdFx0Ly8gcmlwcGxlIG1pbnV0ZXMgZG93biB0byBzZWNvbmRzXG5cdFx0XHR0cy5zZWNvbmRzICs9IHRzLm1pbnV0ZXMgKiBTRUNPTkRTX1BFUl9NSU5VVEU7XG5cdFx0XHRkZWxldGUgdHMubWludXRlcztcblxuXHRcdH0gZWxzZSBpZiAodHMubWludXRlcykge1xuXHRcdFx0Y291bnQrKztcblx0XHR9XG5cblx0XHRpZiAoISh1bml0cyAmIFNFQ09ORFMpIHx8IChjb3VudCA+PSBtYXgpKSB7XG5cdFx0XHQvLyByaXBwbGUgc2Vjb25kcyBkb3duIHRvIG1pbGxpc2Vjb25kc1xuXHRcdFx0dHMubWlsbGlzZWNvbmRzICs9IHRzLnNlY29uZHMgKiBNSUxMSVNFQ09ORFNfUEVSX1NFQ09ORDtcblx0XHRcdGRlbGV0ZSB0cy5zZWNvbmRzO1xuXG5cdFx0fSBlbHNlIGlmICh0cy5zZWNvbmRzKSB7XG5cdFx0XHRjb3VudCsrO1xuXHRcdH1cblxuXHRcdC8vIG5vdGhpbmcgdG8gcmlwcGxlIG1pbGxpc2Vjb25kcyBkb3duIHRvXG5cdFx0Ly8gc28gcmlwcGxlIGJhY2sgdXAgdG8gc21hbGxlc3QgZXhpc3RpbmcgdW5pdCBhcyBhIGZyYWN0aW9uYWwgdmFsdWVcblx0XHRpZiAoISh1bml0cyAmIE1JTExJU0VDT05EUykgfHwgKGNvdW50ID49IG1heCkpIHtcblx0XHRcdGZyYWN0aW9uYWwodHMsIGRpZ2l0cyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFBvcHVsYXRlcyB0aGUgVGltZXNwYW4gb2JqZWN0XG5cdCAqIFxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1RpbWVzcGFufSB0c1xuXHQgKiBAcGFyYW0gez9EYXRlfSBzdGFydCB0aGUgc3RhcnRpbmcgZGF0ZVxuXHQgKiBAcGFyYW0gez9EYXRlfSBlbmQgdGhlIGVuZGluZyBkYXRlXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB1bml0cyB0aGUgdW5pdHMgdG8gcG9wdWxhdGVcblx0ICogQHBhcmFtIHtudW1iZXJ9IG1heCBudW1iZXIgb2YgbGFiZWxzIHRvIG91dHB1dFxuXHQgKiBAcGFyYW0ge251bWJlcn0gZGlnaXRzIG1heCBudW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgdG8gb3V0cHV0XG5cdCAqL1xuXHRmdW5jdGlvbiBwb3B1bGF0ZSh0cywgc3RhcnQsIGVuZCwgdW5pdHMsIG1heCwgZGlnaXRzKSB7XG5cdFx0dmFyIG5vdyA9IG5ldyBEYXRlKCk7XG5cblx0XHR0cy5zdGFydCA9IHN0YXJ0ID0gc3RhcnQgfHwgbm93O1xuXHRcdHRzLmVuZCA9IGVuZCA9IGVuZCB8fCBub3c7XG5cdFx0dHMudW5pdHMgPSB1bml0cztcblxuXHRcdHRzLnZhbHVlID0gZW5kLmdldFRpbWUoKSAtIHN0YXJ0LmdldFRpbWUoKTtcblx0XHRpZiAodHMudmFsdWUgPCAwKSB7XG5cdFx0XHQvLyBzd2FwIGlmIHJldmVyc2VkXG5cdFx0XHR2YXIgdG1wID0gZW5kO1xuXHRcdFx0ZW5kID0gc3RhcnQ7XG5cdFx0XHRzdGFydCA9IHRtcDtcblx0XHR9XG5cblx0XHQvLyByZWZlcmVuY2UgbW9udGggZm9yIGRldGVybWluaW5nIGRheXMgaW4gbW9udGhcblx0XHR0cy5yZWZNb250aCA9IG5ldyBEYXRlKHN0YXJ0LmdldEZ1bGxZZWFyKCksIHN0YXJ0LmdldE1vbnRoKCksIDE1LCAxMiwgMCwgMCk7XG5cdFx0dHJ5IHtcblx0XHRcdC8vIHJlc2V0IHRvIGluaXRpYWwgZGVsdGFzXG5cdFx0XHR0cy5taWxsZW5uaWEgPSAwO1xuXHRcdFx0dHMuY2VudHVyaWVzID0gMDtcblx0XHRcdHRzLmRlY2FkZXMgPSAwO1xuXHRcdFx0dHMueWVhcnMgPSBlbmQuZ2V0RnVsbFllYXIoKSAtIHN0YXJ0LmdldEZ1bGxZZWFyKCk7XG5cdFx0XHR0cy5tb250aHMgPSBlbmQuZ2V0TW9udGgoKSAtIHN0YXJ0LmdldE1vbnRoKCk7XG5cdFx0XHR0cy53ZWVrcyA9IDA7XG5cdFx0XHR0cy5kYXlzID0gZW5kLmdldERhdGUoKSAtIHN0YXJ0LmdldERhdGUoKTtcblx0XHRcdHRzLmhvdXJzID0gZW5kLmdldEhvdXJzKCkgLSBzdGFydC5nZXRIb3VycygpO1xuXHRcdFx0dHMubWludXRlcyA9IGVuZC5nZXRNaW51dGVzKCkgLSBzdGFydC5nZXRNaW51dGVzKCk7XG5cdFx0XHR0cy5zZWNvbmRzID0gZW5kLmdldFNlY29uZHMoKSAtIHN0YXJ0LmdldFNlY29uZHMoKTtcblx0XHRcdHRzLm1pbGxpc2Vjb25kcyA9IGVuZC5nZXRNaWxsaXNlY29uZHMoKSAtIHN0YXJ0LmdldE1pbGxpc2Vjb25kcygpO1xuXG5cdFx0XHRyaXBwbGUodHMpO1xuXHRcdFx0cHJ1bmVVbml0cyh0cywgdW5pdHMsIG1heCwgZGlnaXRzKTtcblxuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRkZWxldGUgdHMucmVmTW9udGg7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRzO1xuXHR9XG5cblx0LyoqXG5cdCAqIERldGVybWluZSBhbiBhcHByb3ByaWF0ZSByZWZyZXNoIHJhdGUgYmFzZWQgdXBvbiB1bml0c1xuXHQgKiBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtudW1iZXJ9IHVuaXRzIHRoZSB1bml0cyB0byBwb3B1bGF0ZVxuXHQgKiBAcmV0dXJuIHtudW1iZXJ9IG1pbGxpc2Vjb25kcyB0byBkZWxheVxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0RGVsYXkodW5pdHMpIHtcblx0XHRpZiAodW5pdHMgJiBNSUxMSVNFQ09ORFMpIHtcblx0XHRcdC8vIHJlZnJlc2ggdmVyeSBxdWlja2x5XG5cdFx0XHRyZXR1cm4gTUlMTElTRUNPTkRTX1BFUl9TRUNPTkQgLyAzMDsgLy8zMEh6XG5cdFx0fVxuXG5cdFx0aWYgKHVuaXRzICYgU0VDT05EUykge1xuXHRcdFx0Ly8gcmVmcmVzaCBldmVyeSBzZWNvbmRcblx0XHRcdHJldHVybiBNSUxMSVNFQ09ORFNfUEVSX1NFQ09ORDsgLy8xSHpcblx0XHR9XG5cblx0XHRpZiAodW5pdHMgJiBNSU5VVEVTKSB7XG5cdFx0XHQvLyByZWZyZXNoIGV2ZXJ5IG1pbnV0ZVxuXHRcdFx0cmV0dXJuIE1JTExJU0VDT05EU19QRVJfU0VDT05EICogU0VDT05EU19QRVJfTUlOVVRFO1xuXHRcdH1cblxuXHRcdGlmICh1bml0cyAmIEhPVVJTKSB7XG5cdFx0XHQvLyByZWZyZXNoIGhvdXJseVxuXHRcdFx0cmV0dXJuIE1JTExJU0VDT05EU19QRVJfU0VDT05EICogU0VDT05EU19QRVJfTUlOVVRFICogTUlOVVRFU19QRVJfSE9VUjtcblx0XHR9XG5cdFx0XG5cdFx0aWYgKHVuaXRzICYgREFZUykge1xuXHRcdFx0Ly8gcmVmcmVzaCBkYWlseVxuXHRcdFx0cmV0dXJuIE1JTExJU0VDT05EU19QRVJfU0VDT05EICogU0VDT05EU19QRVJfTUlOVVRFICogTUlOVVRFU19QRVJfSE9VUiAqIEhPVVJTX1BFUl9EQVk7XG5cdFx0fVxuXG5cdFx0Ly8gcmVmcmVzaCB0aGUgcmVzdCB3ZWVrbHlcblx0XHRyZXR1cm4gTUlMTElTRUNPTkRTX1BFUl9TRUNPTkQgKiBTRUNPTkRTX1BFUl9NSU5VVEUgKiBNSU5VVEVTX1BFUl9IT1VSICogSE9VUlNfUEVSX0RBWSAqIERBWVNfUEVSX1dFRUs7XG5cdH1cblxuXHQvKipcblx0ICogQVBJIGVudHJ5IHBvaW50XG5cdCAqIFxuXHQgKiBAcHVibGljXG5cdCAqIEBwYXJhbSB7RGF0ZXxudW1iZXJ8VGltZXNwYW58bnVsbHxmdW5jdGlvbihUaW1lc3BhbixudW1iZXIpfSBzdGFydCB0aGUgc3RhcnRpbmcgZGF0ZVxuXHQgKiBAcGFyYW0ge0RhdGV8bnVtYmVyfFRpbWVzcGFufG51bGx8ZnVuY3Rpb24oVGltZXNwYW4sbnVtYmVyKX0gZW5kIHRoZSBlbmRpbmcgZGF0ZVxuXHQgKiBAcGFyYW0ge251bWJlcj19IHVuaXRzIHRoZSB1bml0cyB0byBwb3B1bGF0ZVxuXHQgKiBAcGFyYW0ge251bWJlcj19IG1heCBudW1iZXIgb2YgbGFiZWxzIHRvIG91dHB1dFxuXHQgKiBAcGFyYW0ge251bWJlcj19IGRpZ2l0cyBtYXggbnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIHRvIG91dHB1dFxuXHQgKiBAcmV0dXJuIHtUaW1lc3BhbnxudW1iZXJ9XG5cdCAqL1xuXHRmdW5jdGlvbiBjb3VudGRvd24oc3RhcnQsIGVuZCwgdW5pdHMsIG1heCwgZGlnaXRzKSB7XG5cdFx0dmFyIGNhbGxiYWNrO1xuXG5cdFx0Ly8gZW5zdXJlIHNvbWUgdW5pdHMgb3IgdXNlIGRlZmF1bHRzXG5cdFx0dW5pdHMgPSArdW5pdHMgfHwgREVGQVVMVFM7XG5cdFx0Ly8gbWF4IG11c3QgYmUgcG9zaXRpdmVcblx0XHRtYXggPSAobWF4ID4gMCkgPyBtYXggOiBOYU47XG5cdFx0Ly8gY2xhbXAgZGlnaXRzIHRvIGFuIGludGVnZXIgYmV0d2VlbiBbMCwgMjBdXG5cdFx0ZGlnaXRzID0gKGRpZ2l0cyA+IDApID8gKGRpZ2l0cyA8IDIwKSA/IE1hdGgucm91bmQoZGlnaXRzKSA6IDIwIDogMDtcblxuXHRcdC8vIGVuc3VyZSBzdGFydCBkYXRlXG5cdFx0dmFyIHN0YXJ0VFMgPSBudWxsO1xuXHRcdGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2Ygc3RhcnQpIHtcblx0XHRcdGNhbGxiYWNrID0gc3RhcnQ7XG5cdFx0XHRzdGFydCA9IG51bGw7XG5cblx0XHR9IGVsc2UgaWYgKCEoc3RhcnQgaW5zdGFuY2VvZiBEYXRlKSkge1xuXHRcdFx0aWYgKChzdGFydCAhPT0gbnVsbCkgJiYgaXNGaW5pdGUoc3RhcnQpKSB7XG5cdFx0XHRcdHN0YXJ0ID0gbmV3IERhdGUoK3N0YXJ0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICgnb2JqZWN0JyA9PT0gdHlwZW9mIHN0YXJ0VFMpIHtcblx0XHRcdFx0XHRzdGFydFRTID0gLyoqIEB0eXBle1RpbWVzcGFufSAqLyhzdGFydCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0c3RhcnQgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGVuc3VyZSBlbmQgZGF0ZVxuXHRcdHZhciBlbmRUUyA9IG51bGw7XG5cdFx0aWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBlbmQpIHtcblx0XHRcdGNhbGxiYWNrID0gZW5kO1xuXHRcdFx0ZW5kID0gbnVsbDtcblxuXHRcdH0gZWxzZSBpZiAoIShlbmQgaW5zdGFuY2VvZiBEYXRlKSkge1xuXHRcdFx0aWYgKChlbmQgIT09IG51bGwpICYmIGlzRmluaXRlKGVuZCkpIHtcblx0XHRcdFx0ZW5kID0gbmV3IERhdGUoK2VuZCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoJ29iamVjdCcgPT09IHR5cGVvZiBlbmQpIHtcblx0XHRcdFx0XHRlbmRUUyA9IC8qKiBAdHlwZXtUaW1lc3Bhbn0gKi8oZW5kKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbmQgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIG11c3Qgd2FpdCB0byBpbnRlcnByZXQgdGltZXNwYW5zIHVudGlsIGFmdGVyIHJlc29sdmluZyBkYXRlc1xuXHRcdGlmIChzdGFydFRTKSB7XG5cdFx0XHRzdGFydCA9IGFkZFRvRGF0ZShzdGFydFRTLCBlbmQpO1xuXHRcdH1cblx0XHRpZiAoZW5kVFMpIHtcblx0XHRcdGVuZCA9IGFkZFRvRGF0ZShlbmRUUywgc3RhcnQpO1xuXHRcdH1cblxuXHRcdGlmICghc3RhcnQgJiYgIWVuZCkge1xuXHRcdFx0Ly8gdXNlZCBmb3IgdW5pdCB0ZXN0aW5nXG5cdFx0XHRyZXR1cm4gbmV3IFRpbWVzcGFuKCk7XG5cdFx0fVxuXG5cdFx0aWYgKCFjYWxsYmFjaykge1xuXHRcdFx0cmV0dXJuIHBvcHVsYXRlKG5ldyBUaW1lc3BhbigpLCAvKiogQHR5cGV7RGF0ZX0gKi8oc3RhcnQpLCAvKiogQHR5cGV7RGF0ZX0gKi8oZW5kKSwgLyoqIEB0eXBle251bWJlcn0gKi8odW5pdHMpLCAvKiogQHR5cGV7bnVtYmVyfSAqLyhtYXgpLCAvKiogQHR5cGV7bnVtYmVyfSAqLyhkaWdpdHMpKTtcblx0XHR9XG5cblx0XHQvLyBiYXNlIGRlbGF5IG9mZiB1bml0c1xuXHRcdHZhciBkZWxheSA9IGdldERlbGF5KHVuaXRzKSxcblx0XHRcdHRpbWVySWQsXG5cdFx0XHRmbiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjYWxsYmFjayhcblx0XHRcdFx0XHRwb3B1bGF0ZShuZXcgVGltZXNwYW4oKSwgLyoqIEB0eXBle0RhdGV9ICovKHN0YXJ0KSwgLyoqIEB0eXBle0RhdGV9ICovKGVuZCksIC8qKiBAdHlwZXtudW1iZXJ9ICovKHVuaXRzKSwgLyoqIEB0eXBle251bWJlcn0gKi8obWF4KSwgLyoqIEB0eXBle251bWJlcn0gKi8oZGlnaXRzKSksXG5cdFx0XHRcdFx0dGltZXJJZFxuXHRcdFx0XHQpO1xuXHRcdFx0fTtcblxuXHRcdGZuKCk7XG5cdFx0cmV0dXJuICh0aW1lcklkID0gc2V0SW50ZXJ2YWwoZm4sIGRlbGF5KSk7XG5cdH1cblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdGNvdW50ZG93bi5NSUxMSVNFQ09ORFMgPSBNSUxMSVNFQ09ORFM7XG5cblx0LyoqXG5cdCAqIEBwdWJsaWNcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHRjb3VudGRvd24uU0VDT05EUyA9IFNFQ09ORFM7XG5cblx0LyoqXG5cdCAqIEBwdWJsaWNcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHRjb3VudGRvd24uTUlOVVRFUyA9IE1JTlVURVM7XG5cblx0LyoqXG5cdCAqIEBwdWJsaWNcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHRjb3VudGRvd24uSE9VUlMgPSBIT1VSUztcblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdGNvdW50ZG93bi5EQVlTID0gREFZUztcblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdGNvdW50ZG93bi5XRUVLUyA9IFdFRUtTO1xuXG5cdC8qKlxuXHQgKiBAcHVibGljXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0Y291bnRkb3duLk1PTlRIUyA9IE1PTlRIUztcblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdGNvdW50ZG93bi5ZRUFSUyA9IFlFQVJTO1xuXG5cdC8qKlxuXHQgKiBAcHVibGljXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0Y291bnRkb3duLkRFQ0FERVMgPSBERUNBREVTO1xuXG5cdC8qKlxuXHQgKiBAcHVibGljXG5cdCAqIEBjb25zdFxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0Y291bnRkb3duLkNFTlRVUklFUyA9IENFTlRVUklFUztcblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdGNvdW50ZG93bi5NSUxMRU5OSUEgPSBNSUxMRU5OSUE7XG5cblx0LyoqXG5cdCAqIEBwdWJsaWNcblx0ICogQGNvbnN0XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHRjb3VudGRvd24uREVGQVVMVFMgPSBERUZBVUxUUztcblxuXHQvKipcblx0ICogQHB1YmxpY1xuXHQgKiBAY29uc3Rcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdGNvdW50ZG93bi5BTEwgPSBNSUxMRU5OSUF8Q0VOVFVSSUVTfERFQ0FERVN8WUVBUlN8TU9OVEhTfFdFRUtTfERBWVN8SE9VUlN8TUlOVVRFU3xTRUNPTkRTfE1JTExJU0VDT05EUztcblxuXHQvKipcblx0ICogQ3VzdG9taXplIHRoZSBmb3JtYXQgc2V0dGluZ3MuXG5cdCAqIEBwdWJsaWNcblx0ICogQHBhcmFtIHtPYmplY3R9IGZvcm1hdCBzZXR0aW5ncyBvYmplY3Rcblx0ICovXG5cdHZhciBzZXRGb3JtYXQgPSBjb3VudGRvd24uc2V0Rm9ybWF0ID0gZnVuY3Rpb24oZm9ybWF0KSB7XG5cdFx0aWYgKCFmb3JtYXQpIHsgcmV0dXJuOyB9XG5cblx0XHRpZiAoJ3Npbmd1bGFyJyBpbiBmb3JtYXQgfHwgJ3BsdXJhbCcgaW4gZm9ybWF0KSB7XG5cdFx0XHR2YXIgc2luZ3VsYXIgPSBmb3JtYXQuc2luZ3VsYXIgfHwgW107XG5cdFx0XHRpZiAoc2luZ3VsYXIuc3BsaXQpIHtcblx0XHRcdFx0c2luZ3VsYXIgPSBzaW5ndWxhci5zcGxpdCgnfCcpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHBsdXJhbCA9IGZvcm1hdC5wbHVyYWwgfHwgW107XG5cdFx0XHRpZiAocGx1cmFsLnNwbGl0KSB7XG5cdFx0XHRcdHBsdXJhbCA9IHBsdXJhbC5zcGxpdCgnfCcpO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKHZhciBpPUxBQkVMX01JTExJU0VDT05EUzsgaTw9TEFCRUxfTUlMTEVOTklBOyBpKyspIHtcblx0XHRcdFx0Ly8gb3ZlcnJpZGUgYW55IHNwZWNpZmllZCB1bml0c1xuXHRcdFx0XHRMQUJFTFNfU0lOR0xVQVJbaV0gPSBzaW5ndWxhcltpXSB8fCBMQUJFTFNfU0lOR0xVQVJbaV07XG5cdFx0XHRcdExBQkVMU19QTFVSQUxbaV0gPSBwbHVyYWxbaV0gfHwgTEFCRUxTX1BMVVJBTFtpXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBmb3JtYXQubGFzdCkge1xuXHRcdFx0TEFCRUxfTEFTVCA9IGZvcm1hdC5sYXN0O1xuXHRcdH1cblx0XHRpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBmb3JtYXQuZGVsaW0pIHtcblx0XHRcdExBQkVMX0RFTElNID0gZm9ybWF0LmRlbGltO1xuXHRcdH1cblx0XHRpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBmb3JtYXQuZW1wdHkpIHtcblx0XHRcdExBQkVMX05PVyA9IGZvcm1hdC5lbXB0eTtcblx0XHR9XG5cdFx0aWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBmb3JtYXQuZm9ybWF0TnVtYmVyKSB7XG5cdFx0XHRmb3JtYXROdW1iZXIgPSBmb3JtYXQuZm9ybWF0TnVtYmVyO1xuXHRcdH1cblx0XHRpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGZvcm1hdC5mb3JtYXR0ZXIpIHtcblx0XHRcdGZvcm1hdHRlciA9IGZvcm1hdC5mb3JtYXR0ZXI7XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZXZlcnQgdG8gdGhlIGRlZmF1bHQgZm9ybWF0dGluZy5cblx0ICogQHB1YmxpY1xuXHQgKi9cblx0dmFyIHJlc2V0Rm9ybWF0ID0gY291bnRkb3duLnJlc2V0Rm9ybWF0ID0gZnVuY3Rpb24oKSB7XG5cdFx0TEFCRUxTX1NJTkdMVUFSID0gJyBtaWxsaXNlY29uZHwgc2Vjb25kfCBtaW51dGV8IGhvdXJ8IGRheXwgd2Vla3wgbW9udGh8IHllYXJ8IGRlY2FkZXwgY2VudHVyeXwgbWlsbGVubml1bScuc3BsaXQoJ3wnKTtcblx0XHRMQUJFTFNfUExVUkFMID0gJyBtaWxsaXNlY29uZHN8IHNlY29uZHN8IG1pbnV0ZXN8IGhvdXJzfCBkYXlzfCB3ZWVrc3wgbW9udGhzfCB5ZWFyc3wgZGVjYWRlc3wgY2VudHVyaWVzfCBtaWxsZW5uaWEnLnNwbGl0KCd8Jyk7XG5cdFx0TEFCRUxfTEFTVCA9ICcgYW5kICc7XG5cdFx0TEFCRUxfREVMSU0gPSAnLCAnO1xuXHRcdExBQkVMX05PVyA9ICcnO1xuXHRcdGZvcm1hdE51bWJlciA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblx0XHRmb3JtYXR0ZXIgPSBwbHVyYWxpdHk7XG5cdH07XG5cblx0LyoqXG5cdCAqIE92ZXJyaWRlIHRoZSB1bml0IGxhYmVscy5cblx0ICogQHB1YmxpY1xuXHQgKiBAcGFyYW0ge3N0cmluZ3xBcnJheT19IHNpbmd1bGFyIGEgcGlwZSAoJ3wnKSBkZWxpbWl0ZWQgbGlzdCBvZiBzaW5ndWxhciB1bml0IG5hbWUgb3ZlcnJpZGVzXG5cdCAqIEBwYXJhbSB7c3RyaW5nfEFycmF5PX0gcGx1cmFsIGEgcGlwZSAoJ3wnKSBkZWxpbWl0ZWQgbGlzdCBvZiBwbHVyYWwgdW5pdCBuYW1lIG92ZXJyaWRlc1xuXHQgKiBAcGFyYW0ge3N0cmluZz19IGxhc3QgYSBkZWxpbWl0ZXIgYmVmb3JlIHRoZSBsYXN0IHVuaXQgKGRlZmF1bHQ6ICcgYW5kICcpXG5cdCAqIEBwYXJhbSB7c3RyaW5nPX0gZGVsaW0gYSBkZWxpbWl0ZXIgdG8gdXNlIGJldHdlZW4gYWxsIG90aGVyIHVuaXRzIChkZWZhdWx0OiAnLCAnKVxuXHQgKiBAcGFyYW0ge3N0cmluZz19IGVtcHR5IGEgbGFiZWwgdG8gdXNlIHdoZW4gYWxsIHVuaXRzIGFyZSB6ZXJvIChkZWZhdWx0OiAnJylcblx0ICogQHBhcmFtIHtmdW5jdGlvbihudW1iZXIpOnN0cmluZz19IGZvcm1hdE51bWJlciBhIGZ1bmN0aW9uIHdoaWNoIGZvcm1hdHMgbnVtYmVycyBhcyBhIHN0cmluZ1xuXHQgKiBAcGFyYW0ge2Z1bmN0aW9uKG51bWJlcixudW1iZXIpOnN0cmluZz19IGZvcm1hdHRlciBhIGZ1bmN0aW9uIHdoaWNoIGZvcm1hdHMgYSBudW1iZXIvdW5pdCBwYWlyIGFzIGEgc3RyaW5nXG5cdCAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMi42LjBcblx0ICovXG5cdGNvdW50ZG93bi5zZXRMYWJlbHMgPSBmdW5jdGlvbihzaW5ndWxhciwgcGx1cmFsLCBsYXN0LCBkZWxpbSwgZW1wdHksIGZvcm1hdE51bWJlciwgZm9ybWF0dGVyKSB7XG5cdFx0c2V0Rm9ybWF0KHtcblx0XHRcdHNpbmd1bGFyOiBzaW5ndWxhcixcblx0XHRcdHBsdXJhbDogcGx1cmFsLFxuXHRcdFx0bGFzdDogbGFzdCxcblx0XHRcdGRlbGltOiBkZWxpbSxcblx0XHRcdGVtcHR5OiBlbXB0eSxcblx0XHRcdGZvcm1hdE51bWJlcjogZm9ybWF0TnVtYmVyLFxuXHRcdFx0Zm9ybWF0dGVyOiBmb3JtYXR0ZXJcblx0XHR9KTtcblx0fTtcblxuXHQvKipcblx0ICogUmV2ZXJ0IHRvIHRoZSBkZWZhdWx0IHVuaXQgbGFiZWxzLlxuXHQgKiBAcHVibGljXG5cdCAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMi42LjBcblx0ICovXG5cdGNvdW50ZG93bi5yZXNldExhYmVscyA9IHJlc2V0Rm9ybWF0O1xuXG5cdHJlc2V0Rm9ybWF0KCk7XG5cblx0aWYgKG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gY291bnRkb3duO1xuXG5cdH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdy5kZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHdpbmRvdy5kZWZpbmUuYW1kICE9PSAndW5kZWZpbmVkJykge1xuXHRcdHdpbmRvdy5kZWZpbmUoJ2NvdW50ZG93bicsIFtdLCBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBjb3VudGRvd247XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gY291bnRkb3duO1xuXG59KShtb2R1bGUpO1xuIl19
