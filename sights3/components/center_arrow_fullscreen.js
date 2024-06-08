import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import Toolbox from "../../_lib2/sight_toolbox.js";


/**
 * Center arrow (reverse V) extending to sight bottom
 *
 * @param {object=} params
 * @param {number=} params.lineSlopeDegree
 * @param {number[]=} params.boldYOffests - Additional lines will be drawn
 *                   for bolding the arrow. This array describes the Y offsets
 *                   of every bold lines. `0` in the array will be omitted.
 * @param {number=} params.overallYPadding - The Y offset for all arrow lines.
 *                 This can be used to ensure thick line does not cover the
 *                 very screen center, and keep the arrow very top at center.
 * @param {number=} params.promptCurveRadius - Radius of prompt curve. `0`
 *                 will hide the element
 * @param {number=} params.promptCurveSize - Thickness(`size`) of prompt curve.
 *                 `0` will hide the element
 * @param {number=} params.lowerVertLineEndY - The Y of the position of
 *                 the lower vertical line end
 */
const drawArrow = ({
	lineSlopeDegree = 40,
	overallYPadding = 0.02,

	boldYOffests = Toolbox.rangeIE(0, 0.08, 0.02),
	promptCurveRadius = 8.25,
	promptCurveSize = 1,
	lowerVertLineEndY = promptCurveRadius,
} = {}) => {

	let elements = [];

	// Draw arrow and bold
	let arrowLineBasis = new Line({
		from: [0, 0],
		to: [Math.tan(Toolbox.degToRad(lineSlopeDegree)) * 450, 450]
	}).withMirrored("x").move([0, overallYPadding]);
	// ^ Moving down a little bit to let the arrow vertex stays the center
	//   with being less effected by line widths
	elements.push(arrowLineBasis);
	for (let boldYOffest of boldYOffests) {
		if (boldYOffest === 0) { continue; }
		elements.push(arrowLineBasis.copy().move([0, boldYOffest]));
	}

	// Draw prompt curve
	if (promptCurveRadius > 0) {
		elements.push(new Circle({
			segment: [-lineSlopeDegree, lineSlopeDegree],
			diameter: promptCurveRadius * 2,
			size: promptCurveSize
		}));
	}

	// Draw lower vertical line
	elements.push(new Line({
		from: [0, 450],
		to: [0, lowerVertLineEndY]
	}));

	return elements;
}


/** Presets with potentially some field(s) undefined */
drawArrow.presetPartial = {};

drawArrow.presetPartial["z2z15"] = {
	overallYPadding: 0.02,
	boldYOffests: Toolbox.rangeIE(0, 0.10, 0.02),
	promptCurveRadius: undefined,
	promptCurveSize: 1.2,
};
drawArrow.presetPartial["z4z9"] =
drawArrow.presetPartial["z3z12"] =
drawArrow.presetPartial["z4z12"] =
drawArrow.presetPartial["z6z11"] = {
	overallYPadding: 0.02,
	boldYOffests: Toolbox.rangeIE(0, 0.08, 0.02),
	promptCurveRadius: undefined,
	promptCurveSize: 1.2,
};
drawArrow.presetPartial["z8"] = {
	overallYPadding: 0.02,
	boldYOffests: Toolbox.rangeIE(0, 0.12, 0.03),
	promptCurveRadius: undefined,
	promptCurveSize: 1.2,
};
drawArrow.presetPartial["z8z16"] = {
	overallYPadding: 0.02,
	boldYOffests: Toolbox.rangeIE(0, 0.06, 0.03),
	promptCurveRadius: undefined,
	promptCurveSize: 1.2,
};


export default drawArrow;