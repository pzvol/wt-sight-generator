// SCRIPT_DO_NOT_DIRECTLY_COMPILE

/**
 * Frequently used sight code pieces
 */

'use strict';

import { BlkVariable } from "../../_lib2/sight_code_basis.js";
import Toolbox from "../../_lib2/sight_toolbox.js";


//// FOR SIGHT SETTINGS ////
// For simplification, objects for settings will use `s` as prefix instead of
// `settings`

/** Predefined color settings variables */
export const sColor = {
	/**
	 * @param {Object} params - Color settings
	 * @param {[number, number, number, number]} params.main - Main color
	 * @param {[number, number, number, number]} params.sub - Sub color
	 */
	build: ({ main, sub } = {}) => [
		new BlkVariable("crosshairColor", main, "c"),
		new BlkVariable("crosshairLightColor", sub, "c"),
	],

	getGreenRed: ({ main = [10, 210, 50, 255], sub = [180, 0, 0, 255] } = {}) => sColor.build({ main, sub }),
	// ^ Old green: [0, 200, 40, 255]
	// Unused:
	// getLessLightGreenRed: ({ main = [103, 245, 103, 255], sub = [180, 0, 0, 255] } = {}) => colorSettings.build({ main, sub }),
	getLightGreenRed: ({ main = [153, 255, 153, 255], sub = [180, 0, 0, 255] } = {}) => sColor.build({ main, sub }),
	getRedGreen: ({ main = [180, 0, 0, 255], sub = [10, 210, 50, 255] } = {}) => sColor.build({ main, sub }),
	getRedLightGreen: ({ main = [180, 0, 0, 255], sub = [153, 255, 153, 255] } = {}) => sColor.build({ main, sub }),
	getBlackYellow: ({ main = [0, 0, 0, 255], sub = [200, 200, 0, 255] } = {}) => sColor.build({ main, sub }),
};


/** Predefined font/line scale settings variables */
export const sScale = {
	build: ({ font, line } = {}) => [
		new BlkVariable("fontSizeMult", font),
		new BlkVariable("lineSizeMult", line),
	],

	getCommon: ({ font = 0.8, line = 1.1 } = {}) => sScale.build({ font, line }),
	getCommonLargeFont: ({ font = 1.5, line = 1.3 } = {}) => sScale.build({ font, line }),
	getMidHighZoom: ({ font = 0.75, line = 1.2 } = {}) => sScale.build({ font, line }),
	getHighZoom: ({ font = 0.9, line = 1.5 } = {}) => sScale.build({ font, line }),
	getHighZoomSmallFont: ({ font = 0.5, line = 1.6 } = {}) => sScale.build({ font, line }),
	getHighZoomSmall2Font: ({ font = 0.35, line = 1.5 } = {}) => sScale.build({ font, line }),
	getHighZoomLargeFont: ({ font = 1.5, line = 1.3 } = {}) => sScale.build({ font, line }),

	getSPAACommon: ({ font = 0.9, line = 1.5 } = {}) => sScale.build({ font, line }),
	getSPAAHighZoom: ({ font = 0.9, line = 1.5 } = {}) => sScale.build({ font, line }),
	getSPAAHighZoomLargeFont: ({ font = 1.5, line = 1.3 } = {}) => sScale.build({ font, line }),
	getSPAAHighZoomSmallFont: ({ font = 0.5, line = 1.4 } = {}) => sScale.build({ font, line }),
};


/** Current gun distance text settings variables */
export const sGunDistValue = {
	build: ([x, y], {
		enabled = true,
	} ={}) => [
		new BlkVariable("distanceCorrectionPos", [x, y]),
		new BlkVariable("drawDistanceCorrection", enabled),
	],
};


/** Range measuring result text settings variables */
export const sRgfd = {
	build: ([x, y], {
		useThousandthPos = false,
		textScale = 0.8,
		barColorFront = [255, 255, 255, 216],
		barColorBack = [0, 0, 0, 216],
	} = {}) => [
		new BlkVariable("rangefinderHorizontalOffset", x),
		new BlkVariable("rangefinderVerticalOffset", y),
		new BlkVariable("rangefinderUseThousandth", useThousandthPos),
		new BlkVariable("rangefinderTextScale", textScale),
		new BlkVariable("rangefinderProgressBarColor1", barColorFront, "c"),
		new BlkVariable("rangefinderProgressBarColor2", barColorBack, "c"),
	],
};


