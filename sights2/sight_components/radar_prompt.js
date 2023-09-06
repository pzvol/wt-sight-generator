// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Toolbox from "../../_lib2/sight_toolbox.js";
import { Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";

export const buildRadarPrompt = ({
	pos = [0, 0],
	curveDegree = 30,
	curveRadius = 34,
	pieDivisionCurveSizeMain = 3,
	pieDivisionCurveSizeSub = 2,

	radarLongRange = 20,
	radarShortRange = 10,
	textSizeLongRange = 0.85,
	textSizeShortRange = 0.65,
	textSizeLegend = 0.5,
	textPosPaddingLongRange = [0, 2],
	textPosPaddingShortRange = [-1.2, -2.4],
	textPosPaddingLegendLong = [1.5, -1.5],
	textPosPaddingLegendShort = [2, 0.5],
	weaponRanges = [
		{ range: 2, curveDegreeOnLong: 15, curveDegreeOnShort: 15, curveSize: 1.5 },
	],
} = {}) => {
	let lines = [];
	let circles = [];
	let texts = [];

	let degSin = Math.sin(Toolbox.degToRad(curveDegree));
	let degCos = Math.cos(Toolbox.degToRad(curveDegree));

	// Draw the radar pie part
	lines.push(new Line({ from: [0, 0], to: [curveRadius, 0] }));
	lines.push(new Line({
		from: [0, 0], to: [curveRadius * degCos, -curveRadius * degSin]
	}));
	// pie main divisions
	for (let divVal of [0.5, 1]) {
		circles.push(new Circle({
			segment: [90, 90 + curveDegree], size: pieDivisionCurveSizeMain,
			diameter: (curveRadius * 2) * divVal,
		}));
	}
	// pie sub divisions
	for (let divVal of [0.25, 0.75]) {
		circles.push(new Circle({
			segment: [90, 90 + curveDegree], size: pieDivisionCurveSizeSub,
			diameter: (curveRadius * 2) * divVal,
		}));
	}
	// long/short range texts
	texts.push(new TextSnippet({
		text: "L", size: textSizeLongRange, pos: [0, 0]
	}).move(textPosPaddingLongRange))
	for (let divVal of [0.25, 0.5, 0.75, 1]) {
		texts.push(new TextSnippet({
			text: `${Toolbox.round(radarLongRange * divVal, 1)}`,
			size: textSizeLongRange, pos: [curveRadius * divVal, 0]
		}).move(textPosPaddingLongRange));
	}
	texts.push(new TextSnippet({
		text: "S", size: textSizeShortRange, pos: [0, 0]
	}).move(textPosPaddingShortRange))
	for (let divVal of [0.25, 0.5, 0.75, 1]) {
		texts.push(new TextSnippet({
			text: `${Toolbox.round(radarShortRange * divVal, 1)}`,
			size: textSizeShortRange,
			pos: [curveRadius * degCos * divVal, -curveRadius * degSin * divVal]
		}).move(textPosPaddingShortRange));
	}
	// legend texts
	texts.push(new TextSnippet({
		text: "L Rng", align: "right", size: textSizeLegend,
		pos: [curveRadius, 0]
	}).move(textPosPaddingLegendLong));
	texts.push(new TextSnippet({
		text: "S Rng", align: "right", size: textSizeLegend,
		pos: [curveRadius * degCos, -curveRadius * degSin]
	}).move(textPosPaddingLegendShort));


	// Draw required weapon ranges
	for (let w of weaponRanges) {
		// on long range
		circles.push(new Circle({
			segment: [90, 90 + w.curveDegreeOnLong],
			diameter: (curveRadius * 2) * (w.range / radarLongRange),
			size: w.curveSize
		}));
		// on short range
		circles.push(new Circle({
			segment: [
				90 + curveDegree - w.curveDegreeOnShort,
				90 + curveDegree
			],
			diameter: (curveRadius * 2) * (w.range / radarShortRange),
			size: w.curveSize
		}));
	}


	// Move elements to desired pos
	for (let eleArr of [lines, circles, texts]) {
		for (let ele of eleArr) { ele.move(pos); }
	}

	return [].concat(lines, circles, texts);
};