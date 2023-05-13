/**
 * Fundamental elements of a user sight
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

import Toolbox from "./sight_toolbox.js"
import {
	SETTINGS,
	BlkVariable,
	BlkBlock
} from "./sight_code_basis.js";


export default {
	description: "Fundamental elements of a user sight"
}


/** A circle element */
export class Circle {
	/**
	 * @param {Object} obj
	 * @param {[number, number]=} obj.segment - (default `[0,360]`) start/end degree of curve
	 * @param {[number, number]=} obj.pos - (default `[0, 0]`) center position
	 * @param {number} obj.diameter - circle diameter
	 * @param {number=} obj.size - (default `1`) line width
	 * @param {boolean=} obj.move - (default `false`) if move with gun zero changes
	 * @param {boolean=} obj.thousandth - (default `true`) if use thousandth
	 */
	constructor({
		segment = [0, 360],
		pos = [0, 0],
		diameter,
		size = 1,
		move = false,
		thousandth = true
	} = {}, extraDrawn = { mirrorSegmentX: false, mirrorSegmentY: false }) {
		this.details = { segment, pos, diameter, size, move, thousandth };
		/** On what axes will extra curves be generated */
		this.extraDrawn = extraDrawn
	}

	copy() {
		return (new Circle(
			Toolbox.copyValue(this.details),
			Toolbox.copyValue(this.extraDrawn)
		));
	}

	move([x, y]) {
		this.details.pos[0] += x;
		this.details.pos[1] += y;
		return this;
	}

	mirrorSegmentX() {
		let newSegment = [(360 - this.details.segment[1]), (360 - this.details.segment[0])];
		if (newSegment[0] > 360) { newSegment[0] = newSegment[0] % 360; }
		if (newSegment[1] > 360) { newSegment[1] = newSegment[1] % 360; }
		this.details.segment[0] = newSegment[0];
		this.details.segment[1] = newSegment[1];
		return this;
	}

	mirrorSegmentY() {
		let newSegment = [(540 - this.details.segment[1]), (540 - this.details.segment[0])];
		if (newSegment[0] > 360) { newSegment[0] = newSegment[0] % 360; }
		if (newSegment[1] > 360) { newSegment[1] = newSegment[1] % 360; }
		this.details.segment[0] = newSegment[0];
		this.details.segment[1] = newSegment[1];
		return this;
	}

	mirrorPosX() {
		this.details.pos[0] = -(this.details.pos[0]);
		return this;
	}

	mirrorPosY() {
		this.details.pos[1] = -(this.details.pos[1]);
		return this;
	}

	/** Set flag(s) for drawing extra curves */
	withExtra({ mirrorSegmentX = null, mirrorSegmentY = null }={}) {
		if (mirrorSegmentX !== null) {
			this.extraDrawn.mirrorSegmentX = mirrorSegmentX;
		}
		if (mirrorSegmentY !== null) {
			this.extraDrawn.mirrorSegmentY = mirrorSegmentY;
		}
		return this;
	}

	getCode() {
		let resultCodeLines = [];
		resultCodeLines.push(this._getSelfCode());

		// Add extra drawn code
		if (this.extraDrawn.mirrorSegmentX) {
			resultCodeLines.push(this.copy().mirrorSegmentX()._getSelfCode());
		}
		if (this.extraDrawn.mirrorSegmentY) {
			resultCodeLines.push(this.copy().mirrorSegmentY()._getSelfCode());
		}
		if (this.extraDrawn.mirrorSegmentX && this.extraDrawn.mirrorSegmentY) {
			resultCodeLines.push(this.copy().mirrorSegmentX().mirrorSegmentY()._getSelfCode());
		}

		return resultCodeLines.join(SETTINGS.LINE_ENDING);
	}

	/**
	 * Returns the text for drawing the circle without extra segments
	 */
	_getSelfCode() {
		let subVars = [];
		for (let k in this.details) {
			subVars.push(new BlkVariable(k, this.details[k]));
		}
		return (new BlkBlock("circle", subVars, { useOneLine: true }).getCode());
	}
}


