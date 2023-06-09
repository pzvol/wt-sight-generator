/**
 * WT Sight Generator: a simple library for generating War Thunder user sights
 * from JavaScript
 *
 * Copyright (C) 2023  pzvol
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *
 *
 * (Personally) frequently used code blocks
 */

'use strict';

import {
	General as G,
	Toolbox as T,
	Line,
	TextSnippet,
	Circle
} from "./sight_lib.js";

export default {};


/**
 * Collection of method for building frequently used basic variable combinations
 *
 * Combinations are saved as variable code line arrays
 */
export const basicBuild = {
	/**
	 * @param {Object} in - color settings
	 * @param {[number, number, number, number]} in.main - main default color
	 * @param {[number, number, number, number]} in.sub - sub color
	 */
	color: ({ main, sub } = {}) => [
		G.comment("Color of sight"),
		G.variable("crosshairColor", main, "c"),
		G.variable("crosshairLightColor", sub, "c"),
	],

	scale: ({ font, line } = {}) => [
		G.comment("Sight scales"),
		G.variable("fontSizeMult", font),
		G.variable("lineSizeMult", line),
	],

	gunDistanceValuePos: ([x, y]) => [
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
		getGreenRed: ({ main = [0, 200, 40, 255], sub = [180, 0, 0, 255] }={}) => basicBuild.color({ main, sub }),
		getRedGreen: ({ main = [180, 0, 0, 255], sub = [0, 200, 40, 255] }={}) => basicBuild.color({ main, sub }),
		getBlackYellow: ({ main = [0, 0, 0, 255], sub = [200, 200, 0, 255] }={}) => basicBuild.color({ main, sub }),
	},

	scales: {
		getCommon: ({ font = 0.8, line = 1.1 }={}) => basicBuild.scale({ font, line }),
		getMidHighZoom: ({ font = 0.75, line = 1.2 }={}) => basicBuild.scale({ font, line }),
		getHighZoom: ({ font = 0.9, line = 1.5 }={}) => basicBuild.scale({ font, line }),

		getSPAACommon: ({ font = 0.9, line = 1.5 }={}) => basicBuild.scale({ font, line }),
		getSPAAHighZoom: ({ font = 0.9, line = 1.5 }={}) => basicBuild.scale({ font, line }),
		getSPAAHighZoomLargeFont: ({ font = 1.5, line = 1.3 }={}) => basicBuild.scale({ font, line }),
		getSPAAHighZoomSmallFont: ({ font = 0.5, line = 1.4 }={}) => basicBuild.scale({ font, line }),
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
export const concatAllBasics = (zoomScale, color, rgfdPos, detectAllyPos, gunDistanceValuePos, shellDistanceTickSettings, misc = basic.getMiscCommonVars()) => {
	return ([].concat(
		zoomScale, "", color, "",
		rgfdPos, detectAllyPos, gunDistanceValuePos, "",
		shellDistanceTickSettings, "",
		misc, "",
	));
};


export const shellDistances = {
	getFull: () => {
		let result = [];
		for (let r of T.rangeIE(200, 4000, 400)) {  // small ticks
			result.push({ distance: r });
		}
		for (let r of T.rangeIE(400, 4000, 400)) {  // large ticks
			result.push({ distance: r, shown: Math.round(r / 100) });
		}
		result.sort((a, b) => (a.distance, b.distance));
		return result;
	},

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
	},

	getFullLooseTwoSides: ({rightOffset} = {}) => {
		let result = [];
		for (let r of T.rangeIE(400, 4000, 800)) {  // small ticks
			result.push({ distance: r });
		}
		for (let r of T.rangeIE(800, 4000, 1600)) {  // large left ticks
			result.push({ distance: r, shown: Math.round(r / 100) });
		}
		for (let r of T.rangeIE(1600, 4000, 1600)) {  // large right ticks
			result.push({
				distance: r, shown: Math.round(r / 100),
				shownPos: [rightOffset, 0]
			});
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


export const rgfdBuild = {
	/**
	 * @param {[number, number]} pos - position of the rangefinder,
	 * @param {Object} obj - rangefinder settings
	 * @param {boolean} obj.showMiddleLine - if lines will be shown when their
	 *                                       Y value are `0`
	 * @param {boolean} obj.mirrorY - if rangefinder is mirrored in Y direction
	 * @param {number} obj.assumeWidth - assumed target width
	 * @param {number[]} obj.distances - included distance values
	 * @param {number[]} obj.distancesDashed - values in `distances` who use dashed lines.
	 *                                        Must not be a line-connected one
	 * @param {number[]} obj.distancesLined - values in `distances` who use a line to connect two sides.
	 *                                        Must not be a dashed one
	 * @param {number} obj.tickLength - line length for each distances
	 * @param {number} obj.tickInterval - space between distance lines
	 * @param {number} obj.tickDashWidth - empty space between dashed line fragments
	 * @param {number} obj.textSize - prompt text size
	 * @param {number} obj.textSpace - prompt text horizontal distance from tick lines
	 * @param {number} obj.textPosYAdjust - adjust text vertical position
	 *
	 * @returns {{lines: (Line|string)[], texts: (TextSnippet|string)[]}} an object with all components.
	 *          Note that in arrays there could be string elements included
	 */
	linedVertical: ([posX, posY], {
		showMiddleLine, mirrorY,
		assumeWidth, distances, distancesDashed, distancesLined,
		tickLength, tickInterval, tickDashWidth,
		textSize, textSpace,
		textPosYAdjust = 0
	} = {}) => {
		let lines = [];
		let texts = [];

		let currStartY = 0;
		for (let dist of distances) {
			let thWidth = T.calcThousandth(assumeWidth, dist);

			// Is two-side-connected tick?
			let lineFromPosY = 0;
			let additionalLine = null;
			if (distancesLined.findIndex(v => v === dist) > -1) {
				lineFromPosY = tickLength / 2;
				additionalLine = new Line({ from: [0, lineFromPosY], to: [-thWidth, lineFromPosY] });
			}

			let startLine = new Line({ from: [0, lineFromPosY], to: [0, tickLength] });
			let endLine = new Line({ from: [-thWidth, lineFromPosY], to: [-thWidth, tickLength] });
			let text = new TextSnippet({
				text: (dist / 100).toFixed(0),
				align: "right",
				pos: [textSpace, tickLength / 2],
				size: textSize
			});

			if (distancesDashed.findIndex(v => v === dist) > -1) {
				startLine.addBreakAtY(tickLength / 2, tickDashWidth);
				endLine.addBreakAtY(tickLength / 2, tickDashWidth);
			}

			startLine.move([0, currStartY]);
			endLine.move([0, currStartY]);
			text.move([0, currStartY]);
			if (additionalLine) { additionalLine.move([0, currStartY]); }

			if (mirrorY) {
				startLine.mirrorY();
				endLine.mirrorY();
				text.mirrorY();
				if (additionalLine) { additionalLine.mirrorY(); }
			}

			text.move([0, textPosYAdjust]);

			startLine.move([posX, posY]);
			endLine.move([posX, posY]);
			text.move([posX, posY]);
			if (additionalLine) { additionalLine.move([posX, posY]); }

			lines.push(`// ${dist}m`);
			if (showMiddleLine || startLine.lineEnds.from[0] !== 0) {
				lines.push(startLine);
			}
			if (showMiddleLine || endLine.lineEnds.from[0] !== 0) {
				lines.push(endLine);
			}
			texts.push(text);
			if (additionalLine) { lines.push(additionalLine); }

			currStartY += tickLength + tickInterval;
		}

		return { lines, texts };
	},

	/**
	 * @param {[number, number]} pos - position of the rangefinder,
	 * @param {Object} obj - rangefinder settings
	 * @param {boolean} obj.mirrorY - if rangefinder is mirrored in Y direction
	 * @param {number} obj.assumeWidth - assumed target width
	 * @param {number[]} obj.distances - included distance values
	 * @param {[number, number]} obj.circleSegmentRight - segment range for right curves
	 * @param {Object} obj.circleSizes - curve line size for each distance.
	 *                                   Eg, `{ d_100: 1.5 }` sets size to 1.5 for
	 *                                   curves at 100m distance
	 * @param {number} obj.circleSizeDefault - default curve line size being used
	 *                                         if no specification in `circleSizes`
	 * @param {number} obj.circleCenterHeightInterval - Y distance between circle centers
	 * @param {number} obj.textSize - prompt text size
	 * @param {number} obj.textSpace - prompt text horizontal distance from tick lines
	 * @returns {{circles: (Circle|string)[], texts: (TextSnippet|string)[]}} an object with all components.
	 *          Note that in arrays there could be string elements included
	 */
	circledVerticle: ([posX, posY], {
		mirrorY,
		assumeWidth, distances, circleSegmentRight,
		circleSizes, circleSizeDefault, circleCenterHeightInterval,
		textSize, textSpace
	}={}) => {
		let circles = [];
		let texts = [];

		let currStartY = 0;
		for (let dist of distances) {
			let diameter = T.calcThousandth(assumeWidth, dist);
			let c = new Circle({
				segment: circleSegmentRight,
				pos: [-(diameter / 2), currStartY],
				diameter: diameter,
				size: circleSizes.hasOwnProperty(`d_${dist}`) ?
					circleSizes[`d_${dist}`] : circleSizeDefault
			});
			let t = new TextSnippet({
				text: (dist / 100).toFixed(0),
				align: "right",
				pos: [textSpace, currStartY],
				size: textSize
			});

			if (mirrorY) {
				c.mirrorPosY();  // TODO : mirror segment Y
				t.mirrorY();
			}

			c.move([posX, posY]);
			t.move([posX, posY]);

			circles.push(`// ${dist}m`);
			circles.push(c);
			circles.push(c.copy().mirrorSegmentX());
			texts.push(t);

			currStartY += circleCenterHeightInterval;
		}

		return { circles, texts };
	}
};


export const rgfd = {
	getCommon: ([posX, posY] = [0, 0], {
		showMiddleLine = false,
		mirrorY = false,
		assumeWidth = 3.3,
		distances = [400, 600, 800, 1000, 1200, 1600, 2000],
		distancesDashed = [400],
		distancesLined = [1200, 1600, 2000],
		tickLength = 2,
		tickInterval = 1,
		tickDashWidth = 0.75,
		textSize = 0.6,
		textSpace = 0.75,
		textPosYAdjust = -0.3
	} = {}) => rgfdBuild.linedVertical([posX, posY], {
		showMiddleLine, mirrorY, assumeWidth, distances, distancesDashed, distancesLined,
		tickLength, tickInterval, tickDashWidth, textSize, textSpace, textPosYAdjust
	}),

	getHighZoom: ([posX, posY] = [0, 0], {
		showMiddleLine = false,
		mirrorY = false,
		assumeWidth = 3.3,
		distances = [800, 1000, 1200, 1400, 1600, 2000],
		distancesDashed = [800],
		distancesLined = [],
		tickLength = 0.75,
		tickInterval = 0.25,
		tickDashWidth = 0.35,
		textSize = 0.65,
		textSpace = 0.235
	} = {}) => rgfdBuild.linedVertical([posX, posY], {
		showMiddleLine, mirrorY, assumeWidth, distances, distancesDashed, distancesLined,
		tickLength, tickInterval, tickDashWidth, textSize, textSpace
	}),

	getCircledMidHighZoom: ([posX, posY] = [0, 0], {
		mirrorY = false,
		assumeWidth = 3.3,
		distances = [800, 1200, 1600, 2000],
		circleSegmentRight = [60, 120],
		circleSizes = {
			d_800: 1.3, d_1200: 1.1, d_1600: 1.1, d_2000: 1.0
		},
		circleSizeDefault = 1.3,
		circleCenterHeightInterval = 2,
		textSize = 0.6,
		textSpace = 0.675
	}={}) => rgfdBuild.circledVerticle([posX, posY], {
		mirrorY, assumeWidth, distances, circleSegmentRight,
		circleSizes, circleSizeDefault, circleCenterHeightInterval,
		textSize, textSpace
	}),
};