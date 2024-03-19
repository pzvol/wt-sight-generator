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

import { SETTINGS, BlkVariable, BlkBlock } from "../sight_code_basis.js";
import DefTool from "./_element_def_tools.js";


export default class Line {
	/**
	 * @param {Object} defObj
	 * @param {[number, number]} defObj.from
	 * @param {[number, number]} defObj.to
	 * @param {boolean=} defObj.move - (default `false`) if move with gun zero changes
	 * @param {boolean=} defObj.thousandth - (default `true`) if use thousandth
	 *
	 * @param {boolean=} defObj.moveRadial - if radial move
	 * @param {[number, number]=} defObj.radialCenter - radial move center position `[x, y]`
	 * @param {number=} defObj.radialMoveSpeed
	 * @param {number=} defObj.radialAngle
	 *
	 * @param {{from: [number, number], to: [number, number]}[]} lineBreaks
	 * @param {{mirrorX: boolean, mirrorY: boolean}} extraDrawn
	 */
	constructor({
		from, to,
		move = false, thousandth = true,
		moveRadial, radialCenter, radialMoveSpeed, radialAngle
	} = {}, lineBreaks = [], extraDrawn = { mirrorX: false, mirrorY: false }) {
		if (from[0] === to[0] && from[1] === to[1]) {
			// TODO: smoother handling
			throw new Error("ERROR: line has same from & to position");
		}

		/**
		 * Two endpoints of the line
		 * @type {{from: [number, number], to: [number, number]}}
		 */
		this.lineEnds = DefTool.copyValue({ from, to });

		/**
		 * Line specification parameters which will be output directly
		 */
		this.specMisc = DefTool.copyValue({
			move, thousandth,
			moveRadial, radialCenter, radialMoveSpeed, radialAngle
		});

		/**
		 * Line breaks between two endpoints
		 * @type {{from: [number, number], to: [number, number]}[]}
		 */
		this.lineBreaks = DefTool.copyValue(lineBreaks);

		/**
		 * On what axes will extra element(s) be generated when print code
		 * @type {{mirrorX: boolean, mirrorY: boolean}}
		 */
		this.extraDrawn = DefTool.copyValue(extraDrawn);

		/** Info for various calculation */
		this.lineCalcInfo = Line.p_getLineCalcInfo(this.lineEnds);
	}


	//// GETTERS ////

	/** @returns {{from: [number, number], to: [number, number]}} */
	getLineEnds() { return DefTool.copyValue(this.lineEnds); }

	/** @returns {boolean} */
	getMovable() { return this.specMisc.move; }

	/** @returns {boolean} */
	getUseThousandthUnit() { return this.specMisc.thousandth; }

	hasLineBreak() { return (this.lineBreaks.length > 0); }


	//// GENERAL METHODS ////

	/**
	 * Makes the element static or moves with user's distance control
	 * @param {boolean} isMovable
	 */
	setMovable(isMovable) {
		this.specMisc.move = isMovable;
		return this;
	}

	/**
	 * Decides if the element uses thousandth as its unit of positions
	 * @param {boolean} useThousandth
	 */
	setUseThousandthUnit(useThousandth) {
		this.specMisc.thousandth = useThousandth;
		return this;
	}

	/**
	 * Update one or both ends of the line
	 *
	 * **BE AWARE:** This method will prevent change(s) if ANY line break has
	 * been applied, and `forceChange` is not enabled. Line breaks, if
	 * exists, will NOT be updated by this method.
	 *
	 * @param {Object} newEndpointParam
	 * @param {[number, number]|null} newEndpointParam.from - new start point
	 * @param {[number, number]|null} newEndpointParam.to - new end point
	 * @param {boolean} forceChange - (default `false`) if ignores line break limitation and force
	 * applying the change
	 */
	setLineEnds({ from = null, to = null } = {}, forceChange = false) {
		if (!from && !to) { return this; }
		if (this.lineBreaks.length > 0 && !forceChange) {
			throw new Error("ERROR: 'setLineEnds' called after adding line break(s)");
		}
		if (from) {
			this.lineEnds.from[0] = from[0];
			this.lineEnds.from[1] = from[1];
		}
		if (to) {
			this.lineEnds.to[0] = to[0];
			this.lineEnds.to[1] = to[1];
		}
		// Update calculation info
		this.lineCalcInfo = Line.p_getLineCalcInfo(this.lineEnds);
		return this;
	}

