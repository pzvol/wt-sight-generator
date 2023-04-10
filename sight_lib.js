'use strict';


export default {
	SIGHT_LIB_VER: "0.0.1",
}



/** A sight (text) file */
export class Sight {
	/** Available block names in a sight file */
	static blockTitle = {
		vehicleClass: "matchExpClass",
		crosshairHorRanges: "crosshair_hor_ranges",
		shellDistances: "crosshair_distances",
		circles: "drawCircles",
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
 * Sight general setting lines
 */
export class General {
	/**
	 * Generate a new line of variable info
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

	static block(bName, bLines=[], inBlockLineEnd="\n", inBlockLineIndent="\t") {
		let result = `${bName} { ` + inBlockLineEnd;
		for (let l of bLines) {
			// Indent every line
			result +=
				l.replace(new RegExp(`^`, "gm"), `${inBlockLineIndent}`) +
				inBlockLineEnd;
		}
		result += "}";

		return result;
	}
}



export class MatchVehicleClass {
	static vehicleGroundDefaults = [
		"exp_tank", "exp_heavy_tank", "exp_tank_destroyer"
	];
	static vehicleSPAAs = ["exp_SPAA"];


	/**
	 * Generate a "matchExpClass" block text
	 *
	 * @param {string[]} includeCls
	 * @param {string[]} excludeCls
	 */
	static buildBlock(includeCls = [], excludeCls = [], inBlockLineEnd="\n", inBlockLineIndent="\t") {
		let innerLines = [];
		for (let c of includeCls) {
			innerLines.push(General.variable(c, true));
		}
		for (let c of excludeCls) {
			innerLines.push(General.variable(c, false));
		}

		return General.block(
			Sight.blockTitle.vehicleClass, innerLines,
			inBlockLineEnd, inBlockLineIndent
		)
	}
}



/** A circle element */
export class Circle {
	/**
	 * @param {object} details detailed info about the shape
	 * @param {[number, number]} details.segment start/end degree of curve
	 * @param {[number, number]} details.pos center position
	 * @param {number} details.diameter circle diameter
	 * @param {number} details.size line width
	 * @param {boolean} details.move if move with gun zero changes
	 * @param {boolean} details.thousandth if use thousandth
	 */
	constructor(details) {
		this.details = details;
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
			subVars.push(General.variable(k, this.details[k], null, "; "));
		}
		return General.block("circle", subVars, "", "")
	}


	static templateDetails() {
		return {
			segment: [0, 360],
			pos: [0, 0],
			diameter: 10,
			size: 1,
			move: true,
			thousandth: true
		};
	}
}


/**
 * A line with selectable breaking
 *
 * TODO: Add capability for adding breaking dashes
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
		return General.block("line", subVars, "", "")
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