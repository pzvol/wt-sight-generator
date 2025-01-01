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


let sight = new Sight();
let horiRatioMult = new calc.HoriRatioMultCalculator(
	16 / 9, ENV_SET.DISPLAY_RATIO_NUM
).getMult();
// let distMil = new calc.DistMilCalculator(ENV_SET.DEFAULT_ASSUMED_TARGET_WIDTH);


// Introduction comment
sight.addDescription(``.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatSettings(
	pd.sScale.getHighZoom(),
	pd.sColor.getRedLightGreen(),
	pd.sRgfd.build([125 / horiRatioMult, -0.01725]),
	pd.sDetectAlly.build([125 / horiRatioMult, -0.045]),
	pd.sGunDistValue.build([-0.13 / horiRatioMult, 0.035]),
	pd.sShellDistTick.getCentralTickCommon({
		sub: [0.007, 0.002],
		horiPosOffset: -(1 - horiRatioMult) * 0.015
	}),
));


//// VEHICLE TYPES ////
sight.matchVehicle([
	"germ_9a33bm3",
]);


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 200 },
	{ distance: 3600 },
]);


//// SIGHT DESIGNS ////
// Weapon info
let mslInfo = {
	name: "9M33M3",
	spd: 580/1.23,  // m/s. division applied for recitifying since the missile won't keep the max speed all the time
	rangeMax: 10.3,  // km
	rangeRecom: 9.5,  // km
};

// Sight center segments (tiny cross)
for (let direction of [90, 180, 270, 360]) {
	let curveHalfWidth = 15;
	sight.add(new Circle({
		segment: [direction - curveHalfWidth, direction + curveHalfWidth],
		diameter: 0.5,
		size: 2,
	}));
}

let crossMil = { from: 5, to: 10 };
for (let offset of Toolbox.rangeIE(0, 0.03, 0.03)) {
	// cross
	sight.add([
		new Line({
			from: [crossMil.from, offset], to: [crossMil.to, offset]
		}).withMirrored("xy"),
		new Line({
			from: [offset, crossMil.from], to: [offset, crossMil.to]
		}).withMirrored("xy"),
	]);

	// 0m indication
	sight.add(new Line({
		from: [crossMil.to + 0.3, offset],
		to: [crossMil.to + 0.3 + 0.1, offset],
		move: true
	}).withMirrored("xy"));
}

for (let offset of Toolbox.rangeIE(0, 0.02, 0.02)) {
	// Vertical upper line
	sight.add(new Line({
		from: [offset, -25], to: [offset, -450]
	}).withMirrored("x"));
}




// Radar prompt
let zoomMult = Toolbox.calcMultForZooms(8, 9.8);
sight.add(rdr.buildRadarPrompt({
	pos: [-58 * horiRatioMult * zoomMult, -5 * zoomMult],
	curveDegree: 30,
	curveRadius: 14 * zoomMult,
	pieDivisionCurveSizeMain: 8,
	pieDivisionCurveSizeSub: 6,

	radarLongRange: 35,
	radarShortRange: 15,
	textSizeLongRange: 0.9,
	textSizeShortRange: 1.25,
	textSizeLegend: 0.8,
	textPosPaddingLongRange: [0, 0.7],
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
			curveDegreeOnLong: 6,
			curveDegreeOnShort: 4,
			curveSize: 3.0
		},
	],
}));


// Time-to-hit table
let tthTable = [
	// Title line
	new TextSnippet({
		text: mslInfo.name, align: "right",
		pos: [-1.5 * zoomMult, 0], size: 1.2 * zoomMult
	}),
	new TextSnippet({
		text: `Avg ${(mslInfo.spd).toFixed()} m/s`, align: "left",
		pos: [15.5 * zoomMult, 0], size: 1.2 * zoomMult
	}),
	// Table row separation
	new Line({from: [-1.5 * zoomMult, 3.5 * zoomMult], to: [15.5 * zoomMult, 3.5 * zoomMult]})
];
let tthInfo = {
	colWidth: 3.5 * zoomMult,
	rowHeight: 1.8 * zoomMult,
	topLeftCellPos: [0, 2.5 * zoomMult],
	texts: [
		["KM", "2", "4", "8", "10"],
		["Sec",
			"5.5",  // Toolbox.roundToHalf(2000 / mslInfo.spd).toString(),
			"10", // Toolbox.roundToHalf(4000 / mslInfo.spd).toString(),
			Toolbox.roundToHalf(8000 / mslInfo.spd).toString(),
			Toolbox.roundToHalf(10000 / mslInfo.spd).toString()
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
tthTable.forEach((ele) => { ele.move([-58 * horiRatioMult * zoomMult, 1 * zoomMult]); });
sight.add(tthTable);




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
