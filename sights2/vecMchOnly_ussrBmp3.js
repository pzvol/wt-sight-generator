import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";
import templateComp from "./sight_bases/template_components/all.js"


let sight = new Sight();


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoomSmall2Font(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([110, -0.03225]),
	pd.basicBuild.detectAllyPos([110, -0.060]),
	pd.basicBuild.gunDistanceValuePos([-0.173, 0.048]),
	pd.basicBuild.shellDistanceTickVars(
		[-0.01, -0.01],
		[0, 0.0005],
		[0.4, 0]
	),
	pd.basic.miscVars.getCommon(),
));

// Additionally for more dist ticks
//   Manual length adjustment for main and sub ticks having same length set
let shellDistTickAdj = 0.0027;
sight.updateOrAddSettings(
	pd.basicBuild.shellDistanceTickVars(
		[-0.016 + shellDistTickAdj, shellDistTickAdj],
		[0.0005, 0],
		[0.348 + shellDistTickAdj, 0]
	),
)


//// VEHICLE TYPES ////
sight.matchVehicle("ussr_bmp_3");


//// SHELL DISTANCES ////
// sight.addShellDistance([
// 	{ distance: 400 },
// 	{ distance: 800 },
// 	{ distance: 2000, shown: 20, shownPos: [0.0035, 0.0065] },
// 	{ distance: 4000, shown: 40, shownPos: [0.0035, 0.0065] },
// ]);
// Or, more dist ticks
for (let d of Toolbox.range(0, 4000, 100, {includeStart: false, includeEnd: true})) {
	// main ticks
	if ([400, 800, 2000, 4000].find(v => v === d)) {
		sight.addShellDistance({
			distance: d, shown: d/100,
			shownPos: [(d < 1000 ? 10 : -0.022), -0.0009]
		});

	// sub ticks
	} else if (d > 400) {
		sight.addShellDistance({ distance: d });
	}
}

//// SIGHT DESIGNS ////
let shells = {
	apds: { name: "30mm APDS", spd: 1120 * 3.6, d400NotMilY: 0.0165 },
	ap: { name: "30mm AP", spd: 970 * 3.6, d400NotMilY: 0.0232 },
	he: { name: "30mm HEI", spd: 960 * 3.6, d400NotMilY: 0.0240 },
};
// let shellsGun100 = {
// 	he: { name: "100mm 3OF70", spd: 355 * 3.6, d400NotMilY: 0.1559 }
// }
let airShell = shells.he;
let gndShell = shells.apds;
let assumedAirTgtSpd = 300;  // kph  // 600 for avaitions?
let assumedGndTgtSpd = 45;  // kph
let getAirLdn = (aa) => Toolbox.calcLeadingMil(
	airShell.spd, assumedAirTgtSpd, aa
);
let getGndLdn = (aa) => Toolbox.calcLeadingMil(
	gndShell.spd, assumedGndTgtSpd, aa
);


// 0m correction
// sight.add(new Line({ from: [-0.20, 0.0], to: [-0.21, 0.0], move: true, thousandth: false }));
sight.add(new Line({
	from: [-0.0055, 0], to: [0.016, 0], move: true, thousandth: false
}).move([-0.205, 0]));
//   for unzoomed status
(() => {
	let zoomMult = Toolbox.calcMultForZooms(12, 2.5);
	let oldFrom = -0.005 - 0.205;
	let oldTo = 0.005 - 0.205;
	let oldLength = oldTo - oldFrom;
	sight.add(new Line({
		from: [oldTo * zoomMult - oldLength * zoomMult - 0.019, 0],
		to: [oldTo * zoomMult - 0.021, 0],
		move: true, thousandth: false
	}));
})();


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
//   for unzoomed status
(() => {
	let zoomMult = Toolbox.calcMultForZooms(12, 2.5) + 0.1;
	corrValLine.forEach((l) => {
		let ends = l.getLineEnds();
		let extraDrawnStr = ends.from[1] === 0 ? "" : "y";

		ends.from[0] *= zoomMult;
		ends.from[1] *= zoomMult;
		ends.to[0] *= zoomMult;
		ends.to[1] *= zoomMult;

		sight.add(
			new Line({
				from: ends.from,
				to: ends.to,
				thousandth: false,
			}).withMirrored(extraDrawnStr)
		);
	});
})();

