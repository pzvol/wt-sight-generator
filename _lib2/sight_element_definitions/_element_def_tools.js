/** Tool-like functions for defining elements */

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


export default class DefTool {
	/**
	 * Check if an object has all specified properties
	 * @param {string[]} propertyNames
	 * @param {Object} checkedObj
	 */
	static hasAllProperties(propertyNames, checkedObj) {
		for (let p of propertyNames) {
			if (!checkedObj.hasOwnProperty(p)) { return false; }
		}
		return true;
	}

	/**
	 * Gets value of a property, or returns `undefined` if not exist
	 * @param {Object} targetObject
	 * @param {string} propertyName
	 * @returns {any|undefined}
	 */
	static getPropertyOrUndefined(targetObject, propertyName) {
		if (targetObject.hasOwnProperty(propertyName)) {
			return targetObject[propertyName];
		} else {
			return undefined;
		}
	}


	/** Use JSON object to deep copy a value */
	static copyValue(from) {
		return JSON.parse(JSON.stringify(from));
	}


	/**
	 * Check if a value is in a range
	 * TODO: Apply epsilon for ends comparing
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
}