import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Sight for tanks with 125mm gun, 3BM42 and 4X~9X optics
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basicBuild.scale({font: 0.8, line: 1.5}),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([90, -0.04375]),
	pd.basicBuild.detectAllyPos([90, -0.067]),
	pd.basicBuild.gunDistanceValuePos([-0.13, 0.06]),
	pd.basicBuild.shellDistanceTickVars(
		[-0.01, -0.01],
		[0, 0],
		[0.15, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// VEHICLE TYPES ////
sight.matchVehicle([
	"ussr_t_64_b_1984",
	"ussr_t_80b",
]);


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 2000, shown: 20, shownPos: [0.0035, 0.0065] },
	{ distance: 4000, shown: 40, shownPos: [0.0035, 0.0065] },
]);


//// SIGHT DESIGNS ////
// shell tick positional info
let shellTicks = {
	shellName: "3BM42",
	shellSpd: 1700 * 3.6,  // m/s to kph
	rMoveSpd: 18,
	rRadius: 168,
	rAngles: [
		{d: 0, ra: 0},
		{d: 200, ra: 2.58},
		{d: 400, ra: 4.7},
		{d: 600, ra: 6.8},
		{d: 800, ra: 8.95},
		{d: 1000, ra: 11.12},
		{d: 1200, ra: 13.3},
		{d: 1400, ra: 15.57},
		{d: 1600, ra: 17.83},
		{d: 1800, ra: 20.1},
		{d: 2000, ra: 22.45},
		{d: 2400, ra: 27.2},
		{d: 2800, ra: 32.1},
		{d: 3200, ra: 37.12},
		{d: 3600, ra: 42.3},
		{d: 4000, ra: 48.7},
	]
}
// // Gun correction value display on the top
// // Display ring
// let rouletteCenter = [0, -238];
// // higher boundary
// for (let dBias of [0, 0.25, -0.25, -0.5]) {
// 	sight.add(new Circle({
// 		pos: rouletteCenter,
// 		diameter: (shellTicks.rRadius - 8) * 2 - dBias,
// 		size: 3
// 	}));
// }
// // lower boundary
// for (let dBias of [0, 0.25, -0.25]) {
// 	sight.add(new Circle({
// 		pos: rouletteCenter,
// 		diameter: (shellTicks.rRadius + 7) * 2 - dBias,
// 		size: 3
// 	}));
// }
// // Current value indication
// sight.add(new Line({
// 	from: [0, rouletteCenter[1] + shellTicks.rRadius - 8],
// 	to: [0, rouletteCenter[1] + shellTicks.rRadius + 2.5]
// }));
// sight.add(new Line({
// 	from: [0, rouletteCenter[1] + shellTicks.rRadius + 5.75],
// 	to: [0, rouletteCenter[1] + shellTicks.rRadius + 7]
// }));
// // current value bold
// sight.add(new Quad({
// 	topCenter: [0, rouletteCenter[1] + shellTicks.rRadius - 8],
// 	xWidth: 0.6, yWidth: 3
// }));
// sight.add(new Quad({  // triangle
// 	topLeft: [-0.3, rouletteCenter[1] + shellTicks.rRadius - 8 + 3],
// 	topRight: [0.3, rouletteCenter[1] + shellTicks.rRadius - 8 + 3],
// 	bottomLeft: [0, rouletteCenter[1] + shellTicks.rRadius - 8 + 4],
// 	bottomRight: [0, rouletteCenter[1] + shellTicks.rRadius - 8 + 4],
// }));
// sight.add(new Quad({  // triangle
// 	bottomLeft: [-0.5, rouletteCenter[1] + shellTicks.rRadius + 7],
// 	bottomRight: [0.5, rouletteCenter[1] + shellTicks.rRadius + 7],
// 	topLeft: [0, rouletteCenter[1] + shellTicks.rRadius + 7 - 1],
// 	topRight: [0, rouletteCenter[1] + shellTicks.rRadius + 7 - 1],
// }));
// // Shell indication
// sight.add(new TextSnippet({
// 	text: shellTicks.shellName, align: "left",
// 	pos: [-1, rouletteCenter[1] + shellTicks.rRadius - 8 + 1.75],
// 	size: 1.05
// }));
// sight.add(new TextSnippet({
// 	text: "APFSDS", align: "right",
// 	pos: [1, rouletteCenter[1] + shellTicks.rRadius - 8 + 1.75],
// 	size: 1.05
// }));