/** A line element */
export class Line {
	/**
	 * @param {Object} obj
	 * @param {[number, number]} obj.from
	 * @param {[number, number]} obj.to
	 * @param {boolean=} obj.move - (default `false`) if move with gun zero changes
	 * @param {boolean=} obj.thousandth - (default `true`) if use thousandth
	 *
	 * @param {boolean=} obj.moveRadial - if radial move
	 * @param {[number, number]=} obj.radialCenter - radial move center position `[x, y]`
	 * @param {number=} obj.radialMoveSpeed
	 * @param {number=} obj.radialAngle
	 *
	 * @param {Object[]} lineBreakPoints
	 * @param {number} lineBreakPoints.x
	 * @param {number} lineBreakPoints.y
	 * @param {number} lineBreakPoints.r
	 */
	constructor({
		from,
		to,
		move = false,
		thousandth = true,
		moveRadial, radialCenter, radialMoveSpeed, radialAngle
	} = {}, lineBreakPoints = [], extraDrawn = {mirrorX: false, mirrorY: false}) {
		this.lineEnds = { from, to };
		/** Difference of x/y values ("to" - "from") */
		this.lineEndDiffs = { x: (to[0] - from[0]), y: (to[1] - from[1]) };
		this.lineEndDistance = Math.sqrt(
			(to[0] - from[0]) ** 2 +
			(to[1] - from[1]) ** 2
		);
		this.detailsMisc = {
			move, thousandth,
			moveRadial, radialCenter, radialMoveSpeed, radialAngle
		};
		this.lineBreakPoints = lineBreakPoints;

		/** On what axes will extra lines be generated */
		this.extraDrawn = extraDrawn;
	}


	/** Adds a line break on X. Note that break widths should never overlap. */
	addBreakAtX(x, width) {
		if (!Toolbox.valueInRange(x, [this.lineEnds.from[0], this.lineEnds.to[0]])) {
			console.warn(`WARN: Line.addBreakAtX - x value ${x} is not in line range, break ignored`);
			return this;
		}
		if (this.lineEndDiffs.x === 0) {
			console.warn(`WARN: Line.addBreakAtX - vert line, break at x=${x} ignored`);
			return this;
		}
		let y =
			((x - this.lineEnds.from[0]) / this.lineEndDiffs.x * this.lineEndDiffs.y) +
			this.lineEnds.from[1];

		this.lineBreakPoints.push({ x: x, y: y, r: width / 2 });
		return this;
	}

	/** Adds a line break on Y. Note that break widths should never overlap. */
	addBreakAtY(y, width) {
		if (!Toolbox.valueInRange(y, [this.lineEnds.from[1], this.lineEnds.to[1]])) {
			console.warn(`WARN: Line.addBreakAtY - y value ${y} is not in line range, break ignored`);
			return this;
		}
		if (this.lineEndDiffs.y === 0) {
			console.warn(`WARN: Line.addBreakAtY - hori line, break at y=${y} ignored`);
			return this;
		}
		let x =
			((y - this.lineEnds.from[1]) / this.lineEndDiffs.y * this.lineEndDiffs.x) +
			this.lineEnds.from[0];

		this.lineBreakPoints.push({ x: x, y: y, r: width / 2 });
		return this;
	}

	copy() {
		return (new Line(
			{
			from: Toolbox.copyValue(this.lineEnds.from),
			to: Toolbox.copyValue(this.lineEnds.to),
			move: this.detailsMisc.move,
			thousandth: this.detailsMisc.thousandth,

			moveRadial: this.detailsMisc.moveRadial || null,
			radialCenter: this.detailsMisc.radialCenter || null,
			radialMoveSpeed: this.detailsMisc.radialMoveSpeed || null,
			radialAngle: this.detailsMisc.radialAngle || null
			},
			Toolbox.copyValue(this.lineBreakPoints),
			Toolbox.copyValue(this.extraDrawn)
		));
	}

