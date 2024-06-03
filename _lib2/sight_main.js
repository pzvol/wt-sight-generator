/**
 * Main module for the sight
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

import * as block from "./sight_blocks.js";
import { BlkVariable, BlkBlock, BlkComment, BlkFile } from "./sight_code_basis.js";
import { Quad, Circle, Line, TextSnippet } from "./sight_elements.js";


/** An all-in-one entrance for creating a user sight */
export default class Sight {
	static libVersion = "20240603";

	static commonVehicleTypes = block.MatchVehicleClassBlock.commonTypes;

	constructor() {
		/** All blocks inside a sight */
		this.components = {
			/** @type {string[]} */
			description: [],
			sightSettings: new block.BasicSettings(),
			matchVehicleClasses: new block.MatchVehicleClassBlock(),
			horiThousandths: new block.HoriThousandthsBlock(),
			shellDistances: new block.ShellDistancesBlock(),
			quads: new block.QuadsBlock(),
			circles: new block.CirclesBlock(),
			lines: new block.LinesBlock(),
			texts: new block.TextsBlock(),
			/**
			 * All additional elements appended to the sight
			 *
			 * (designed as a temp solution before implementing
			 * a proper `ballistics` block)
			 * @type {(BlkBlock|BlkVariable|BlkComment)[]}
			 */
			extra: [],
		};

		/** Shorthand for accessing the quad component block */
		this.quads = this.components.quads;
		/** Shorthand for accessing the circle component block */
		this.circles = this.components.circles;
		/** Shorthand for accessing the line component block */
		this.lines = this.components.lines;
		/** Shorthand for accessing the text component block */
		this.texts = this.components.texts;

		/**
		 * A set of collection of sight-designer-defined element collections
		 * to enable further-modifications after creating a sight.
		 *
		 * This object of collections should be organized like:
		 * ```
		 * {
		 *   "userDefinedCollectionName": [
		 *     myQuad, myCircle, myLine, myTextSnippet,
		 *     ...
		 *   ]
		 * }
		 *
		 * It is recommended to create/manage them with `add` method's parameters
		 * ```
		 * @type {object.<string, (Quad|Circle|Line|TextSnippet)[]>}
		 */
		this.collections = {};

		/**
		 * The very recently added elements by calling `add` method. Be noted
		 * that only `add` from `Sight` class will take effect.
		 */
		this.lastAddedElements = [];
	}

	getComponents() { return this.components; }

	getCollections() { return this.collections; }

	/**
	 * Add text(s) into description
	 * @param {string|string[]} content
	 */
	addDescription(content) {
		let arr;
		if (Array.isArray(content)) { arr = content; }
		else { arr = [content]; }

		for (let element of arr) { this.components.description.push(element); }
		return this;
	}

	/** Clear all sight description lines */
	clearDescription() {
		this.components.description.length = 0;
		return this;
	}

	/**
	 * @param {string|BlkVariable|BlkComment|(string|BlkVariable|BlkComment)[]} input
	 */
	addSettings(input) {
		this.components.sightSettings.add(input);
		return this;
	}

	/**
	 * Update the value and datatype of existing settings, or
	 * add the provided new one(s)
	 *
	 * Only `BlkVariable` or its array is allowed as input
	 *
	 * @param {BlkVariable|BlkVariable[]} input
	 */
	updateOrAddSettings(input) {
		this.components.sightSettings.updateOrAddVariable(input);
		return this;
	}

	/**
	 * @param {string|string[]} input - variable name(s)
	 */
	removeSettingsByVariableName(input) {
		this.components.sightSettings.removeVariableByName(input);
		return this;
	}

	clearSettings() {
		this.components.sightSettings.clear();
		return this;
	}


	/**
	 * Sight matches given vehicle(s)
	 * @param {string|string[]} vehicleType
	 */
	matchVehicle(vehicleType) {
		this.components.matchVehicleClasses.include(vehicleType);
		return this;
	}

	/**
	 * Sight does not match given vehicle(s)
	 * @param {string|string[]} vehicleType
	 */
	noMatchVehicle(vehicleType) {
		this.components.matchVehicleClasses.exclude(vehicleType);
		return this;
	}

	/**
	 * Adds new thousandth tick(s) on the horizon for measuring distance
	 * @param {{thousandth: number, shown?: number}|{thousandth: number, shown?: number}[]} input - added tick(s).
	 *        set `shown` to 0 or skip the key for not display a value
	 */
	addHoriThousandths(input) {
		this.components.horiThousandths.add(input);
		return this;
	}

	/**
	 * Adds new shell distance line(s)
	 *
	 * Use `shown=0` to hide a displayed number.
	 *
	 * @param {{distance: number, shown?: number, shownPos?: [number, number], tickExtension?: number}|{distance: number, shown?: number, shownPos?: [number, number], tickExtension?: number}[]} input
	 */
	addShellDistance(input) {
		this.components.shellDistances.add(input);
		return this;
	}

