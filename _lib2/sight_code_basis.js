/**
 * Basic coding elements of a `.blk` sight file
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

import Toolbox from "./sight_toolbox.js";


export default {
	description: "Basic coding elements of a `.blk` sight file"
};


export const SETTINGS = {
	/** Max number of digits for numbers in code output */
	NUM_DIGIT: 8,
	/** Output code's line indentation */
	LINE_INDENT: "\t",
	/** Output code's line ending */
	LINE_ENDING: "\n",
	/** Separator for multiple code parts in one line */
	ONE_LINE_SEP: "; ",
};


/** An variable in blk file */
export class BlkVariable {
	/**
	 * Defines a new .blk variable
	 *
	 * @param {string} vName - variable name
	 * @param {number|string|boolean|number[]} vValue
	 * @param {null|"i"|"t"|"r"|"c"|"b"|"p2"|"p3"|"p4"} vType - output type. `null` for auto
	 *
	 * Note that:
	 * 1. for sight text align, the vType `"r"` will be selected by default, so
	 * `"i"` needs to be decalred if necessary
	 * 2. for 4 number arrays, the vType `"p4"` will be selected by default, so
	 * `"c"` needs to be decalred if necessary
	 */
	constructor(vName, vValue, vType = null) {
		/** Variable name */
		this.name = vName;
		/** Variable value */
		this.value = vValue;
		/** Variable type. Set to `null` for auto detecting when output */
		this.type = vType;
	}

	getCode() {
		let valueOut;
		let typeOut = this.type;

		if (typeof this.value == "number") {
			if (!typeOut) { typeOut = "r"; }
			valueOut = Toolbox.round(this.value, SETTINGS.NUM_DIGIT).toString(10);

		} else if (typeof this.value == "boolean") {
			if (!typeOut) { typeOut = "b"; }
			valueOut = this.value ? "yes" : "no";

		} else if (typeof this.value == "string") {
			if (!typeOut) { typeOut = "t"; }
			valueOut = `"${this.value.replace(/["]/gm, "")}"`;

		} else if (Array.isArray(this.value) && this.value.length >= 2 && this.value.length <= 4) {
			if (!typeOut) { typeOut = "p" + this.value.length.toString(10); }
			let valueRounded = [];
			for (let v of this.value) { valueRounded.push(Toolbox.round(v, SETTINGS.NUM_DIGIT)); }
			valueOut = valueRounded.join(", ");
		} else {
			throw new Error(`ERROR: Unidentified sight variable type from '${this.name}'`);
		}

		return `${this.name}:${typeOut} = ${valueOut}`;
	}
}


/** A block in blk file */
export class BlkBlock {
	/**
	 * @param {string} bName - block name
	 * @param {*[]} bLines - block lines. Elements must either be strings
	 *                       or have method `getCode` which return a string
	 *
	 * @param {Object} settings
	 * @param {boolean} settings.useOneLine
	 * @param {number} settings.baseIndentLevel
	 */
	constructor(bName, bLines = [], {
		useOneLine = false,
		baseIndentLevel = 0
	} = {}) {
		/** Block name */
		this.name = bName;
		/** Block internal lines */
		this.contentLines = bLines;
		/** Code output settings */
		this.settings = {
			useOneLine,
			baseIndentLevel,
		};
	}

	/**
	 * Append a new content line of block
	 * @param {*|*[]} input - appended item(s). Must either be a string or
	 *                    has `getCode` method
	 */
	push(input) {
		if (Array.isArray(input)) {
			for (let ele of input) { this.contentLines.push(ele); }
		} else {
			this.contentLines.push(input);
		}
		return this;
	}

	getCode() {
		// Empty block:
		if (this.contentLines.length === 0) {
			return `${this.name} {}`;
		}

		let baseIndent = (() => {
			let s = "";
			for (let i = 0; i < this.settings.baseIndentLevel; i++) {
				s += SETTINGS.LINE_INDENT;
			}
			return s;
		})();

		// One line mode:
		if (this.settings.useOneLine) {
			let result = baseIndent + `${this.name} { `;
			for (let l of this.contentLines) {
				result +=
					(typeof l === "string") ? l : l.getCode() +
						SETTINGS.ONE_LINE_SEP;
			}
			result += "}";
			return result;
		}

		// Multiple lines mode:
		let inBlockIndent = baseIndent + SETTINGS.LINE_INDENT;
		let lineStartRegExp = (new RegExp("^", "gm"));
		let result = baseIndent + `${this.name} { ` + SETTINGS.LINE_ENDING;
		for (let l of this.contentLines) {
			result +=
				((typeof l === "string") ? l : l.getCode()).replace(lineStartRegExp, inBlockIndent) +
				SETTINGS.LINE_ENDING;
		}
		result += baseIndent + "}";
		return result;
	}
}

export class BlkComment {
	constructor(s = "") {
		/** Comment content. Allows multiple lines. */
		this.value = s;
	}

	getCode() {
		let lines = BlkComment.p_splitMultiLineStr(this.value);
		return lines.map(l => `// ${l}`).join(SETTINGS.LINE_ENDING);
	}


	/**
	 * Split a string with multiple lines into an array
	 * @param {string} s
	 */
	static p_splitMultiLineStr(s) {
		return s.replace(/\r\n/gm, "\n").replace(/\r/gm, "\n").split("\n");
	}
}


/** A `.blk` sight file */
export class BlkFile {
	// TODO: Add line search methods

	constructor() {
		/** file lines (un-compiled) */
		this.contentLines = [];
		this.settings = {};
	}

	/**
	 * Append a new line of element
	 * @param {*|*[]} input - appended item(s). Must either be a string or
	 *                    has `getCode` method
	 */
	push(input) {
		if (Array.isArray(input)) {
			for (let ele of input) { this.contentLines.push(ele); }
		} else {
			this.contentLines.push(input);
		}
		return this;
	}

	/** Get code lines of a blk file */
	getCode() {
		let result = "";

		for (let l of this.contentLines) {
			if (typeof l === "string") {
				result += l + SETTINGS.LINE_ENDING;
			} else {
				result += l.getCode() + SETTINGS.LINE_ENDING;
			}
		}
		return result;
	}
}
