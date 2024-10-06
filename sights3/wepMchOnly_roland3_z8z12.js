import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";

import ENV_SET from "./helper/env_settings.js";
import * as pd from "./helper/predefined.js";
import * as calc from "./helper/calculators.js";
import comp from "./components/all.js";

import rgfd from "./extra_modules/rangefinder.js"
import binoCali from "./extra_modules/binocular_calibration_2.js"
import * as rdr from "./extra_modules/radar_prompt.js"

import base from "./aa_msl_z8z12.js";
let sight = base.sightObj;
let horiRatioMult = new calc.HoriRatioMultCalculator(
	16 / 9, ENV_SET.DISPLAY_RATIO_NUM
).getMult();


//// VEHICLE TYPES ////
sight.components.matchVehicleClasses.clear();
sight.matchVehicle([
	"fr_amx_30_roland",
	"germ_flarakpz_1",
	"germ_flarakrad",
	"us_xm_975_roland",
]);



//// ADDITIONAL ELEMENTS (IF ANY) ////
// Weapon info
let mslInfo = {
	name: "Rld 3",
	spd: 570/1.25,  // m/s. division applied for recitifying since the missile won't keep the max speed all the time
	rangeMax: 8,  // km
	rangeRecom: 6,  // km
};

// Radar prompt
sight.add(rdr.buildRadarPrompt({
	pos: [-58 * horiRatioMult, -5],
	curveDegree: 30,
	curveRadius: 14,
	pieDivisionCurveSizeMain: 8,
	pieDivisionCurveSizeSub: 6,

	radarLongRange: 20,
	radarShortRange: 10,
	textSizeLongRange: 1.3,
	textSizeShortRange: 1.0,
	textSizeLegend: 0.65,
	textPosPaddingLongRange: [0, 1.1],
	textPosPaddingShortRange: [-0.6, -1],
	textPosPaddingLegendLong: [0.4, -0.6],
	textPosPaddingLegendShort: [0.7, 0.3],
	weaponRanges: [
		{
			range: mslInfo.rangeMax,
			curveDegreeOnLong: 13,
			curveDegreeOnShort: 10,
			curveSize: 4
		},
		{
			range: mslInfo.rangeRecom,
			curveDegreeOnLong: 7,
			curveDegreeOnShort: 5,
			curveSize: 3.5
		},
	],
}));


// Time-to-hit table
let tthTable = [
	// Title line
	new TextSnippet({
		text: mslInfo.name, align: "right",
		pos: [-1.5, 0], size: 1.2
	}),
	new TextSnippet({
		text: `Avg ${(mslInfo.spd).toFixed()} m/s`, align: "left",
		pos: [15.5, 0], size: 1.2
	}),
	// Table row separation
	new Line({from: [-1.5, 3.5], to: [15.5, 3.5]})
];
let tthInfo = {
	colWidth: 3.5,
	rowHeight: 1.8,
	topLeftCellPos: [0, 2.5],
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
			size: 1.1
		}));
	}
}
// Move to correct pos and append elements
tthTable.forEach((ele) => { ele.move([-58 * horiRatioMult, 1]); });
sight.add(tthTable);




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
