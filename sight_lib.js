'use strict';


export default {
	SIGHT_LIB_VER: "0.0.2",
}




//// GENERALS ////

/** A sight (text) file */
export class Sight {
	/** Available block names in a sight file */
	static blockName = {
		quads: "drawQuads",
		lines: "drawLines",
		texts: "drawTexts",
	}

	constructor() {
		this.text = "";
	}

	getCurrentText() { return this.text; }

	/**
	 * Append new text
	 *
	 * @param {string|string[]} text
	 * @param {string} end
	 */
	append(text, end="\n") {
		if (typeof text == "string") {
			this.text += text + end;
		} else {
			for (let line of text) {
				this.text += line + end;
			}
		}
	}
}


/**
 * Tools for writing
 */
export class Toolbox {
	/** Get a number range array */
	static range(start, end, step = 1.0) {
		let result = [];
		for (let i = start; i < end; i += step) { result.push(i); }
		return result;
	}
	/** Get a number range array including the ending number */
	static rangeIE(start, end, step = 1.0) {
		let result = [];
		for (let i = start; i <= end; i += step) { result.push(i); }
		return result;
	}

	/** Clacuate thousandth value with given data (in meter) */
	static calcThousandth(tgtWidth, distance) {
		return ((1000 * tgtWidth) / distance)
	}
}


/**
 * Sight general setting lines
 */
export class General {
	/**
	 * Generates a new line of compiled variable info
	 * (without ending newline by default)
	 *
	 * @param {string} vName variable name
	 * @param {number|string|boolean|number[]} vValue
	 * @param {null|"i"|"t"|"r"|"c"|"b"|"p2"|"p3"|"p4"} vType output type. `null` for auto
	 * @param {""|";"} end ending symbol, either `""` or `";"`
	 *
	 * Note that:
	 * 1. for sight text align, the vType `"r"` will be selected by default, so
	 * `"i"` needs to be decalred if necessary
	 * 2. for 4 number arrays, the vType `"p4"` will be selected by default, so
	 * `"c"` needs to be decalred if necessary
	 *
	 */
	static variable(vName, vValue, vType = null, end = "") {
		let vValueOut;
		let vTypeOut = vType;

		if (typeof vValue == "number") {
			if (!vTypeOut) { vTypeOut = "r" }
			vValueOut = vValue.toString(10);

		} else if (typeof vValue == "boolean") {
			if (!vTypeOut) { vTypeOut = "b" }
			vValueOut = vValue ? "yes" : "no";

		} else if (typeof vValue == "string") {
			if (!vTypeOut) { vTypeOut = "t" }
			vValueOut = `"${vValue.replace(/["]/gm, "")}"`;

		} else if (Array.isArray(vValue) && vValue.length >= 2 && vValue.length <= 4) {
			if (!vTypeOut) { vTypeOut = "p" + vValue.length.toString(10); }
			vValueOut = vValue.join(", ");
		} else {
			console.warn(`WARN: Unidentified sight variable type from '${vName}'`);
		}

		return `${vName}:${vTypeOut} = ${vValueOut}${end}`
	}

	/** Generates code of compiled general block inBlockLineEnd="\n", inBlockLineIndent="\t"*/
	static block(bName, bLines=[], {
		useOneLine = false,
		baseIndentLevel = 0,
		lineIndent = "\t",
		oneLineSeparator = "; ",
		multiLineEnd = "\n",
	}={}) {
		// Empty block:
		if (bLines.length === 0) {
			return `${bName} {}`;
		}

		let baseIndent = (() => {
			let s = "";
			for (let i = 0; i < baseIndentLevel; i++) { s += lineIndent; }
			return s;
		})();

		// One line mode:
		if (useOneLine) {
			let result = baseIndent + `${bName} { `;
			for (let l of bLines) {
				result += l + oneLineSeparator;
			}
			result += "}";
			return result;
		}

		// Multiple lines mode:
		let inBlockIndentChars = baseIndent + lineIndent;
		let lineStartRegExp = (new RegExp("^", "gm"));
		let result = baseIndent + `${bName} { ` + multiLineEnd;
		for (let l of bLines) {
			result +=
				l.replace(lineStartRegExp, inBlockIndentChars) +
				multiLineEnd;
		}
		result += baseIndent + "}";
		return result;
	}
}




//// BLOCKS ////

/** Matched vehicle types (originall named as `matchExpClass`) */
export class MatchVehicleClassBlock {
	static vehicleTypeGroundDefaults = [
		"exp_tank", "exp_heavy_tank", "exp_tank_destroyer"
	];
	static vehicleTypeSPAAs = ["exp_SPAA"];

	/**
	 * Generate a "matchExpClass" block text
	 *
	 * @param {string[]} includeCls
	 * @param {string[]} excludeCls
	 */
	static buildBlock(includeCls = [], excludeCls = []) {
		let innerLines = [];
		for (let c of includeCls) {
			innerLines.push(General.variable(c, true));
		}
		for (let c of excludeCls) {
			innerLines.push(General.variable(c, false));
		}

		return General.block("matchExpClass", innerLines)
	}
}


/**
 * Thousandth lines on the sight horizon for measuring enemy distance
 * (originall named as `crosshair_hor_ranges`)
 */
export class HorizontalThousandthsBlock {
	constructor() { this.thousandthLines = []; }