	move([x, y]) {
		this.lineEnds.from[0] += x;
		this.lineEnds.from[1] += y;
		this.lineEnds.to[0] += x;
		this.lineEnds.to[1] += y;
		// TODO: deal with radial center
		for (let bp of this.lineBreakPoints) {
			bp.x += x;
			bp.y += y;
		}
		return this;
	}

	mirrorX() {
		this.lineEnds.from[0] = -(this.lineEnds.from[0]);
		this.lineEnds.to[0] = -(this.lineEnds.to[0]);
		this.lineEndDiffs.x = -(this.lineEndDiffs.x);
		// TODO: deal with radial values
		for (let bp of this.lineBreakPoints) { bp.x = -(bp.x); }
		return this;
	}
	mirrorY() {
		this.lineEnds.from[1] = -(this.lineEnds.from[1]);
		this.lineEnds.to[1] = -(this.lineEnds.to[1]);
		this.lineEndDiffs.y = -(this.lineEndDiffs.y);
		// TODO: deal with radial values
		for (let bp of this.lineBreakPoints) { bp.y = -(bp.y); }
		return this;
	}

	/** Set flag(s) for drawing extra lines */
	withExtra({ mirrorX = null, mirrorY = null }={}) {
		if (mirrorX !== null) {
			this.extraDrawn.mirrorX = mirrorX;
		}
		if (mirrorY !== null) {
			this.extraDrawn.mirrorY = mirrorY;
		}
		return this;
	}

	getCode() {
		let resultCodeLines = [];
		resultCodeLines = resultCodeLines.concat(this._getSelfCodeFrags());

		// Add extra drawn code
		if (this.extraDrawn.mirrorX) {
			resultCodeLines = resultCodeLines.concat(this.copy().mirrorX()._getSelfCodeFrags());
		}
		if (this.extraDrawn.mirrorY) {
			resultCodeLines = resultCodeLines.concat(this.copy().mirrorY()._getSelfCodeFrags());
		}
		if (this.extraDrawn.mirrorX && this.extraDrawn.mirrorY) {
			resultCodeLines = resultCodeLines.concat(this.copy().mirrorX().mirrorY()._getSelfCodeFrags());
		}

		return resultCodeLines.join(SETTINGS.LINE_ENDING);
	}


	/**
	 * Get code for all line frags into an array without extras
	 * @returns {string[]}
	 */
	_getSelfCodeFrags() {
		// Sort breakpoints
		//   Note that same from & to is not supported
		if (this.lineEndDiffs.x !== 0) {
			if (this.lineEndDiffs.x > 0) {
				this.lineBreakPoints.sort((a, b) => (a.x - b.x));
			} else {
				this.lineBreakPoints.sort((a, b) => -(a.x - b.x));
			}
		} else {
			if (this.lineEndDiffs.y > 0) {
				this.lineBreakPoints.sort((a, b) => (a.y - b.y));
			} else {
				this.lineBreakPoints.sort((a, b) => -(a.y - b.y));
			}
		}

		// Find all line frags
		let lineFragStarts = [this.lineEnds.from];
		let lineFragEnds = [];  // Whole line ending will be added later

		for (let bp of this.lineBreakPoints) {
			if (this.lineEndDiffs.x === 0) {  // Vert line
				if (this.lineEndDiffs.y > 0) {
					lineFragEnds.push([bp.x, bp.y - bp.r]);
					lineFragStarts.push([bp.x, bp.y + bp.r]);
				} else {
					lineFragEnds.push([bp.x, bp.y + bp.r]);
					lineFragStarts.push([bp.x, bp.y - bp.r]);
				}

			} else if (this.lineEndDiffs.y === 0) {  // Hori line
				if (this.lineEndDiffs.x > 0) {
					lineFragEnds.push([bp.x - bp.r, bp.y]);
					lineFragStarts.push([bp.x + bp.r, bp.y]);
				} else {
					lineFragEnds.push([bp.x + bp.r, bp.y]);
					lineFragStarts.push([bp.x - bp.r, bp.y]);
				}

			} else {
				lineFragEnds.push([
					bp.x - (this.lineEndDiffs.x / this.lineEndDistance * bp.r),
					bp.y - (this.lineEndDiffs.y / this.lineEndDistance * bp.r)
				]);
				lineFragStarts.push([
					bp.x + (this.lineEndDiffs.x / this.lineEndDistance * bp.r),
					bp.y + (this.lineEndDiffs.y / this.lineEndDistance * bp.r)
				]);
			}
		}
		// Add whole line ending
		lineFragEnds.push(this.lineEnds.to);

		// Print line frags
		let lineAllFragCodes = [];
		let lineFragLen = lineFragStarts.length;
		for (let i = 0; i < lineFragLen; i++) {
			let fragDetails = Toolbox.copyValue(this.detailsMisc);
			fragDetails.line = [
				lineFragStarts[i][0], lineFragStarts[i][1],
				lineFragEnds[i][0], lineFragEnds[i][1],
			];

			let fragVars = [];
			for (let k in fragDetails) {
				if (fragDetails[k] === null) { continue; }
				fragVars.push(new BlkVariable(k, fragDetails[k]));
			}

			lineAllFragCodes.push(new BlkBlock("line", fragVars, { useOneLine: true }).getCode());
		}

		return lineAllFragCodes;
	}
}


