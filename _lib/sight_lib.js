'use strict';


export default {
	SIGHT_LIB_VER: "0.1.0",
	TODO: [
		"drawQuads",
		"drawTexts"
	]
}




//// GENERALS ////

/** A sight (text) file */
export class Sight {
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

	static round(value, digit) {
		return (Number.isInteger(value) ?
			value :
			(Math.round(value * (10 ** digit)) / (10 ** digit))
		);
	}

	/**
	 * Check if a value is in a range
	 * @param {number} v - checked value
	 * @param {[number, number]} range - check value range
	 * @param {[boolean, boolean]} includeEnds - if start/end is included
	 */
	static valueInRange(v, range, includeEnds = [true, true]) {
		if (range[1] === range[0]) {
			return ((includeEnds[0] || includeEnds[1]) && v === range[1]);
		}
		// Check if in range and return
		return (
			(includeEnds[0] && v === range[0]) ||
			(includeEnds[1] && v === range[1]) ||
			(range[0] < range[1] && range[0] < v && v < range[1]) ||
			(range[1] < range[0] && range[1] < v && v < range[0])
		);
	}

	/** Use JSON object to deep copy a value */
	static copyValue(from) {
		return JSON.parse(JSON.stringify(from));
	}
}


/**
 * Sight general setting lines
 */
