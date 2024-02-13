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

import { BlkBlock, BlkVariable } from "./sight_code_basis.js";


/**
 * Converter for translating blk code to JavaScript objects and defined classes
 */
export default class BlkParser {
	/** Parser status enum */
	static STATUS = {
		UNDEF: 0,
		IDLE: 1,
		HOLD_ONE_SLASH: 2,
		SKIP_UNTIL_NEWLINE: 3,
		READING_ELEMENT_NAME: 4,
		HOLDING_ELEMENT_NAME: 5,
		READING_ELEMENT_VARTYPE: 6,
		HOLDING_ELEMENT_VARTYPE: 7,
		READING_ELEMENT_VALUE: 8,
		READING_ELEMENT_VALUE_IN_QUOTE_SG: 9,
		READING_ELEMENT_VALUE_IN_QUOTE_DB: 10,
		READING_ELEMENT_BLOCK: 11,
	}

	/** Character types in a "blk" file */
	static CTYPE = {
		SLASH: 0,
		COLON: 1,
		SEMICOLON: 2,
		EQUAL: 3,
		COMMA: 4,
		DOT: 5,
		MINUS: 6,
		WHITESPACE: 7,
		QUOTE_SG: 8,
		QUOTE_DB: 9,
		BRACE_LEFT: 10,
		BRACE_RIGHT: 11,
		UNDERSCORE: 12,
		NEWLINE: 13,
		NUMBER: 14,
		ALPHABET: 15,
		OTHER: 16,
	};

	/** Element levels in a "blk" file */
	static LTYPE = {
		ROOT: "root",
		BLOCK: "block",
		VARIABLE: "variable",
	};

	/** Name of the root-level "element" */
	static ROOT_NAME = "__ROOT__";

	static REGEX_NUM_CHAR = /^[0-9]$/;
	static REGEX_ALPHABET_CHAR = /^[a-zA-Z]$/;

	static REGEX_NUM_STR = /^-?[.0-9]+$/;
	static REGEX_NUM_ARRAY_STR = /^[-.0-9, ]+$/;


	constructor() {}


	/**
	 * @typedef AstLike - an object like an abstract syntax tree (AST)
	 * @property {string} name - name of the block/variable
	 * @property {"root"|"block"|"variable"} level - element level (type)
	 * @property {string=} varType - (for variables only) variable datatype
	 * @property {AstLike[]} value - children of this element
	 */


