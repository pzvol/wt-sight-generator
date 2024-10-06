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
// sight.matchVehicle([
// 	"fr_amx_30_roland",
// 	"germ_flarakpz_1",
// 	"germ_flarakrad",
// 	"us_xm_975_roland",
// ]);



//// ADDITIONAL ELEMENTS (IF ANY) ////
let displayRatioHoriMult = ENV_SET.DISPLAY_RATIO_NUM / (16/9);

// Weapon info
let mslInfo = {
	name: "Rld 3",
	spd: 570/1.25,  // m/s. division applied for recitifying since the missile won't keep the max speed all the time
	rangeMax: 8,  // km
	rangeRecom: 6,  // km
};

// Radar prompt
sight.add(rdr.buildRadarPrompt({
	pos: [-76 * displayRatioHoriMult, -10],
	curveDegree: 30,
	curveRadius: 17,
	pieDivisionCurveSizeMain: 3,
	pieDivisionCurveSizeSub: 2,

	radarLongRange: 20,
	radarShortRange: 10,
	textSizeLongRange: 0.85,
	textSizeShortRange: 0.65,
	textSizeLegend: 0.5,
	textPosPaddingLongRange: [0, 1.8],
	textPosPaddingShortRange: [-0.5, -1.75],
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
		pos: [19, 0], size: 0.65
	}),
	// Table row separation
	new Line({from: [-2, 4.125], to: [19, 4.125]})
];
let tthInfo = {
	colWidth: 4.25,
	rowHeight: 2.2,
	topLeftCellPos: [0, 2.8],
	texts: [
		["KM", "2", "4", "6", "8"],
		["Sec",
			Toolbox.roundToHalf(2000 / mslInfo.spd).toString(),
			Toolbox.roundToHalf(4000 / mslInfo.spd).toString(),
			Toolbox.roundToHalf(6000 / mslInfo.spd).toString(),
			Toolbox.roundToHalf(8000 / mslInfo.spd).toString()
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
tthTable.forEach((ele) => { ele.move([-76 * displayRatioHoriMult, -1]); });
sight.add(tthTable);




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
