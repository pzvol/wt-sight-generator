// SCRIPT_COMPILE_TO=cn_zbd_04a

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";


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


let centerArrowDeg = 40;
let centerArrowDegTan = Math.tan(Toolbox.degToRad(centerArrowDeg));

// Center arrow
let arrowLineBasis = new Line({
	from: [0, 0], to: [centerArrowDegTan * 450, 450]
}).withMirrored("x").move([0, 0.02]);
// ^ Moving down a little bit to let the arrow vertex stays the center
//   with being less effected by line widths
for (let posYBias of Toolbox.rangeIE(0, 0.08, 0.02)) {
	let addedLine = arrowLineBasis.copy().move([0, posYBias]);
	// bold lines avoid center area for better vision of missiles
	if (posYBias > 0) {
		addedLine.addBreakAtX(0, 2);
	}
	sight.add(addedLine);
}


// Center arrow position prompt curve
sight.add(new Circle({
	segment: [-centerArrowDeg, centerArrowDeg],
	diameter: getGndLdn(0.5) * 2,
	size: 1.2
}));
// Center position prompt vertical lower line
sight.add(new Line({ from: [0, 450], to: [0, getGndLdn(0.5)] }));
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
sight.add(getArrowElements(getGndLdn(1), 0.5));
sight.add(new TextSnippet({
	text: assumedGndTgtSpd.toFixed(),
	pos: [getGndLdn(1), 1.1-0.05],
	size: 0.47
}).withMirrored("x")).repeatLastAdd();
// 3/4
sight.add(getTickElements(
	getGndLdn(0.75), 0.15, [-0.04, 0.04]
));
// 2/4
sight.add(getArrowElements(getGndLdn(0.5), 0.45));
// 1/4
sight.add(getTickElements(
	getGndLdn(0.25), 0.2, [-0.02, 0.02]
));
// Draw additional speed numbers
sight.texts.add(new TextSnippet({
	text: Toolbox.roundToHalf(0.75*assumedGndTgtSpd, -1).toString(),
	pos: [getGndLdn(0.75), 1.1-0.05], size: 0.45
}).withMirrored("x"));
sight.texts.add(new TextSnippet({
	text: Toolbox.roundToHalf(0.5*assumedGndTgtSpd, -1).toString(),
	pos: [getGndLdn(0.5), 1.1-0.05], size: 0.45
}).withMirrored("x"));


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