	/**
	 * Moves the element relatively
	 * @param {[number, number]} moveDist
	 */
	move([x, y]) {
		this.lineEnds.from[0] += x;
		this.lineEnds.from[1] += y;
		this.lineEnds.to[0] += x;
		this.lineEnds.to[1] += y;
		for (let b of this.lineBreaks) {
			b.from[0] += x;
			b.from[1] += y;
			b.to[0] += x;
			b.to[1] += y;
		}
		if (this.specMisc.hasOwnProperty("radialCenter")) {
			this.specMisc.radialCenter[0] += x;
			this.specMisc.radialCenter[1] += y;
		}
		return this;
	}

	/** Copies to a new element */
	copy() {
		return (new Line(
			{
				from: this.lineEnds.from,
				to: this.lineEnds.to,
				move: this.specMisc.move,
				thousandth: this.specMisc.thousandth,

				moveRadial: DefTool.getPropertyOrUndefined(this.specMisc, "moveRadial"),
				radialCenter: DefTool.getPropertyOrUndefined(this.specMisc, "radialCenter"),
				radialMoveSpeed: DefTool.getPropertyOrUndefined(this.specMisc, "radialMoveSpeed"),
				radialAngle: DefTool.getPropertyOrUndefined(this.specMisc, "radialAngle"),
			},
			this.lineBreaks,
			this.extraDrawn
		));
	}


	//// ELEMENT-SPECIFIC METHODS ////

	mirrorX() {
		this.lineEnds.from[0] = -(this.lineEnds.from[0]);
		this.lineEnds.to[0] = -(this.lineEnds.to[0]);
		this.lineCalcInfo.endDiffs.x = -(this.lineCalcInfo.endDiffs.x);
		this.lineCalcInfo.direction.cos = -(this.lineCalcInfo.direction.cos);
		for (let b of this.lineBreaks) {
			b.from[0] = -(b.from[0]);
			b.to[0] = -(b.to[0]);
		}
		// Deal with radial values
		if (this.specMisc.hasOwnProperty("radialCenter")) {
			this.specMisc.radialCenter[0] = -(this.specMisc.radialCenter[0]);
		}
		if (this.specMisc.hasOwnProperty("radialMoveSpeed")) {
			this.specMisc.radialMoveSpeed = -(this.specMisc.radialMoveSpeed);
		}
		if (this.specMisc.hasOwnProperty("radialAngle")) {
			this.specMisc.radialAngle = -(this.specMisc.radialAngle);
		}
		return this;
	}

	mirrorY() {
		this.lineEnds.from[1] = -(this.lineEnds.from[1]);
		this.lineEnds.to[1] = -(this.lineEnds.to[1]);
		this.lineCalcInfo.endDiffs.y = -(this.lineCalcInfo.endDiffs.y);
		this.lineCalcInfo.direction.sin = -(this.lineCalcInfo.direction.sin);
		for (let b of this.lineBreaks) {
			b.from[1] = -(b.from[1]);
			b.to[1] = -(b.to[1]);
		}
		// Deal with radial values
		if (this.specMisc.hasOwnProperty("radialCenter")) {
			this.specMisc.radialCenter[1] = -(this.specMisc.radialCenter[1]);
		}
		if (this.specMisc.hasOwnProperty("radialMoveSpeed")) {
			this.specMisc.radialMoveSpeed = -(this.specMisc.radialMoveSpeed);
		}
		if (this.specMisc.hasOwnProperty("radialAngle")) {
			this.specMisc.radialAngle = -(this.specMisc.radialAngle);
		}
		return this;
	}