	/**
	 * Adds a new line
	 *
	 * @param {number} thousandth line thousandth value
	 * @param {number} shown displayed number value, `0` to hide the number
	 */
	add(thousandth, shown = 0) {
		this.thousandthLines.push([thousandth, shown])
	}

	getCode() {
		this.thousandthLines.sort((a, b) => (a[0] - b[0]))

		let compiledLines = []
		for (let lineInfo of this.thousandthLines) {
			compiledLines.push(General.variable("range", lineInfo));
		}
		return General.block("crosshair_hor_ranges", compiledLines);
	}
}


/** Shell distance block (originall named as `crosshair_distances`) */
export class ShellDistancesBlock {
	constructor() {
		this.distanceLines = []
	}

	/**
	 * Adds a new shell distance line
	 *
	 * @param {number} distance shell distance line value
	 * @param {number} shown displayed number value, `0` to hide the number
	 * @param {[number, number]} shownPos position of displayed number
	 */
	add(distance, shown = 0, shownPos = [0 ,0]) {
		this.distanceLines.push({distance, shown, shownPos})
	}

	getCode() {
		this.distanceLines.sort((a, b) => (a.distance - b.distance))

		let compiledLines = []
		for (let distanceInfo of this.distanceLines) {
			compiledLines.push(General.block("distance", [
				General.variable("distance", [ distanceInfo.distance, distanceInfo.shown, 0 ]),
				General.variable("textPos", distanceInfo.shownPos)
			], {useOneLine: true}))
		}

		return General.block("crosshair_distances", compiledLines);
	}
}


export class CirclesBlock {
	constructor() {
		this.blockLines = []
	}

	/**
	 * Adds a new circle. Only its code will be kept
	 * @param {Circle} c
	 */
	add(c) {
		this.blockLines.push(c.getCode());
	}

	/** Adds a text line. Note leading double slash is auto generated by default */
	addComment(s, prefix = "// ") {
		this.blockLines.push(prefix + s);
	}

	getCode() {
		return General.block("drawCircles", this.blockLines);
	}
}

// TODO:
// lines: "drawLines",
// quads: "drawQuads",
// texts: "drawTexts",


//// ELEMENTS ////

/** A circle element */
export class Circle {
	/**
	 * @param {object} obj
	 * @param {[number, number]} obj.segment start/end degree of curve
	 * @param {[number, number]} obj.pos center position
	 * @param {number} obj.diameter circle diameter
	 * @param {number} obj.size (default `1`) line width
	 * @param {boolean} obj.move (default `false`) if move with gun zero changes
	 * @param {boolean} obj.thousandth (default `true`) if use thousandth
	 */
	constructor({
		segment = [0, 360],
		pos,
		diameter,
		size = 1,
		move = false,
		thousandth = true
	} = {}) {
		this.details = {
			segment,
			pos,
			diameter,
			size,
			move,
			thousandth
		};
	}

	copy() {
		return (new Circle(
			JSON.parse(JSON.stringify(this.details))
		));
	}

	mirrorSegmentY() {
		let newSegment = [ (360-this.details.segment[1]), (360-this.details.segment[0]) ]
		this.details.segment[0] = newSegment[0];
		this.details.segment[1] = newSegment[1];
		return this;
	}

	/**
	 * Returns the text for drawing a circle
	 */
	getCode() {
		let subVars = [];
		for (let k in this.details) {
			subVars.push(General.variable(k, this.details[k]));
		}
		return General.block("circle", subVars, {useOneLine: true})
	}
}


/**
 * A line with selectable breaking
 *
 * TODO: Add capability for adding breaking dashes
 * TODO: REPLACE
 */
export class Line {
	/**
	 *
	 * @param {object} details
	 * @param {number[]} details.line line position `[fromX, fromY, toX, toY]`
	 * @param {boolean} details.move if move with gun zero changes
	 * @param {boolean} details.thousandth if use thousandth
	 *
	 * @param {?boolean} details.moveRadial if radial move
	 * @param {?number[]} details.radialCenter radial move center position `[x, y]`
	 * @param {?number} details.radialMoveSpeed
	 * @param {?number} details.radialAngle
	 */
	constructor(details) {
		this.details = details;
	}

	copy() {
		return (new Line(
			JSON.parse(JSON.stringify(this.details))
		));
	}

	mirrorX() {
		this.details.line[0] = -(this.details.line[0])
		this.details.line[2] = -(this.details.line[2])
		return this;
	}
	mirrorY() {
		this.details.line[1] = -(this.details.line[1])
		this.details.line[3] = -(this.details.line[3])
		return this;
	}
	move(x, y) {
		this.details.line[0] += x
		this.details.line[2] += x
		this.details.line[1] += y
		this.details.line[3] += y
		return this;
	}
	moveStartTo(x, y) {
		this.details.line[0] = x
		this.details.line[1] = y
		return this;
	}
	moveEndTo(x, y) {
		this.details.line[2] = x
		this.details.line[3] = y
		return this;
	}

	/**
	 * Returns the text for drawing a circle
	 */
	getCode() {
		let subVars = [];
		for (let k in this.details) {
			subVars.push(General.variable(k, this.details[k], null, "; "));
		}
		return General.block("line", subVars, {useOneLine: true})
	}

	// TODO: get parallel code

	// TODO more usable one fromTemplateSimpleDetails(default..)
	static templateSimpleDetails() {
		return {
			line: [0, 0, 1, 1],
			move: true,
			thousandth: true,
		};
	}
}