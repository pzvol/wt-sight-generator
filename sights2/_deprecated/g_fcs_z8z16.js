import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";
import fcsRadialCfgs from "./sight_components/mousewheel_move_tick_cfg.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
An virtual FCS sight inspired Luch series, for 8-16X optics.

Luch FCS: https://live.warthunder.com/post/1069134/en/
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoom(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([110, -0.02125]),
	pd.basicBuild.detectAllyPos([110, -0.045]),
	pd.basicBuild.gunDistanceValuePos([-0.13, 0.035]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0070, 0.0025],
		[0.005, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds);


//// SHELL DISTANCES ////
sight.addShellDistance(pd.shellDists.getFullLoose());


//// SIGHT DESIGNS ////
// w & h based on T-54
let assumedTgtWidth = 3.3;
let assumedTgtHeight = 2.4;

// Get positioning configs
let mouseWheelMult = 75;
let mouseWheelTickMil = fcsRadialCfgs.getLinearTickMil(mouseWheelMult);
let fcsConfig = fcsRadialCfgs.getConfigByParams({
	mouseWheelMult: mouseWheelMult,
	radius: 10000,
	radialSpeed: 1000
});
let radialCenter = [fcsConfig.radius, 0];

// Appriximate shell(DM12 HEAT) distance for each tick
// collected with 75 mult
// TODO: Based on a more accurate mathmatical model
let tickShellDists = [
	0, 350, 700, 1000, 1300, 1550, 1800, 2000, 2200, 2400, 2550, 2750, 2900,
	3050, 3150, 3300, 3400, 3550, 3650, 3750, 3850
];


let getTgtCornerMil = (dist) => [
	Toolbox.calcDistanceMil(assumedTgtWidth, dist) / 2,
	Toolbox.calcDistanceMil(assumedTgtHeight, dist) / 2,
];
let getAdjustedRadialSpeed = (lineFrom, lineTo) => {
	let lineCenter = [
		(lineFrom[0] + lineTo[0]) / 2,
		(lineFrom[1] + lineTo[1]) / 2,
	];
	let realRadius = Math.sqrt(
		(radialCenter[0] + lineCenter[0])**2 +
		(radialCenter[1] + lineCenter[1])**2
	);
	return (fcsConfig.radialSpeed / (realRadius / fcsConfig.radius));
}
let getFcsQuadEles = (dist, tickCount) => {
	let results = [];
	let cornerPos = getTgtCornerMil(dist);
	for (let toPos of [
		[cornerPos[0], cornerPos[1]*0.67],
		[cornerPos[0]*0.67, cornerPos[1]]
	]) {
		for (let mirroring of [
			{x: 1, y: 1},
			{x: -1, y: -1},
			{x: -1, y: 1},
			{x: 1, y: -1},
		]) {
			let mirroredFrom = [
				cornerPos[0] * mirroring.x,
				cornerPos[1] * mirroring.y,
			];
			let mirroredTo = [
				toPos[0] * mirroring.x,
				toPos[1] * mirroring.y,
			];
			results.push(new Line({
				from: mirroredFrom, to: mirroredTo,
				moveRadial: true,
				radialCenter: radialCenter,
				radialAngle: fcsConfig.tickAngle * tickCount,
				radialMoveSpeed: getAdjustedRadialSpeed(mirroredFrom, mirroredTo),
			}));
		}
	}
	return results;
}


// Sight center
sight.add(new Circle({ diameter: 0.3, size: 2 }));
sight.add(new Circle({ diameter: 0.15, size: 4 }));
// Gun center
Toolbox.repeat(2, () => {
	sight.add(new Line({ from: [-0.16, 0], to: [0.16, 0], move: true }));
	sight.add(new Line({ from: [0, -0.16], to: [0, 0.16], move: true }));
});

// Draw virtual FCS quads
for (let count = 0; count < tickShellDists.length; count++) {
	if (count == 0) { continue; }
	let shellDist = tickShellDists[count];
	sight.add(getFcsQuadEles(shellDist, count));
}

// Sight cross
// Vertical
sight.add(new Line({ from: [0, -450], to: [0, -24.75] }).withMirrored("y"));
sight.add(new Line({ from: [0.1, -450], to: [0.1, -40] }).withMirrored("xy"));
// Horizontal
sight.add(new Line({ from: [450, 0], to: [66, 0] }).withMirrored("x"));
sight.add(new Line({ from: [450, 0.1], to: [66, 0.1] }).withMirrored("xy"));
// Inner
sight.add(new Line({
	from: [Toolbox.calcDistanceMil(assumedTgtWidth, 100)/2, 0],
	to: [Toolbox.calcDistanceMil(assumedTgtWidth, 200)/2, 0],
}).withMirrored("x"));


// Prompt text
sight.add(new TextSnippet({
	text: `FCS`,
	align: "right", pos: [66.5, -1.2 - 1.5], size: 0.9
}));
sight.add(new TextSnippet({
	text: `ON  (75%)`,
	align: "right", pos: [66.5 + 4.4, -1.2 - 1.5], size: 0.9
}));
sight.add(new TextSnippet({
	text: `ASM`,
	align: "right", pos: [66.5, -1.2], size: 0.9
}));
sight.add(new TextSnippet({
	text: `W ${assumedTgtWidth}m,  H ${assumedTgtHeight}m`,
	align: "right", pos: [66.5 + 4.4, -1.2], size: 0.9
}));
sight.add(new TextSnippet({
	text: `SHELL`,
	align: "right", pos: [66.5, 1], size: 0.9
}));
sight.add(new TextSnippet({
	text: `DM12 1174 m/s`,
	align: "right", pos: [66.5 + 4.4, 1], size: 0.9
}));



//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
