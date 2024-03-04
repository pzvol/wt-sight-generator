import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoomSmallFont(),
	pd.basic.colors.getLightGreenRed(),
	pd.basicBuild.rgfdPos([150, -0.013]),
	pd.basicBuild.detectAllyPos([150, -0.038]),
	pd.basicBuild.gunDistanceValuePos([-0.2, 0.027]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0070, 0.002],
		[0.005, -0.0009]  // y for text height
	),
	pd.basic.miscVars.getCommon()
));


//// VEHICLE TYPES ////
sight.matchVehicle([
	"germ_marder_1a1",
	"germ_marder_1a3",
]);


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 2000, shown: 20 },  // wider the line w/o seeing the value
	{ distance: 4000, shown: 40 },
]);


//// SIGHT DESIGNS ////
let shells = {
	he: { name: "HEFI", spd: 1100 * 3.6 },
	hvap: { name: "HVAP", spd: 1100 * 3.6 },
	apds: { name: "APDS", spd: 1150 * 3.6 },
};
let airShell = shells.he;
let gndShell = shells.apds;
let assumedAirTgtSpd = 500;  // kph
let assumedGndTgtSpd = 40;  // kph
let getAirLdn = (aa) => Toolbox.calcLeadingMil(
	airShell.spd, assumedAirTgtSpd, aa
);
let getGndLdn = (aa) => Toolbox.calcLeadingMil(
	gndShell.spd, assumedGndTgtSpd, aa
);


// Gun center & Sight center
(() => {
	// Gun center, a no-corner square
	let lineHalfLen = 0.15;
	let lineRadius = 0.4;
	sight.add(new Line({
		from: [lineRadius, -lineHalfLen], to: [lineRadius, lineHalfLen], move: true
	}).withMirrored("x"));
	sight.add(new Line({
		from: [-lineHalfLen, -lineRadius], to: [lineHalfLen, -lineRadius], move: true
	})).repeatLastAdd();

	// Sight center
	// //   line type
	// sight.add(new Line({
	// 	from: [lineRadius + 0.25, 0], to: [getGndLdn(0.25), 0], move: false
	// }).withMirrored("x")).repeatLastAdd();
	//   or, arrow type
	let centerArrowHalfDegree = 30;
	let centerArrowYLen = 5;
	let centerArrowXHalfWidth = centerArrowYLen * Math.tan(Toolbox.degToRad(centerArrowHalfDegree));
	let arrowLine = new Line({
		from: [0, 0],
		to: [centerArrowXHalfWidth, centerArrowYLen]
	}).withMirrored("x");
	for (let biasVert of Toolbox.rangeIE(-0.05, 0.05, 0.05)) {
		sight.add(arrowLine.copy()
			.move([
				biasVert * Math.cos(Toolbox.degToRad(centerArrowHalfDegree)),
				-biasVert * Math.sin(Toolbox.degToRad(centerArrowHalfDegree))
			])
			.addBreakAtX(0, (lineRadius+0.3)*2)
		);
	}
	sight.add(new Circle({
		segment: [centerArrowHalfDegree, 120], pos: [0, 0],
		diameter: (lineRadius+0.3)*2, size: 2
	}).withMirroredSeg("x"));
})();


// Lower vertical line
sight.add([
	new Line({ from: [0, 6], to: [0, 450] }),
	new Line({ from: [0.02, 8.25], to: [0.02, 450] }).withMirrored("x"),
]);


// Air leading circles
// Curves
let segHalfLen = 7.5;
//   lower
sight.add(new Circle({
	segment: [0.8, segHalfLen], diameter: getAirLdn(1) * 2, size: 4.8
}).withMirroredSeg("x"));
sight.add(new Circle({
	segment: [1.6, segHalfLen], diameter: getAirLdn(0.5) * 2, size: 4
}).withMirroredSeg("x"));
//   others
for (let segCenter of Toolbox.range(0, 360, 90, {
	includeStart: false, includeEnd: false
})) {
	sight.add(new Circle({
		segment: [segCenter - segHalfLen, segCenter + segHalfLen],
		diameter: getAirLdn(1) * 2, size: 4.8
	}));
	sight.add(new Circle({
		segment: [segCenter - segHalfLen, segCenter + segHalfLen],
		diameter: getAirLdn(0.5) * 2, size: 4
	}));
}
// Texts
// sight.add(new Line({from: [-450, 0], to: [450, 0]}))
// 4/4
sight.add(new TextSnippet({
	text: `${assumedAirTgtSpd} kph`,
	pos: [getAirLdn(1) + 2, -0.5],
	align: "right", size: 1.5
}));
// 2/4
sight.add(new TextSnippet({
	text: (assumedAirTgtSpd * 0.5).toFixed(),
	pos: [getAirLdn(0.5) + 2, -0.5],
	align: "right", size: 1.2
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
	sight.add(getArrowElements(getGndLdn(1), 1));
	sight.add(new TextSnippet({
		text: assumedGndTgtSpd.toFixed(),
		pos: [getGndLdn(1), 2-0.03],
		size: 0.45
	}).withMirrored("x"));
	// 3/4
	sight.add(getTickElements(
		getGndLdn(0.75), 0.4, [-0.02, 0.02]
	));
	// 2/4
	sight.add(getArrowElements(getGndLdn(0.5), 0.4));
	// 1/4
	sight.add(getTickElements(
		getGndLdn(0.25), 0.4, [-0.02, 0.02]
	));
})();


// Shell info
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
let shellTableColPos = [5, 17, 30];
// Draw elements
let shellTableElements = [];
//   head separator line
shellTableElements.push(new Line({
	from: [-1, 3], to: [46, 3]
}));
//   texts
for (let row = 0; row < shellTable.length; row++) {
	for (let col = 0; col < shellTable[row].length; col++) {
		let cellContent = shellTable[row][col];
		shellTableElements.push(new TextSnippet({
			text: cellContent,
			pos: [shellTableColPos[col] || 0, row * 5],
			align: (col == 0 ? "center" : "right"),
			size: 1.3
		}))
	}
}
shellTableElements.forEach((ele) => {ele.move([130, 150])});
sight.add(shellTableElements);



//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
