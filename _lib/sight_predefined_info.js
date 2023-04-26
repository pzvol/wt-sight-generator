/** Usually used code blocks */

'use strict';

import {
	General as G
} from "./sight_lib.js";

export default {}




/**
 * Collection of frequently used basic variable combinations
 *
 * Combinations are saved as variable code line arrays
 */
export const basicVars = {
	colors: {
		getGreenRed: ()=>[
			G.comment("Color of sight"),
			G.variable("crosshairColor", [0, 200, 40, 255], "c"),
			G.variable("crosshairLightColor", [180, 0, 0, 255], "c"),
		],
	},

	sizeScales: {
		getHighZoom: ({font=0.9, line=1.5}={}) => [
			G.comment("Sight scales"),
			G.variable("fontSizeMult", font),
			G.variable("lineSizeMult", line),
		],
	},

	getMiscCommonVars: ()=> [
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


	buildDistanceValuePos: ([x, y])=> [
		G.variable("distanceCorrectionPos", [x, y]),
	],

	buildRgfdPos: ([x, y])=> [
		G.variable("rangefinderHorizontalOffset", x),
		G.variable("rangefinderVerticalOffset", y),
	],

	buildDetectAllyPos: ([x, y])=> [
		G.variable("detectAllyOffset", [x, y])
	],

	buildShellDistanceTickVars: (
		[mainTickSizeLarge, mainTickSizeSmall],
		[subTickSizeLarge, subTickSizeSmall],
		[mainTickPosX, mainTickPosY]
	)=> [
		G.variable("crosshairDistHorSizeMain", [mainTickSizeLarge, mainTickSizeSmall]),
		G.variable("crosshairDistHorSizeAdditional", [subTickSizeLarge, subTickSizeSmall]),
		G.variable("distancePos", [mainTickPosX, mainTickPosY]),
	]


}