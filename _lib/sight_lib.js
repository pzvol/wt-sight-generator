'use strict';


const SIGHT_LIB = {
	VER: "20230504",
	TODO: [
		"drawQuads",
	]
};
export default SIGHT_LIB;


export class SightComponentCollection {
	constructor() {
		this.sight = new SightFile();
		this.matchVehicleClasses = new MatchVehicleClassBlock();
		this.horizontalThousandths = new HorizontalThousandthsBlock();
		this.shellDistances = new ShellDistancesBlock();
		this.circles = new CirclesBlock();
		this.lines = new LinesBlock();
		this.texts = new TextsBlock();
	}

	getComponents() {
		return {
			sight: this.sight,
			matchVehicleClasses: this.matchVehicleClasses,
			horizontalThousandths: this.horizontalThousandths,
			shellDistances: this.shellDistances,
			circles: this.circles,
			lines: this.lines,
			texts: this.texts,
		};
	}

	compileSightBlocks() {
		return this.sight.append([
			this.matchVehicleClasses, "",
			this.horizontalThousandths, "",
			this.shellDistances, "",
			this.circles, "",
			this.lines, "",
			this.texts,
		]);
	}

	printCode() {
		console.log(this.sight.getCurrentText());
	}
}




//// GENERALS ////

/** A sight (text) file */
export class SightFile {
	constructor(addAutoGenComment = true) {
		this.text = "";

		if (addAutoGenComment) {
			this.append(General.comment(
				"GENERATED FROM CODE WITH wt-sight-generator"
			)).append("");
		}
	}

	getCurrentText() { return this.text; }

	/**
	 * Append a piece of new code
	 * @param {string|BlockLevel} input
	 * @param {string} end
	 */
	appendOne(input, end = "\n") {
		if (typeof input === "string") {
			this.text += input + end;
		} else {
			this.text += input.getCode() + end;
		}
	}

	/**
	 *
	 * @param {string|string[]|BlockLevel|BlockLevel[]} input
	 * @param {string} end
	 */
	append(input, end = "\n") {
		if (Array.isArray(input)) {
			for (let ele of input) { this.appendOne(ele, end); }
		} else {
			this.appendOne(input, end);
		}
		return this;
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
		return ((1000 * tgtWidth) / distance);
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
	static NUMBER_DIGIT = 8;

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
			if (!vTypeOut) { vTypeOut = "r"; }
			vValueOut = Toolbox.round(vValue, this.NUMBER_DIGIT).toString(10);

		} else if (typeof vValue == "boolean") {
			if (!vTypeOut) { vTypeOut = "b"; }
			vValueOut = vValue ? "yes" : "no";

		} else if (typeof vValue == "string") {
			if (!vTypeOut) { vTypeOut = "t"; }
			vValueOut = `"${vValue.replace(/["]/gm, "")}"`;

		} else if (Array.isArray(vValue) && vValue.length >= 2 && vValue.length <= 4) {
			if (!vTypeOut) { vTypeOut = "p" + vValue.length.toString(10); }
			let vValueRound = [];
			for (let v of vValue) { vValueRound.push(Toolbox.round(v, this.NUMBER_DIGIT)); }
			vValueOut = vValueRound.join(", ");
		} else {
			console.warn(`WARN: Unidentified sight variable type from '${vName}'`);
		}

		return `${vName}:${vTypeOut} = ${vValueOut}${end}`;
	}

	/** Generates code of compiled general block inBlockLineEnd="\n", inBlockLineIndent="\t"*/
	static block(bName, bLines = [], {
		useOneLine = false,
		baseIndentLevel = 0,
		lineIndent = "\t",
		oneLineSeparator = "; ",
		multiLineEnd = "\n",
	} = {}) {
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

	static comment(s, prefix = "// ", end = "") {
		return (prefix + s + end);
	}
}




//// BLOCKS ////

/** General block class */
class BlockLevel {
	constructor() { }
	getCode() { return "ERROR: Unset class method 'getCode'"; }
}


/** Matched vehicle types (originall named as `matchExpClass`) */
export class MatchVehicleClassBlock extends BlockLevel {
	static vehicleTypeGroundDefaults = [
		"exp_tank", "exp_heavy_tank", "exp_tank_destroyer"
	];
	static vehicleTypeSPAAs = ["exp_SPAA"];

	constructor(includeClasses = [], excludeClasses = []) {
		super();
		this.includeClasses = includeClasses;
		this.excludeClasses = excludeClasses;
	}

