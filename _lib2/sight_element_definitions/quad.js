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


export default class Quad {
	/** Key name conversion for compiled quad code */
	static p_realKey = {
		topLeft: "tl", topRight: "tr", bottomLeft: "bl", bottomRight: "br"
	};

	//// CONSTRUCTOR ////
	/**
	 * ONE of following value combinations are required for creating a quad -
	 *
	 * *A. Arbitrary quad: four corners*
	 *   - `{ topLeft, topRight, bottomLeft, bottomRight }`
	 *
	 *
	 * *B. Parallelogram, with 2 opposite sides on a axis direction:*
	 * 1. two corners on one side + x/y width
	 * - `{ topLeft, topRight, yWidth }`
	 * - `{ bottomLeft, bottomRight, yWidth }`
	 * - `{ topLeft, bottomLeft, xWidth }`
	 * - `{ topRight, bottomRight, xWidth }`
	 *
	 * 2. two side centers of opposite sides + x/y width
	 * - `{ topCenter, bottomCenter, xWidth }`
	 * - `{ leftCenter, rightCenter, yWidth }`
	 *
	 * *C. Rectangle:*
	 * 1. one corner + x & y width
	 * - `{ topLeft, xWidth, yWidth }`
	 * - `{ topRight, xWidth, yWidth }`
	 * - `{ bottomLeft, xWidth, yWidth }`
	 * - `{ bottomRight, xWidth, yWidth }`
	 *
	 * 2. one side center + x & y width
	 * - `{ topCenter, xWidth, yWidth }`
	 * - `{ bottomCenter, xWidth, yWidth }`
	 * - `{ leftCenter, xWidth, yWidth }`
	 * - `{ rightCenter, xWidth, yWidth }`
	 *
	 * 3. rect center + x & y width
	 * - `{ center, xWidth, yWidth }`
	 *
	 *
	 * TODO: Radial move params (does WT supports it?)
	 *
	 * @param {Object} infoCopied
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
	 *
	 * @param {boolean=} info.move - (default `false`) if move with gun zero changes
	 * @param {boolean=} info.thousandth - (default `true`)
	 *
	 * @param {{mirrorX: boolean, mirrorY: boolean}} extraDrawn
	 */
	constructor(
		info,
		extraDrawn = { mirrorX: false, mirrorY: false }
	) {
		let infoCopied = DefTool.copyValue(info);

		// Extract 4 corner coordinates
		let corners = {
			topLeft: null, topRight: null, bottomLeft: null, bottomRight: null
		};
		// Arbitrary quad: four corners
		if (DefTool.hasAllProperties(["topLeft", "topRight", "bottomLeft", "bottomRight"], infoCopied)) {
			corners.topLeft = infoCopied.topLeft;
			corners.topRight = infoCopied.topRight;
			corners.bottomLeft = infoCopied.bottomLeft;
			corners.bottomRight = infoCopied.bottomRight;

		// Parallelogram, with 2 opposite sides on a axis direction:
		// two corners on one side + x/y width
		} else if (DefTool.hasAllProperties(["topLeft", "topRight", "yWidth"], infoCopied)) {
			corners.topLeft = infoCopied.topLeft;
			corners.topRight = infoCopied.topRight;
			corners.bottomLeft = [infoCopied.topLeft[0], infoCopied.topLeft[1] + infoCopied.yWidth];
			corners.bottomRight = [infoCopied.bottomRight[0], infoCopied.bottomRight[1] + infoCopied.yWidth];
		} else if (DefTool.hasAllProperties(["bottomLeft", "bottomRight", "yWidth"], infoCopied)) {
			corners.topLeft = [infoCopied.bottomLeft[0], infoCopied.bottomLeft[1] - infoCopied.yWidth];
			corners.topRight = [infoCopied.bottomRight[0], infoCopied.bottomRight[1] - infoCopied.yWidth];
			corners.bottomLeft = infoCopied.bottomLeft;
			corners.bottomRight = infoCopied.bottomRight;
		} else if (DefTool.hasAllProperties(["topLeft", "bottomLeft", "xWidth"], infoCopied)) {
			corners.topLeft = infoCopied.topLeft;
			corners.topRight = [infoCopied.topLeft[0] + infoCopied.xWidth, infoCopied.topLeft[1]];
			corners.bottomLeft = infoCopied.bottomLeft;
			corners.bottomRight = [infoCopied.bottomLeft[0] + infoCopied.xWidth, infoCopied.bottomLeft[1]];
		} else if (DefTool.hasAllProperties(["topRight", "bottomRight", "xWidth"], infoCopied)) {
			corners.topLeft = [infoCopied.topRight[0] - infoCopied.xWidth, infoCopied.topRight[1]];
			corners.topRight = infoCopied.topRight;
			corners.bottomLeft = [infoCopied.bottomRight[0] - infoCopied.xWidth, infoCopied.bottomRight[1]];
			corners.bottomRight = infoCopied.bottomRight;

		// two side centers of opposite sides + x/y width
		} else if (DefTool.hasAllProperties(["topCenter", "bottomCenter", "xWidth"], infoCopied)) {
			corners.topLeft = [infoCopied.topCenter[0] - infoCopied.xWidth/2, infoCopied.topCenter[1]];
			corners.topRight = [infoCopied.topCenter[0] + infoCopied.xWidth/2, infoCopied.topCenter[1]];
			corners.bottomLeft = [infoCopied.bottomCenter[0] - infoCopied.xWidth/2, infoCopied.bottomCenter[1]];
			corners.bottomRight = [infoCopied.bottomCenter[0] + infoCopied.xWidth/2, infoCopied.bottomCenter[1]];
		} else if (DefTool.hasAllProperties(["leftCenter", "rightCenter", "yWidth"], infoCopied)) {
			corners.topLeft = [infoCopied.leftCenter[0], infoCopied.leftCenter[1] - infoCopied.yWidth/2];
			corners.topRight = [infoCopied.rightCenter[0], infoCopied.rightCenter[1] - infoCopied.yWidth/2];
			corners.bottomLeft = [infoCopied.leftCenter[0], infoCopied.leftCenter[1] + infoCopied.yWidth/2];
			corners.bottomRight = [infoCopied.rightCenter[0], infoCopied.rightCenter[1] + infoCopied.yWidth/2];

		// Rectangle
		// one corner + x & y width
		} else if (DefTool.hasAllProperties(["topLeft", "xWidth", "yWidth"], infoCopied)) {
			corners.topLeft = infoCopied.topLeft;
			corners.topRight = [infoCopied.topLeft[0] + infoCopied.xWidth, infoCopied.topLeft[1]];
			corners.bottomLeft = [infoCopied.topLeft[0], infoCopied.topLeft[1] + infoCopied.yWidth];
			corners.bottomRight = [infoCopied.topLeft[0] + infoCopied.xWidth, infoCopied.topLeft[1] + infoCopied.yWidth];
		} else if (DefTool.hasAllProperties(["topRight", "xWidth", "yWidth"], infoCopied)) {
			corners.topLeft = [infoCopied.topRight[0] - infoCopied.xWidth, infoCopied.topRight[1]];
			corners.topRight = infoCopied.topRight;
			corners.bottomLeft = [infoCopied.topRight[0], infoCopied.topRight[1] + infoCopied.yWidth];
			corners.bottomRight = [infoCopied.topRight[0] - infoCopied.xWidth, infoCopied.topRight[1] + infoCopied.yWidth];
		} else if (DefTool.hasAllProperties(["bottomLeft", "xWidth", "yWidth"], infoCopied)) {
			corners.topLeft = [infoCopied.bottomLeft[0], infoCopied.bottomLeft[1] - infoCopied.yWidth];
			corners.topRight = [infoCopied.bottomLeft[0] + infoCopied.xWidth, infoCopied.bottomLeft[1] - infoCopied.yWidth];
			corners.bottomLeft = infoCopied.bottomLeft;
			corners.bottomRight = [infoCopied.bottomLeft[0] + infoCopied.xWidth, infoCopied.bottomLeft[1]];
		} else if (DefTool.hasAllProperties(["bottomRight", "xWidth", "yWidth"], infoCopied)) {
			corners.topLeft = [infoCopied.bottomRight[0] - infoCopied.xWidth, infoCopied.bottomRight[1] - infoCopied.yWidth];
			corners.topRight = [infoCopied.bottomRight[0], infoCopied.bottomRight[1] - infoCopied.yWidth];
			corners.bottomLeft = [infoCopied.bottomRight[0] - infoCopied.xWidth, infoCopied.bottomRight[1]];
			corners.bottomRight = infoCopied.bottomRight;

		// one side center + x & y width
		} else if (DefTool.hasAllProperties(["topCenter", "xWidth", "yWidth"], infoCopied)) {
			corners.topLeft = [infoCopied.topCenter[0] - infoCopied.xWidth/2, infoCopied.topCenter[1]];
			corners.topRight = [infoCopied.topCenter[0] + infoCopied.xWidth/2, infoCopied.topCenter[1]];
			corners.bottomLeft = [infoCopied.topCenter[0] - infoCopied.xWidth/2, infoCopied.topCenter[1] + infoCopied.yWidth];
			corners.bottomRight = [infoCopied.topCenter[0] + infoCopied.xWidth/2, infoCopied.topCenter[1] + infoCopied.yWidth];
		} else if (DefTool.hasAllProperties(["bottomCenter", "xWidth", "yWidth"], infoCopied)) {
			corners.topLeft = [infoCopied.bottomCenter[0] - infoCopied.xWidth/2, infoCopied.bottomCenter[1] - infoCopied.yWidth];
			corners.topRight = [infoCopied.bottomCenter[0] + infoCopied.xWidth/2, infoCopied.bottomCenter[1] - infoCopied.yWidth];
			corners.bottomLeft = [infoCopied.bottomCenter[0] - infoCopied.xWidth/2, infoCopied.bottomCenter[1]];
			corners.bottomRight = [infoCopied.bottomCenter[0] + infoCopied.xWidth/2, infoCopied.bottomCenter[1]];
		} else if (DefTool.hasAllProperties(["leftCenter", "xWidth", "yWidth"], infoCopied)) {
			corners.topLeft = [infoCopied.leftCenter[0], infoCopied.leftCenter[1] - infoCopied.yWidth/2];
			corners.topRight = [infoCopied.leftCenter[0] + infoCopied.xWidth, infoCopied.leftCenter[1] - infoCopied.yWidth/2];
			corners.bottomLeft = [infoCopied.leftCenter[0], infoCopied.leftCenter[1] + infoCopied.yWidth/2];
			corners.bottomRight = [infoCopied.leftCenter[0] + infoCopied.xWidth, infoCopied.leftCenter[1] + infoCopied.yWidth/2];
		} else if (DefTool.hasAllProperties(["rightCenter", "xWidth", "yWidth"], infoCopied)) {
			corners.topLeft = [infoCopied.rightCenter[0] - infoCopied.xWidth, infoCopied.rightCenter[1] - infoCopied.yWidth/2];
			corners.topRight = [infoCopied.rightCenter[0], infoCopied.rightCenter[1] - infoCopied.yWidth/2];
			corners.bottomLeft = [infoCopied.rightCenter[0] - infoCopied.xWidth, infoCopied.rightCenter[1] + infoCopied.yWidth/2];
			corners.bottomRight = [infoCopied.rightCenter[0], infoCopied.rightCenter[1] + infoCopied.yWidth/2];

		// rect center + x & y width
		} else if (DefTool.hasAllProperties(["center", "xWidth", "yWidth"], infoCopied)) {
			corners.topLeft = [infoCopied.center[0] - infoCopied.xWidth/2, infoCopied.center[1] - infoCopied.yWidth/2];
			corners.topRight = [infoCopied.center[0] + infoCopied.xWidth/2, infoCopied.center[1] - infoCopied.yWidth/2];
			corners.bottomLeft = [infoCopied.center[0] - infoCopied.xWidth/2, infoCopied.center[1] + infoCopied.yWidth/2];
			corners.bottomRight = [infoCopied.center[0] + infoCopied.xWidth/2, infoCopied.center[1] + infoCopied.yWidth/2];

		// no matched pattern
		} else {
			throw new Error("ERROR: quad definition cannot be resolved");
		}

		/**
		 * Four corners of the quad
		 * @type {{topLeft: [number, number], topRight: [number, number], bottomLeft: [number, number], bottomRight: [number, number]}}
		 */
		this.corners = corners;

		/**
		 * Quad specification parameters which will be output directly
		 */
		this.specMisc = {
			move:
				infoCopied.hasOwnProperty("move") ?
					infoCopied.move : false,
			thousandth:
				infoCopied.hasOwnProperty("thousandth") ?
					infoCopied.thousandth : true,
		};

		/**
		 * On what axes will extra element(s) be generated when print code
		 * @type {{mirrorX: boolean, mirrorY: boolean}}
		 */
		this.extraDrawn = DefTool.copyValue(extraDrawn);
	}


