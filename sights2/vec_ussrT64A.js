// SCRIPT_COMPILE_TO=ussr_t_64a_1971

import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import { BlkVariable } from "../_lib2/sight_code_basis.js";
import * as pd from "../_lib2/predefined.js";

import rgfd from "./sight_components/rangefinder.js"
import binoCali from "./sight_components/binocular_calibration_2.js"


let sight = new Sight();


// Introduction comment
sight.addDescription(`
TPD-like sight for T-64/72 series

Inspired by kuIoodporny's historical TPD-2 and used his/her sight as a reference:
https://live.warthunder.com/post/821276/en/
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoomLargeFont(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([234, 0.001]),
	pd.basicBuild.detectAllyPos([234, -0.02]),
	pd.basicBuild.gunDistanceValuePos([-0.2, 0.014]),
	pd.basicBuild.shellDistanceTickVars(
		[0.003, 0.001],
		[0, 0],  // [0.0008, 0.0001],
		[0.215, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// VEHICLE TYPES ////
// NOT NEEDED HERE


//// SHELL DISTANCES ////
let shellDists = pd.shellDists.getFullLoose();
shellDists.forEach((ele) => {
	if (ele.distance % 800 === 0) {
		ele.tickExtension = 0.002;
	}
	if (ele.distance % 800 === 0 && ele.distance % 1600 !== 0) {
		ele.shownPos[0] -= 0.015;
		ele.tickExtension += 0.015;
	}
});
sight.addShellDistance(shellDists);


//// SIGHT DESIGNS ////
let assumedTargetWidth = 3.3;
let getMilHalf = (dist) => Toolbox.calcDistanceMil(assumedTargetWidth, dist) / 2;

// Gun center
//   A small dot
// sight.add(new Line({
// 	from: [0.0001, 0.0001], to: [-0.0001, 0.0001],
// 	move: true, thousandth: false
// }));
//   or, a dashed line
sight.add(new Line({
	from: [getMilHalf(3200), 0],
	to: [getMilHalf(3200)/2, 0],
	move: true,
}).withMirrored("xy"));

// Draw 400m/800m correction for APFSDS
//   manually drawn since I failed to find a way generating them from
//   current-shell correction w/o creating redundant ticks
(() => {
	let shellDrops = [
		// 3BM22
		{d: 400, mil: 0.75},
		{d: 800, mil: 1.42},
	];
	for (let shellDrop of shellDrops) {
		sight.add(new Line({
			from: [-0.05, shellDrop.mil], to: [0.05, shellDrop.mil],
			move: true
		}));
	}
})();


// Gun height prompt & correction value indicator
(() => {
	let arrowElements = [
		new Line({ from: [0, 0], to: [-0.005, 0.003], thousandth: false }).withMirrored("y"),
		new Line({ from: [-0.005, 0.0009], to: [-0.005, 0.003], thousandth: false }).withMirrored("y"),
	];
	arrowElements.forEach((ele) => { ele.move([0.211, 0]).withMirrored("xy"); })
	sight.add(arrowElements);
})();
// 0m line
sight.add(new Line({from: [-0.212, 0], to: [(-0.215 - 0.001 - 0.002), 0], move: true, thousandth: false}));
sight.add(new TextSnippet({
	text: "00", align: "left",
	pos: [(-0.215 - 0.001 - 0.003), -0.0008], size: 0.7,
	move: true, thousandth: false
}));

// Sight center
let centerArrowDeg = 25;
let centerArrowYLen = 6;
let centerArrowDegTan = Math.tan(Toolbox.degToRad(centerArrowDeg));
for (let biasY of Toolbox.rangeIE(0, 0.24, 0.04)) {
	sight.add(new Line({
		from: [0, biasY],
		to: [
			(centerArrowYLen * centerArrowDegTan) - (biasY * centerArrowDegTan),
			centerArrowYLen
		],
	}).withMirrored("x").move([0, 0.04]));
}

// Vertical lower line
sight.add(new Line({from: [0, 6.5], to: [0, 450]}));
for (let biasX of Toolbox.range(0, 0.06, 0.03, {includeStart: false, includeEnd: true})) {
	sight.add(new Line({
		from: [biasX, 7], to: [biasX, 450]
	}).withMirrored("x"));
}

// Rangefinder reticles on the horizon
(() => {
	let getTickElements = (type) => {
		let tickElements =
		type == "arrow" ? [
			new Line({from: [0, 0], to: [0.5, 2]}),
			new Line({from: [0, 0], to: [-0.5, 2]}),
		] :
		type == "long" ? [
			new Line({from: [0, 0], to: [0, 1.6]})
		] :
		type == "medium" ? [
			new Line({from: [0, 0], to: [0, 0.8]})
		] :
		type == "short" ? [
			new Line({from: [0, 0], to: [0, 0.3]})
		] :
		type == "dot" ? [
			new Line({from: [0, 0], to: [0, 0.1]})
		] : [];
		return tickElements;
	}

	for (let tickInfo of [
		{d: 100, type: "long", text: {yPos: 2.7, size: 0.7}},
		{d: 120, type: "dot"},
		{d: 150, type: "dot"},
		{d: 200, type: "arrow", text: {yPos: 2.75, size: 0.6}},
		{d: 400, type: "long", text: {yPos: 2.2, size: 0.45}},
		//{d: 600, type: "dot"},
		{d: 800, type: "medium", text: {yPos: 1.4, size: 0.4}},
		{d: 1600, type: "short"},
	]) {
		let tickItems = getTickElements(tickInfo.type);
		if (tickInfo.hasOwnProperty("text")) {
			tickItems.push(new TextSnippet({
				text: (tickInfo.d / 100).toFixed(),
				pos: [0, tickInfo.text.yPos], size: tickInfo.text.size
			}));
		}
		tickItems.forEach((ele) => { ele.move([getMilHalf(tickInfo.d), 0]).withMirrored("x"); });
		sight.add(tickItems);
		// Repeat lines
		sight.add(tickItems.filter((ele) => (ele instanceof Line)));
	}
})();


// MG corrections
// correction values are directly copied from kuIoodporny's sight
let mgDrops = [
	// {d: 300, mil: 2.55},
	// {d: 400, mil: 3.44},
	// {d: 500, mil: 4.67},
	{d: 600, mil: 6.17},
	{d: 700, mil: 7.94},
	{d: 800, mil: 10.0},
	{d: 900, mil: 12.2},
	{d: 1000, mil: 15.0},
	{d: 1100, mil: 18.0},
	{d: 1200, mil: 21.34},
	{d: 1300, mil: 25.24},
	{d: 1400, mil: 29.4},
	{d: 1500, mil: 34.04},
	{d: 1600, mil: 39.04},
	// {d: 1700, mil: 44.6},
	// {d: 1800, mil: 50.8},
];
for (let mgDrop of mgDrops) {
	if (mgDrop.d <= 500) {
		sight.add(new Line({
			from: [-0.1, mgDrop.mil], to: [0, mgDrop.mil],
		}));
	} else {
		sight.add(new Line({
			from: [(mgDrop.d % 200 === 0) ? -0.6 : -0.3, mgDrop.mil],
			to: [0, mgDrop.mil],
		}));
		if (mgDrop.d % 200 === 0) {
			sight.add(new TextSnippet({
				text: (mgDrop.d / 100).toFixed(), align: "left",
				pos: [-0.8, mgDrop.mil - 0.08], size: 0.4,
			}));
		}
	}
}
// mg reticle indication
sight.add(new TextSnippet({
	text: "7.62MM PKT", align: "left",
	pos: [-4, mgDrops.find((ele) => (ele.d === 1400)).mil - 0.2],  // [-2.5, 9],
	size: 0.6,
}));


// Rangefinder
sight.add(rgfd.getCommon([getMilHalf(800)*2, 15], {
	distances: [800, 1200, 1600, 2000],
	distancesDashed: [800],
	distancesLined: [1200, 1600, 2000],
	textSize: 0.55,
	tickLength: 1,
	tickInterval: 0.5,
	tickDashWidth: 0.35,
	textSpace: 0.4,
	textPosYAdjust: -0.15
}));

// Binocular calibration reference
let binoCaliEles = binoCali.getCommonRealMil({
	pos: [getMilHalf(800)*2, 24],
	quadHeight: 1.5,
	zeroLineExceeds: [-1.5, 0],
	upperLargeTextY: -2 + 1,
	upperSmallTextY: -1.8 + 1,
	lowerLargeTextY: 1.6 - 0.8,
	lowerSmallTextY: 1.4 - 0.8,
});
sight.add(binoCaliEles);
sight.add(binoCaliEles.filter((ele) => (ele instanceof Line)));






//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
