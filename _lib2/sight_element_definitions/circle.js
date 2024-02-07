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


export default class Circle {
	/**
	 * @param {Object} defObj
	 * @param {[number, number]=} defObj.segment - (default `[0,360]`) start/end degree of curve
	 * @param {[number, number]=} defObj.pos - (default `[0, 0]`) center position
	 * @param {number=} defObj.diameter - (default `1`) circle diameter
	 * @param {number=} defObj.size - (default `1`) line width
	 * @param {boolean=} defObj.move - (default `false`) if move with gun zero changes
	 * @param {boolean=} defObj.thousandth - (default `true`) if use thousandth

	 * @param {boolean=} defObj.moveRadial - if radial move
	 * @param {[number, number]=} defObj.radialCenter - radial move center position `[x, y]`
	 * @param {number=} defObj.radialMoveSpeed
	 * @param {number=} defObj.radialAngle
	 *
	 * @param {{mirrorSegmentX: boolean, mirrorSegmentY: boolean}} extraDrawn
	 */
	constructor({
		segment = [0, 360],
		pos = [0, 0],
		diameter = 1,
		size = 1,
		move = false,
		thousandth = true,
		moveRadial, radialCenter, radialMoveSpeed, radialAngle
	} = {}, extraDrawn = { mirrorSegmentX: false, mirrorSegmentY: false }) {
		/**
		 * Circle specification parameters which will be output directly
		 */
		this.spec = DefTool.copyValue({
			segment, pos, diameter, size, move, thousandth,
			moveRadial, radialCenter, radialMoveSpeed, radialAngle
		});

		/**
		 * On what axes will extra element(s) be generated when print code
		 * @type {{mirrorSegmentX: boolean, mirrorSegmentY: boolean}}
		 */
		this.extraDrawn = DefTool.copyValue(extraDrawn);
	}


	//// GENERAL METHODS ////

	/**
	 * Makes the element static or moves with user's distance control
	 * @param {boolean} isMovable
	 */
	setMovable(isMovable) {
		this.spec.move = isMovable;
		return this;
	}

	/**
	 * Decides if the element uses thousandth as its unit of positions
	 * @param {boolean} useThousandth
	 */
	setUseThousandthUnit(useThousandth) {
		this.spec.thousandth = useThousandth;
		return this;
	}

	/**
	 * Moves the element relatively
	 * @param {[number, number]} moveDist
	 */
	move([x, y]) {
		this.spec.pos[0] += x;
		this.spec.pos[1] += y;
		return this;
	}

	/** Copies to a new element */
	copy() {
		return (new Circle(this.spec, this.extraDrawn));
	}


	//// ELEMENT-SPECIFIC METHODS ////

	mirrorSegmentX() {
		// TODO: modify radial values?
		let newSeg = [
			Circle.p_degLimited(-(this.spec.segment[1])),
			Circle.p_degLimited(-(this.spec.segment[0])),
		];
		this.spec.segment[0] = newSeg[0];
		this.spec.segment[1] = newSeg[1];
		return this;
	}

	mirrorSegmentY() {
		// TODO: modify radial values?
		let newSeg = [
			Circle.p_degLimited(180 - this.spec.segment[1]),
			Circle.p_degLimited(180 - this.spec.segment[0]),
		];
		this.spec.segment[0] = newSeg[0];
		this.spec.segment[1] = newSeg[1];
		return this;
	}

	/**
	 * Additionally draws extra mirrored curves when output code
	 * @param {""|"x"|"y"|"xy"|null} mirrorStr - a string specifying mirroring type.
	 *        Empty `""` to unset any mirroring and `null` for making no change
	 */
	withMirroredSeg(mirrorStr = null) {
		if (mirrorStr === "") { this.p_withExtraDrawn({ mirrorSegmentX: false, mirrorSegmentY: false }); }
		else if (mirrorStr === "x") { this.p_withExtraDrawn({ mirrorSegmentX: true, mirrorSegmentY: false }); }
		else if (mirrorStr === "y") { this.p_withExtraDrawn({ mirrorSegmentX: false, mirrorSegmentY: true }); }
		else if (mirrorStr === "xy") { this.p_withExtraDrawn({ mirrorSegmentX: true, mirrorSegmentY: true }); }
		return this;
	}

	mirrorPosX() {
		this.spec.pos[0] = -(this.spec.pos[0]);
		// Deal with radial values
		if (this.spec.hasOwnProperty("radialCenter")) {
			this.spec.radialCenter[0] = -(this.spec.radialCenter[0]);
		}
		if (this.spec.hasOwnProperty("radialMoveSpeed")) {
			this.spec.radialMoveSpeed = -(this.spec.radialMoveSpeed);
		}
		if (this.spec.hasOwnProperty("radialAngle")) {
			this.spec.radialAngle = -(this.spec.radialAngle);
		}
		return this;
	}

	mirrorPosY() {
		this.spec.pos[1] = -(this.spec.pos[1]);
		// Deal with radial values
		if (this.spec.hasOwnProperty("radialCenter")) {
			this.spec.radialCenter[1] = -(this.spec.radialCenter[1]);
		}
		if (this.spec.hasOwnProperty("radialMoveSpeed")) {
			this.spec.radialMoveSpeed = -(this.spec.radialMoveSpeed);
		}
		if (this.spec.hasOwnProperty("radialAngle")) {
			this.spec.radialAngle = -(this.spec.radialAngle);
		}
		return this;
	}


	//// OUTPUT METHOD ////
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


	//// PRIVATE METHODS ////

	/** Set extra drawn element settings */
	p_withExtraDrawn({ mirrorSegmentX = null, mirrorSegmentY = null } = {}) {
		if (mirrorSegmentX !== null) {
			this.extraDrawn.mirrorSegmentX = mirrorSegmentX;
		}
		if (mirrorSegmentY !== null) {
			this.extraDrawn.mirrorSegmentY = mirrorSegmentY;
		}
		return this;
	}

	/**
	 * Returns the text for drawing the circle without extra segments
	 */
	p_getSelfCode() {
		let subVars = [];
		for (let k in this.spec) {
			subVars.push(new BlkVariable(k, this.spec[k]));
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