	/**
	 * @param {string|string[]} c
	 */
	addInclude(c) {
		if (Array.isArray(c)) {
			for (let ce of c) { this.includeClasses.push(ce); }
		} else { this.includeClasses.push(c); }
		return this;
	}
	/**
	 * @param {string|string[]} c
	 */
	addExclude(c) {
		if (Array.isArray(c)) {
			for (let ce of c) { this.excludeClasses.push(ce); }
		} else { this.excludeClasses.push(c); }
		return this;
	}

	getCode() {
		let innerLines = [];
		for (let c of this.includeClasses) {
			innerLines.push(General.variable(c, true));
		}
		for (let c of this.excludeClasses) {
			innerLines.push(General.variable(c, false));
		}

		return General.block("matchExpClass", innerLines);
	}
}


/**
 * Thousandth lines on the sight horizon for measuring enemy distance
 * (originall named as `crosshair_hor_ranges`)
 */
export class HorizontalThousandthsBlock extends BlockLevel {
	constructor() {
		super();
		this.thousandthLines = [];
	}

	/**
	 * Adds a new line
	 *
	 * @param {number} thousandth line thousandth value
	 * @param {number} shown displayed number value, `0` to hide the number
	 */
	add(thousandth, shown = 0) {
		this.thousandthLines.push([thousandth, shown]);
	}

	getCode() {
		this.thousandthLines.sort((a, b) => (a[0] - b[0]));

		let compiledLines = [];
		for (let lineInfo of this.thousandthLines) {
			compiledLines.push(General.variable("range", lineInfo));
		}
		return General.block("crosshair_hor_ranges", compiledLines);
	}
}


/** Shell distance block (originall named as `crosshair_distances`) */
export class ShellDistancesBlock extends BlockLevel {
	constructor() {
		super();
		this.distanceLines = [];
	}

	/**
	 * Adds a new shell distance line
	 *
	 * @param {number} distance shell distance line value
	 * @param {number} shown displayed number value, `0` to hide the number
	 * @param {[number, number]} shownPos position of displayed number
	 */
	addOne(distance, shown = 0, shownPos = [0, 0]) {
		this.distanceLines.push({ distance, shown, shownPos });
		return this;
	}

	/**
	 * Adds multiple new shell distance lines
	 *
	 * @param {Object[]} distances
	 * @param {number} distances.distance shell distance line value
	 * @param {number} [distances.shown=] displayed number value, `0` to hide the number
	 * @param {[number, number]} [distances.shownPos=] position of displayed number
	 */
	addMulti(distances) {
		for (let d of distances) {
			this.addOne(d.distance, (d.shown || 0), (d.shownPos || [0,0]))
		}
		return this;
	}

	/** Adds a line as the max value, ensuring distance is shown properly
	 *  until this distance
	 */
	addMax(maxDistance = 20000) {
		this.distanceLines.push({ distance: maxDistance, shown: 0, shownPos: [0, 0] });
		return this;
	}

	getCode(autoAddMax = true) {
		if (autoAddMax) { this.addMax(); }

		this.distanceLines.sort((a, b) => (a.distance - b.distance));

		let compiledLines = [];
		for (let distanceInfo of this.distanceLines) {
			compiledLines.push(General.block("distance", [
				General.variable("distance", [distanceInfo.distance, distanceInfo.shown, 0]),
				General.variable("textPos", distanceInfo.shownPos)
			], { useOneLine: true }));
		}

		return General.block("crosshair_distances", compiledLines);
	}
}


export class CirclesBlock extends BlockLevel {
	constructor() {
		super();
		this.blockLines = [];
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
		return this;
	}

	getCode() {
		return General.block("drawCircles", this.blockLines);
	}
}


export class LinesBlock extends BlockLevel {
	constructor() {
		super();
		this.blockLines = [];
	}

	/**
	 * Adds a new line. Only its code will be kept
	 * @param {Line|string} l
	 */
	addOne(l) {
		if (typeof l == "string") {
			this.blockLines.push(l);
		} else {
			for (let f of l.getCodeFrags()) {
				this.blockLines.push(f);
			}
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
		return this;
	}

	getCode() {
		return General.block("drawLines", this.blockLines);
	}
}

export class TextsBlock extends BlockLevel {
	constructor() {
		super();
		this.blockLines = [];
	}