	/**
	 * Draw one/multiple circles/lines/texts
	 * @param {Quad|Circle|Line|TextSnippet|(Quad|Circle|Line|TextSnippet)[]} input
	 * @param {string|null} customCollectionName - the name of user-defined
	 *                                             collection elements will be
	 *                                             added to
	 * @param {boolean} updateLastAddedElements - if update recorded recently
	 *                                            added elements
	 */
	add(input, customCollectionName = null, updateLastAddedElements = true) {
		let arr;
		if (Array.isArray(input)) { arr = input; }
		else { arr = [input]; }

		for (let element of arr) {
			if (element instanceof Quad) {
				this.components.quads.add(element);
			} else if (element instanceof Circle) {
				this.components.circles.add(element);
			} else if (element instanceof Line) {
				this.components.lines.add(element);
			} else if (element instanceof TextSnippet) {
				this.components.texts.add(element);
			} else {
				continue;
			}

			// Add to indicated custom collection if required to do so
			if (customCollectionName !== null && customCollectionName !== "") {
				// Collection does not exist - create it first
				if (!this.collections.hasOwnProperty(customCollectionName)) {
					this.collections[customCollectionName] = [];
				}
				// Append the element if yet to be there
				if (!this.collections[customCollectionName].includes(element)) {
					this.collections[customCollectionName].push(element);
				}
			}
		}

		// Record added elements
		if (arr.length > 0 && updateLastAddedElements) {
			if (Array.isArray(input)) {
				// `arr` is directly from input - do a shallow copy
				this.lastAddedElements = Array.from(arr);
			} else {
				// `arr` is created inside this function - directly use it
				this.lastAddedElements = arr;
			}
		}

		return this;
	}

	/**
	 * Add comment to specified (one/multiple) blocks
	 *
	 * @param {string} content
	 * @param {"settings"|"quads"|"circles"|"lines"|"texts"|("settings"|"quads"|"circles"|"lines"|"texts")[]} toBlock
	 */
	addComment(content, toBlock) {
		let toArr;
		if (Array.isArray(toBlock)) { toArr = toBlock; }
		else { toArr = [toBlock]; }

		for (let t of toArr) {
			if (t === "settings") {
				this.components.sightSettings.addComment(content);
			} else if (t === "quads") {
				this.components.quads.addComment(content);
			} else if (t === "circles") {
				this.components.circles.addComment(content);
			} else if (t === "lines") {
				this.components.lines.addComment(content);
			} else if (t === "texts") {
				this.components.texts.addComment(content);
			}
		}

		return this;
	}

	/**
	 * Add an extra element which is not covered as a standard component
	 *
	 * (designed as a temp solution before implementing a proper `ballistics` block)
	 * @param {BlkBlock|BlkVariable|BlkComment|(BlkBlock|BlkVariable|BlkComment)[]} input
	 */
	addExtra(input) {
		let arr;
		if (Array.isArray(input)) { arr = input; }
		else { arr = [input]; }

		for (let element of arr) {
			if (
				element instanceof BlkBlock ||
				element instanceof BlkVariable ||
				element instanceof BlkComment
			) { this.components.extra.push(element); }
		}
		return this;
	}

	/**
	 * Repetitively `add` the latest (one single) element for given times (so it will be
	 * drawn for multiple times while compiling)
	 *
	 * BE NOTICED that only elements appended by `add` method from this
	 * `Sight` class will be considered
	 *
	 * @param {number} n number of repetition (`1` by default)
	 */
	repeatLastAdd(n = 1) {
		if (this.lastAddedElements.length <= 0) { return this; }
		for (let count = 0; count < n; count++) {
			this.add(this.lastAddedElements, false);
		}
		return this;
	}

	/**
	 * Remove all occurences of one/multiple circles/lines/texts
	 * @param {Quad|Circle|Line|TextSnippet|(Quad|Circle|Line|TextSnippet)[]} input
	 * @param {boolean} tryRemoveFromCollections
	 */
	remove(input, tryRemoveFromCollections = true) {
		let arr;
		// Do a shallow copy for array input to avoid the situation when
		// this.collections["someColl"] is used as input
		if (Array.isArray(input)) { arr = [...input]; }
		else { arr = [input]; }

		for (let element of arr) {
			if (element instanceof Quad) {
				this.components.quads.remove(element);
			} else if (element instanceof Circle) {
				this.components.circles.remove(element);
			} else if (element instanceof Line) {
				this.components.lines.remove(element);
			} else if (element instanceof TextSnippet) {
				this.components.texts.remove(element);
			} else {
				continue;
			}

			if (tryRemoveFromCollections) {
				for (let collName in this.collections) {
					while(true) {
						let eIndex = this.collections[collName].
							findIndex((ele) => (ele === element));
						if (eIndex < 0) { break; }
						this.collections[collName].splice(eIndex, 1);
					}
				}
			}
		}
	}


	/** Get complete compiled code for the sight */
	getCode(addAutoGenHeadingComment = true) {
		let blkFile = new BlkFile();

		if (addAutoGenHeadingComment) {
			blkFile.push([
				new BlkComment("GENERATED FROM CODE WITH wt-sight-generator V2"),
				""
			]);
		}

		if (this.components.description.length > 0) {
			blkFile.push([
				new BlkComment(this.components.description.join("\n")),
				""
			]);
		}

		blkFile.push([
			this.components.sightSettings, "",
			this.components.matchVehicleClasses, "",
			this.components.horiThousandths, "",
			this.components.shellDistances, "",
			this.components.quads, "",
			this.components.circles, "",
			this.components.lines, "",
			this.components.texts,
		]);
		// Append extra elements
		for (let ex of this.components.extra) {
			blkFile.push(["", ex]);
		}
		return blkFile.getCode();
	}

	printCode() { console.log(this.getCode()); }
}