/** Ally detection text (will be shown in Sim Battle only) settings variables */
export const sDetectAlly = {
	build: ([x, y], {
		textScale = 0.8,
	} = {}) => [
		new BlkVariable("detectAllyOffset", [x, y]),
		new BlkVariable("detectAllyTextScale", textScale),
	],
};


/** Shell distance tick size settings variables */
export const sShellDistTick = {
	build: (
		[mainTickSizeLarge, mainTickSizeSmall],
		[subTickSizeLarge, subTickSizeSmall],
		[mainTickPosX, mainTickPosY]
	) => [
		new BlkVariable("crosshairDistHorSizeMain", [mainTickSizeLarge, mainTickSizeSmall]),
		new BlkVariable("crosshairDistHorSizeAdditional", [subTickSizeLarge, subTickSizeSmall]),
		new BlkVariable("distancePos", [mainTickPosX, mainTickPosY]),
	],

	getCentralTickCommon: ({
		main = [0, 0],
		sub = [0.0070, 0.0025],
		distPos = [0.005, 0],
		horiPosOffset = 0,
	} = {}) => sShellDistTick.build(
		[main[0], main[1]],
		[sub[0], sub[1]],
		[distPos[0] - horiPosOffset, distPos[1]],
	),
};


/** Horizontal mil tick settings variables */
export const sHoriThousandthTick = {
	build: ([x, y]) => [
		new BlkVariable("crosshairHorVertSize", [x, y]),
	],
}


/** Misc settings variables, which is not used by me in most situations */
export const sMisc = {
	getCommon: () => [
		...sHoriThousandthTick.build([0.5, 0.3]),
		new BlkVariable("drawCentralLineVert", false),
		new BlkVariable("drawCentralLineHorz", false),
		new BlkVariable("drawSightMask", true),
	],
};


/** A shorthand for prompting devs with required sight settings variables */
export const concatSettings = (
	scaleVars, colorVars, rgfdTextVars, detectAllyTextVars,
	gunDistValueTextVars, shellDistTickVars,
	miscVars = sMisc.getCommon()
) => [
	...scaleVars, ...colorVars, ...rgfdTextVars, ...detectAllyTextVars,
	...gunDistValueTextVars, ...shellDistTickVars,
	...miscVars
];


//// SHELL DISTANCE TICK COLLECTIONS ////

/** Shell distance tick combinations */
export const shellDistTicks = {
	getFull: ({
		useTwoSideTicks = false,
		twoSideRightTextPosX = 0.03,
		twoSideRightTextPosXOffsetForOneDigit = -0.0065,
		shownNumPosYOffset = -0.0009,
		distGap = 200,
		distUntil = 4000,
	} = {}) => {
		let result = [];
		// Sub ticks
		for (let d of Toolbox.rangeIE(distGap, distUntil, distGap * 2)) {
			result.push({ distance: d });
		}
		// Main ticks left
		for (let d of Toolbox.rangeIE(distGap * 2, distUntil, distGap * 4)) {
			result.push({
				distance: d, shown: d / 100,
				shownPos: [0, shownNumPosYOffset]
			});
		}
		// Main ticks potential right
		for (let d of Toolbox.rangeIE(distGap * 4, distUntil, distGap * 4)) {
			result.push({
				distance: d, shown: d / 100,
				shownPos:
					(!useTwoSideTicks) ?
						[0, shownNumPosYOffset] :
						(d / 100 < 10) ?
							[
								twoSideRightTextPosX + twoSideRightTextPosXOffsetForOneDigit,
								shownNumPosYOffset
							] :
							[twoSideRightTextPosX, shownNumPosYOffset],
			});
		}
		return result.sort((a, b) => (a.distance - b.distance));
	},

	getFullLoose: ({
		useTwoSideTicks = false,
		twoSideRightTextPosX = 0.03,
		twoSideRightTextPosXOffsetForOneDigit = -0.0065,
		shownNumPosYOffset = -0.0009,
		distGap = 400,
		distUntil = 4000,
	} = {}) => shellDistTicks.getFull({
		useTwoSideTicks,
		twoSideRightTextPosX, twoSideRightTextPosXOffsetForOneDigit,
		shownNumPosYOffset, distGap, distUntil
	}),

	// TODO laser ticks
};