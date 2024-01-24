/**
 * Blocks of a user sight
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

import {
	SETTINGS,
	BlkVariable,
	BlkBlock,
	BlkComment
} from "./sight_code_basis.js";
import { Quad, Circle, Line, TextSnippet } from "./sight_elements.js";


export default {
	description: "Blocks of a user sight"
};


/** "Abstract" block class for sight blocks */
class SightBlock {
	constructor(blockName) {
		/** Block name after compiling to `.blk` */
		this.blockName = blockName;
	}
	/**
	 * Gets the code of the whole block
	 * @returns {string}
	 */
	getCode() { return `ERROR: Unset class method 'getCode' for generating block '${this.blockName}'`; }
}



/**
 * Basic settings variables of a sight (color, rangefinder numbers, etc.)
 *
 * Note that these setting vars are on the top level after compliing to `.blk`
 */
export class BasicSettings {
	/**
	 * @param {BlkVariable[]} settingLines
	 */
	constructor(settingLines = []) {
		/** @type {(string|BlkVariable|BlkComment)[]} */
		this.settingLines = settingLines;
	}

	/**
	 * Clear all setting lines
	 */
	clear() {
		this.settingLines.length = 0;
		return this;
	}

	/**
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
	 * Remove BlkVariable by variable name(s). All variables with
	 * matching name(s) will be removed.
	 *
	 * @param {string|string[]} input removed variable name or a name array
	 */
	removeVariableByName(input) {
		return this.p_removeElementByInputAndCondition(input, (ele, inputItem) => (
			ele instanceof BlkVariable && ele.name === inputItem
		));
	}


	/**
	 * Remove BlkComment by their value(s). All BlkComment
	 * with matching value(s) will be removed.
	 *
	 * @param {string|string[]} input removed value or a removed value array
	 */
	removeCommentByContent(input) {
		return this.p_removeElementByInputAndCondition(input, (ele, inputItem) => (
			ele instanceof BlkComment && ele.value === inputItem
		));
	}

	/**
	 * Remove raw string by their content(s). All string with matching value(s)
	 * will be removed.
	 *
	 * @param {string|string[]} input removed string or a removed string array
	 */
	removeStringByContent(input) {
		return this.p_removeElementByInputAndCondition(input, (ele, inputItem) => (
			typeof ele === "string" && ele === inputItem
		));
	}

	/**
	 * A shortcut for adding comment
	 * @param {string} s
	 */
	addComment(s) {
		this.settingLines.push(new BlkComment(s));
		return this;
	}

	getCode() {
		let resultCodeLines = [];
		for (let v of this.settingLines) {
			resultCodeLines.push(
				(typeof v === "string") ? v : v.getCode()
			);
		}
		return resultCodeLines.join(SETTINGS.LINE_ENDING);
	}

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


/** Matched vehicle types (originall named as `matchExpClass`) */
export class MatchVehicleClassBlock extends SightBlock {
	static commonTypes = {
		grounds: ["exp_tank", "exp_heavy_tank", "exp_tank_destroyer"],
		spaas: "exp_SPAA"
	};

	constructor(includedClasses = [], excludedClasses = []) {
		super("matchExpClass");

		this.includedClasses = includedClasses;
		this.excludedClasses = excludedClasses;
	}

	/**
	 * Clear all included/excluded classes
	 */
	clear() {
		this.includedClasses.length = 0;
		this.excludedClasses.length = 0;
		return this;
	}

	/**
	 * Sight matches specified vehicle type(s)
	 * @param {string|string[]} c
	 */
	include(c) {
		if (Array.isArray(c)) {
			for (let ce of c) { this.includedClasses.push(ce); }
		} else { this.includedClasses.push(c); }
		return this;
	}

	/**
	 * Sight should not match specified vehicle type(s)
	 * @param {string|string[]} c
	 */
	exclude(c) {
		if (Array.isArray(c)) {
			for (let ce of c) { this.excludedClasses.push(ce); }
		} else { this.excludedClasses.push(c); }
		return this;
	}

	getCode() {
		let blkBlock = new BlkBlock(this.blockName);
		for (let c of this.includedClasses) {
			blkBlock.push(new BlkVariable(c, true));
		}
		for (let c of this.excludedClasses) {
			blkBlock.push(new BlkVariable(c, false));
		}
		return blkBlock.getCode();
	}
}


/**
 * Thousandth lines (mils) on the sight horizon for measuring enemy distance
 * (originall named as `crosshair_hor_ranges`)
 */
export class HoriThousandthsBlock extends SightBlock {
	constructor() {
		super("crosshair_hor_ranges");
		/** @type {{thousandth: number, shown: number}[]} */
		this.thousandthLines = [];
	}

	/**
	 * Clear all ticks
	 */
	clear() {
		this.thousandthLines.length = 0;
		return this;
	}

	/**
	 * Adds new thousandth tick(s)
	 * @param {{thousandth: number, shown?: number}|{thousandth: number, shown?: number}[]} input - added tick(s).
	 *        set `shown` to 0 or skip the key for not display a value
	 */
	add(input) {
		if (Array.isArray(input)) {
			for (let t of input) { this.p_addOne(t); }
		} else { this.p_addOne(input); }
		return this;
	}

	getCode() {
		this.thousandthLines.sort((a, b) => (a.thousandth - b.thousandth));

		let blkBlock = new BlkBlock(this.blockName);
		for (let l of this.thousandthLines) {
			blkBlock.push(new BlkVariable("range", [l.thousandth, l.shown]));
		}
		return blkBlock.getCode();
	}


