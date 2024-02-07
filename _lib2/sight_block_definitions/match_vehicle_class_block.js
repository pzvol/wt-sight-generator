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
 * A sight block specifying matched vehicle types.
 *
 * Originally named as `matchExpClass`.
 */
export default class MatchVehicleClassBlock extends SightBlock {
	/** Names for matching all vehicles of a type */
	static commonTypes = {
		grounds: ["exp_tank", "exp_heavy_tank", "exp_tank_destroyer"],
		spaas: ["exp_SPAA"]
	};


	/**
	 *
	 * @param {string[]} includedClasses - vehicle names or types to be matched
	 * @param {string[]} excludedClasses - vehicle names or types to be
	 *                                     explicitly filtered out
	 */
	constructor(includedClasses = [], excludedClasses = []) {
		super("matchExpClass");

		/**
		 * Vehicle names or types to be matched
		 * @type {string[]}
		 */
		this.includedClasses = includedClasses;
		/**
		 * Vehicle names or types to be explicitly filtered out
		 * @type {string[]}
		 */
		this.excludedClasses = excludedClasses;
	}


	//// SETTERS ////

	/**
	 * Clear all included/excluded classes
	 */
	clear() {
		this.includedClasses.length = 0;
		this.excludedClasses.length = 0;
		return this;
	}

	/**
	 * Sight matches specified vehicle(s) or type(s)
	 * @param {string|string[]} c - vehicle name code or type code, or
	 *                              their array
	 */
	include(c) {
		if (Array.isArray(c)) {
			for (let ce of c) { this.includedClasses.push(ce); }
		} else { this.includedClasses.push(c); }
		return this;
	}

	/**
	 * Sight explicitly unmatches specified vehicle(s) or type(s)
	 * @param {string|string[]} c - vehicle name code or type code, or
	 *                              their array
	 */
	exclude(c) {
		if (Array.isArray(c)) {
			for (let ce of c) { this.excludedClasses.push(ce); }
		} else { this.excludedClasses.push(c); }
		return this;
	}


	//// OUTPUT METHOD ////
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
