/**
 * Tool-like methods for code writing
 *
 * V2 - overhauled version for cleaner files and simpler code writing
 */

// WT Sight Generator: a simple library for generating War Thunder user sights
// from JavaScript
//
// Copyright (C) 2023  pzvol
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

'use strict';


export default class Toolbox {
	/** Mil(aka thousandth) value for different types.
	 *
	 * Keys are used by sight code files' variable `thousandth:t = "xxxx"`
	 *
	 * `value` indicates the percentage of 1mil on a 360 degree
	 */
	static MIL = {
		/** 360 deg is divided by 6000 */
		ussr: {
			value: 1 / 6000,
			deg: 360 / 6000,
			rad: 2 * Math.PI / 6000,
		},
		/** 360 deg is divided by 6400 */
		nato: {
			value: 1 / 6400,
			deg: 360 / 6400,
			rad: 2 * Math.PI / 6400,
		},
		/** 1 mil is defined as arctan(1/1000), degree of an 1m target on 1000m.
		 * Apporiximately, 360 deg is divided by 6283 */
		real: {
			value: 1 / 6283,
			deg: 360 / 6283,
			rad: 2 * Math.PI / 6283,
		},
	};

	/**
	 * Get a number range array
	 * @param {number} start - starting number
	 * @param {number} end - ending number
	 * @param {number} step - step interval between generated values
	 */
	static range(start, end, step = 1.0, includeEnd = false) {
		let result = [];
		for (let i = start; i < end; i += step) { result.push(i); }
		return result;
	}
	/**
	 * Get a number range array **including the ending number**
	 * @param {number} start - starting number
	 * @param {number} end - ending number
	 * @param {number} step - step interval between generated values
	 */
	static rangeIE(start, end, step = 1.0) {
		let result = [];
		for (let i = start; i <= end; i += step) { result.push(i); }
		return result;
	}

	/**
	 * Repetitively execute a function for specified time(s)
	 * @param {number} repeatCount - number of repetition
	 * @param {Function} execFunc - repeated function
	 * @returns {any[]} an array of the results of `execFunc`
	 */
	static repeat(repeatCount, execFunc) {
		let execResults = [];
		for (let count = 0; count < repeatCount; count++) {
			execResults.push(execFunc());
		}
		return execResults;
	}


	/** Get the round of a value with give digit number */
	static round(value, digit) {
		return (Number.isInteger(value) ?
			value :
			(Math.round(value * (10 ** digit)) / (10 ** digit))
		);
	}

	/**
	 * Check if a value is in a range
	 * @param {number} v - checked value
	 * @param {[number, number]} range - check value range
	 * @param {[boolean, boolean]} includeEnds - if start/end is included
	 */
	static valueInRange(v, range, includeEnds = [true, true]) {
		if (range[1] === range[0]) {
			return ((includeEnds[0] || includeEnds[1]) && v === range[1]);
		}
		// Check if in range and return
		return (
			(includeEnds[0] && v === range[0]) ||
			(includeEnds[1] && v === range[1]) ||
			(range[0] < range[1] && range[0] < v && v < range[1]) ||
			(range[1] < range[0] && range[1] < v && v < range[0])
		);
	}

	/** Use JSON object to deep copy a value */
	static copyValue(from) {
		return JSON.parse(JSON.stringify(from));
	}

	static radToDeg(rad) {
		return (rad / (2 * Math.PI) * 360);
	}

	static degToRad(deg) {
		return (deg / 360 * (2 * Math.PI));
	}

	/**
	 * Calcuate thousandth width value of a specific distance
	 * for an object with given size (in meter)
	 *
	 * Thousandth value is under "real" standard (1/6283) by default,
	 * where 1 mil is for a 1m object on 1000m ( arctan(1/1000) )
	 * @param {"ussr"|"nato"|"real"} type - (default `"real"`) Thousandth (mil) type
	 */
	static calcDistanceMil(tgtWidth, distance, type = "real") {
		// Number below are `1 / tan(2pi / x)`, where x is the mil number in 360 deg
		return (
			(type === "ussr") ? ((955 * tgtWidth) / distance) :
			(type === "nato") ? ((1019 * tgtWidth) / distance) :
			((1000 * tgtWidth) / distance)  // "real"
		);
	}

	/**
	 * Calcuate degree value (in thousandth) for shooting of given target with a specific speed
	 *
	 * @param {number} shellSpeed - shell speed, should have the same unit as target speed
	 * @param {number} tgtSpeed - target speed, should have the same unit as shell speed
	 * @param {number} tgtAspectAngle - (default `1`) target angle,
	 *                                  equals to (visual length / real length).
	 *                                  For transversal targets, the number is 1;
	 *                                  for parallel targets, the number is 0;
	 *                                  for 45 deg targets, the number is sqrt(2)/2
	 * @param {"ussr"|"nato"|"real"} type - (default `"real"`) Thousandth (mil) type
	 * @returns {number} the mil angle between target position and shooting direction for hitting the target
	 */
	static calcLeadingMil(shellSpeed, tgtSpeed, tgtAspectAngle = 1, type = "real") {
		return Math.asin(tgtSpeed / shellSpeed) / Toolbox.MIL[type].rad * tgtAspectAngle;
	}
}
