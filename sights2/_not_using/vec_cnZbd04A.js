// SCRIPT_COMPILE_TO=cn_zbd_04a

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";
import templateComp from "../sight_bases/template_components/all.js"


let sight = new Sight();


sight.addDescription(`
Sight for ZBD04A, being directly converted from the one for BMP3.

BE AWARE: this sight haven't been finely tested on ZBD04A because I don't have
access to that vehicle.
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoom({ line: 1.6 }),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([110, -0.03225]),
	pd.basicBuild.detectAllyPos([110, -0.060]),
	pd.basicBuild.gunDistanceValuePos([-0.173, 0.048]),
	pd.basicBuild.shellDistanceTickVars(
		[-0.01, -0.01],
		[0, 0.0005],
		[0.2, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// VEHICLE TYPES ////
// Not needed


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 2000, shown: 20, shownPos: [0.0035, 0.0065] },
	{ distance: 4000, shown: 40, shownPos: [0.0035, 0.0065] },
]);


//// SIGHT DESIGNS ////
let shells = {
	apdsfs: { name: "30mm APDS-FS", spd: 1190 * 3.6, d400MilY: 1.5 },  // d400MilY estimated
	apds: { name: "30mm APDS", spd: 1180 * 3.6, d400MilY: 1.55 },
	he: { name: "30mm HE", spd: 960 * 3.6, d400MilY: 2.5 },
};
let gndShell = shells.apdsfs;
let assumedGndTgtSpd = 45;  // kph
let getGndLdn = (aa) => Toolbox.calcLeadingMil(
	gndShell.spd, assumedGndTgtSpd, aa
);


// 0m correction
// sight.add(new Line({ from: [-0.20, 0.0], to: [-0.21, 0.0], move: true, thousandth: false }));
sight.add(new Line({
	from: [-0.0055, 0], to: [0.016, 0], move: true, thousandth: false
}).move([-0.205, 0]));

// Pointer for correction value check
let corrValLine = [
	new Line({ from: [0.006, 0], to: [0.016, 0], thousandth: false }),
	new Line({ from: [-0.006, 0], to: [-0.008, 0], thousandth: false }),
	new Line({ from: [0.006, 0.0007], to: [0.016, 0.0007], thousandth: false }).withMirrored("y"),
	new Line({ from: [-0.006, 0.0007], to: [-0.008, 0.0007], thousandth: false }).withMirrored("y"),
];
//   move pointer to apporiate place
corrValLine.forEach((l) => { l.move([-0.205, 0]); });
sight.add(corrValLine);


// Marks for identifying used gun
(() => {
	let marksTickLen = 0.1;
	let marksXPos = -23;
	let marksMidHalfWidth = 0.5; // 0.016 + 0.0035;
	let getRangeElements = (rangeArr, tickLen, promptText) => {
		let templateElements = [];
		//   hori ticks
		if (tickLen > 0) {
			for (let y of rangeArr) {
				templateElements.push(new Line({
					from: [0, y], to: [-tickLen, y],
					thousandth: true, move: true
				}));
			}
		}
		//   vert range line
		templateElements.push(new Line({
			from: [-tickLen, rangeArr[0]],
			to: [-tickLen, rangeArr[1]],
			thousandth: true, move: true
		}));
		templateElements.push(  // bold
			templateElements[templateElements.length-1].copy().move([-0.0005, 0])
		);

		let outElements = [];
		templateElements.forEach((ele) => {
			outElements.push(ele.copy().move([marksXPos - marksMidHalfWidth, 0]));
		});
		outElements.push(new TextSnippet({
			text: promptText,
			pos: [
				-tickLen - 0.5,
				((rangeArr[0] + rangeArr[1]) / 2) - 0.09
			],
			size: 0.45, align: "left",
			thousandth: true, move: true
		}).move([marksXPos - marksMidHalfWidth, 0]));
		return outElements;
	};

	// 30mm gun
	let gun30YRange = (() => {
		let yValues = [
			shells.apdsfs, shells.apds, shells.he
		].map((ele) => (ele.d400MilY));
		return [yValues[0], yValues[yValues.length - 1]];
	})();
	sight.add(getRangeElements(
		gun30YRange, marksTickLen, "MAIN 30MM ?"
	)).repeatLastAdd();
})();


// Gun center
sight.add(new Line({
	from: [0.005, 0.0003], to: [0.0085, 0.0003], move: true, thousandth: false
}).withMirrored("xy"));  // y for bold
sight.add(new Line({
	from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
}));  // center dot


// Sight center arrow
let centerArrowDeg = 40;
let centerArrowYMoveDown = 0.02;
let arrowLines = templateComp.centerArrowFullscreen({
	lineSlopeDegree: centerArrowDeg,
	overallYPadding: centerArrowYMoveDown,
	boldYOffests: Toolbox.rangeIE(0, 0.08, 0.02),
	promptCurveRadius: getGndLdn(0.5),
	promptCurveSize: 1.2,
});
sight.add(arrowLines);
// cut central part for arrow bold lines
arrowLines.forEach((ele) => {
	if (ele instanceof Line) {
		let lineEnds = ele.getLineEnds();
		if (Math.abs(lineEnds.from[0] - lineEnds.to[0]) === 0) {
			return;  // vertical line
		}

		for (let dot of [lineEnds.from, lineEnds.to]) {
			if (dot[0] === 0 && dot[1] === centerArrowYMoveDown) {
				// Not extra bold line
				return;
			}
		}

		// for bold arrow lines
		ele.addBreakAtX(0, 2);
	}
});
// vertical lower bold
sight.add(new Line({
	from: [0.03, 450], to: [0.03, getGndLdn(0.75)]
}).withMirrored("x"));


// Missile drop indicators
// 100m
sight.add(new Circle({
	segment: [90-30, 90+45],
	pos: [-0.12, 2.12],
	diameter: 0.8, size: 1.5, move: true
}).withMirroredSeg("x"));
// missile will smoothly goes to sight center (and stays after ~125m)
// if gun correction is adjusted to this position
sight.add(new Circle({
	segment: [-centerArrowDeg, centerArrowDeg],
	pos: [0, 3.35],
	diameter: 1.2, size: 1.3, move: true
}).withMirroredSeg("x"));


// Leading offset arrows
sight.add(templateComp.leadingReticleArrowType({
	assumedMoveSpeed: assumedGndTgtSpd,
	shellSpeed: gndShell.spd,

	textYPosDefault: 1.1 - 0.05,
	textSizeDefault: 0.47,
	lineTickXOffsetsDefault: [-0.02, 0.02],

	tickParams: [
		{
			type: "arrow", aa: 1, yLen: 0.5,
			text: "_tick_speed_", textRepeated: true
		},
		{
			type: "line", aa: 0.75, yLen: 0.15,
			text: "_tick_speed_", textSize: 0.45,
		},
		{
			type: "arrow", aa: 0.5, yLen: 0.45,
			text: "_tick_speed_", textSize: 0.45,
		},
		{
			type: "line", aa: 0.25, yLen: 0.2,
		},
	],
}));


// Shell info table
let shellTable = [];
shellTable.push(["FUNC", "TYPE", "SPD"])
for (let shellKey in shells) {
	let currShell = shells[shellKey];
	let colContents = [
		(
			currShell.spd == gndShell.spd ? '[ GND ]' :
			'[         ]'
		),
		currShell.name,
		`${(currShell.spd / 3.6).toFixed()}m/s`
	];
	shellTable.push(colContents);
}
let shellTableColPos = [5, 9, 20];
// Draw elements
let shellTableElements = [];
for (let row = 0; row < shellTable.length; row++) {
	for (let col = 0; col < shellTable[row].length; col++) {
		let cellContent = shellTable[row][col];
		shellTableElements.push(new TextSnippet({
			text: cellContent,
			pos: [shellTableColPos[col] || 0, row * 1.7],
			align: (col == 0 ? "center" : "right"),
			size: 0.75,
		}))
	}
}
shellTableElements.forEach((ele) => {ele.move([35, 35])});
sight.add(shellTableElements);



//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
