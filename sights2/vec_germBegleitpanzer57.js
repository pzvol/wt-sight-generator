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
	// pd.basic.colors.getRedGreen(),
	pd.basic.colors.getLightGreenRed(),
	// pd.basicBuild.rgfdPos([125, -0.01725]),
	// pd.basicBuild.detectAllyPos([125, -0.045]),
	// pd.basicBuild.gunDistanceValuePos([-0.17, 0.035]),
	pd.basicBuild.rgfdPos([115, -0.04025]),
	pd.basicBuild.detectAllyPos([115, -0.068]),
	pd.basicBuild.gunDistanceValuePos([-0.15, 0.057]),
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
let shells = {
	he: { name: "HE-VT", spd: 1020 * 3.6 },
	ap: { name: "AP-T", spd: 950 * 3.6 },
}
let airShell = shells.he;
let gndShell = shells.ap;
let assumedAirTgtSpd = 750;  // kph
let assumedGndTgtSpd = 45;  // kph
let getAirLdn = (aa) => Toolbox.calcLeadingMil(
	airShell.spd, assumedAirTgtSpd, aa
);
let getGndLdn = (aa) => Toolbox.calcLeadingMil(
	gndShell.spd, assumedGndTgtSpd, aa
);


// Gun center
Toolbox.repeat(2, () => {
	// sight.add(new Line({ from: [0.15, 0], to: [-0.15, 0], move: true }));
	// sight.add(new Line({ from: [0, 0.15], to: [0, -0.15], move: true }));
	// OR use a no-corner square
	let lineHalfLen = 0.06;
	let lineRadius = 0.18;
	sight.add(new Line({
		from: [lineRadius, -lineHalfLen], to: [lineRadius, lineHalfLen], move: true
	}).withMirrored("x"));
	sight.add(new Line({
		from: [-lineHalfLen, -lineRadius], to: [lineHalfLen, -lineRadius], move: true
	}));
});

// Sight center
for (let bias of Toolbox.rangeIE(-0.075, 0.075, 0.025)) {
	sight.add(new Line({ from: [0.6, bias], to: [2, bias] }).withMirrored("x"));
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
	segment: [0.75, 60], diameter: getAirLdn(0.5) * 2, size: 4.8  // [45 - 30, 45 + 30]
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
// sight.add(new Circle({
// 	segment: [2, 358], diameter: getAirLdn(0.25) * 2, size: 3
// }));
//   or, dashed
sight.add(new Circle({  // hori
	segment: [90 - 8, 90 + 8],
	diameter: getAirLdn(0.25) * 2, size: 3
}).withMirroredSeg("x"));
sight.add(new Circle({  // lower
	segment: [1.5, 35],
	diameter: getAirLdn(0.25) * 2, size: 3
}).withMirroredSeg("x"));
sight.add(new Circle({  // upper
	segment: [180 - 35, 180 + 35],
	diameter: getAirLdn(0.25) * 2, size: 3
}));
//   faster speed texts
sight.add(new TextSnippet({
	text: `1/4`,
	pos: [getAirLdn(0.25) - 1, 0.2],
	align: "left", size: 1.5
}));
sight.add(new TextSnippet({
	text: `${assumedAirTgtSpd} kph`,
	pos: [getAirLdn(0.25) + 0.8, 0.2],
	align: "right", size: 1.5
}));
//   slower speed texts
sight.add(new TextSnippet({
	text: `2/4`,
	pos: [getAirLdn(0.25) - 1, -1.9],
	align: "left", size: 0.95
}));
sight.add(new TextSnippet({
	text: `${assumedAirTgtSpd/2} kph`,
	pos: [getAirLdn(0.25) + 0.8, -1.9],
	align: "right", size: 0.95
}));


// Ground moving offsets
(() => {
	let arrowDegree = 60;
	let getArrowElements = (xPos, yLen) => {
		let xHalfWidth = Math.tan(Toolbox.degToRad(arrowDegree / 2)) * yLen;
		let halfElements = [
			new Line({ from: [0, 0], to: [xHalfWidth, yLen] }),
			new Line({ from: [xHalfWidth, yLen], to: [xHalfWidth/2, yLen] }),
		]
		let elements = [];
		halfElements.forEach((ele) => {
			elements.push(ele);
			elements.push(ele.copy().mirrorX());
		});
		elements.forEach((ele) => {
			ele.move([xPos, 0]).withMirrored("x");
		});
		return elements;
	}
	let getTickElements = (xPos, yLen, drawnXBiases = [0]) => {
		let elements = [];
		for (let biasX of drawnXBiases) {
			elements.push(new Line({
				from: [xPos + biasX, 0], to: [xPos + biasX, yLen]
			}).withMirrored("x"));
		}
		return elements;
	}

	// 4/4 AA
	sight.add(getArrowElements(getGndLdn(1), 0.4));
	sight.add(new TextSnippet({
		text: assumedGndTgtSpd.toFixed(),
		pos: [getGndLdn(1), 1-0.03],
		size: 0.55
	}).withMirrored("x"));
	// 3/4
	sight.add(getTickElements(
		getGndLdn(0.75), 0.2, [-0.02, 0.02]
	));
	// 2/4
	sight.add(getArrowElements(getGndLdn(0.5), 0.4));
	// 1/4
	sight.add(getTickElements(
		getGndLdn(0.25), 0.2, [-0.02, 0.02]
	));
	// Additional speed numbers
	sight.add(new TextSnippet({
		text: Toolbox.roundToHalf(0.75*assumedGndTgtSpd, -1).toString(),
		pos: [getGndLdn(0.75), 1-0.03], size: 0.5
	}).withMirrored("x"));
	sight.add(new TextSnippet({
		text: Toolbox.roundToHalf(0.5*assumedGndTgtSpd, -1).toString(),
		pos: [getGndLdn(0.5), 1-0.03], size: 0.5
	}).withMirrored("x"));
	// sight.add(new TextSnippet({
	// 	text: Toolbox.roundToHalf(0.25*assumedGndTgtSpd, -1).toString(),
	// 	pos: [getGndLdn(0.25), 1-0.03], size: 0.5
	// }).withMirrored("x"));
})();


// Shell info table
let shellTable = [];
shellTable.push(["FUNC", "TYPE", "SPD"])
for (let shellKey in shells) {
	let currShell = shells[shellKey];
	let colContents = [
		(
			// "air" uses EnSpace for formatting
			currShell.spd == airShell.spd ? '[ AIR ]' :
			currShell.spd == gndShell.spd ? '[ GND ]' :
			''
		),
		currShell.name,
		`${(currShell.spd / 3.6).toFixed()}m/s`
	];
	shellTable.push(colContents);
}
let shellTableColPos = [5, 11, 18];
// Draw elements
let shellTableElements = [];
for (let row = 0; row < shellTable.length; row++) {
	for (let col = 0; col < shellTable[row].length; col++) {
		let cellContent = shellTable[row][col];
		shellTableElements.push(new TextSnippet({
			text: cellContent,
			pos: [shellTableColPos[col] || 0, row * 2.5],
			align: (col == 0 ? "center" : "right"),
			size: 1.3,
		}))
	}
}
shellTableElements.forEach((ele) => {ele.move([67, 82])});
sight.add(shellTableElements);



//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
