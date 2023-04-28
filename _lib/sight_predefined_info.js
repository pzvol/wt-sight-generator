/** Usually used code blocks */

'use strict';

import {
	General as G,
	Toolbox as T,
	Line,
	TextSnippet
} from "./sight_lib.js";

export default {};


/**
 * Collection of method for building frequently used basic variable combinations
 *
 * Combinations are saved as variable code line arrays
 */
export const basicBuild = {
	distanceValuePos: ([x, y]) => [
		G.variable("distanceCorrectionPos", [x, y]),
	],

	rgfdPos: ([x, y]) => [
		G.variable("rangefinderHorizontalOffset", x),
		G.variable("rangefinderVerticalOffset", y),
	],

	detectAllyPos: ([x, y]) => [
		G.variable("detectAllyOffset", [x, y])
	],

	shellDistanceTickVars: (
		[mainTickSizeLarge, mainTickSizeSmall],
		[subTickSizeLarge, subTickSizeSmall],
		[mainTickPosX, mainTickPosY]
	) => [
			G.variable("crosshairDistHorSizeMain", [mainTickSizeLarge, mainTickSizeSmall]),
			G.variable("crosshairDistHorSizeAdditional", [subTickSizeLarge, subTickSizeSmall]),
			G.variable("distancePos", [mainTickPosX, mainTickPosY]),
		]
};


/**
 * Collection of frequently used basic variable combinations
 *
 * Combinations are saved as variable code line arrays
 */
export const basic = {
	colors: {
		getGreenRed: () => [
			G.comment("Color of sight"),
			G.variable("crosshairColor", [0, 200, 40, 255], "c"),
			G.variable("crosshairLightColor", [180, 0, 0, 255], "c"),
		],
	},

	sizeScales: {
		getHighZoom: ({ font = 0.9, line = 1.5 } = {}) => [
			G.comment("Sight scales"),
			G.variable("fontSizeMult", font),
			G.variable("lineSizeMult", line),
		],
	},

	shellDistanceTicks: {
		getHighZoomCentral: ({
			main = [0, 0],
			sub = [0.0070, 0.0025],
			distPos = [0.005, 0] } = {}
		) => basicBuild.shellDistanceTickVars(main, sub, distPos),
	},

	getMiscCommonVars: () => [
		G.variable("rangefinderTextScale", 0.8),
		G.variable("rangefinderUseThousandth", false),
		G.variable("rangefinderProgressBarColor1", [255, 255, 255, 216], "c"),
		G.variable("rangefinderProgressBarColor2", [0, 0, 0, 216], "c"),

		G.variable("detectAllyTextScale", 0.8),

		G.variable("crosshairHorVertSize", [0.5, 0.3]),
		G.variable("drawDistanceCorrection", true),
		G.variable("drawCentralLineVert", false),
		G.variable("drawCentralLineHorz", false),
		G.variable("drawSightMask", true),
	],
};


/** A method for prompting all necessary basic components */
export const concatAllBasics = (zoomScale, color, rgfdPos, detectAllyPos, gunDistanceVal, gunDistanceTickSettings, misc = basic.getMiscCommonVars()) => {
	return ([].concat(
		zoomScale, "", color, "", rgfdPos, "", detectAllyPos, "",
		gunDistanceVal, "", gunDistanceTickSettings, "",
		misc, "",
	));
};


export const shellDistances = {
	getFullLoose: () => {
		let result = [];
		for (let r of T.rangeIE(400, 4000, 800)) {  // small ticks
			result.push({ distance: r });
		}
		for (let r of T.rangeIE(800, 4000, 800)) {  // large ticks
			result.push({ distance: r, shown: Math.round(r / 100) });
		}
		result.sort((a, b) => (a.distance, b.distance));
		return result;
	}
};



/** Frequently used thousandth values */
export const rgfdThousandths = {
	getWidths(assumeWidth = 3.3, distances = [100, 200, 400, 600, 800, 1000, 1200, 1600, 2000]) {
		let result = {};
		for (let d of distances) {
			result[`d_${d}`] = T.calcThousandth(assumeWidth, d);
		}
		return result;
	},

	getHalfWidths(assumeWidth = 3.3, distances = [100, 200, 400, 600, 800, 1000, 1200, 1600, 2000]) {
		let result = {};
		for (let d of distances) {
			result[`d_${d}`] = T.calcThousandth(assumeWidth, d) / 2;
		}
		return result;
	}
};

// text {
// 	text:t = "8"
// 	align:i = 2
// 	pos:p2 = 4.36, 2.625
// 	move:b = no
// 	thousandth:b = yes
// 	size:r = 0.65
// 	highlight:b=yes
// 	}


export const rgfd = {
	getHighZoom: ([posX, posY] = [0, 0], {
		showMiddleLine = false,
		mirrorY = false,
		assumeWidth = 3.3,
		distances = [800, 1000, 1200, 1400, 1600, 2000],
		distancesDashed = [800],
		tickLength = 0.75,
		tickInterval = 0.25,
		tickDashWidth = 0.35,
		textSize = 0.65,
	} = {}) => {
		let lines = [];
		let texts = [];

		let currStartY = 0;
		for (let dist of distances) {
			let thWidth = T.calcThousandth(assumeWidth, dist);

			let startLine = new Line({ from: [0, 0], to: [0, tickLength] });
			let endLine = new Line({ from: [-thWidth, 0], to: [-thWidth, tickLength] });
			let text = new TextSnippet({
				text: (dist / 100).toFixed(0),
				align: "right",
				pos: [0.235, tickLength / 2],
				size: textSize
			});

			if (distancesDashed.findIndex(v => v === dist) > -1) {
				startLine.addBreakAtY(tickLength / 2, tickDashWidth);
				endLine.addBreakAtY(tickLength / 2, tickDashWidth);
			}

			startLine.move([0, currStartY]);
			endLine.move([0, currStartY]);
			text.move([0, currStartY]);

			if (mirrorY) {
				startLine.mirrorY();
				endLine.mirrorY();
				text.mirrorY();
			}

			startLine.move([posX, posY]);
			endLine.move([posX, posY]);
			text.move([posX, posY]);

			lines.push(`// ${dist}m`)
			if (showMiddleLine || startLine.lineEnds.from[0] !== 0) {
				lines.push(startLine);
			}
			if (showMiddleLine || endLine.lineEnds.from[0] !== 0) {
				lines.push(endLine);
			}
			texts.push(text);

			currStartY += tickLength + tickInterval;
		}

		return { lines, texts };
	}
};