/** A piece of displayed text */
export class TextSnippet {
	/**
	 * @param {Object} obj
	 * @param {string=} obj.text - (default `""`)
	 * @param {"center"|"left"|"right"|0|1|2=} obj.align - (default `"center"`)
	 * @param {[number, number]} obj.pos
	 * @param {number=} obj.size - (default `1`)
	 * @param {boolean=} obj.move - (default `false`)
	 * @param {boolean=} obj.thousandth - (default `true`)
	 * @param {boolean=} obj.highlight - (default `true`)
	 */
	constructor({
		text = "",
		align = "center",
		pos,
		size = 1,
		move = false,
		thousandth = true,
		highlight = true
	} = {}, extraDrawn = { mirrorX: false, mirrorY: false }) {
		this.details = {
			text,
			align: (align === "center") ? 0 : (align === "left") ? 1 : (align === "right") ? 2 : align,
			pos,
			size,
			highlight,
			move,
			thousandth
		};
		/** On what axes will extra text(s) be generated */
		this.extraDrawn = extraDrawn;
	}

	copy() {
		return (new TextSnippet(Toolbox.copyValue(this.details)));
	}

	move([x, y]) {
		this.details.pos[0] += x
		this.details.pos[1] += y
		return this;
	}

	mirrorX() {
		this.details.pos[0] = -(this.details.pos[0]);
		if (this.details.align === 1) {
			this.details.align = 2;
		} else if (this.details.align === 2) {
			this.details.align = 1;
		}
		return this;
	}

	mirrorY() {
		this.details.pos[1] = -(this.details.pos[1]);
		return this;
	}

	/** Set flag(s) for drawing extra texts */
	withExtra({ mirrorX = null, mirrorY = null }={}) {
		if (mirrorX !== null) {
			this.extraDrawn.mirrorX = mirrorX;
		}
		if (mirrorY !== null) {
			this.extraDrawn.mirrorY = mirrorY;
		}
		return this;
	}

	getCode() {
		let resultCodeLines = [];
		resultCodeLines.push(this._getSelfCode());

		// Add extra drawn code
		if (this.extraDrawn.mirrorX) {
			resultCodeLines.push(this.copy().mirrorX()._getSelfCode());
		}
		if (this.extraDrawn.mirrorY) {
			resultCodeLines.push(this.copy().mirrorY()._getSelfCode());
		}
		if (this.extraDrawn.mirrorX && this.extraDrawn.mirrorY) {
			resultCodeLines.push(this.copy().mirrorX().mirrorY()._getSelfCode());
		}

		return resultCodeLines.join(SETTINGS.LINE_ENDING);
	}


	/**
	 * Returns the code for drawing a text
	 */
	_getSelfCode() {
		let subVars = [];
		for (let k in this.details) {
			let type = (k === "align") ? "i" : null;
			subVars.push(new BlkVariable(k, this.details[k], type));
		}
		return (new BlkBlock("text", subVars, { useOneLine: true }).getCode());
	}
}