	/**
	 * Parse .blk code string to a AST-like JavaScript object
	 * @param {string} codeText - raw .blk code string
	 * @param {boolean} isRoot - if the provided text is at root level.
	 *   If yes, `"__ROOT__"` will be used as the name of this "block"
	 *
	 * @returns {AstLike}
	 */
	static toAstLike(codeText, isRoot = true) {
		// Convert text line endings
		let t = BlkParser.p_unifyNewLines(codeText);

		// Static shorthands
		const S = BlkParser.STATUS;
		const CT = BlkParser.CTYPE;

		// Initialize status
		let status = S.IDLE;
		let statusCached = S.UNDEF;  // Cached status for jumping back to if necessary
		// Prepare output storage
		let resultValues = [];
		// Initalize relvant variables
		let currLineIndex = 1;
		let currColIndex = 0;
		let cachedElementName = "";
		let cachedElementLevel = "";  // A `LTYPE`
		let cachedElementVarType = "";  // type of variables
		let cachedElementValueRawStr = "";
		let currWorkingBlockValue = resultValues;  // "cwd" of parsed data element
		let readingBlockLevel = 0;

		// More shorthands
		let throwError = (msg) => BlkParser.p_throwError(
			currLineIndex, currColIndex, msg
		);
		let getResult = () => {
			if (isRoot) {
				return {
					name: BlkParser.ROOT_NAME,
					level: BlkParser.LTYPE.ROOT,
					value: resultValues
				};
			} else {
				return resultValues;
			}
		};

		// Main: Go through input chars
		for (let c of t) {
			// Check current char based on read-in status
			let cType = BlkParser.p_charType(c);
			switch (status) {

				case S.IDLE:
					switch (cType) {
						case CT.WHITESPACE: break;
						case CT.NEWLINE: break;
						case CT.SLASH:
							statusCached = status;
							status = S.HOLD_ONE_SLASH;
							break;
						case CT.ALPHABET:
							// start reading a var or a block
							status = S.READING_ELEMENT_NAME;
							cachedElementName = "";
							cachedElementName += c;
							break;
						case CT.BRACE_RIGHT:
							// Should only happens with empty blocks.
							// Call return directly
							return getResult();
							break;

						default:
							throwError(`Failure with parser status ${status}, char type ${cType}, char '${c}'`);
							break;
					}
					break;

				case S.READING_ELEMENT_NAME:
					switch (cType) {
						case CT.ALPHABET:
						case CT.NUMBER:
						case CT.UNDERSCORE:
							cachedElementName += c;
							break;
						case CT.COLON:
							cachedElementLevel = BlkParser.LTYPE.VARIABLE;
							cachedElementVarType = "";
							status = S.READING_ELEMENT_VARTYPE;
							break;
						case CT.BRACE_LEFT:
							cachedElementLevel = BlkParser.LTYPE.BLOCK;
							cachedElementVarType = "";
							cachedElementValueRawStr = "";
							readingBlockLevel += 1;
							status = S.READING_ELEMENT_BLOCK;
							break;
						case CT.WHITESPACE:
							status = S.HOLDING_ELEMENT_NAME;
							break;

						default:
							throwError(`Failure with parser status ${status}, char type ${cType}, char '${c}'`);
							break;
					}
					break;

				case S.HOLDING_ELEMENT_NAME:
					switch (cType) {
						case CT.WHITESPACE: break;
						case CT.COLON:
							cachedElementLevel = BlkParser.LTYPE.VARIABLE;
							cachedElementVarType = "";
							status = S.READING_ELEMENT_VARTYPE;
							break;

						case CT.BRACE_LEFT:
							cachedElementLevel = BlkParser.LTYPE.BLOCK;
							cachedElementVarType = "";
							cachedElementValueRawStr = "";
							readingBlockLevel += 1;
							status = S.READING_ELEMENT_BLOCK;
							break;

						default:
							throwError(`Failure with parser status ${status}, char type ${cType}, char '${c}'`);
							break;
					}
					break;

				case S.READING_ELEMENT_VARTYPE:
					switch (cType) {
						case CT.WHITESPACE: break;
						case CT.ALPHABET:
						case CT.NUMBER:
							cachedElementVarType += c;
							break;
						case CT.WHITESPACE:
							status = S.HOLDING_ELEMENT_VARTYPE;
							break;
						case CT.EQUAL:
							cachedElementValueRawStr = "";
							status = S.READING_ELEMENT_VALUE;
							break;

						default:
							throwError(`Failure with parser status ${status}, char type ${cType}, char '${c}'`);
							break;
					}
					break;

				case S.HOLDING_ELEMENT_VARTYPE:
					switch (cType) {
						case CT.WHITESPACE: break;
						case CT.EQUAL:
							cachedElementValueRawStr = "";
							status = S.READING_ELEMENT_VALUE;
							break;

						default:
							throwError(`Failure with parser status ${status}, char type ${cType}, char '${c}'`);
							break;
					}
					break;

				case S.READING_ELEMENT_VALUE:
					switch (cType) {
						case CT.WHITESPACE:
						case CT.NUMBER:
						case CT.ALPHABET:
						case CT.COMMA:
						case CT.DOT:
						case CT.MINUS:
							cachedElementValueRawStr += c;
							break;

						case CT.QUOTE_SG:
							cachedElementValueRawStr += c;
							status = S.READING_ELEMENT_VALUE_IN_QUOTE_SG;
							break
						case CT.QUOTE_DB:
							cachedElementValueRawStr += c;
							status = S.READING_ELEMENT_VALUE_IN_QUOTE_DB;
							break

						case CT.SEMICOLON:
						case CT.NEWLINE:
							// End and concat new value
							let newElement = {
								name: cachedElementName,
								level: cachedElementLevel,
								varType: cachedElementVarType,
								value: BlkParser.p_evalValue(cachedElementValueRawStr),
							};
							currWorkingBlockValue.push(newElement);
							status = S.IDLE;
							break;

						default:
							throwError(`Failure with parser status ${status}, char type ${cType}, char '${c}'`);
							break;
					}
					break;

				case S.READING_ELEMENT_VALUE_IN_QUOTE_SG:
					// TODO: backslash quote support?
					switch (cType) {
						case CT.QUOTE_SG:
							cachedElementValueRawStr += c;
							status = S.READING_ELEMENT_VALUE;
							break;

						case CT.NEWLINE:
							throwError(`Failure with parser status ${status}, char type ${cType}, char '${c}'`);
							break;

						default:
							cachedElementValueRawStr += c;
							break;
					}
					break;

				case S.READING_ELEMENT_VALUE_IN_QUOTE_DB:
					// TODO: backslash quote support?
					switch (cType) {
						case CT.QUOTE_DB:
							cachedElementValueRawStr += c;
							status = S.READING_ELEMENT_VALUE;
							break;

						case CT.NEWLINE:
							throwError(`Failure with parser status ${status}, char type ${cType}, char '${c}'`);
							break;

						default:
							cachedElementValueRawStr += c;
							break;
					}
					break;

				case S.READING_ELEMENT_BLOCK:
					switch (cType) {
						case CT.BRACE_LEFT:
							readingBlockLevel += 1;
							cachedElementValueRawStr += c;
							break;

						case CT.BRACE_RIGHT:
							readingBlockLevel -= 1;
							if (readingBlockLevel > 0) {
								cachedElementValueRawStr += c;
							} else {
								// Block read ended, compile the block
								let newElement = {
									name: cachedElementName,
									level: cachedElementLevel,
									value: this.toAstLike(cachedElementValueRawStr, false),
								};
								currWorkingBlockValue.push(newElement);
								status = S.IDLE;
							}
							break;

						default:
							cachedElementValueRawStr += c;
							break;
					}
					break;

				case S.HOLD_ONE_SLASH:
					switch (cType) {
						case CT.SLASH:
							// db slash - comment to the line end
							status = S.SKIP_UNTIL_NEWLINE;
							break;

						default:
							throwError(`Failure with parser status ${status}, char type ${cType}, char '${c}'`);
							break;
					}
					break;

				case S.SKIP_UNTIL_NEWLINE:
					switch (cType) {
						case CT.NEWLINE:
							// Stop skipping
							status = statusCached;
							statusCached = S.UNDEF;
							break;

						default: break;
					}
					break;

				default:
					throwError(`Failure with undefined status ${status}, char type ${cType}, char '${c}'`);
					break;
			}


			// Update "curr pos" variables
			switch (cType) {
				case CT.NEWLINE:
					currLineIndex++;
					currColIndex = 0;
					break;
				default:
					currColIndex++;
					break;
			}


		}

		// Return result
		return getResult();
	}


