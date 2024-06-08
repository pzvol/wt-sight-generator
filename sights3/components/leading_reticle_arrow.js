import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import Toolbox from "../../_lib2/sight_toolbox.js";

/**
 * @typedef {object} arrowTypeReticleTickParam
 * @property {number} aa - The fraction-based aspect angle for the tick.
 *                    For example, arcsin(30 deg) -> 2/4 -> 0.5
 * @property {"arrow"|"line"} type - Type of the tick, either an arrow or a
 *                            short verticle line
 * @property {string?=} text - The text to be drawn under the tick.
 *                      `"_tick_speed_"` will make the speed on this tick
 *                      to be drawn; `""`, `null` or undefined hides the text
 * @property {number=} yLen - Vertical length of the tick
 *
 * @property {number[]=} lineTickXOffsets - X position offset(s).
 *                       For `"line"` type tick only. Use `[0]` to draw
 *                       a single line without any bold.
 *
 * @property {number=} textSize - Size of the drawn text
 * @property {number=} textYPos - Vertical position of the drawn text
 * @property {number=} textYPosAdjustment - Additional vertical position
 *                     adjustment for drawing the text, based on `textYPos`
 * @property {boolean=} textRepeated - If the text is drawn twice to make it
 *                      more visible
 */


/**
 * Prompt cross starting from sight edges.
 * By default the line(s) lower edge will not be drawn.
 *
 *
 * @param {object} params
 * @param {number} params.assumedMoveSpeed - Assumed move speed for the reticle
 * @param {number} params.shellSpeed - Shell speed for the reticle. Be aware
 *                  this value should use the same unit as the assumed move
 *                  speed. For example, if the move speed is in KPH, the shell
 *                  speed in M/S should be converted by multiplying 3.6 here.
 * @param {arrowTypeReticleTickParam[]} params.tickParams - Drawn ticks and their definitions
 * @param {number=} params.tickYLenDefault - Default (fallback) value of
 *                  tick vertical length if not defined in tick parameter
 *                  specifically
 * @param {number=} params.textSizeDefault - Default (fallback) value of
 *                  tick text size if not defined in tick parameter
 *                  specifically
 * @param {number=} params.textYPosDefault - Default (fallback) value of
 *                  tick vertical position if not defined in tick parameter
 *                  specifically
 *
 * @param {number=} params.arrowDegree - Sharpness of arrow ticks
 * @param {number[]=} params.lineTickXOffsetsDefault - Default (fallback)
 *                    X position offset(s) for drawn line-type ticks.
 *                    Use `[0]`, which is default, to draw a single line
 *                    without any bold.
 */
export default ({
	assumedMoveSpeed,
	shellSpeed,
	tickParams = [],

	tickYLenDefault = 5,
	textSizeDefault = 1,
	textYPosDefault = 0,

	arrowDegree = 60,
	lineTickXOffsetsDefault = [0],

} = {}) => {

	let elements = [];

	for (let t of tickParams) {
		let tickX = Toolbox.calcLeadingMil(shellSpeed, assumedMoveSpeed, t.aa);
		// Draw tick
		if (t.type == "arrow") {
			elements.push(...getArrowElements(
 				tickX, (t.yLen || tickYLenDefault), arrowDegree
			));

		} else if (t.type == "line") {
			elements.push(...getLineElements(
				tickX,
				(t.yLen || tickYLenDefault),
				(t.lineTickXOffsets || lineTickXOffsetsDefault)
			));

		} else {
			// Draws an "E" for error
			elements.push(new TextSnippet({
				text: "E", pos: [tickX, 0], size: textSizeDefault
			}).withMirrored("x"));
		}

		// Draw text
		if (t.text) {
			let drawnText =
				t.text == "_tick_speed_" ?
					t.aa == 1 ?
						(assumedMoveSpeed * t.aa).toFixed() :
						Toolbox.roundToHalf(assumedMoveSpeed * t.aa, -1).toString() :
				t.text;
			let drawnYPos =
				(t.textYPos || textYPosDefault) + (t.textYPosAdjustment || 0);

			let textElement = new TextSnippet({
				text: drawnText,
				pos: [tickX, drawnYPos],
				size: t.textSize || textSizeDefault,
			}).withMirrored("x");

			elements.push(textElement);
			if (t.textRepeated) { elements.push(textElement); }
		}
	}

	return elements;
}



//// Private helper functions ////

function getArrowElements(xPos, yLen, arrowDegree) {
	let xHalfWidth = Math.tan(Toolbox.degToRad(arrowDegree / 2)) * yLen;
	let halfElements = [
		new Line({ from: [0, 0], to: [xHalfWidth, yLen] }),
		new Line({ from: [xHalfWidth, yLen], to: [xHalfWidth/2, yLen] }),
	]
	let elements = [];
	halfElements.forEach((ele) => {
		elements.push(ele);
		elements.push(ele.copy().mirrorX());
	});
	elements.forEach((ele) => {
		ele.move([xPos, 0]).withMirrored("x");
	});
	return elements;
}
function getLineElements(xPos, yLen, drawnXBiases = [0]) {
	let elements = [];
	for (let biasX of drawnXBiases) {
		elements.push(new Line({
			from: [xPos + biasX, 0], to: [xPos + biasX, yLen]
		}).withMirrored("x"));
	}
	return elements;
}