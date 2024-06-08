import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import Toolbox from "../../_lib2/sight_toolbox.js";

/**
 * @exports
 * @typedef {object} leadingReticleLineTypeTickParam
 * @property {number} aa - The fraction-based aspect angle for the tick.
 *                    For example, arcsin(30 deg) -> 2/4 -> 0.5
 * @property {"text"|"line"} type - Type of the tick, either an text or a
 *                            short verticle line
 * @property {string?=} text - The text to be drawn under the tick.
 *                      `"_tick_speed_"` will make the speed on this tick
 *                      to be drawn; `""`, `null` or undefined hides the text
 *
 * @property {number[]=} lineTickXOffsets - X position offset(s).
 *                       For `"line"` type tick only. Use `[0]` to draw
 *                       a single line without any bold.
 * @property {number=} lineTickYLen - Vertical length.
 *                     For `"line"` type tick only.
 *
 * @property {number=} textYPos - Height of the text
 * @property {number=} textSize - Size of the drawn text
 * @property {boolean=} textRepeated - If the text is drawn twice to make it
 *                      more visible
 *
 * @property {number=} horiLineBreakWidth - The width of break opened on the
 *                     horizontal line for this tick
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
 * @param {leadingReticleLineTypeTickParam[]} params.tickParams - Drawn ticks
 *                                            and their definitions
 *
 * @param {[number, number]=} params.horiLineAARange - Starting and ending
 *                            aspect angle for the horizontal leading line. Use
 *                            either the same starting-ending value or set it
 *                            to null/undefined to disable the line
 * @param {boolean=} params.horiLineRepeated - If the horizontal line is
 *                   drawn twice to make it more visible
 *
 * @param {number=} params.horiLineBreakWidthDefault - Default (fallback) value
 *                  of breaks added to the horizontal line by ticks
 * @param {number=} params.textSizeDefault - Default (fallback) value of
 *                  tick text size if not defined in tick parameter
 *                  specifically
 * @param {number=} params.textYPosDefault - Default (fallback) value of
 *                  tick height if not defined in tick parameter specifically
 *
 * @param {number[]=} params.lineTickXOffsetsDefault - Default (fallback)
 *                    X position offset(s) for drawn line-type ticks.
 *                    Use `[0]`, which is default, to draw a single line
 *                    without any bold.
 * @param {number=} params.lineTickYLenDefault -  Default Y length for drawn
 *                    line-type ticks
 */
export default ({
	assumedMoveSpeed,
	shellSpeed,
	tickParams = [],

	horiLineAARange = [0, 0],
	horiLineRepeated = false,

	horiLineBreakWidthDefault = 0,
	textSizeDefault = 1,
	textYPosDefault = 0,

	lineTickXOffsetsDefault = [0],
	lineTickYLenDefault = 1,

} = {}) => {

	let elements = [];

	// Draw horizontal leading line
	let horiLine = null;
	if (horiLineAARange && horiLineAARange[0] != horiLineAARange[1]) {
		horiLine = new Line({
			from: [Toolbox.calcLeadingMil(
				shellSpeed, assumedMoveSpeed, horiLineAARange[0]
			), 0],
			to: [Toolbox.calcLeadingMil(
				shellSpeed, assumedMoveSpeed, horiLineAARange[1]
			), 0],
		}).withMirrored("x");

		elements.push(horiLine);
		if (horiLineRepeated) { elements.push(horiLine); }
	}

	// Draw ticks
	for (let t of tickParams) {
		let tickX = Toolbox.calcLeadingMil(shellSpeed, assumedMoveSpeed, t.aa);

		// Add horizontal line break
		let addedHoriLineBreak = t.horiLineBreakWidth ?
			t.horiLineBreakWidth : horiLineBreakWidthDefault;
		if (horiLine && addedHoriLineBreak > 0) {
			horiLine.addBreakAtX(tickX, addedHoriLineBreak);
		}
		// Add tick element(s)
		if (t.type == "text") {
			if (t.text) {
				let drawnText = t.text == "_tick_speed_" ?
					t.aa == 1 ?
						(assumedMoveSpeed * t.aa).toFixed() :
						Toolbox.roundToHalf(assumedMoveSpeed * t.aa, -1).toString() :
					t.text;

				let textElement = new TextSnippet({
					text: drawnText,
					pos: [tickX, t.textYPos || textYPosDefault],
					size: t.textSize || textSizeDefault,
				}).withMirrored("x");

				elements.push(textElement);
				if (t.textRepeated) { elements.push(textElement); }
			}

		} else if (t.type == "line") {
			elements.push(...getLineTick(
				tickX,
				(t.lineTickYLen || lineTickYLenDefault),
				(t.lineTickXOffsets || lineTickXOffsetsDefault)
			));

		} else {
			// Draws an "E" for error
			elements.push(new TextSnippet({
				text: "E", pos: [tickX, 0], size: textSizeDefault
			}).withMirrored("x"));
		}
	}




	return elements;
}



//// Private helper functions ////

function getLineTick(xPos, yLen, drawnXBiases = [0]) {
	let elements = [];
	for (let biasX of drawnXBiases) {
		elements.push(new Line({
			from: [xPos + biasX, -yLen / 2],
			to: [xPos + biasX, yLen / 2]
		}).withMirrored("x"));
	}
	return elements;
}