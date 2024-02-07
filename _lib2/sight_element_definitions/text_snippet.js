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


export default class TextSnippet {
	/**
	 * @param {Object} defObj
	 * @param {string=} defObj.text - (default `""`)
	 * @param {"center"|"left"|"right"|0|1|2=} defObj.align - (default `"center"`)
	 * @param {[number, number]=} defObj.pos - (default `[0, 0]`)
	 * @param {number=} defObj.size - (default `1`)
	 * @param {boolean=} defObj.move - (default `false`)
	 * @param {boolean=} defObj.thousandth - (default `true`)
	 * @param {boolean=} defObj.highlight - (default `true`)
	 *
	 * @param {boolean=} defObj.moveRadial - if radial move
	 * @param {[number, number]=} defObj.radialCenter - radial move center position `[x, y]`
	 * @param {number=} defObj.radialMoveSpeed
	 * @param {number=} defObj.radialAngle
	 *
	 * @param {{mirrorX: boolean, mirrorY: boolean}} extraDrawn
	 */
	constructor({
		text = "",
		align = "center",
		pos = [0, 0],
		size = 1,
		move = false,
		thousandth = true,
		highlight = true,
		moveRadial, radialCenter, radialMoveSpeed, radialAngle
	} = {}, extraDrawn = { mirrorX: false, mirrorY: false }) {
		this.spec = DefTool.copyValue({
			text,
			align: (align === "center") ? 0 : (align === "left") ? 1 : (align === "right") ? 2 : align,
			pos,
			size,
			move,
			thousandth,
			highlight,
			moveRadial, radialCenter, radialMoveSpeed, radialAngle
		});

		/**
		 * On what axes will extra element(s) be generated when print code
		 * @type {{mirrorX: boolean, mirrorY: boolean}}
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
		return (new TextSnippet(this.spec, this.extraDrawn));
	}


	//// ELEMENT-SPECIFIC METHODS ////

	mirrorX() {
		this.spec.pos[0] = -(this.spec.pos[0]);
		if (this.spec.align === 1) {
			this.spec.align = 2;
		} else if (this.spec.align === 2) {
			this.spec.align = 1;
		}
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

	mirrorY() {
		// TODO: Extra line-height adjustment param?
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


	//// OUTPUT METHOD ////
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

	/**
	 * Returns the code for drawing a text
	 */
	p_getSelfCode() {
		let subVars = [];
		for (let k in this.spec) {
			let type = (k === "align") ? "i" : null;
			subVars.push(new BlkVariable(k, this.spec[k], type));
		}
		return (new BlkBlock("text", subVars, { useOneLine: true }).getCode());
	}
}
