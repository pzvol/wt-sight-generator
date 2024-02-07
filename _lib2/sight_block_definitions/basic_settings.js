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

import { SETTINGS, BlkVariable, BlkComment } from "../sight_code_basis.js";


/**
 * Basic settings of a sight (color, rangefinder number positions, etc.).
 *
 * This is not a real "block" in compiled ".blk" code.
 * In a ".blk" sight file, setting variables are directly placed at
 * the top(usually) of code. This class is created just for easier settings
 * management.
 */
export default class BasicSettings {
	/**
	 * @param {BlkVariable[]} settingLines
	 */
	constructor(settingLines = []) {
		/** @type {(string|BlkVariable|BlkComment)[]} */
		this.settingLines = settingLines;
	}


	//// SETTERS - COMMON ////

	/**
	 * Clear all setting lines
	 */
	clear() {
		this.settingLines.length = 0;
		return this;
	}

	/**
	 * Add one or more lines into settings
	 * @param {string|BlkVariable|BlkComment|(string|BlkVariable|BlkComment)[]} input
	 */
	add(input) {
		if (Array.isArray(input)) {
			for (let ele of input) { this.settingLines.push(ele); }
		} else {
			this.settingLines.push(input);
		}
		return this;
	}

	/**
	 * A shortcut for adding a comment line
	 * @param {string} s
	 */
	addComment(s) {
		this.settingLines.push(new BlkComment(s));
		return this;
	}


	//// SETTERS - BlkVariable ////

	/**
	 * Update the value and datatype of one/an array of BlkVariable based on
	 * given input, or add the provided new one(s)
	 *
	 * Only BlkVariable or its array is allowed.
	 *
	 * @param {BlkVariable|BlkVariable[]} input
	 */
	updateOrAddVariable(input) {
		let arr = (Array.isArray(input)) ? input : [input];
		for (let inVar of arr) {
			let inVarName = inVar.getName();
			let existingVar = this.settingLines.find((ele) => (
				ele instanceof BlkVariable && ele.getName() === inVarName
			));
			// Add given one or modify existing one
			if (typeof existingVar === "undefined") {
				this.add(inVar);
			} else {
				existingVar.setValue(
					inVar.getValue(), inVar.getTypeOfOutput()
				);
			}
		}

		return this;
	}

	/**
	 * Remove BlkVariable by variable name(s). All variables with
	 * matching name(s) will be removed.
	 *
	 * @param {string|string[]} input - removed variable name
	 *                                  or an array of names
	 */
	removeVariableByName(input) {
		return this.p_removeElementByInputAndCondition(input, (ele, inputItem) => (
			ele instanceof BlkVariable && ele.name === inputItem
		));
	}


	//// SETTERS - BlkComment ////

	/**
	 * Remove BlkComment by their value(s).
	 * **All** matching ones(s) will be removed.
	 *
	 * @param {string|string[]} input - removed value
	 *                                  or an array of removed values
	 */
	removeCommentByContent(input) {
		return this.p_removeElementByInputAndCondition(input, (ele, inputItem) => (
			ele instanceof BlkComment && ele.value === inputItem
		));
	}


	//// SETTERS - raw string ////

	/**
	 * Remove raw string by their content(s).
	 * **All** matching ones(s) will be removed.
	 *
	 * @param {string|string[]} input - removed string
	 *                                  or an array of removed strings
	 */
	removeStringByContent(input) {
		return this.p_removeElementByInputAndCondition(input, (ele, inputItem) => (
			typeof ele === "string" && ele === inputItem
		));
	}


	//// OUTPUT METHOD ////
	getCode() {
		let resultCodeLines = [];
		for (let v of this.settingLines) {
			resultCodeLines.push(
				(typeof v === "string") ? v : v.getCode()
			);
		}
		return resultCodeLines.join(SETTINGS.LINE_ENDING);
	}


	//// PRIVATE METHODS ////

	/**
	 * @callback conditionCallback
	 * @param {any} element entrance for checked element in `findIndex` method
	 * @param {any} inputItem entrance for input item
	 */
	/**
	 * Common interface for searching and removing with specified condition
	 * @param {any|any[]} input input reserved for further calling
	 * @param {conditionCallback} conditionMatcherFunc how input items will be
	 * handled for finding matching element. Will be called by array's
	 * `findIndex` method
	 */
	p_removeElementByInputAndCondition(input, conditionMatcherFunc) {
		let inItems = [];
		if (Array.isArray(input)) {
			for (let ele of input) { inItems.push(ele); }
		} else { inItems.push(input); }

		// Find & remove all matched elements
		for (let inItem of inItems) {
			while (true) {
				let foundIndex = this.settingLines.findIndex(
					(ele) => conditionMatcherFunc(ele, inItem)
				);
				if (foundIndex > -1) {
					this.settingLines.splice(foundIndex, 1);
				} else {
					break;
				}
			}
		}

		return this;
	}

}