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

import Toolbox from "./sight_toolbox.js";
import {
	SETTINGS,
	BlkVariable,
	BlkBlock
} from "./sight_code_basis.js";


export default {
	description: "Fundamental elements of a user sight"
};


/** A circle element */
export class Circle {
	static extraSegHori = { mirrorSegmentX: true, mirrorSegmentY: false };
	static extraSegVert = { mirrorSegmentX: false, mirrorSegmentY: true };
	static extraSegFourQuad = { mirrorSegmentX: true, mirrorSegmentY: true };

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
		this.extraDrawn = Toolbox.copyValue(extraDrawn);
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
		let newSeg = [
			Circle.p_degLimited(-(this.details.segment[1])),
			Circle.p_degLimited(-(this.details.segment[0])),
		];
		this.details.segment[0] = newSeg[0];
		this.details.segment[1] = newSeg[1];
		return this;
	}

	mirrorSegmentY() {
		let newSeg = [
			Circle.p_degLimited(180 - this.details.segment[1]),
			Circle.p_degLimited(180 - this.details.segment[0]),
		];
		this.details.segment[0] = newSeg[0];
		this.details.segment[1] = newSeg[1];
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
	withExtra({ mirrorSegmentX = null, mirrorSegmentY = null } = {}) {
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
		resultCodeLines.push(this.p_getSelfCode());

		// Add extra drawn code
		if (this.extraDrawn.mirrorSegmentX) {
			resultCodeLines.push(this.copy().mirrorSegmentX().p_getSelfCode());
		}
		if (this.extraDrawn.mirrorSegmentY) {
			resultCodeLines.push(this.copy().mirrorSegmentY().p_getSelfCode());
		}
		if (this.extraDrawn.mirrorSegmentX && this.extraDrawn.mirrorSegmentY) {
			resultCodeLines.push(this.copy().mirrorSegmentX().mirrorSegmentY().p_getSelfCode());
		}

		return resultCodeLines.join(SETTINGS.LINE_ENDING);
	}

	/**
	 * Returns the text for drawing the circle without extra segments
	 */
	p_getSelfCode() {
		let subVars = [];
		for (let k in this.details) {
			subVars.push(new BlkVariable(k, this.details[k]));
		}
		return (new BlkBlock("circle", subVars, { useOneLine: true }).getCode());
	}

	/** Limits a degree into +-360 (including two ends) */
	static p_degLimited(deg) {
		if (deg >= -360 && deg <= 360) { return deg; }
		if (deg % 360 === 0) { return (deg > 0) ? 360 : -360; }
		return (deg % 360);
	}
}


