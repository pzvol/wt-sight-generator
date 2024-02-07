/**
 * (All) Block types for storing elements drawn in sight
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

import { Quad, Circle, Line, TextSnippet } from "../sight_elements.js";
import ElementsBlock from "./_generic_elements_block.js";


/** A block for storing sight's circle elements */
export class CirclesBlock extends ElementsBlock {
	constructor() {
		super("drawCircles");
	}

	//// Override for clear prompts ////
	/**
	 * Add one/multiple new circle(s)
	 * @param {string|Circle|(string|Circle)[]} c
	 */
	add(c) { return super.add(c); }
}


/** A block for storing sight's line elements */
export class LinesBlock extends ElementsBlock {
	constructor() {
		super("drawLines");
	}

	//// Override for clear prompts ////
	/**
	 * Add one/multiple new line(s)
	 * @param {string|Line|(string|Line)[]} c
	 */
	add(c) { return super.add(c); }
}


/** A block for storing sight's text elements */
export class TextsBlock extends ElementsBlock {
	constructor() {
		super("drawTexts");
	}

	//// Override for clear prompts ////
	/**
	 * Add one/multiple new text pieces
	 * @param {string|TextSnippet|(string|TextSnippet)[]} c
	 */
	add(c) { return super.add(c); }
}


/** A block for storing sight's quad elements */
export class QuadsBlock extends ElementsBlock {
	constructor() {
		super("drawQuads");
	}

	//// Override for clear prompts ////
	/**
	 * Add one/multiple new text pieces
	 * @param {string|Quad|(string|Quad)[]} c
	 */
	add(c) { return super.add(c); }
}



export default { CirclesBlock, LinesBlock, TextsBlock, QuadsBlock };
