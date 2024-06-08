import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";

import ENV_SET from "./helper/env_settings.js";
import * as pd from "./helper/predefined.js";
import * as calc from "./helper/calculators.js";
import comp from "./components/all.js";

import rgfd from "./extra_modules/rangefinder.js"
import binoCali from "./extra_modules/binocular_calibration_2.js"


let sight = new Sight();
let horiRatioMult = new calc.HoriRatioMultCalculator(
	16 / 9, ENV_SET.DISPLAY_RATIO_NUM
).getMult();


// Introduction comment
sight.addDescription(`
Generic sight for tanks with 3X~8X optics.
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatSettings(
	pd.sScale.getMidHighZoom(),
	pd.sColor.getLightGreenRed(),
	pd.sRgfd.build([115 / horiRatioMult, -0.015]),
	pd.sDetectAlly.build([115 / horiRatioMult, -0.04]),
	pd.sGunDistValue.build([-0.18 * horiRatioMult, 0.027]),
	pd.sShellDistTick.build(
		[0.01, 0.01],
		[0.005, 0.002],
		[0.2 - -(1 - horiRatioMult) * 0.015, 0]
	),
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"ussr_t_10a",
	"ussr_t_10m",
]);


//// SHELL DISTANCES ////
sight.addShellDistance(pd.shellDistTicks.getFullLoose());


//// SIGHT DESIGNS ////
let assumedTgtWidth = 3.3;
let distMil = new calc.DistMilCalculator(assumedTgtWidth);


// Gun center
sight.add(new Circle({
	diameter: 0.5, size: 1.25, move: true
})).repeatLastAdd();


// Gun 0m
sight.add(new Line({
	from: [-0.202, 0], to: [-0.190, 0], move: true, thousandth: false
})).repeatLastAdd();
sight.add(new TextSnippet({
	text: "0",
	align: "left",
	pos: [-0.205, -0.0009],
	size: 0.7,
	move: true,
	thousandth: false
}));


// Gun distance indication
let leftArrow = [
	new Line({
		from: [0, 0], to: [0.006, 0.002],
		thousandth: false,
	}).withMirrored("y"),
	new Line({
		from: [0, 0], to: [0.006, 0.0018],
		thousandth: false,
	}).withMirrored("y"),
	new Line({
		from: [0.006, 0.001], to: [0.006, 0.002],
		thousandth: false,
	}).withMirrored("y"),
];
for (let ele of leftArrow) {
	sight.add(ele.copy().move([-0.188, 0])).repeatLastAdd();
	sight.add(ele.copy().mirrorX().move([-0.220, 0])).repeatLastAdd();
}


// Center arrow
let centerArrowDeg = 25;
let centerArrowYLen = 5.25;
let centerArrowDegTan = Math.tan(Toolbox.degToRad(centerArrowDeg));
for (let biasY of Toolbox.rangeIE(0, 0.24, 0.04)) {
	sight.add(new Line({
		from: [0, biasY],
		to: [
			(centerArrowYLen * centerArrowDegTan) - (biasY * centerArrowDegTan),
			centerArrowYLen
		]
	}).withMirrored("x").move([0, 0.03]));
}


// Cross lines
for (let biasX of Toolbox.rangeIE(-0.04, 0.04, 0.04)) {
	sight.add(new Line({from: [biasX, 26], to: [biasX, 450]}));
}
for (let b of Toolbox.rangeIE(0, 0.20, 0.04)) {
	sight.add(new Line({
		from: [b, 85], to: [b, 450]
	}).withMirrored("xy"));
	sight.add(new Line({
		from: [180 * horiRatioMult, b], to: [450, b]
	}).withMirrored(b == 0 ? "x" : "xy"));
}


// Rangefinder on the horizon
let smallTickLen = (d) => (1.6 / distMil.halfFor(400) * distMil.halfFor(d));
// 100 & 200
sight.add(new TextSnippet({
	text: "1", pos: [distMil.halfFor(100), -0.24], size: 0.7
}).withMirrored("x")).repeatLastAdd();
sight.add(new TextSnippet({
	text: "2", pos: [distMil.halfFor(200), -0.17], size: 0.6
}).withMirrored("x")).repeatLastAdd();
sight.add(new Line({
	from: [distMil.halfFor(100), 0], to: [distMil.halfFor(200), 0]
}).withMirrored("xy").
	addBreakAtX(distMil.halfFor(100), 2.0).
	addBreakAtX(distMil.halfFor(200), 1.8)
).repeatLastAdd();
// 400
sight.add(new TextSnippet({
	text: "4", pos: [distMil.halfFor(400), -0.1], size: 0.4
}).withMirrored("x")).repeatLastAdd();
sight.add(new Circle({
	segment: [90 - 8.5, 90 - 20],
	diameter: distMil.halfFor(400) * 2,
	size: 1.5
}).withMirroredSeg("xy"));
// // 600
// sight.add(new Line({
// 	from: [distMil.halfFor(600), 0],
// 	to: [distMil.halfFor(600), 0.1]
// }).withMirrored("x"));
// 800
sight.add(new Line({
	from: [distMil.halfFor(800), 0],
	to: [distMil.halfFor(800), smallTickLen(800)]
}).withMirrored("x")).repeatLastAdd();
sight.add(new TextSnippet({
	text: "8", pos: [distMil.halfFor(800), 1.4], size: 0.33
}).withMirrored("x"));
// 1600
sight.add(new Line({
	from: [distMil.halfFor(1600), 0],
	to: [distMil.halfFor(1600), smallTickLen(1600)]
}).withMirrored("x"));


// Binocular calibration reference
let binoCaliEles = binoCali.getBinoCaliSimplified({
	pos: [-distMil.halfFor(100), 26 + 2],
	mirrorX: false,
	mirrorY: true,
	centerCrossRadius: 0.4,
	binoMainTickHeight: 2,
	binoSubTickPer: 0.7,

	binoTextSizeMain: 0.48,
	binoTextYMain: 1.1,

	binoTextSizeSub: 0.33,
	binoTextYSub: 0.9,
	binoHalfTickLength: 0.2,

	distTextSize: 0.35
});
sight.add(binoCaliEles);
sight.add(binoCaliEles.filter((ele) => (ele instanceof Line)));
sight.add(binoCaliEles.filter((ele) => (
	ele instanceof TextSnippet &&
	(ele.getText() === "3" || ele.getText() === "6")
)));




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