/** A line element */
export class Line {
	static extraHori = { mirrorX: true, mirrorY: false };
	static extraVert = { mirrorX: false, mirrorY: true };
	static extraFourQuad = { mirrorX: true, mirrorY: true };

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
	} = {}, lineBreakPoints = [], extraDrawn = { mirrorX: false, mirrorY: false }) {
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
		this.extraDrawn = Toolbox.copyValue(extraDrawn);
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
	withExtra({ mirrorX = null, mirrorY = null } = {}) {
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
		resultCodeLines = resultCodeLines.concat(this.p_getSelfCodeFrags());

		// Add extra drawn code
		if (this.extraDrawn.mirrorX) {
			resultCodeLines = resultCodeLines.concat(this.copy().mirrorX().p_getSelfCodeFrags());
		}
		if (this.extraDrawn.mirrorY) {
			resultCodeLines = resultCodeLines.concat(this.copy().mirrorY().p_getSelfCodeFrags());
		}
		if (this.extraDrawn.mirrorX && this.extraDrawn.mirrorY) {
			resultCodeLines = resultCodeLines.concat(this.copy().mirrorX().mirrorY().p_getSelfCodeFrags());
		}

		return resultCodeLines.join(SETTINGS.LINE_ENDING);
	}


	/**
	 * Get code for all line frags into an array without extras
	 * @returns {string[]}
	 */
	p_getSelfCodeFrags() {
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
	static extraHori = { mirrorX: true, mirrorY: false };
	static extraVert = { mirrorX: false, mirrorY: true };
	static extraFourQuad = { mirrorX: true, mirrorY: true };

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
		this.extraDrawn = Toolbox.copyValue(extraDrawn);
	}

	copy() {
		return (new TextSnippet(Toolbox.copyValue(this.details)));
	}

	move([x, y]) {
		this.details.pos[0] += x;
		this.details.pos[1] += y;
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
	withExtra({ mirrorX = null, mirrorY = null } = {}) {
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
		resultCodeLines.push(this.p_getSelfCode());

		// Add extra drawn code
		if (this.extraDrawn.mirrorX) {
			resultCodeLines.push(this.copy().mirrorX().p_getSelfCode());
		}
		if (this.extraDrawn.mirrorY) {
			resultCodeLines.push(this.copy().mirrorY().p_getSelfCode());
		}
		if (this.extraDrawn.mirrorX && this.extraDrawn.mirrorY) {
			resultCodeLines.push(this.copy().mirrorX().mirrorY().p_getSelfCode());
		}

		return resultCodeLines.join(SETTINGS.LINE_ENDING);
	}


	/**
	 * Returns the code for drawing a text
	 */
	p_getSelfCode() {
		let subVars = [];
		for (let k in this.details) {
			let type = (k === "align") ? "i" : null;
			subVars.push(new BlkVariable(k, this.details[k], type));
		}
		return (new BlkBlock("text", subVars, { useOneLine: true }).getCode());
	}
}


/** A quadrangle */
export class Quad {
	/** Findable keyname in compiled sight file */
	static p_realKey = {
		topLeft: "tl", topRight: "tr", bottomLeft: "bl", bottomRight: "br"
	};

	static extraHori = { mirrorX: true, mirrorY: false };
	static extraVert = { mirrorX: false, mirrorY: true };
	static extraFourQuad = { mirrorX: true, mirrorY: true };


	/**
	 * ONE of following value combinations are required for creating a quad:
	 *
	 * 1. Arbitrary quad: four corners
	 *   - `{ topLeft, topRight, bottomLeft, bottomRight }`

	 * 2. Parallelogram, with 2 opposite sides on a axis direction:
	 *   1. two corners on one side + x/y width
	 *     - `{ topLeft, topRight, yWidth }`
	 *     - `{ bottomLeft, bottomRight, yWidth }`
	 *     - `{ topLeft, bottomLeft, xWidth }`
	 *     - `{ topRight, bottomRight, xWidth }`
	 *
	 *   2. two side centers of opposite sides + x/y width
	 *     - `{ topCenter, bottomCenter, xWidth }`
	 *     - `{ leftCenter, rightCenter, yWidth }`
	 *
	 * 3. Rectangle
	 *   1. one corner + x & y width
	 *     - `{ topLeft, xWidth, yWidth }`
	 *     - `{ topRight, xWidth, yWidth }`
	 *     - `{ bottomLeft, xWidth, yWidth }`
	 *     - `{ bottomRight, xWidth, yWidth }`
	 *
	 *   2. one side center + x & y width
	 *     - `{ topCenter, xWidth, yWidth }`
	 *     - `{ bottomCenter, xWidth, yWidth }`
	 *     - `{ leftCenter, xWidth, yWidth }`
	 *     - `{ rightCenter, xWidth, yWidth }`
	 *
	 *   3. rect center + x & y width
	 *     - `{ center, xWidth, yWidth }`
	 *
	 *
	 * @param {Object} info
	 * @param {[number, number]=} info.topLeft
	 * @param {[number, number]=} info.topRight
	 * @param {[number, number]=} info.bottomLeft
	 * @param {[number, number]=} info.bottomRight
	 * @param {[number, number]=} info.center
	 * @param {[number, number]=} info.topCenter
	 * @param {[number, number]=} info.leftCenter
	 * @param {[number, number]=} info.bottomCenter
	 * @param {[number, number]=} info.rightCenter
	 * @param {number=} info.xWidth - width on X direction
	 * @param {number=} info.yWidth - width on Y direction
	 * @param {boolean=} info.thousandth - (default `true`)
	 */
	constructor(
		info,
		extraDrawn = { mirrorX: false, mirrorY: false }
	) {
		// Extract 4 corner coordinates
		let corner = {
			topLeft: null, topRight: null, bottomLeft: null, bottomRight: null
		};
		// Arbitrary quad: four corners
		if (Quad.p_hasAllProps(["topLeft", "topRight", "bottomLeft", "bottomRight"], info)) {
			corner.topLeft = info.topLeft;
			corner.topRight = info.topRight;
			corner.bottomLeft = info.bottomLeft;
			corner.bottomRight = info.bottomRight;

		// Parallelogram, with 2 opposite sides on a axis direction:
		// two corners on one side + x/y width
		} else if (Quad.p_hasAllProps(["topLeft", "topRight", "yWidth"], info)) {
			corner.topLeft = info.topLeft;
			corner.topRight = info.topRight;
			corner.bottomLeft = [info.topLeft[0], info.topLeft[1] + info.yWidth];
			corner.bottomRight = [info.bottomRight[0], info.bottomRight[1] + info.yWidth];
		} else if (Quad.p_hasAllProps(["bottomLeft", "bottomRight", "yWidth"], info)) {
			corner.topLeft = [info.bottomLeft[0], info.bottomLeft[1] - info.yWidth];
			corner.topRight = [info.bottomRight[0], info.bottomRight[1] - info.yWidth];
			corner.bottomLeft = info.bottomLeft;
			corner.bottomRight = info.bottomRight;
		} else if (Quad.p_hasAllProps(["topLeft", "bottomLeft", "xWidth"], info)) {
			corner.topLeft = info.topLeft;
			corner.topRight = [info.topLeft[0] + info.xWidth, info.topLeft[1]];
			corner.bottomLeft = info.bottomLeft;
			corner.bottomRight = [info.bottomLeft[0] + info.xWidth, info.bottomLeft[1]];
		} else if (Quad.p_hasAllProps(["topRight", "bottomRight", "xWidth"], info)) {
			corner.topLeft = [info.topRight[0] - info.xWidth, info.topRight[1]];
			corner.topRight = info.topRight;
			corner.bottomLeft = [info.bottomRight[0] - info.xWidth, info.bottomRight[1]];
			corner.bottomRight = info.bottomRight;

		// two side centers of opposite sides + x/y width
		} else if (Quad.p_hasAllProps(["topCenter", "bottomCenter", "xWidth"], info)) {
			corner.topLeft = [info.topCenter[0] - info.xWidth/2, info.topCenter[1]];
			corner.topRight = [info.topCenter[0] + info.xWidth/2, info.topCenter[1]];
			corner.bottomLeft = [info.bottomCenter[0] - info.xWidth/2, info.bottomCenter[1]];
			corner.bottomRight = [info.bottomCenter[0] + info.xWidth/2, info.bottomCenter[1]];
		} else if (Quad.p_hasAllProps(["leftCenter", "rightCenter", "yWidth"], info)) {
			corner.topLeft = [info.leftCenter[0], info.leftCenter[1] - info.yWidth/2];
			corner.topRight = [info.rightCenter[0], info.rightCenter[1] - info.yWidth/2];
			corner.bottomLeft = [info.leftCenter[0], info.leftCenter[1] + info.yWidth/2];
			corner.bottomRight = [info.rightCenter[0], info.rightCenter[1] + info.yWidth/2];

		// Rectangle
		// one corner + x & y width
		} else if (Quad.p_hasAllProps(["topLeft", "xWidth", "yWidth"], info)) {
			corner.topLeft = info.topLeft;
			corner.topRight = [info.topLeft[0] + info.xWidth, info.topLeft[1]];
			corner.bottomLeft = [info.topLeft[0], info.topLeft[1] + info.yWidth];
			corner.bottomRight = [info.topLeft[0] + info.xWidth, info.topLeft[1] + info.yWidth];
		} else if (Quad.p_hasAllProps(["topRight", "xWidth", "yWidth"], info)) {
			corner.topLeft = [info.topRight[0] - info.xWidth, info.topRight[1]];
			corner.topRight = info.topRight;
			corner.bottomLeft = [info.topRight[0], info.topRight[1] + info.yWidth];
			corner.bottomRight = [info.topRight[0] - info.xWidth, info.topRight[1] + info.yWidth];
		} else if (Quad.p_hasAllProps(["bottomLeft", "xWidth", "yWidth"], info)) {
			corner.topLeft = [info.bottomLeft[0], info.bottomLeft[1] - info.yWidth];
			corner.topRight = [info.bottomLeft[0] + info.xWidth, info.bottomLeft[1] - info.yWidth];
			corner.bottomLeft = info.bottomLeft;
			corner.bottomRight = [info.bottomLeft[0] + info.xWidth, info.bottomLeft[1]];
		} else if (Quad.p_hasAllProps(["bottomRight", "xWidth", "yWidth"], info)) {
			corner.topLeft = [info.bottomRight[0] - info.xWidth, info.bottomRight[1] - info.yWidth];
			corner.topRight = [info.bottomRight[0], info.bottomRight[1] - info.yWidth];
			corner.bottomLeft = [info.bottomRight[0] - info.xWidth, info.bottomRight[1]];
			corner.bottomRight = info.bottomRight;

		// one side center + x & y width
		} else if (Quad.p_hasAllProps(["topCenter", "xWidth", "yWidth"], info)) {
			corner.topLeft = [info.topCenter[0] - info.xWidth/2, info.topCenter[1]];
			corner.topRight = [info.topCenter[0] + info.xWidth/2, info.topCenter[1]];
			corner.bottomLeft = [info.topCenter[0] - info.xWidth/2, info.topCenter[1] + info.yWidth];
			corner.bottomRight = [info.topCenter[0] + info.xWidth/2, info.topCenter[1] + info.yWidth];
		} else if (Quad.p_hasAllProps(["bottomCenter", "xWidth", "yWidth"], info)) {
			corner.topLeft = [info.bottomCenter[0] - info.xWidth/2, info.bottomCenter[1] - info.yWidth];
			corner.topRight = [info.bottomCenter[0] + info.xWidth/2, info.bottomCenter[1] - info.yWidth];
			corner.bottomLeft = [info.bottomCenter[0] - info.xWidth/2, info.bottomCenter[1]];
			corner.bottomRight = [info.bottomCenter[0] + info.xWidth/2, info.bottomCenter[1]];
		} else if (Quad.p_hasAllProps(["leftCenter", "xWidth", "yWidth"], info)) {
			corner.topLeft = [info.leftCenter[0], info.leftCenter[1] - info.yWidth/2];
			corner.topRight = [info.leftCenter[0] + info.xWidth, info.leftCenter[1] - info.yWidth/2];
			corner.bottomLeft = [info.leftCenter[0], info.leftCenter[1] + info.yWidth/2];
			corner.bottomRight = [info.leftCenter[0] + info.xWidth, info.leftCenter[1] + info.yWidth/2];
		} else if (Quad.p_hasAllProps(["rightCenter", "xWidth", "yWidth"], info)) {
			corner.topLeft = [info.rightCenter[0] - info.xWidth, info.rightCenter[1] - info.yWidth/2];
			corner.topRight = [info.rightCenter[0], info.rightCenter[1] - info.yWidth/2];
			corner.bottomLeft = [info.rightCenter[0] - info.xWidth, info.rightCenter[1] + info.yWidth/2];
			corner.bottomRight = [info.rightCenter[0], info.rightCenter[1] + info.yWidth/2];

		// rect center + x & y width
		} else if (Quad.p_hasAllProps(["center", "xWidth", "yWidth"], info)) {
			corner.topLeft = [info.center[0] - info.xWidth/2, info.center[1] - info.yWidth/2];
			corner.topRight = [info.center[0] + info.xWidth/2, info.center[1] - info.yWidth/2];
			corner.bottomLeft = [info.center[0] - info.xWidth/2, info.center[1] + info.yWidth/2];
			corner.bottomRight = [info.center[0] + info.xWidth/2, info.center[1] + info.yWidth/2];
		}

		/** @type {{topLeft: [number, number]|null, topRight: [number, number]|null, bottomLeft: [number, number]|null, bottomRight: [number, number]|null,}} */
		this.corner = Toolbox.copyValue(corner);
		this.detailsMisc = {
			thousandth:
				info.hasOwnProperty("thousandth") ?
					info.thousandth : true,
		};
		/** @type {{mirrorX: boolean, mirrorY: boolean}} */
		this.extraDrawn = Toolbox.copyValue(extraDrawn);
	}

	copy() {
		return (new Quad(
			{...Toolbox.copyValue(this.corner), ...Toolbox.copyValue(this.detailsMisc)},
			Toolbox.copyValue(this.extraDrawn)
		));
	}

	move([x, y]) {
		for (let k in this.corner) {
			let pos = this.corner[k];
			if (pos) { pos[0] += x; pos[1] += y }
		}
		return this;
	}

	mirrorX() {
		let newCorner = {
			topLeft: [-this.corner.topRight[0], this.corner.topRight[1]],
			topRight: [-this.corner.topLeft[0], this.corner.topLeft[1]],
			bottomLeft: [-this.corner.bottomRight[0], this.corner.bottomRight[1]],
			bottomRight: [-this.corner.bottomLeft[0], this.corner.bottomLeft[1]],
		}

		for (let k in newCorner) {
			this.corner[k][0] = newCorner[k][0];
			this.corner[k][1] = newCorner[k][1];
		}
		return this;
	}

	mirrorY() {
		let newCorner = {
			topLeft: [this.corner.bottomLeft[0], -this.corner.bottomLeft[1]],
			topRight: [this.corner.bottomRight[0], -this.corner.bottomRight[1]],
			bottomLeft: [this.corner.topLeft[0], -this.corner.topLeft[1]],
			bottomRight: [this.corner.topRight[0], -this.corner.topRight[1]],
		}

		for (let k in newCorner) {
			this.corner[k][0] = newCorner[k][0];
			this.corner[k][1] = newCorner[k][1];
		}
		return this;
	}

	/** Set flag(s) for drawing extra texts */
	withExtra({ mirrorX = null, mirrorY = null } = {}) {
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
		resultCodeLines.push(this.p_getSelfCode());

		// Add extra drawn code
		if (this.extraDrawn.mirrorX) {
			resultCodeLines.push(this.copy().mirrorX().p_getSelfCode());
		}
		if (this.extraDrawn.mirrorY) {
			resultCodeLines.push(this.copy().mirrorY().p_getSelfCode());
		}
		if (this.extraDrawn.mirrorX && this.extraDrawn.mirrorY) {
			resultCodeLines.push(this.copy().mirrorX().mirrorY().p_getSelfCode());
		}

		return resultCodeLines.join(SETTINGS.LINE_ENDING);
	}


	/**
	 * Returns the code for drawing a text
	 */
	p_getSelfCode() {
		let subVars = [];
		for(let ck in this.corner) {
			subVars.push(new BlkVariable(
				Quad.p_realKey[ck],
				this.corner[ck]
			))
		}

		for (let k in this.detailsMisc) {
			subVars.push(new BlkVariable(k, this.detailsMisc[k]));
		}
		return (new BlkBlock("quad", subVars, { useOneLine: true }).getCode());
	}

	/**
	 * @param {string[]} properties
	 * @param {Object} checkedObj
	 */
	static p_hasAllProps(properties, checkedObj) {
		for (let p of properties) {
			if (!checkedObj.hasOwnProperty(p)) { return false; }
		}
		return true;
	}
}