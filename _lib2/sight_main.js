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
	static libVersion = "20230913";

	static commonVehicleTypes = block.MatchVehicleClassBlock.commonTypes;

	constructor() {
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
		};

		// Shorthands
		this.quads = this.components.quads;
		this.circles = this.components.circles;
		this.lines = this.components.lines;
		this.texts = this.components.texts;
	}

	getComponents() { return this.components; }

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

	/**
	 * @param {string|BlkVariable|BlkComment|(string|BlkVariable|BlkComment)[]} input
	 */
	addSettings(input) {
		this.components.sightSettings.add(input);
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
	 * @param {{distance: number, shown?: number, shownPos?: [number, number]}|{distance: number, shown?: number, shownPos?: [number, number]}[]} input
	 */
	addShellDistance(input) {
		this.components.shellDistances.add(input);
		return this;
	}

	/**
	 * Draw one/multiple circles/lines/texts
	 * @param {Quad|Circle|Line|TextSnippet|(Quad|Circle|Line|TextSnippet)[]} input
	 */
	add(input) {
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
		return blkFile.getCode();
	}

	printCode() { console.log(this.getCode()); }
}
