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
 * A sight block specifying drawn shell distance, a.k.a. drawn shell
 * points of fall at various distances.
 *
 * Originally named as `crosshair_distances`.
 */
export default class ShellDistancesBlock extends SightBlock {
	/**
	 *
	 * @param {Object} settingsObj - block output settings
	 * @param {boolean=} settingsObj.autoAddMax - if an additional max distance
	 *   tick will be added. This tick ensures the "Distance: xxx" text in
	 *   generated sight will show specific distance value (instead of ">xxx")
	 *   until `min(maxDist, gunMaxRange)`, even though the max-value tick is
	 *   not actually drawn. Default is `true`.
	 * @param {boolean=} settingsObj.maxDist - distance of max distance tick.
	 *                                         Default is `20000`.
	 */
	constructor({ autoAddMax = true, maxDist = 20000 } = {}) {
		super("crosshair_distances");

		/**
		 * Drawn distance ticks
		 * @type {{distance: number, shown: number, shownPos: [number, number], tickExtension: number}[]}
		 */
		this.distLines = [];

		this.settings = { autoAddMax, maxDist };
	}


	//// SETTERS ////

	/**
	 * Clear all ticks
	 */
	clear() {
		this.distLines.length = 0;
		return this;
	}

	/**
	 * Add one or multiple new shell distance line(s)
	 * Use `shown=0` to hide a displayed number.
	 *
	 * **Input tick(s) may have following properties:**
	 * - `distance`: (mandantory) distance value (in meter) of this tick;
	 * - `shown`: (optional) displayed value (`number` type) of the tick.
	 *            Setting it to `0` or leave the property undefined will hide
	 *            the shown number and make the tick treated as
	 *            a secondary-level one
	 * - `shownPos`: (optional) position adjustment of shown number
	 * - `tickExtension`: (optional) tick length addition. Positive and negative
	 *                    numbers will make the tick grow to contrary directions
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

	/**
	 * Update if the additional max distance tick will be added
	 * @param {boolean} isDrawn
	 */
	setAutoAddMax(isDrawn) {
		this.settings.autoAddMax = isDrawn;
		return this;
	}

	/**
	 * Update if the distance number of auto-added max tick
	 * @param {number} newDist
	 */
	setAutoAddedMaxDist(newDist) {
		this.settings.maxDist = newDist;
		return this;
	}


	//// OUTPUT METHOD ////
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
			if ( // specified max dist not over auto-added dist
				this.distLines.length <= 0 ||
				this.distLines[this.distLines.length-1].distance < this.settings.maxDist
			) {
				topBlock.push(new BlkBlock("distance", [
					new BlkVariable("distance", [this.settings.maxDist, 0, 0]),
					new BlkVariable("textPos", [0, 0]),
				], { useOneLine: true }));
			}
		}
		return topBlock.getCode();
	}


	//// PRIVATE METHODS ////

	p_addOne(distance, shown = 0, shownPos = [0, 0], tickExtension = 0) {
		this.distLines.push({ distance, shown, shownPos, tickExtension });
		return this;
	}
}