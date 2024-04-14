import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js"

import base from "./g_msl_z4z8_alt.js";
let sight = base.sightObj;


sight.clearDescription();
sight.addDescription("For M113A1 TOW carriers");


sight.components.matchVehicleClasses.clear();
sight.matchVehicle([
	"cn_m113a1_tow",
	"il_m113a1_tow",
	"it_m113a1_tow",
	// For stock ammo:
	"cn_cm_25",
]);

// Re-configure colors
sight.updateOrAddSettings(pd.basic.colors.getLightGreenRed());
sight.updateOrAddSettings([
	...pd.basicBuild.gunDistanceValuePos([-0.18, 0.05]),
	...pd.basicBuild.rgfdPos([95, -0.045]),
	...pd.basicBuild.detectAllyPos([95, -0.045 - 0.023]),
])



//// ADDITIONAL ELEMENTS (IF ANY) ////
let assumedTgtWidth = 3.3;  // for elements added here only
let getMil = (dist) => Toolbox.calcDistanceMil(assumedTgtWidth, dist);
let getHalfMil = (dist) => (getMil(dist) / 2);


let mslInfo = {
	name: "I-TOW",
	spd: 296/1.33,  // m/s
	// ^ division applied for recitifying since the missile won't keep
	//   the max speed all the time. Based on test result: 1700m -> 7.6s
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
let tthInfo = {
	colWidth: 4.25,
	rowHeight: 2,
	topLeftCellPos: [0, 0],
	texts: [
		["X00m", "4", "8", "12", "20"],
		["Sec",
			"2",  // Tested Value
			"3.5",  // Tested Value
			"5.3",  // Tested Value
			(2000 / mslInfo.spd).toFixed(0)
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


// Additional ticks
// 200 circle
sight.add(new Circle({
	segment: [90-15, 90], diameter: getMil(200), size: 2.8,
}).withMirroredSeg("x"));
sight.add(new TextSnippet({
	text: "2", pos: [getHalfMil(200) + 0.6, 0.8], size: 0.8
}).withMirrored("x"));
// 300~400 hori line for identifying the rangefinder circle
for (let p of Toolbox.rangeIE(-0.04, 0.04, 0.02)) {
	sight.add(new Line({
		from: [getHalfMil(300), p], to: [getHalfMil(400), p],
	}).withMirrored("x"));
}
// 400 circle
sight.add(new Circle({
	segment: [90-20, 90+20], diameter: getMil(400), size: 2.8,
}).withMirroredSeg("x"));
sight.add(new TextSnippet({
	text: "4", pos: [getHalfMil(400) + 0.6, 1.2], size: 0.75
})).repeatLastAdd();


// Missile drop indication
let mslDropMils = [
	{d: 10, mil: -18},
	{d: 50, mil: -5},
	{d: 100, mil: 0},
	{d: 170, mil: 2.7},
	{d: 200, mil: 2.2},
	{d: 300, mil: 0.6},
];
let getMslDropMil = (d) => mslDropMils.find((ele) => (ele.d === d)).mil;
//   10m
sight.add(new Circle({
	pos: [0, getMslDropMil(10)], segment: [90-70, 90+80],
	diameter: 2.5, size: 1.5, move: true
}).withMirroredSeg("x"));
sight.add(new TextSnippet({
	text: "10m", align: "right",
	pos: [3, getMslDropMil(10) - 0.08], size: 0.8, move: true
}));
//   50m
sight.add(new Circle({
	pos: [0, getMslDropMil(50)], segment: [90-45, 90+45],
	diameter: 1.7, size: 1.4, move: true
}).withMirroredSeg("x"));
sight.add(new TextSnippet({
	text: "50m", align: "right",
	pos: [2.5, getMslDropMil(50) - 0.08], size: 0.65, move: true
}));
//   100m
// sight.add(new Line({
// 	from: [1, getMslDropMil(100)], to: [1.2, getMslDropMil(100)], move: true
// }).withMirrored("x")).repeatLastAdd();
sight.add(new TextSnippet({
	text: "100", align: "right",
	pos: [2, getMslDropMil(100) - 0.08], size: 0.6, move: true
}));
//   170m (lowest)
sight.add(new Circle({
	pos: [0, getMslDropMil(170)], segment: [-100, 100],
	diameter: 1, size: 1.4, move: true
}));
sight.add(new TextSnippet({
	text: "170", align: "right",
	pos: [1.4, getMslDropMil(170) - 0.08 + 0.2],
	size: 0.57, move: true
}).mirrorX());
//   200m
sight.add(new Line({
	from: [-0.5, getMslDropMil(200)], to: [0.5, getMslDropMil(200)], move: true
}));
sight.add(new TextSnippet({
	text: "200", align: "right",
	pos: [1.2, getMslDropMil(200) - 0.08],
	size: 0.6, move: true
}));
// //   300m
// sight.add(new Line({
// 	from: [-0.1, getMslDropMil(300)], to: [0.1, getMslDropMil(300)], move: true
// }));
// sight.add(new TextSnippet({
// 	text: "300", align: "right",
// 	pos: [0.7, getMslDropMil(300) - 0.08],
// 	size: 0.55, move: true
// }));




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