	/**
	 * Adds a new thousandth tick
	 * @param {{thousandth: number, shown?: number}} input - added tick
	 */
	p_addOne(input) {
		this.thousandthLines.push({
			thousandth: input.thousandth,
			shown: (input.hasOwnProperty("shown")) ? input.shown : 0
		});
		return this;
	}
}


/** Shell distance block (originall named as `crosshair_distances`) */
export class ShellDistancesBlock extends SightBlock {
	constructor({ autoAddMax = true, maxDist = 20000 } = {}) {
		super("crosshair_distances");
		/** @type {{distance: number, shown: number, shownPos: [number, number], tickExtension: number}[]} */
		this.distLines = [];

		this.settings = { autoAddMax, maxDist };
	}

	/**
	 * Clear all ticks
	 */
	clear() {
		this.distLines.length = 0;
		return this;
	}

	/**
	 * Adds new shell distance line(s)
	 *
	 * Use `shown=0` to hide a displayed number.
	 *
	 * @param {{distance: number, shown?: number, shownPos?: [number, number], tickExtension?: number}|{distance: number, shown?: number, shownPos?: [number, number], tickExtension?: number}[]} input
	 */
	add(input) {
		if (Array.isArray(input)) {
			for (let d of input) {
				this.p_addOne(d.distance, (d.shown || 0), (d.shownPos || [0, 0]), (d.tickExtension || 0));
			}
		} else {
			this.p_addOne(input.distance, (input.shown || 0), (input.shownPos || [0, 0]), (input.tickExtension || 0));
		}
		return this;
	}

	getCode() {
		this.distLines.sort((a, b) => (a.distance - b.distance));

		let topBlock = new BlkBlock(this.blockName);
		for (let d of this.distLines) {
			topBlock.push(new BlkBlock("distance", [
				new BlkVariable("distance", [d.distance, d.shown, d.tickExtension]),
				new BlkVariable("textPos", d.shownPos),
			], { useOneLine: true }));
		}
		if (this.settings.autoAddMax) {
			topBlock.push(new BlkBlock("distance", [
				new BlkVariable("distance", [this.settings.maxDist, 0, 0]),
				new BlkVariable("textPos", [0, 0]),
			], { useOneLine: true }));
		}
		return topBlock.getCode();
	}


	p_addOne(distance, shown = 0, shownPos = [0, 0], tickExtension = 0) {
		this.distLines.push({ distance, shown, shownPos, tickExtension });
		return this;
	}
}


export class CirclesBlock extends SightBlock {
	constructor() {
		super("drawCircles");
		/** @type {(string|Circle|BlkComment)[]} */
		this.blockLines = [];
	}

	/**
	 * Clear all circle elements
	 */
	clear() {
		this.blockLines.length = 0;
		return this;
	}

	/**
	 * Add one/multiple new circles
	 * @param {string|Circle|(string|Circle)[]} c
	 */
	add(c) {
		if (Array.isArray(c)) { for (let ce of c) { this.blockLines.push(ce); } }
		else { this.blockLines.push(c); }
		return this;
	}

	/**
	 * @param {string} s
	 */
	addComment(s) {
		this.blockLines.push(new BlkComment(s));
		return this;
	}

	getCode() {
		return (new BlkBlock(this.blockName, this.blockLines)).getCode();
	}
}


export class LinesBlock extends SightBlock {
	constructor() {
		super("drawLines");
		/** @type {(string|Line|BlkComment)[]} */
		this.blockLines = [];
	}

	/**
	 * Clear all line elements
	 */
	clear() {
		this.blockLines.length = 0;
		return this;
	}

	/**
	 * Add one/multiple new lines
	 * @param {string|Line|(string|Line)[]} l
	 */
	add(l) {
		if (Array.isArray(l)) { for (let le of l) { this.blockLines.push(le); } }
		else { this.blockLines.push(l); }
		return this;
	}

	/**
	 * @param {string} s
	 */
	addComment(s) {
		this.blockLines.push(new BlkComment(s));
		return this;
	}

	getCode() {
		return (new BlkBlock(this.blockName, this.blockLines)).getCode();
	}
}


export class TextsBlock extends SightBlock {
	constructor() {
		super("drawTexts");
		/** @type {(string|TextSnippet|BlkComment)[]} */
		this.blockLines = [];
	}

	/**
	 * Clear all text elements
	 */
	clear() {
		this.blockLines.length = 0;
		return this;
	}

	/**
	 * Add one/multiple new texts
	 * @param {string|TextSnippet|(string|TextSnippet)[]} t
	 */
	add(t) {
		if (Array.isArray(t)) { for (let te of t) { this.blockLines.push(te); } }
		else { this.blockLines.push(t); }
		return this;
	}

	/**
	 * @param {string} s
	 */
	addComment(s) {
		this.blockLines.push(new BlkComment(s));
		return this;
	}

	getCode() {
		return (new BlkBlock(this.blockName, this.blockLines)).getCode();
	}
}


export class QuadsBlock extends SightBlock {
	constructor() {
		super("drawQuads");
		/** @type {(string|Quad|BlkComment)[]} */
		this.blockLines = [];
	}

	/**
	 * Clear all quad elements
	 */
	clear() {
		this.blockLines.length = 0;
		return this;
	}

	/**
	 * Add one/multiple new quads
	 * @param {string|Quad|(string|Quad)[]} q
	 */
	add(q) {
		if (Array.isArray(q)) { for (let qe of q) { this.blockLines.push(qe); } }
		else { this.blockLines.push(q); }
		return this;
	}

	/**
	 * @param {string} s
	 */
	addComment(s) {
		this.blockLines.push(new BlkComment(s));
		return this;
	}

	getCode() {
		return (new BlkBlock(this.blockName, this.blockLines)).getCode();
	}
}