	/**
	 * Parse an ast-like object to defined
	 * `BlkBlock` and `BlkVariable` instances
	 * @param {AstLike} astLike
	 * @param {object[]?} parentArray - if not `null`, parsed elements will be
	 *   pushed into specified array instead of creating a new one.
	 * @returns {(BlkBlock|BlkVariable)[]}
	 */
	static astLikeToBlkElements(astLike, parentArray = null) {
		let output = (parentArray === null) ? [] : parentArray;

		if (astLike.level === BlkParser.LTYPE.ROOT) {
			for (let childAstLike of astLike.value) {
				BlkParser.astLikeToBlkElements(childAstLike, output);
			}

		} else if (astLike.level === BlkParser.LTYPE.BLOCK) {
			let blockChildren = [];
			for (let childAstLike of astLike.value) {
				BlkParser.astLikeToBlkElements(childAstLike, blockChildren);
			}
			output.push(new BlkBlock(astLike.name, blockChildren));

		} else if (astLike.level === BlkParser.LTYPE.VARIABLE) {
			output.push(new BlkVariable(
				astLike.name, astLike.value, astLike.varType | null
			));
		}

		return output;
	}


	/**
	 * Parse ".blk" code to defined `BlkBlock` and `BlkVariable` instances
	 * @param {string} codeText
	 */
	static toBlkElements(codeText) {
		return BlkParser.astLikeToBlkElements(
			BlkParser.toAstLike(codeText), null
		);
	}