export class General {
	/** Max number of digits for numbers in code output */
	static NUMBER_DIGIT = 6

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
			vValueOut = Toolbox.round(vValue, this.NUMBER_DIGIT).toString(10);

		} else if (typeof vValue == "boolean") {
			if (!vTypeOut) { vTypeOut = "b" }
			vValueOut = vValue ? "yes" : "no";

		} else if (typeof vValue == "string") {
			if (!vTypeOut) { vTypeOut = "t" }
			vValueOut = `"${vValue.replace(/["]/gm, "")}"`;

		} else if (Array.isArray(vValue) && vValue.length >= 2 && vValue.length <= 4) {
			if (!vTypeOut) { vTypeOut = "p" + vValue.length.toString(10); }
			let vValueRound = []
			for (let v of vValue) { vValueRound.push(Toolbox.round(v, this.NUMBER_DIGIT)); }
			vValueOut = vValueRound.join(", ");
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

	/** Adds a line as the max value, ensuring distance is shown properly
	 *  until this distance
	 */
	addMax(maxDistance = 20000) {
		this.distanceLines.push({distance: maxDistance, shown: 0, shownPos: [0, 0]})
	}

	getCode(autoAddMax = true) {
		if (autoAddMax) { this.addMax(); }

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
	 * @param {Circle|string} c
	 */
	addOne(c) {
		if (typeof c == "string") {
			this.blockLines.push(c);
		} else {
			this.blockLines.push(c.getCode());
		}
		return this;
	}

	/**
	 * Add one/multiple new circles. Only code will be kept
	 * @param {Circle|string|Circle[]|string[]} c
	 */
	add(c) {
		if (Array.isArray(c)) { for (let ce of c) { this.addOne(ce); } }
		else { this.addOne(c); }
		return this;
	}

	/** Adds a text line. Note leading double slash is auto generated by default */
	addComment(s, prefix = "// ") {
		this.blockLines.push(prefix + s);
	}

	getCode() {
		return General.block("drawCircles", this.blockLines);
	}
}


export class LinesBlock {
	constructor() {
		this.blockLines = []
	}

	/**
	 * Adds a new line. Only its code will be kept
	 * @param {Line|string} l
	 */
	addOne(l) {
		if (typeof l == "string") {
			this.blockLines.push(l);
		} else {
			this.blockLines.push(l.getCode());
		}
		return this;
	}

	/**
	 * Add one/multiple new lines. Only code will be kept
	 * @param {Line|string|Line[]|string[]} l
	 */
	add(l) {
		if (Array.isArray(l)) { for (let le of l) { this.addOne(le); } }
		else { this.addOne(l); }
		return this;
	}

	/** Adds a text line. Note leading double slash is auto generated by default */
	addComment(s, prefix = "// ") {
		this.blockLines.push(prefix + s);
	}

	getCode() {
		return General.block("drawLines", this.blockLines);
	}
}

// TODO:
// quads: "drawQuads",
// texts: "drawTexts",


//// ELEMENTS ////

/** A circle element */
export class Circle {
	/**
	 * @param {Object} obj
	 * @param {[number, number]} obj.segment - start/end degree of curve
	 * @param {[number, number]} obj.pos - center position
	 * @param {number} obj.diameter - circle diameter
	 * @param {number} obj.size - (default `1`) line width
	 * @param {boolean} obj.move - (default `false`) if move with gun zero changes
	 * @param {boolean} obj.thousandth - (default `true`) if use thousandth
	 */
	constructor({
		segment = [0, 360],
		pos,
		diameter,
		size = 1,
		move = false,
		thousandth = true
	}={}) {
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


/** A line element */
export class Line {
	/**
	 * @param {Object} obj
	 * @param {[number, number]} obj.from
	 * @param {[number, number]} obj.to
	 * @param {boolean} obj.move - (default `false`) if move with gun zero changes
	 * @param {boolean} obj.thousandth - (default `true`) if use thousandth
	 *
	 * @param {?boolean} obj.moveRadial - if radial move
	 * @param {?[number, number]} obj.radialCenter - radial move center position `[x, y]`
	 * @param {?number} obj.radialMoveSpeed
	 * @param {?number} obj.radialAngle
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
	}={}, lineBreakPoints = []) {
		this.lineEnds = { from, to };
		/** Difference of x/y values ("to" - "from") */
		this.lineEndDiffs = { x: (to[0]-from[0]), y: (to[1]-from[1]) };
		this.lineEndDistance = Math.sqrt(
			(to[0]-from[0]) ** 2 +
			(to[1]-from[1]) ** 2
		);

		this.detailsMisc = {
			move, thousandth,
			moveRadial, radialCenter, radialMoveSpeed, radialAngle
		};

		this.lineBreakPoints = lineBreakPoints;
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
			((x - this.lineEnds.from[0]) / this.lineEndDiffs.x * this.lineEndDiffs.x) +
			this.lineEnds.from[1];

		this.lineBreakPoints.push({ x: x, y: y, r: width/2 });
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
			this.lineEnds.from[1];

		this.lineBreakPoints.push({ x: x, y: y, r: width/2 });
		return this;
	}


	copy() {
		return (new Line({
			from: Toolbox.copyValue(this.lineEnds.from),
			to: Toolbox.copyValue(this.lineEnds.to),
			move: this.detailsMisc.move,
			thousandth: this.detailsMisc.thousandth,

			moveRadial: this.detailsMisc.moveRadial || null,
			radialCenter: this.detailsMisc.radialCenter || null,
			radialMoveSpeed: this.detailsMisc.radialMoveSpeed || null,
			radialAngle: this.detailsMisc.radialAngle || null
		}, Toolbox.copyValue(this.lineBreakPoints)));
	}

	mirrorX() {
		this.lineEnds.from[0] = -(this.lineEnds.from[0])
		this.lineEnds.to[0] = -(this.lineEnds.to[0])
		this.lineEndDiffs.x = -(this.lineEndDiffs.x)
		// TODO: deal with radial values
		for (let bp of this.lineBreakPoints) { bp.x = -(bp.x) }

		return this;
	}
	mirrorY() {
		this.lineEnds.from[1] = -(this.lineEnds.from[1])
		this.lineEnds.to[1] = -(this.lineEnds.to[1])
		this.lineEndDiffs.y = -(this.lineEndDiffs.y)
		// TODO: deal with radial values
		for (let bp of this.lineBreakPoints) { bp.y = -(bp.y) }

		return this;
	}

	move(x, y) {
		this.lineEnds.from[0] += x
		this.lineEnds.from[1] += y
		this.lineEnds.to[0] += x
		this.lineEnds.to[1] += y
		// TODO: deal with radial center
		for (let bp of this.lineBreakPoints) {
			bp.x += x
			bp.y += y
		}

		return this;
	}


	/**
	 * Get code for all line frags into an array
	 * @returns {string[]}
	 */
	getAllFragCodes() {
		// Sort breakpoints
		//   Note that same from & to is not supported
		if (this.lineEndDiffs.x !== 0) {
			if (this.lineEndDiffs.x > 0) {
				this.lineBreakPoints.sort((a, b) => (a.x - b.x))
			} else {
				this.lineBreakPoints.sort((a, b) => -(a.x - b.x))
			}
		} else {
			if (this.lineEndDiffs.y > 0) {
				this.lineBreakPoints.sort((a, b) => (a.y - b.y))
			} else {
				this.lineBreakPoints.sort((a, b) => -(a.y - b.y))
			}
		}

		// Find all line frags
		let lineFragStarts = [ this.lineEnds.from ];
		let lineFragEnds = [];  // Whole line ending will be added later

		for (let bp of this.lineBreakPoints) {
			if (this.lineEndDiffs.x === 0) {  // Vert line
				if (this.lineEndDiffs.y > 0) {
					lineFragEnds.push([bp.x, bp.y-bp.r])
					lineFragStarts.push([bp.x, bp.y+bp.r])
				} else {
					lineFragEnds.push([bp.x, bp.y+bp.r])
					lineFragStarts.push([bp.x, bp.y-bp.r])
				}

			} else if (this.lineEndDiffs.y === 0) {  // Hori line
				if (this.lineEndDiffs.x > 0) {
					lineFragEnds.push([bp.x-bp.r, bp.y])
					lineFragStarts.push([bp.x+bp.r, bp.y])
				} else {
					lineFragEnds.push([bp.x+bp.r, bp.y])
					lineFragStarts.push([bp.x-bp.r, bp.y])
				}

			} else {
				lineFragEnds.push([
					bp.x - (this.lineEndDiffs.x / this.lineEndDistance * bp.r),
					bp.y - (this.lineEndDiffs.y / this.lineEndDistance * bp.r)
				])
				lineFragStarts.push([
					bp.x + (this.lineEndDiffs.x / this.lineEndDistance * bp.r),
					bp.y + (this.lineEndDiffs.y / this.lineEndDistance * bp.r)
				])
			}
		}
		// Add whole line ending
		lineFragEnds.push(this.lineEnds.to);

		// Print line frags
		let lineAllFragCodes = [];
		let lineFragLen = lineFragStarts.length
		for (let i=0; i<lineFragLen; i++) {
			let fragDetails = Toolbox.copyValue(this.detailsMisc);
			fragDetails.line = [
				lineFragStarts[i][0], lineFragStarts[i][1],
				lineFragEnds[i][0], lineFragEnds[i][1],
			]

			let fragVarCodes = [];
			for (let k in fragDetails) {
				if (fragDetails[k] === null) { continue; }
				fragVarCodes.push(General.variable(k, fragDetails[k]))
			}

			lineAllFragCodes.push(General.block("line", fragVarCodes, {useOneLine: true}))
		}

		return lineAllFragCodes;
	}
}