	//// GETTERS ////

	/**
	 * @returns {{topLeft: [number, number], topRight: [number, number], bottomLeft: [number, number], bottomRight: [number, number]}}
	 */
	getCorners() { return DefTool.copyValue(this.corners); }

	/** @returns {boolean} */
	getMovable() { return this.specMisc.move; }

	/** @returns {boolean} */
	getUseThousandthUnit() { return this.specMisc.thousandth; }


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
	 * Moves the element relatively
	 * @param {[number, number]} moveDist
	 */
	move([x, y]) {
		for (let k in this.corners) {
			let pos = this.corners[k];
			if (pos) { pos[0] += x; pos[1] += y }
		}
		return this;
	}

	/** Copies to a new element */
	copy() {
		return (new Quad(
			{...(this.corners), ...(this.specMisc)},
			this.extraDrawn
		));
	}


	//// ELEMENT-SPECIFIC METHODS ////

	mirrorX() {
		let newCorners = {
			topLeft: [-this.corners.topRight[0], this.corners.topRight[1]],
			topRight: [-this.corners.topLeft[0], this.corners.topLeft[1]],
			bottomLeft: [-this.corners.bottomRight[0], this.corners.bottomRight[1]],
			bottomRight: [-this.corners.bottomLeft[0], this.corners.bottomLeft[1]],
		}

		for (let k in newCorners) {
			this.corners[k][0] = newCorners[k][0];
			this.corners[k][1] = newCorners[k][1];
		}
		return this;
	}

	mirrorY() {
		let newCorner = {
			topLeft: [this.corners.bottomLeft[0], -this.corners.bottomLeft[1]],
			topRight: [this.corners.bottomRight[0], -this.corners.bottomRight[1]],
			bottomLeft: [this.corners.topLeft[0], -this.corners.topLeft[1]],
			bottomRight: [this.corners.topRight[0], -this.corners.topRight[1]],
		}

		for (let k in newCorner) {
			this.corners[k][0] = newCorner[k][0];
			this.corners[k][1] = newCorner[k][1];
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
		for(let ck in this.corners) {
			subVars.push(new BlkVariable(
				Quad.p_realKey[ck],
				this.corners[ck]
			));
		}

		for (let k in this.specMisc) {
			subVars.push(new BlkVariable(k, this.specMisc[k]));
		}
		return (new BlkBlock("quad", subVars, { useOneLine: true }).getCode());
	}
}