	//// PRIVATE METHODS ////

	/**
	 * Converts CR/CRLF into LF and removes empty lines
	 * @param {string} text
	 */
	static p_unifyNewLines(text) {
		return text.replace(/\r\n/mg, "\n").replace(/\r/mg, "\n");
	}


	/** Check and get character type */
	static p_charType(c) {
		switch (c) {
			case "/":
				return BlkParser.CTYPE.SLASH;
			case ":":
				return BlkParser.CTYPE.COLON;
			case ";":
				return BlkParser.CTYPE.SEMICOLON;
			case "=":
				return BlkParser.CTYPE.EQUAL;
			case ",":
				return BlkParser.CTYPE.COMMA;
			case ".":
				return BlkParser.CTYPE.DOT;
			case "-":
				return BlkParser.CTYPE.MINUS;
			case "\t":
			case " ":
				return BlkParser.CTYPE.WHITESPACE;
			case "'":
				return BlkParser.CTYPE.QUOTE_SG;
			case "\"":
				return BlkParser.CTYPE.QUOTE_DB;
			case "{":
				return BlkParser.CTYPE.BRACE_LEFT;
			case "}":
				return BlkParser.CTYPE.BRACE_RIGHT;
			case "_":
				return BlkParser.CTYPE.UNDERSCORE;
			case "\n":
				return BlkParser.CTYPE.NEWLINE;

			default:
				if (BlkParser.REGEX_NUM_CHAR.test(c)) {
					return BlkParser.CTYPE.NUMBER;
				}
				if (BlkParser.REGEX_ALPHABET_CHAR.test(c)) {
					return BlkParser.CTYPE.ALPHABET;
				}
				return BlkParser.CTYPE.OTHER;
		}
	}

	/**
	 * Convert blk value string to a JS value type
	 *
	 * TODO: Add validation with originally defined blk types
	 * @param {string} text
	 */
	static p_evalValue(text) {
		let t = text.trim();
		if (
			(t.startsWith("\"") && t.endsWith("\"")) ||
			(t.startsWith("'") && t.endsWith("'"))
		) {
			return t.slice(1, -1);
		} else if (t === "yes" || t === "true") {
			return true;
		} else if (t === "no" || t === "false") {
			return false;
		} else if (BlkParser.REGEX_NUM_STR.test(t)) {
			return Number(t);
		} else if (BlkParser.REGEX_NUM_ARRAY_STR.test(t)) {
			let arr = [];
			let tFrags = t.split(",");
			for (let frag of tFrags) {
				let numStr = frag.trim();
				arr.push(
					BlkParser.REGEX_NUM_STR.test(numStr) ? Number(numStr) : null
				);
			}
			return arr;
		}
	}

	static p_throwError(lineIndex, columnIndex, message = "Unexpected error") {
		throw new Error(`Parse Error(${lineIndex}, ${columnIndex}): ${message}`);
	}
}