	/**
	 * Adds a new text. Only its code will be kept
	 * @param {TextSnippet|string} t
	 */
	addOne(t) {
		if (typeof t == "string") {
			this.blockLines.push(t);
		} else {
			this.blockLines.push(t.getCode());
		}
		return this;
	}

	/**
	 * Add one/multiple new texts. Only code will be kept
	 * @param {TextSnippet|string|TextSnippet[]|string[]} l
	 */
	add(t) {
		if (Array.isArray(t)) { for (let te of t) { this.addOne(te); } }
		else { this.addOne(t); }
		return this;
	}

	/** Adds a text line. Note leading double slash is auto generated by default */
	addComment(s, prefix = "// ") {
		this.blockLines.push(prefix + s);
		return this;
	}

	getCode() {
		return General.block("drawTexts", this.blockLines);
	}
}

// TODO:
// quads: "drawQuads",




//// ELEMENTS ////

/** A circle element */
export class Circle {
	/**
	 * @param {Object} obj
	 * @param {[number, number]=} obj.segment - (default `[0,360]`) start/end degree of curve
	 * @param {[number, number]} obj.pos - center position
	 * @param {number} obj.diameter - circle diameter
	 * @param {number=} obj.size - (default `1`) line width
	 * @param {boolean=} obj.move - (default `false`) if move with gun zero changes
	 * @param {boolean=} obj.thousandth - (default `true`) if use thousandth
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

	move([x, y]) {
		this.details.pos[0] += x;
		this.details.pos[1] += y;
		return this;
	}

	mirrorSegmentX() {
		let newSegment = [(360 - this.details.segment[1]), (360 - this.details.segment[0])];
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

	/**
	 * Returns the text for drawing a circle
	 */
	getCode() {
		let subVars = [];
		for (let k in this.details) {
			subVars.push(General.variable(k, this.details[k]));
		}
		return General.block("circle", subVars, { useOneLine: true });
	}

	getCodeMulti({ mirrorSegmentX = false } = {}) {
		let result = [];
		result.push(this.getCode());
		if (mirrorSegmentX) { result.push(this.copy().mirrorSegmentX().getCode()); }
		return result;
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
	} = {}, lineBreakPoints = []) {
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
	}

	//
	//

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


	/**
	 * Get code for all line frags into an array
	 * @returns {string[]}
	 */
	getCodeFrags() {
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

			let fragVarCodes = [];
			for (let k in fragDetails) {
				if (fragDetails[k] === null) { continue; }
				fragVarCodes.push(General.variable(k, fragDetails[k]));
			}

			lineAllFragCodes.push(General.block("line", fragVarCodes, { useOneLine: true }));
		}

		return lineAllFragCodes;
	}

	/**
	 * Get code for all frags of multiple lines into an array
	 * @returns {string[]}
	 */
	getCodeFragsMulti({ mirrorX = false, mirrorY = false } = {}) {
		let result = [];
		result = result.concat(this.getCodeFrags());
		if (mirrorX) { result = result.concat(this.copy().mirrorX().getCodeFrags()); }
		if (mirrorY) { result = result.concat(this.copy().mirrorY().getCodeFrags()); }
		if (mirrorX && mirrorY) { result = result.concat(this.copy().mirrorX().mirrorY().getCodeFrags()); }
		return result;
	}
}


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
	} = {}) {
		this.details = {
			text,
			align: (align === "center") ? 0 : (align === "left") ? 1 : (align === "right") ? 2 : align,
			pos,
			size,
			highlight,
			move,
			thousandth
		};
	}

	copy() {
		return (new TextSnippet(
			JSON.parse(JSON.stringify(this.details))
		));
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

	move([x, y]) {
		this.details.pos[0] += x
		this.details.pos[1] += y
		return this;
	}

	/**
	 * Returns the code for drawing a text
	 */
	getCode() {
		let subVars = [];
		for (let k in this.details) {
			let type = (k === "align") ? "i" : null;
			subVars.push(General.variable(k, this.details[k], type));
		}
		return General.block("text", subVars, { useOneLine: true });
	}

	getCodeMulti({ mirrorX = false, mirrorY = false } = {}) {
		let result = [];
		result.push(this.getCode());
		if (mirrorX) { result.push(this.copy().mirrorX().getCode()); }
		if (mirrorY) { result.push(this.copy().mirrorY().getCode()); }
		if (mirrorX && mirrorY) { result.push(this.copy().mirrorX().mirrorY().getCode()); }
		return result;
	}
}
