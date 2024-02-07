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


/** "Abstract" block class for sight blocks */
export default class SightBlock {
	constructor(blockName) {
		/** Block name after compiling to `.blk` */
		this.blockName = blockName;
	}
	/**
	 * Gets the code of the whole block
	 * @returns {string}
	 */
	getCode() {
		let errorText = `ERROR: Unset method 'getCode' for sight block '${this.blockName}'`;
		throw new Error(errorText);
	}
}