// // Ticks
// for (let rAngle of shellTicks.rAngles) {
// 	let tickHalfWidth = (rAngle.d % 400 == 0) ? 2 : 1;
// 	let tickCenterY = rouletteCenter[1] + shellTicks.rRadius;
// 	for (let paddingX of [0, -0.1, 0.1]) {
// 		sight.add(new Line({
// 			from: [paddingX, tickCenterY - tickHalfWidth],
// 			to: [paddingX, tickCenterY + tickHalfWidth],
// 			moveRadial: true, radialCenter: rouletteCenter, radialMoveSpeed: shellTicks.rMoveSpd,
// 			radialAngle: rAngle.ra
// 		}));
// 	}
// 	if (rAngle.d % 400 == 0) {
// 		let textPosY = rouletteCenter[1] + shellTicks.rRadius + 3.85;
// 		let textRMoveSpd = shellTicks.rMoveSpd / shellTicks.rRadius * (shellTicks.rRadius + 3.85);
// 		sight.add(new TextSnippet({
// 			text: (rAngle.d / 100).toFixed(),
// 			pos: [0, textPosY], size: 1.4,
// 			moveRadial: true, radialCenter: rouletteCenter, radialMoveSpeed: textRMoveSpd,
// 			radialAngle: rAngle.ra
// 		}));
// 	}
// }

// // Gun correction display position prompt arrows above sight view top
// for (let paddingY of [-110, -120, -140, -150]) {
// 	sight.add(new Quad({
// 		topLeft: [0, -2 + paddingY], topRight: [28.5, -20 + paddingY],
// 		bottomLeft: [0, paddingY], bottomRight: [31.5, -20 + paddingY]
// 	}).withMirrored("x"));
// }



// Gun center
sight.add(new Line({
	from: [0.002, 0], to: [0.004, 0], move: true, thousandth: false
}).withMirrored("x"));
// bold
sight.add(new Line({
	from: [0.002, 0], to: [0.004, 0], move: true, thousandth: false
}).withMirrored("xy"));
// sight.add(new Line({
// 	from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
// }));  // center dot

// 0m correction
sight.add(new Line({ from: [-0.16, 0.0], to: [-0.15, 0.0], move: true, thousandth: false }));

// correction value indication
let corrValLine = [
	new Line({ from: [0.0055, 0.00035], to: [0.016, 0.00035], thousandth: false }).withMirrored("y"),  // mirrored for bold
	new Line({ from: [-0.0055, 0.00035], to: [-0.016, 0.00035], thousandth: false }).withMirrored("y"),  // mirrored for bold
];
// move arrow to apporiate place
corrValLine.forEach((l) => { l.move([-0.155, 0]); });
sight.add(corrValLine);


let centerArrowDeg = 40;
let assumedMoveSpd = 40;
let getLdn = (aa) => Toolbox.calcLeadingMil(shellTicks.shellSpd, assumedMoveSpd, aa);

// Sight Center arrow line and bolds
let arrowLineBasis = new Line({
	from: [0, 0],
	to: [Math.tan(Toolbox.degToRad(centerArrowDeg)) * 450, 450]
}).withMirrored("x").move([0, 0.02]);
// ^ Moving down a little bit to let the arrow vertex stays the center
//   with being less effected by line widths
for (let posYBias of Toolbox.rangeIE(0, 0.08, 0.02)) {
	sight.add(arrowLineBasis.copy().move([0, posYBias]));
}

// Lower vertical line
sight.add(new Line({ from: [0, 450], to: [0, getLdn(1)] }));
sight.add(new Line({ from: [0.03, 450], to: [0.03, getLdn(1.5)] }).withMirrored("x"));
// Center prompt curve
sight.add(new Circle({
	segment: [-centerArrowDeg, centerArrowDeg],
	diameter: getLdn(1) * 2,
	size: 1.2
}));


// leading values for shooting while moving
let ldHoriLine = new Line({
	from: [getLdn(1), 0], to: [getLdn(0.5), 0]
}).withMirrored("x");
sight.add(ldHoriLine);
// 4/4 AA
Toolbox.repeat(2, () => {
	sight.add(new TextSnippet({
		text: assumedMoveSpd.toFixed(), pos: [getLdn(1), -0.1], size: 0.5
	}).withMirrored("x"));
});
ldHoriLine.addBreakAtX(getLdn(1), 1.7)
// 3/4 ~ 1/4
for (let aa of [0.25, 0.5, 0.75]) {
	for (let biasY of Toolbox.rangeIE(-0.05, 0.05, 0.05)) {
		let Xradius = 0.05;
		sight.add(new Line({
			from: [getLdn(aa) - Xradius, biasY],
			to: [getLdn(aa) + Xradius, biasY],
		}).withMirrored("x"));
	}
}
ldHoriLine.addBreakAtX(getLdn(0.75), 0.7);




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
