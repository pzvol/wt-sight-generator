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

import { BlkVariable, BlkBlock } from "../sight_code_basis.js";
import SightBlock from "./_abstract_sight_block.js";


/**
 * A sight block specifying drawn thousandth lines (mils) on the sight horizon
 * for measuring enemy distance.
 *
 * Originally named as `crosshair_hor_ranges`.
 */
export default class HoriThousandthsBlock extends SightBlock {
	constructor() {
		super("crosshair_hor_ranges");

		/**
		 * Drawn thousandth ticks
		 * @type {{thousandth: number, shown: number}[]}
		 */
		this.thousandthLines = [];
	}


	//// SETTERS ////

	/**
	 * Clear all ticks
	 */
	clear() {
		this.thousandthLines.length = 0;
		return this;
	}

	/**
	 * Add one or multiple new thousandth tick(s).
	 *
	 * **Input tick(s) may have following properties:**
	 * - `thousandth`: (mandantory) thousandth value (or mil) of this tick;
	 * - `shown`: (optional) displayed value (`number` type) of the tick.
	 *            Setting it to `0` or leave the property undefined will hide
	 *            the shown number and make the tick treated as
	 *            a secondary-level one
	 *
	 * @param {{thousandth: number, shown?: number}|{thousandth: number, shown?: number}[]} input - added tick(s)
	 */
	add(input) {
		if (Array.isArray(input)) {
			for (let t of input) { this.p_addOne(t); }
		} else { this.p_addOne(input); }
		return this;
	}


	//// OUTPUT METHOD ////
	getCode() {
		this.thousandthLines.sort((a, b) => (a.thousandth - b.thousandth));

		let blkBlock = new BlkBlock(this.blockName);
		for (let l of this.thousandthLines) {
			blkBlock.push(new BlkVariable("range", [l.thousandth, l.shown]));
		}
		return blkBlock.getCode();
	}


	//// PRIVATE METHODS ////

	/**
	 * Add a new thousandth tick
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