	/**
	 * Additionally draws extra mirrored element(s) when output code
	 * @param {""|"x"|"y"|"xy"|null} mirrorStr - a string specifying mirroring type.
	 *        Empty `""` to unset any mirroring, and `null` for making no change
	 */
	withMirrored(mirrorStr = null) {
		if (mirrorStr === "") { this.p_withExtraDrawn({ mirrorX: false, mirrorY: false }); }
		else if (mirrorStr === "x") { this.p_withExtraDrawn({ mirrorX: true, mirrorY: false }); }
		else if (mirrorStr === "y") { this.p_withExtraDrawn({ mirrorX: false, mirrorY: true }); }
		else if (mirrorStr === "xy") { this.p_withExtraDrawn({ mirrorX: true, mirrorY: true }); }
		return this;
	}


	/**
	 * Adds a line break on X. Note that break widths should never overlap.
	 * TODO: Detect overlap and merge breaks
	 * @param {number} x
	 * @param {number} width
	 */
	addBreakAtX(x, width, showWarn = false) {
		if (width === 0) { return this; }
		if (this.lineCalcInfo.endDiffs.x === 0) {
			if (showWarn) { console.warn(`WARN: Line.addBreakAtX - vert line, break at x=${x} ignored`); }
			return this;
		}

		// y of new break center on the line's direction
		let y =
			((x - this.lineEnds.from[0]) / this.lineCalcInfo.endDiffs.x * this.lineCalcInfo.endDiffs.y) +
			this.lineEnds.from[1];
		// find break two ends
		let lineBreak = {
			from: [
				x - (width / 2 * this.lineCalcInfo.direction.cos),
				y - (width / 2 * this.lineCalcInfo.direction.sin),
			],
			to: [
				x + (width / 2 * this.lineCalcInfo.direction.cos),
				y + (width / 2 * this.lineCalcInfo.direction.sin),
			],
		};

		// Break two ends both outside the line - ignore
		if (
			!DefTool.valueInRange(lineBreak.from[0], [this.lineEnds.from[0], this.lineEnds.to[0]]) &&
			!DefTool.valueInRange(lineBreak.to[0], [this.lineEnds.from[0], this.lineEnds.to[0]])
		) {
			if (showWarn) { console.warn(`WARN: Line.addBreakAtX - x=${x}, width=${width} is not in line range, break ignored`); }
			return this;
		}
		// Break start is outside the line - new line start
		if (!DefTool.valueInRange(lineBreak.from[0], [this.lineEnds.from[0], this.lineEnds.to[0]])) {
			this.setLineEnds({ from: lineBreak.to }, true);
			return this;
		}
		// Break end is outside the line - new line end
		if (!DefTool.valueInRange(lineBreak.to[0], [this.lineEnds.from[0], this.lineEnds.to[0]])) {
			this.setLineEnds({ to: lineBreak.from }, true);
			return this;
		}
		// Break totally inside the line
		this.lineBreaks.push(lineBreak);
		return this;
	}

	/**
	 * Adds a line break on Y. Note that break widths should never overlap.
	 * TODO: Detect break overlap and merge breaks
	 * @param {number} y
	 * @param {number} width
	 */
	addBreakAtY(y, width, showWarn = false) {
		if (width === 0) { return this; }
		if (this.lineCalcInfo.endDiffs.y === 0) {
			if (showWarn) { console.warn(`WARN: Line.addBreakAtY - hori line, break at y=${y} ignored`); }
			return this;
		}
		// x of new break center on the line's direction
		let x =
			((y - this.lineEnds.from[1]) / this.lineCalcInfo.endDiffs.y * this.lineCalcInfo.endDiffs.x) +
			this.lineEnds.from[0];
		// find break two ends
		let lineBreak = {
			from: [
				x - (width / 2 * this.lineCalcInfo.direction.cos),
				y - (width / 2 * this.lineCalcInfo.direction.sin),
			],
			to: [
				x + (width / 2 * this.lineCalcInfo.direction.cos),
				y + (width / 2 * this.lineCalcInfo.direction.sin),
			],
		};

		// Break two ends both outside the line - ignore
		if (
			!DefTool.valueInRange(lineBreak.from[1], [this.lineEnds.from[1], this.lineEnds.to[1]]) &&
			!DefTool.valueInRange(lineBreak.to[1], [this.lineEnds.from[1], this.lineEnds.to[1]])
		) {
			if (showWarn) { console.warn(`WARN: Line.addBreakAtY - y=${y}, width=${width} is not in line range, break ignored`); }
			return this;
		}
		// Break start is outside the line - new line start
		if (!DefTool.valueInRange(lineBreak.from[1], [this.lineEnds.from[1], this.lineEnds.to[1]])) {
			this.setLineEnds({ from: lineBreak.to }, true);
			return this;
		}
		// Break end is outside the line - new line end
		if (!DefTool.valueInRange(lineBreak.to[1], [this.lineEnds.from[1], this.lineEnds.to[1]])) {
			this.setLineEnds({ to: lineBreak.from }, true);
			return this;
		}
		// Break totally inside the line
		this.lineBreaks.push(lineBreak);
		return this;
	}


