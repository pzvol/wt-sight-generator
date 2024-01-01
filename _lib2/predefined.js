/**
 * Frequently used sight code pieces
 */

// WT Sight Generator: a simple library for generating War Thunder user sights
// from JavaScript
//
// Copyright (C) 2023  pzvol
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

'use strict';

import { BlkComment, BlkVariable } from "./sight_code_basis.js";
import Toolbox from "./sight_toolbox.js";




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
		new BlkComment("Color of sight"),
		new BlkVariable("crosshairColor", main, "c"),
		new BlkVariable("crosshairLightColor", sub, "c"),
	],

	scale: ({ font, line } = {}) => [
		new BlkComment("Sight scales"),
		new BlkVariable("fontSizeMult", font),
		new BlkVariable("lineSizeMult", line),
	],

	gunDistanceValuePos: ([x, y]) => [
		new BlkVariable("distanceCorrectionPos", [x, y]),
	],

	rgfdPos: ([x, y]) => [
		new BlkVariable("rangefinderHorizontalOffset", x),
		new BlkVariable("rangefinderVerticalOffset", y),
	],

	detectAllyPos: ([x, y]) => [
		new BlkVariable("detectAllyOffset", [x, y])
	],

	shellDistanceTickVars: (
		[mainTickSizeLarge, mainTickSizeSmall],
		[subTickSizeLarge, subTickSizeSmall],
		[mainTickPosX, mainTickPosY]
	) => [
			new BlkVariable("crosshairDistHorSizeMain", [mainTickSizeLarge, mainTickSizeSmall]),
			new BlkVariable("crosshairDistHorSizeAdditional", [subTickSizeLarge, subTickSizeSmall]),
			new BlkVariable("distancePos", [mainTickPosX, mainTickPosY]),
		]
};

/** A method for prompting all necessary basic components */
export const concatAllBasics = (zoomScale, color, rgfdPos, detectAllyPos, gunDistanceValuePos, shellDistanceTickSettings, misc = basic.miscVars.getCommon()) => {
	return ([].concat(
		zoomScale, "", color, "",
		rgfdPos, detectAllyPos, gunDistanceValuePos, "",
		shellDistanceTickSettings, "",
		misc, "",
	));
};


/**
 * Collection of frequently used basic settings variable combinations
 *
 * Combinations are saved as variable code line arrays
 */
export const basic = {
	colors: {
		getGreenRed: ({ main = [0, 200, 40, 255], sub = [180, 0, 0, 255] } = {}) => basicBuild.color({ main, sub }),
		getLightGreenRed: ({ main = [153, 255, 153, 255], sub = [180, 0, 0, 255] } = {}) => basicBuild.color({ main, sub }),

		getRedGreen: ({ main = [180, 0, 0, 255], sub = [0, 200, 40, 255] } = {}) => basicBuild.color({ main, sub }),
		getRedLightGreen: ({ main = [180, 0, 0, 255], sub = [153, 255, 153, 255] } = {}) => basicBuild.color({ main, sub }),

		getBlackYellow: ({ main = [0, 0, 0, 255], sub = [200, 200, 0, 255] } = {}) => basicBuild.color({ main, sub }),
	},

	scales: {
		getCommon: ({ font = 0.8, line = 1.1 } = {}) => basicBuild.scale({ font, line }),
		getCommonLargeFont: ({ font = 1.5, line = 1.3 } = {}) => basicBuild.scale({ font, line }),
		getMidHighZoom: ({ font = 0.75, line = 1.2 } = {}) => basicBuild.scale({ font, line }),
		getHighZoom: ({ font = 0.9, line = 1.5 } = {}) => basicBuild.scale({ font, line }),
		getHighZoomSmallFont: ({ font = 0.5, line = 1.6 } = {}) => basicBuild.scale({ font, line }),
		getHighZoomSmall2Font: ({ font = 0.35, line = 1.5 } = {}) => basicBuild.scale({ font, line }),
		getHighZoomLargeFont: ({ font = 1.5, line = 1.3 } = {}) => basicBuild.scale({ font, line }),

		getSPAACommon: ({ font = 0.9, line = 1.5 } = {}) => basicBuild.scale({ font, line }),
		getSPAAHighZoom: ({ font = 0.9, line = 1.5 } = {}) => basicBuild.scale({ font, line }),
		getSPAAHighZoomLargeFont: ({ font = 1.5, line = 1.3 } = {}) => basicBuild.scale({ font, line }),
		getSPAAHighZoomSmallFont: ({ font = 0.5, line = 1.4 } = {}) => basicBuild.scale({ font, line }),
	},

	shellDistanceTicks: {
		getHighZoomCentral: ({
			main = [0, 0],
			sub = [0.0070, 0.0025],
			distPos = [0.005, 0] } = {}
		) => basicBuild.shellDistanceTickVars(main, sub, distPos),
	},

	miscVars: {
		getCommon: () => [
			new BlkVariable("rangefinderTextScale", 0.8),
			new BlkVariable("rangefinderUseThousandth", false),
			new BlkVariable("rangefinderProgressBarColor1", [255, 255, 255, 216], "c"),
			new BlkVariable("rangefinderProgressBarColor2", [0, 0, 0, 216], "c"),

			new BlkVariable("detectAllyTextScale", 0.8),

			new BlkVariable("crosshairHorVertSize", [0.5, 0.3]),
			new BlkVariable("drawDistanceCorrection", true),
			new BlkVariable("drawCentralLineVert", false),
			new BlkVariable("drawCentralLineHorz", false),
			new BlkVariable("drawSightMask", true),
		]
	}
};


/** Shell distance tick combinations */
export const shellDists = {
	getFull: (shownRightX = 0, {
		shownRightOneDigitPadding = -0.0065,
		shownNumYAdjust = -0.0009
	} = {}) => {
		let result = [];
		for (let d of Toolbox.rangeIE(200, 4000, 400)) {
			result.push({ distance: d });  // sub ticks
		}
		for (let d of Toolbox.rangeIE(400, 4000, 800)) {
			result.push({
				distance: d, shown: d / 100,
				shownPos: [0, shownNumYAdjust]
			});  // main ticks left
		}
		for (let d of Toolbox.rangeIE(800, 4000, 800)) {
			result.push({
				distance: d, shown: d / 100,
				shownPos: (d/100 < 10 && shownRightX > 0) ?
					[shownRightX + shownRightOneDigitPadding, shownNumYAdjust] :
					[shownRightX, shownNumYAdjust],
			});  // main ticks right
		}
		return result.sort((a, b) => (a.distance - b.distance));
	},

	getFullLoose: (shownRightX = 0, {
		shownNumYAdjust = -0.0009
	} = {}) => {
		let result = [];
		for (let d of Toolbox.rangeIE(400, 4000, 800)) {
			result.push({ distance: d });  // sub ticks
		}
		for (let d of Toolbox.rangeIE(800, 4000, 1600)) {
			result.push({
				distance: d, shown: d / 100,
				shownPos: [0, shownNumYAdjust]
			});  // main ticks left
		}
		for (let d of Toolbox.rangeIE(1600, 4000, 1600)) {
			result.push({
				distance: d, shown: d / 100,
				shownPos: [shownRightX, shownNumYAdjust]
			});  // main ticks right
		}
		return result.sort((a, b) => (a.distance - b.distance));
	}
};
