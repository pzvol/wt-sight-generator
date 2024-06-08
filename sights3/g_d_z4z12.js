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
	pd.sScale.getHighZoomSmallFont({ line: 1.6 }),
	pd.sColor.getGreenRed(),
	pd.sRgfd.build([135 / horiRatioMult, -0.01725 - 0.003]),
	pd.sDetectAlly.build([135 / horiRatioMult, -0.045 - 0.003]),
	pd.sGunDistValue.build([-0.175 * horiRatioMult, 0.035]),
	pd.sShellDistTick.getCentralTickCommon({
		sub: [0.007, 0.002],
		horiPosOffset: -(1 - horiRatioMult) * 0.015
	}),
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds);


//// SHELL DISTANCES ////
sight.addShellDistance(pd.shellDistTicks.getFullLoose());


//// SIGHT DESIGNS ////
let assumedTgtWidth = 3.3;
let distMil = new calc.DistMilCalculator(assumedTgtWidth);


// Gun center
sight.add(new Line({
	from: [0.005, 0], to: [0.0075, 0], move: true, thousandth: false
}).withMirrored("x")).repeatLastAdd(2);
sight.add(new Line({
	from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
}));  // center dot


// Center arrow and bold
sight.add(comp.centerArrowFullscreen({
	...comp.centerArrowFullscreen.presetPartial["z4z12"],
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
	{ d: 100, posY: -0.15, textSize: 1, repeat: 0, breakWidth: 1 },
	{ d: 200, posY: -0.1, textSize: 0.8, repeat: 1, breakWidth: 1 },
	{ d: 400, posY: -0.06, textSize: 0.6, repeat: 1, breakWidth: 1.1 },
]) {
	sight.add(new TextSnippet({
		text: (info.d/100).toFixed(),
		pos: [distMil.halfFor(info.d), info.posY],
		size: info.textSize
	}).withMirrored("x")).repeatLastAdd(info.repeat);
	rfHoriLine.addBreakAtX(distMil.halfFor(info.d), info.breakWidth);
}
sight.add(new Circle({
	segment: [84, 96], diameter: distMil.for(800), size: 1.6
}).withMirroredSeg("x")).repeatLastAdd();


// Rangefinder
sight.add(rgfd.getHighZoom([distMil.for(800), distMil.halfFor(200) - 1], {
	textSize: 0.6,
}));


// Binocular calibration reference
let binoCaliEles = binoCali.getHighZoom({
	pos: [distMil.for(800), 16],
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