	//// OUTPUT METHOD ////
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


	//// PRIVATE METHODS ////

	/** Set extra drawn element settings */
	p_withExtraDrawn({ mirrorX = null, mirrorY = null } = {}) {
		if (mirrorX !== null) {
			this.extraDrawn.mirrorX = mirrorX;
		}
		if (mirrorY !== null) {
			this.extraDrawn.mirrorY = mirrorY;
		}
		return this;
	}

	/** Sort line breaks */
	p_sortLineBreaks() {
		// (Same start & end will potentially cause error - it's not allowed anyway)
		if (this.lineCalcInfo.endDiffs.x !== 0) {
			if (this.lineCalcInfo.endDiffs.x > 0) {
				this.lineBreaks.sort((a, b) => (a.from[0] - b.from[0]));
			} else {
				this.lineBreaks.sort((a, b) => -(a.from[0] - b.from[0]));
			}
		} else {
			if (this.lineCalcInfo.endDiffs.y > 0) {
				this.lineBreaks.sort((a, b) => (a.from[1] - b.from[1]));
			} else {
				this.lineBreaks.sort((a, b) => -(a.from[1] - b.from[1]));
			}
		}
		return this;
	}

	/**
	 * Get code for all line frags into an array without extra drawn ones
	 * @returns {string[]}
	 */
	p_getSelfCodeFrags() {
		// Sort breakpoints.
		this.p_sortLineBreaks();

		// Find all line frags
		let lineFragStarts = [this.lineEnds.from];
		let lineFragEnds = [];  // whole line ending will be added later
		for (let b of this.lineBreaks) {
			lineFragEnds.push(b.from);
			lineFragStarts.push(b.to);
		}
		lineFragEnds.push(this.lineEnds.to);  // adds whole line ending

		// Print line frags
		let lineAllFragCodes = [];
		let lineFragLen = lineFragStarts.length;
		for (let i = 0; i < lineFragLen; i++) {
			let fragDetails = DefTool.copyValue(this.specMisc);
			// Adds variable for line ends (namely "line")
			fragDetails.line = [
				lineFragStarts[i][0], lineFragStarts[i][1],
				lineFragEnds[i][0], lineFragEnds[i][1],
			];
			// Compile variables used in blk
			let fragVars = [];
			for (let k in fragDetails) {
				if (fragDetails[k] === null) { continue; }
				fragVars.push(new BlkVariable(k, fragDetails[k]));
			}

			lineAllFragCodes.push(new BlkBlock("line", fragVars, { useOneLine: true }).getCode());
		}

		return lineAllFragCodes;
	}

	/** Get various info for calculation on a specific line */
	static p_getLineCalcInfo(lineEnds) {
		let endDiffs = {
			x: (lineEnds.to[0] - lineEnds.from[0]),
			y: (lineEnds.to[1] - lineEnds.from[1])
		};
		let endDistance = Math.sqrt(
			Math.pow(endDiffs.x, 2) + Math.pow(endDiffs.y, 2)
		);
		let direction = {
			sin: endDiffs.y / endDistance,
			cos: endDiffs.x / endDistance,
		}
		return {
			/** Difference of x/y values ("to" - "from") */
			endDiffs,
			/** Distance between two ends */
			endDistance,
			/** Line(vector) direction */
			direction,
		}
	}
}