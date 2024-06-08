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
Generic sight for tanks with 2.7X~12X optics.
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatSettings(
	pd.sScale.getHighZoomSmall2Font(),
	pd.sColor.getGreenRed(),
	pd.sRgfd.build([115 / horiRatioMult, -0.02225]),
	pd.sDetectAlly.build([115 / horiRatioMult, -0.050]),
	pd.sGunDistValue.build([-0.166 * horiRatioMult, 0.035]),
	pd.sShellDistTick.build(
		[0, 0],
		[0.006, 0.0015],
		[0.005 - -(1 - horiRatioMult) * 0.015, 0]
	),
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"it_vbc_pt2",
	"sw_t_80u",
	"ussr_bmp_2m",
	"ussr_bmp_3",
	"ussr_t_80u",
	"ussr_t_80um2",
	"ussr_t_80uk",
	"ussr_t_90a",
]);


//// SHELL DISTANCES ////
sight.addShellDistance(pd.shellDistTicks.getFullLoose());


//// SIGHT DESIGNS ////
let assumedTgtWidth = 3.3;
let distMil = new calc.DistMilCalculator(assumedTgtWidth);


// Gun center
sight.add(new Line({
	from: [0.005, 0], to: [0.0085, 0], move: true, thousandth: false
}).withMirrored("x")).repeatLastAdd();
sight.add(new Line({
	from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
}));  // center dot


// Center arrow and bold
sight.add(comp.centerArrowFullscreen({
	...comp.centerArrowFullscreen.presetPartial["z3z12"],
	promptCurveRadius: distMil.halfFor(400),
	promptCurveSize: 0,
}));
sight.add(new Line({
	from: [0.03, 450], to: [0.03, distMil.halfFor(200)]
}).withMirrored("x"));


// Rangefinder line on the horizon
let rfHoriLine = new Line({
	from: [distMil.halfFor(100), 0], to: [distMil.halfFor(400), 0]
}).withMirrored("x");
sight.add(rfHoriLine).repeatLastAdd();
for (let info of [
	{ d: 100, posY: -0.14, textSize: 0.8, repeat: 1, breakWidth: 1.3 },
	{ d: 200, posY: -0.10, textSize: 0.6, repeat: 1, breakWidth: 1.1 },
	{ d: 400, posY: -0.07, textSize: 0.55, repeat: 1, breakWidth: 1.1 },
]) {
	sight.add(new TextSnippet({
		text: (info.d/100).toFixed(),
		pos: [distMil.halfFor(info.d), info.posY],
		size: info.textSize
	}).withMirrored("x")).repeatLastAdd(info.repeat);
	rfHoriLine.addBreakAtX(distMil.halfFor(info.d), info.breakWidth);
}
sight.add(new Circle({
	segment: [90 - 3.5, 90 + 3.5], diameter: distMil.for(800), size: 2.5
}).withMirroredSeg("x"));


// Rangefinder
sight.add(rgfd.getHighZoom([distMil.for(800), distMil.halfFor(200) - 0.6], {
	tickLength: 0.65,
	tickInterval: 0.25,
	tickDashWidth: 0.3,
	textSize: 0.55,
}));


// Binocular calibration reference
let binoCaliEles = binoCali.getHighZoom({
	pos: [distMil.for(800), 16],
	upperTextSize: 0.55,
	lowerTextSize: 0.5,
	upperTextY: -0.7,
	lowerTextY: 0.6,
});
sight.add(binoCaliEles);
sight.add(binoCaliEles.filter((ele) => (ele instanceof Line)));




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
