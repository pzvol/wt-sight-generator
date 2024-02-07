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

import { BlkBlock, BlkComment } from "../sight_code_basis.js";
import SightBlock from "./_abstract_sight_block.js";


/** Generic type of block of sight elements (circles, lines, etc.) */
export default class ElementsBlock extends SightBlock {
	constructor(blockName) {
		super(blockName);
		/**
		 * Elements included in the block
		 */
		this.blockLines = [];
	}


	//// SETTERS ////
	/**
	 * Clear all included elements
	 */
	clear() {
		this.blockLines.length = 0;
		return this;
	}

	/**
	 * Add one new element/string or multiple inside an array.
	 */
	add(added) {
		if (Array.isArray(added)) {
			for (let oneAdded of added) { this.blockLines.push(oneAdded); }
		} else {
			this.blockLines.push(added);
		}
		return this;
	}

	/**
	 * A shortcut for adding a comment line
	 * @param {string} s
	 */
	addComment(s) {
		this.blockLines.push(new BlkComment(s));
		return this;
	}


	//// OUTPUT METHOD ////
	getCode() {
		return (new BlkBlock(this.blockName, this.blockLines)).getCode();
	}
}