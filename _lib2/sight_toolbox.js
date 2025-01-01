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
	static range(start, end, step = 1.0, {
		includeStart = true,
		includeEnd = false,
		epsilon = 1e-9
	} = {}) {
		if (Math.abs(step) <= epsilon) {
			throw new Error(`range function receives step=${step} while epsilon=${epsilon}`);
		}

		let result = [];

		let i = start;
		let iIsStartNumber = true;
		while (true) {
			// break conditions check
			if (Math.abs(i - end) < epsilon) {  // i equals end
				// decide if end num is included and break the loop
				if (includeEnd) { result.push(i); }
				break;
			}
			if (
				(end >= start && i > end) ||  //ascending order out of range
				(end < start && i < end)      //descending order out of range
			) { break; }

			// i is still in range
			if (iIsStartNumber) {
				if (includeStart) { result.push(i); }
				i += step;
				iIsStartNumber = false;
			} else {
				result.push(i);
				i+= step;
			}
		}

		return result;
	}
	/**
	 * Get a number range array **including the ending number**
	 * @param {number} start - starting number
	 * @param {number} end - ending number
	 * @param {number} step - step interval between generated values
	 */
	static rangeIE(start, end, step = 1.0, { epsilon = 1e-9 } = {}) {
		if (Math.abs(step) <= epsilon) {
			throw new Error(`range function receives step=${step} while epsilon=${epsilon}`);
		}

		let result = [];

		let i = start;
		while (true) {
			// break conditions check
			if (Math.abs(i - end) < epsilon) {  // i equals end
				result.push(i);
				break;
			}
			if (
				(end >= start && i > end) ||  //ascending order out of range
				(end < start && i < end)      //descending order out of range
			) { break; }

			// i is still in range
			result.push(i);
			i+= step;
		}

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

	/**
	 * Execute modifications on each element of an array and return it
	 *
	 * @param {*[]} items - an array of items to be modified
	 * @param {Function} execFunc - callback to be run on each item
	 *                              (as the callback of `Array.prototype.forEach`)
	 * @returns {*[]} the input `items` array
	 */
	static withMod(items, execFunc) {
		items.forEach(execFunc);
		return items;
	}

	/**
	 * Get the round of a value with give digit number
	 *
	 * @param {number} value
	 * @param {number} digit - number of digits after the decimal point. `digit < 0`
	 * makes value to be rounded before the decimal point. E.g, -1 makes 41 become 40
	 * @returns {number}
	 */
	static round(value, digit = 0) {
		if (Number.isInteger(value) && digit >= 0) {
			return value;
		}
		return (Math.round(value * (10 ** digit)) / (10 ** digit));
	}

	/**
	 * Round but considers "half digit". E.g., `3.6` can be rounded to `3.5` when
	 * `digit == 0` is specified.
	 *
	 * Designed to be used to output more human-readable values in sights.
	 *
	 * **BE AWARE:** since ".5" values can be returned, this method may
	 * **NOT** be apporpriate for mathematical calculation.
	 *
	 * Following rules are applied during calculating
	 * - `<= 0.3` floored to 0
	 * - `>= 0.7` ceiled to 1
	 * - values between "rounded" to 0.5
	 *
	 * @param {number} value
	 * @param {number} digit - number of digits after the decimal point. `digit < 0`
	 * makes value to be rounded before the decimal point. E.g, -1 makes 41 become 40
	 * @returns {number}
	 */
	static roundToHalf(value, digit = 0) {
		if (Number.isInteger(value) && digit >= 0) {
			return value;
		}
		let scaledNum = value * (10 ** digit);
		// Apply ".5" rule
		scaledNum = ((scaledNum % 1) <= 0.3 || (scaledNum % 1) >= 0.7) ?
			Math.round(scaledNum) : (parseInt(scaledNum) + 0.5);
		return (scaledNum / (10 ** digit));
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
	 * Calculate the distance of a target with given target width and mil.
	 *
	 * Basically a copy-paste of `calcDistanceMil` with their equation for calculation.
	 *
	 * Thousandth value is under "real" standard (1/6283) by default,
	 * where 1 mil is for a 1m object on 1000m ( arctan(1/1000) )
	 * @param {"ussr"|"nato"|"real"} type - (default `"real"`) Thousandth (mil) type
	 */
	static calcDistanceOfMil(tgtWidth, mil, type = "real") {
		return (
			(type === "ussr") ? ((955 * tgtWidth) / mil) :
				(type === "nato") ? ((1019 * tgtWidth) / mil) :
					((1000 * tgtWidth) / mil)  // "real"
		)
	}

	/**
	 * Calculate target width with given mil and distance.
	 *
	 * Thousandth value is under "real" standard (1/6283) by default,
	 * where 1 mil is for a 1m object on 1000m ( arctan(1/1000) )
	 * @param {"ussr"|"nato"|"real"} type - (default `"real"`) Thousandth (mil) type
	 */
	static calcSizeFromMil(mil, distance, type = "real") {
		return (
			(type === "ussr") ? (distance * mil / 955) :
				(type === "nato") ? (distance * mil / 1019) :
					(distance * mil / 1000)  // "real"
		)
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

	/**
	 * Calculate the multiplier which needs to be applied to mils for keeping
	 * things at same position of screen between zooms. Using a position like
	 * (originalMil * multipler) does the job.
	 *
	 * Yes, the game devs are using sin, instead of tan, for calculating
	 * magnifications...
	 * @param {number} fromZoom
	 * @param {number} toZoom
	 */
	static calcMultForZooms(fromZoom, toZoom) {
		const fov = 80;
		return (
			1
			/ Math.asin(Toolbox.degToRad(fov / fromZoom) / 2)
			* Math.asin(Toolbox.degToRad(fov / toZoom) / 2)
		);
	}

	/**
	 * Calcuate length of a line, a.k.a the distance between two points
	 * @param {[number, number]} fromPos
	 * @param {[number, number]} toPos
	 * @returns {number}
	 */
	static calcLineLength(fromPos, toPos) {
		return Math.sqrt(
			Math.pow(toPos[0] - fromPos[0], 2) +
			Math.pow(toPos[1] - fromPos[1], 2)
		);
	}
}
