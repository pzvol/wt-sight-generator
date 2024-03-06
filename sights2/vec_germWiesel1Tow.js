// SCRIPT_COMPILE_TO=germ_wiesel_1_tow

import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js"

import base from "./g_msl_z4z8_alt.js";
let sight = base.sightObj;


sight.components.matchVehicleClasses.clear();
sight.clearDescription();
sight.addDescription("For Wiesel 1A2");


// Re-configure colors
sight.updateOrAddSettings(pd.basic.colors.getLightGreenRed());


//// ADDITIONAL ELEMENTS (IF ANY) ////
let mslInfo = {
	name: "TOW-2/2A",
	spd: 329/1.4,  // m/s. division applied for recitifying since the missile won't keep the max speed all the time
	rangeMax: 3.75,  // km
};
let tthTable = [
	// Title line
	new TextSnippet({
		text: mslInfo.name, align: "right",
		pos: [-2, -2.5], size: 0.85
	}),
	new TextSnippet({
		text: `Avg ${(mslInfo.spd).toFixed()} m/s`, align: "left",
		pos: [19, -2.5], size: 0.85
	}),
	// Table row separation
	new Line({from: [-2, 1.15], to: [19, 1.15]}),
	new Line({from: [-2, 1.15], to: [19, 1.15]}),  // copy for bolding
];
let tthSecPrec = 1;  // Precision displayed (Calculated values only)
let tthInfo = {
	colWidth: 4.25,
	rowHeight: 2,
	topLeftCellPos: [0, 0],
	texts: [
		["Dist", "4", "8", "12", "20"],
		["Sec",
			"2",  // Tested Value
			"3.5",  // Tested Value
			"5",  // Tested Value, 5.1 actually
			(2000 / mslInfo.spd).toFixed(tthSecPrec)  // 8.5 from test
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
			size: 0.9
		}));
		// Copy for bolding second values
		if (col != 0 && row == 1) {
			tthTable.push(
				tthTable[tthTable.length-1].copy()
			);
		}
	}
}
// Move to correct pos and append elements
tthTable.forEach((ele) => { ele.move([-30, 15]); });
sight.add(tthTable);


// Additional tick at 400m
sight.add(new Circle({
	segment: [90-15, 90+15],
	diameter: Toolbox.calcDistanceMil(3.3, 300, "real"),
	size: 1.8,
}).withMirroredSeg("x"));
sight.add(new TextSnippet({
	text: "3",
	pos: [Toolbox.calcDistanceMil(3.3, 300, "real")/2 + 0.6, 0.8], size: 0.7
}));


// Missile drop indication
let mslDropMil = { d10: -13, d100: 2.9, };
//   10m
// sight.add(new Line({
// 	from: [-1, dropMil.d10], to: [1, dropMil.d10],
// 	move: true,
// }));
sight.add(new Circle({
	pos: [0, mslDropMil.d10], segment: [90-70, 90+70],
	diameter: 2, size: 1.2, move: true
}).withMirroredSeg("x"));
sight.add(new TextSnippet({
	text: "10m", align: "right",
	pos: [2.5, mslDropMil.d10 - 0.08],
	size: 0.6, move: true
}));
//   100m
sight.add(new Line({
	from: [-0.5, mslDropMil.d100], to: [0.5, mslDropMil.d100], move: true
}));
// sight.add(new Circle({
// 	pos: [0, dropMil.d100], segment: [-100, 100],
// 	diameter: 1.5, size: 1.4, move: true
// }));
sight.add(new TextSnippet({
	text: "100m", align: "right",
	pos: [1.2, mslDropMil.d100 - 0.08],
	size: 0.55, move: true
}));




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
