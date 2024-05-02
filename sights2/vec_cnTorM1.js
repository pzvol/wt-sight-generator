// SCRIPT_COMPILE_TO=cn_tor_m1

import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import * as rdr from "./sight_components/radar_prompt.js"

import ENV_SET from "./sight_bases/_env_settings.js"

import base from "./aa_msl_z6z12.js";
let sight = base.sightObj;


//// VEHICLE TYPES ////
sight.components.matchVehicleClasses.clear();



//// ADDITIONAL ELEMENTS (IF ANY) ////
let displayRatioHoriMult = ENV_SET.DISPLAY_RATIO_NUM / (16/9);

// Weapon info
let mslInfo = {
	name: "9M331",
	spd: 850/1.35,  // m/s
		// ^ Division for rectifying since the missile won't keep the max speed all the time
		//   Divider selected based on a 10km and a 9km hit record
	rangeMax: 12,  // km
	rangeRecom: 10,  // km
};

// Radar prompt
sight.add(rdr.buildRadarPrompt({
	pos: [-56.8 * displayRatioHoriMult, -8],
	curveDegree: 30,
	curveRadius: 12,
	pieDivisionCurveSizeMain: 3,
	pieDivisionCurveSizeSub: 2,

	radarLongRange: 30,
	radarShortRange: 10,
	textSizeLongRange: 0.6,
	textSizeShortRange: 0.55,
	textSizeLegend: 0.5,
	textPosPaddingLongRange: [0, 1],
	textPosPaddingShortRange: [-0.5, -1.0],
	textPosPaddingLegendLong: [0.5, -1],
	textPosPaddingLegendShort: [1.25, 0.5],
	weaponRanges: [
		{
			range: mslInfo.rangeMax,
			curveDegreeOnLong: 13,
			curveDegreeOnShort: 10,
			curveSize: 1.5
		},
		{
			range: mslInfo.rangeRecom,
			curveDegreeOnLong: 7,
			curveDegreeOnShort: 5,
			curveSize: 1
		},
	],
}));


// Time-to-hit table
let tthTable = [
	// Title line
	new TextSnippet({
		text: mslInfo.name, align: "right",
		pos: [-1.5, 0], size: 0.65
	}),
	new TextSnippet({
		text: `Avg ${(mslInfo.spd).toFixed()} m/s`, align: "left",
		pos: [16, 0], size: 0.65
	}),
	// Table row separation
	new Line({from: [-2, 3.2], to: [16.1, 3.2]})
];
let tthInfo = {
	colWidth: 3.5,
	rowHeight: 1.8,
	topLeftCellPos: [0, 2.2],
	texts: [
		["KM", "4", "8", "10", "12"],
		["Sec",
			Toolbox.roundToHalf(4000 / mslInfo.spd).toString(),
			Toolbox.roundToHalf(8000 / mslInfo.spd).toString(),
			Toolbox.roundToHalf(10000 / mslInfo.spd).toString(),
			Toolbox.roundToHalf(12000 / mslInfo.spd).toString()
		],
	]
}
for (let row = 0; row < tthInfo.texts.length; row++) {
	for (let col = 0; col < tthInfo.texts[0].length; col++) {
		tthTable.push(new TextSnippet({
			text: tthInfo.texts[row][col], align: "center",
			pos: [
				tthInfo.colWidth * col + tthInfo.topLeftCellPos[0],
				tthInfo.rowHeight * row + tthInfo.topLeftCellPos[1],
			],
			size: 0.6
		}));
	}
}
// Move to correct pos and append elements
tthTable.forEach((ele) => { ele.move([-56.8 * displayRatioHoriMult - 0.6, -2]); });
sight.add(tthTable);




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
