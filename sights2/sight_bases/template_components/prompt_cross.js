import { Quad, Circle, Line, TextSnippet } from "../../../_lib2/sight_elements.js";


/**
 * Prompt cross starting from sight edges.
 * By default the line(s) lower edge will not be drawn.
 *
 * @param {object} params
 * @param {{to: number, offsets: number[]}[]=} params.horiLines - Horizontal
 *        lines and bold settings
 * @param {{to: number, offsets: number[]}[]=} params.vertLines - Vertical lines
 *        and bold settings
 *
 * @param {boolean=} params.drawHori - If horizontal lines are drawn
 * @param {boolean=} params.drawUpperVert - If upper vertical lines are drawn
 * @param {boolean=} params.drawLowerVert - If lower vertical lines are drawn
 * @param {boolean=} params.useThousandth - If use thousandth position values
 */
export default ({
	horiLines = [{to: 50, offsets: [0]}],
	vertLines = [{to: 50, offsets: [0]}],
	drawHori = true,
	drawUpperVert = true,
	drawLowerVert = false,
	useThousandth = true,
} = {}) => {

	let elements = [];

	if (drawHori) {
		for (let horiSettings of horiLines) {
			for (let yPos of horiSettings.offsets) {
				elements.push(new Line({
					from: [450, yPos], to: [horiSettings.to, yPos],
					thousandth: useThousandth,
				}).withMirrored(yPos === 0 ? "x" : "xy"));
			}
		}
	}

	for (let vertSettings of vertLines) {
		for (let xPos of vertSettings.offsets) {
			let lowerVertLine = new Line({
				from: [xPos, 450], to: [xPos, vertSettings.to],
				thousandth: useThousandth,
			}).withMirrored(xPos === 0 ? "" : "x");
			if (drawLowerVert) { elements.push(lowerVertLine); }
			if (drawUpperVert) { elements.push(lowerVertLine.copy().mirrorY()); }
		}
	}

	return elements;
}