// Marks for identifying used gun
(() => {
	let marksTickLen = 0.001;
	let marksXPos = -0.205;
	let marksMidHalfWidth = 0.009; // 0.016 + 0.0035;
	let getRangeElements = (rangeArr, tickLen, promptText) => {
		let templateElements = [];
		//   hori ticks
		if (tickLen > 0) {
			for (let y of rangeArr) {
				templateElements.push(new Line({
					from: [0, y], to: [-tickLen, y],
					thousandth: false, move: true
				}));
			}
		}
		//   vert range line
		templateElements.push(new Line({
			from: [-tickLen, rangeArr[0]],
			to: [-tickLen, rangeArr[1]],
			thousandth: false, move: true
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
				-tickLen - 0.006,
				((rangeArr[0] + rangeArr[1]) / 2) - 0.0009
			],
			size: 0.45, align: "left",
			thousandth: false, move: true
		}).move([marksXPos - marksMidHalfWidth, 0]));
		return outElements;
	};

	// // 30mm gun
	// let gun30YRange = (() => {
	// 	let yValues = [
	// 		shells.apds, shells.ap, shells.he
	// 	].map((ele) => (ele.d400NotMilY));
	// 	return [yValues[0], yValues[yValues.length - 1]];
	// })();
	// sight.add(getRangeElements(
	// 	gun30YRange, marksTickLen, "MAIN 30MM ?"
	// )).repeatLastAdd();

	// // 100mm gun
	// let gun100YRange = [
	// 	shellsGun100.he.d400NotMilY - 0.005,
	// 	shellsGun100.he.d400NotMilY + 0.005,
	// ];
	// sight.add(getRangeElements(
	// 	gun100YRange, marksTickLen, "100mm HE ?"
	// )).repeatLastAdd();
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
	...templateComp.centerArrowFullscreen.presetPartial["z3z12"],
	lineSlopeDegree: centerArrowDeg,
	overallYPadding: centerArrowYMoveDown,
	promptCurveRadius: getGndLdn(0.5),
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
	diameter: 0.8, size: 1.2, move: true
}).withMirroredSeg("x"));
// missile will smoothly goes to sight center (and stays after ~125m)
// if gun correction is adjusted to this position
sight.add(new Circle({
	segment: [-centerArrowDeg, centerArrowDeg],
	pos: [0, 3.35],
	diameter: 1.2, size: 1, move: true
}).withMirroredSeg("x"));


// Leading offset arrows
sight.add(templateComp.leadingReticleArrowType({
	assumedMoveSpeed: assumedGndTgtSpd,
	shellSpeed: gndShell.spd,

	textYPosDefault: 0.97 - 0.03,
	textSizeDefault: 0.5,
	lineTickXOffsetsDefault: [-0.02, 0.02],

	tickParams: [
		{
			type: "arrow", aa: 1, yLen: 0.43,
			text: "_tick_speed_", textRepeated: true
		},
		{
			type: "line", aa: 0.75, yLen: 0.2,
			text: "_tick_speed_", textSize: 0.45,
		},
		{
			type: "arrow", aa: 0.5, yLen: 0.43,
			text: "_tick_speed_", textSize: 0.45,
		},
		{
			type: "line", aa: 0.25, yLen: 0.2,
		},
	],
}));


