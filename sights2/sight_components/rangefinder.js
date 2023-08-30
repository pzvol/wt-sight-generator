// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Toolbox from "../../_lib2/sight_toolbox.js";
import { Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";


export const rangefinderBuild = {
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
	 * @returns {(Line|TextSnippet)[]} all elements
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
			let milWidth = Toolbox.calcDistanceMil(assumeWidth, dist);

			// Is two-side-connected tick?
			let lineFromPosY = 0;
			let additionalLine = null;
			if (distancesLined.findIndex(v => v === dist) > -1) {
				lineFromPosY = tickLength / 2;
				additionalLine = new Line({ from: [0, lineFromPosY], to: [-milWidth, lineFromPosY] });
			}

			let startLine = new Line({ from: [0, lineFromPosY], to: [0, tickLength] });
			let endLine = new Line({ from: [-milWidth, lineFromPosY], to: [-milWidth, tickLength] });
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

			// lines.push(new BlkComment(`${dist}m`));
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

		return [].concat(lines, texts);
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
	 *
	 * @returns {(Circle|TextSnippet)[]} all elements
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
			let diameter = Toolbox.calcDistanceMil(assumeWidth, dist);
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

			// circles.push(new BlkComment(`${dist}m`));
			circles.push(c);
			circles.push(c.copy().mirrorSegmentX());
			texts.push(t);

			currStartY += circleCenterHeightInterval;
		}

		return [].concat(circles, texts);
	}
};


export default {
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
	} = {}) => rangefinderBuild.linedVertical([posX, posY], {
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
	} = {}) => rangefinderBuild.linedVertical([posX, posY], {
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
	}={}) => rangefinderBuild.circledVerticle([posX, posY], {
		mirrorY, assumeWidth, distances, circleSegmentRight,
		circleSizes, circleSizeDefault, circleCenterHeightInterval,
		textSize, textSpace
	}),
};