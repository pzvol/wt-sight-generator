// SCRIPT_COMPILE_TO=germ_begleitpanzer_57

import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Sight for Begleitpanzer 57 with air leading circles
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoomSmallFont(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([125, -0.01725]),
	pd.basicBuild.detectAllyPos([125, -0.045]),
	pd.basicBuild.gunDistanceValuePos([-0.17, 0.035]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.007, 0.003],
		[0.005, 0]
	),
	pd.basic.miscVars.getCommon(),
));

//// VEHICLE TYPES ////
// NOT USED


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 2000, shown: 20, shownPos: [10, 0] },  // wider the line w/o seeing the value
	{ distance: 4000, shown: 40 },
]);


//// SIGHT DESIGNS ////
let shellInfo = { name: "HE-VT", spd: 1020 * 3.6 };
let assumedAirTgtSpd = 750;  // kph
let getAirLdn = (aa) => Toolbox.calcLeadingMil(shellInfo.spd, assumedAirTgtSpd, aa);

// Gun center
Toolbox.repeat(2, () => {
	sight.add(new Line({ from: [0.15, 0], to: [-0.15, 0], move: true }));
	sight.add(new Line({ from: [0, 0.15], to: [0, -0.15], move: true }));
});

// Sight center and bold
for (let bias of Toolbox.rangeIE(-0.075, 0.075, 0.025)) {
	sight.add(new Line({ from: [0.6, bias], to: [2, bias] }).withMirrored("x"));
	sight.add(new Line({ from: [bias, 0.6], to: [bias, 2] }));
}

// Lower vertical line
sight.add([
	new Line({ from: [0, 8.25], to: [0, 450] }).withMirrored("x"), // mirroring for bold
	//new Line({ from: [0.04, 8.25], to: [0.04, 450] }).withMirrored("x"),
]);


// Sight center prompt bold at borders
// horizontal
for (let l of [
	{ toX: getAirLdn(0.75), biasY: 0 },
	{ toX: getAirLdn(0.75), biasY: 0.1 },
	{ toX: getAirLdn(0.75), biasY: 0.15 },
]) {
	sight.add(new Line({
		from: [450, l.biasY], to: [l.toX, l.biasY]
	}).withMirrored(l.biasY == 0 ? "x" : "xy"));
}
// vertical
for (let l of [
	{ toY: -getAirLdn(0.35), biasX: 0 },
	{ toY: -getAirLdn(0.35), biasX: 0.1 },
	{ toY: -getAirLdn(0.35), biasX: 0.2 },
]) {
	sight.add(new Line({
		from: [l.biasX, -450], to: [l.biasX, l.toY]
	}).withMirrored(l.biasX == 0 ? null : "x"));
}


// Air leading circles
// 3/4
for (let segCenter of Toolbox.range(0, 360, 45, {includeEnd: true, includeStart: false})) {
	sight.add(new Circle({
		segment: [segCenter - 2, segCenter + 2], diameter: getAirLdn(0.75) * 2, size: 3
	}).withMirroredSeg("xy"));
}
sight.add(new TextSnippet({
	text: `3/4 - ${assumedAirTgtSpd} kph`,
	pos: [getAirLdn(0.75) - 1.5, -0.4],
	align: "left", size: 1.6
}));
// 2/4
sight.add(new Circle({
	segment: [45 - 30, 45 + 30], diameter: getAirLdn(0.5) * 2, size: 4.8
}).withMirroredSeg("xy"));
sight.add(new Circle({
	segment: [90 - 2, 90 + 2], diameter: getAirLdn(0.5) * 2, size: 4.8
}).withMirroredSeg("x"));
sight.add(new TextSnippet({
	text: `2/4 - ${assumedAirTgtSpd} kph`,
	pos: [getAirLdn(0.5) - 1, 0.2],
	align: "left", size: 1.5
}));
sight.add(new TextSnippet({
	text: `4/4  ${assumedAirTgtSpd/2} kph`,
	pos: [getAirLdn(0.5) - 1, -1.9],
	align: "left", size: 1.0
}));
// 1/4
sight.add(new Circle({
	segment: [2, 358], diameter: getAirLdn(0.25) * 2, size: 3
}));
sight.add(new TextSnippet({
	text: `1/4`,
	pos: [getAirLdn(0.25) - 1, 0.2],
	align: "left", size: 1.5
}));
sight.add(new TextSnippet({
	text: `2/4  ${assumedAirTgtSpd/2} kph`,
	pos: [getAirLdn(0.25) - 1, -1.9],
	align: "left", size: 1.0
}));
// // 1/4
// Toolbox.repeat(2, () => {
// 	let tickHalfLen = 0.2;
// 	let sqrt2 = Math.sqrt(2);
// 	let aa = 0.25;
// 	// hori
// 	sight.add(new Line({
// 		from: [getAirLdn(aa), -tickHalfLen],
// 		to: [getAirLdn(aa), tickHalfLen]
// 	}).withMirrored("x"));
// 	// verti upper
// 	sight.add(new Line({
// 		from: [-tickHalfLen, -getAirLdn(0.25)],
// 		to: [tickHalfLen, -getAirLdn(0.25)]
// 	}).withMirrored("x"));
// 	// x
// 	sight.add(new Line({
// 		from: [(getAirLdn(aa) + tickHalfLen) / sqrt2, (getAirLdn(aa) - tickHalfLen) / sqrt2],
// 		to: [(getAirLdn(aa) - tickHalfLen) / sqrt2, (getAirLdn(aa) + tickHalfLen) / sqrt2]
// 	}).withMirrored("xy"));
// });




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