// Air leading circles
// Curves
let segHalfLens = { hori: 8, lower: 12, upper: 8, };
let curveSizes = { inner: 6, outer: 8, };
//   lower
sight.add(new Circle({
	segment: [0.75, segHalfLens.lower/2], diameter: getAirLdn(1) * 2,
	size: curveSizes.outer
}).withMirroredSeg("x"));
sight.add(new Circle({
	segment: [1.5, segHalfLens.lower], diameter: getAirLdn(0.5) * 2,
	size: curveSizes.inner
}).withMirroredSeg("x"));
//   hori
for (let segCenter of [90, 270]) {
	sight.add(new Circle({
		segment: [segCenter - segHalfLens.hori/2, segCenter + segHalfLens.hori/2],
		diameter: getAirLdn(1) * 2, size: curveSizes.outer
	}));
	sight.add(new Circle({
		segment: [segCenter - segHalfLens.hori, segCenter + segHalfLens.hori],
		diameter: getAirLdn(0.5) * 2, size: curveSizes.inner
	}));
}
//   upper
sight.add(new Circle({
	segment: [180 - segHalfLens.upper, 180 + segHalfLens.upper],
	diameter: getAirLdn(1) * 2, size: curveSizes.outer
}));
sight.add(new Circle({
	segment: [180 - segHalfLens.upper, 180 + segHalfLens.upper],
	diameter: getAirLdn(0.5) * 2, size: curveSizes.inner
}));
//   additional 3/4
if (assumedAirTgtSpd > 550) {  // when 4/4 upper tick out of screen
	// sight.add(new Line({from: [getAirLdn(0.75), 0], to: [getAirLdn(1), 0]}).withMirrored("x"));
	// sight.add(new Line({from: [0, -getAirLdn(0.75)], to: [0, -getAirLdn(1)]}));
	for (let segCenter of [0, 90, 180, 270]) {
		sight.add(new Circle({
			segment: [segCenter - segHalfLens.hori/6, segCenter + segHalfLens.hori/6],
			diameter: getAirLdn(0.75) * 2, size: curveSizes.outer
		}));
	}
}
// Texts
// 4/4
sight.add(new TextSnippet({
	text: `${assumedAirTgtSpd} kph`,
	pos: [getAirLdn(1) + 2, -0.3],
	align: "right", size: 2.5
}));
// 2/4
sight.add(new TextSnippet({
	text: (assumedAirTgtSpd * 0.5).toFixed(),
	pos: [getAirLdn(0.5) + 2, -0.3],
	align: "right", size: 2
}));


// Shell info table
let shellTable = [];
shellTable.push(["FUNC", "TYPE", "SPD"])
for (let shellKey in shells) {
	let currShell = shells[shellKey];
	let colContents = [
		(
			// "a/g" and "air" uses EnSpace for formatting
			currShell.spd == airShell.spd && currShell.spd == gndShell.spd ? '[ A/G ]' :
			currShell.spd == airShell.spd ? '[ AIR ]' :
			currShell.spd == gndShell.spd ? '[ GND ]' :
			'[          ]'
		),
		currShell.name,
		`${(currShell.spd / 3.6).toFixed()}m/s`
	];
	shellTable.push(colContents);
}
let shellTableColPos = [5, 15, 38];
// Draw elements
let shellTableElements = [];
for (let row = 0; row < shellTable.length; row++) {
	for (let col = 0; col < shellTable[row].length; col++) {
		let cellContent = shellTable[row][col];
		shellTableElements.push(new TextSnippet({
			text: cellContent,
			pos: [shellTableColPos[col] || 0, row * 4],
			align: (col == 0 ? "center" : "right"),
			size: 2,
		}))
	}
}
shellTableElements.forEach((ele) => {ele.move([90, 90])});
sight.add(shellTableElements);


// Shell type indicator prompt
let shellTypePromptPos = [113.5, 72.3];
let shellTypePromptLineHalfLength = 14;
let shellTypePromptLineOffsetY = 3;
let shellTypePromptTextSize = 2;
let drawShellTypePrompt = () => {
	sight.add(new TextSnippet({
		text: "MAIN",
		pos: shellTypePromptPos,
		align: "center",
		size: shellTypePromptTextSize,
	}));
	sight.add(new Line({
		from: [
			shellTypePromptPos[0] + shellTypePromptLineHalfLength,
			shellTypePromptPos[1] + shellTypePromptLineOffsetY
		],
		to: [
			shellTypePromptPos[0] - shellTypePromptLineHalfLength,
			shellTypePromptPos[1] + shellTypePromptLineOffsetY
		]
	}));
};
drawShellTypePrompt();

//  zoomed in prompt elements
(() => {
	let zoomMult = Toolbox.calcMultForZooms(2.5, 12);
	shellTypePromptPos[0] *= zoomMult;
	shellTypePromptPos[1] *= zoomMult;
	shellTypePromptPos[1] -= 0.2;
	shellTypePromptLineHalfLength *= zoomMult;
	shellTypePromptLineOffsetY *= zoomMult;
	shellTypePromptLineOffsetY += 0.1;
	shellTypePromptTextSize *= zoomMult;
	drawShellTypePrompt();
})();



//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
