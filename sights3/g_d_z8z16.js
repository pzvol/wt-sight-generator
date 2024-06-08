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
Generic sight for tanks with 8X~16X optics.
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatSettings(
	pd.sScale.getHighZoom(),
	pd.sColor.getGreenRed(),
	pd.sRgfd.build([110 / horiRatioMult, -0.02125]),
	pd.sDetectAlly.build([110 / horiRatioMult, -0.045]),
	pd.sGunDistValue.build([-0.13 / horiRatioMult, 0.035]),
	pd.sShellDistTick.getCentralTickCommon({
		horiPosOffset: -(1 - horiRatioMult) * 0.015
	}),
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_kanonenjagdpanzer",
	"germ_leopard_I",
	"germ_leopard_I_a1",
]);


//// SHELL DISTANCES ////
sight.addShellDistance(pd.shellDistTicks.getFullLoose());


//// SIGHT DESIGNS ////
let assumedTgtWidth = 3.3;
let distMil = new calc.DistMilCalculator(assumedTgtWidth);


// Gun center
sight.add([
	new Line({ from: [-0.16, 0], to: [0.16, 0], move: true }),
	new Line({ from: [0, -0.16], to: [0, 0.16], move: true }),
]).repeatLastAdd();


// Sight center
sight.add(new Circle({ diameter: 0.3, size: 2 }));
sight.add(new Circle({ diameter: 0.15, size: 4 }));
// Sight cross
let horiLine = new Line({ from: [450, 0], to: [distMil.halfFor(400), 0] }).withMirrored("x");
sight.add(horiLine).repeatLastAdd();
//   vert lines
//   - lower
sight.add(new Line({ from: [0, 450], to: [0, 10.5] })).repeatLastAdd();
//   - upper
sight.add(new Line({ from: [0, -450], to: [0, -8.25] }));
// Bold at borders
for (let info of [
	{ toX: 30 , padding: 0.05 },
	{ toX: 63, padding: 0.1 },
]) {
	sight.add(new Line({
		from: [450, info.padding], to: [info.toX * horiRatioMult, info.padding]
	}).withMirrored("xy"));
}
for (let info of [
	{ toY: 16, padding: 0.05 },
	{ toY: 32, padding: 0.1 },
]) {
	sight.add(new Line({
		from: [info.padding, 450], to: [info.padding, info.toY]
	}).withMirrored("xy"));
}


// Rangefinder ticks on the horizon
// 100m
sight.add(new TextSnippet({
	text: "1",
	pos: [distMil.halfFor(100), -0.14],
	size: 1.15
}).withMirrored("x"));
horiLine.addBreakAtX(distMil.halfFor(100), 0.9);
// 200m
sight.add(new TextSnippet({
	text: "2",
	pos: [distMil.halfFor(200), -0.1],
	size: 0.8
}).withMirrored("x"));
horiLine.addBreakAtX(distMil.halfFor(200), 0.7);
// 400m
sight.add(new Circle({
	segment: [83, 97], diameter: distMil.for(400), size: 1.8,
}).withMirroredSeg("x"));
sight.add(new TextSnippet({
	text: "4",
	pos: [distMil.halfFor(400) + 0.45, -0.08],
	size: 0.6
}).withMirrored("x"));
horiLine.addBreakAtX(distMil.halfFor(400) + 0.45, 0.7);
// 800m
(() => {
	let halfHeight = 0.08;
	let halfWidth = 0.03;
	for (let padding of Toolbox.rangeIE(-halfWidth, halfWidth, 0.01)) {
		sight.add(new Line({
			from: [distMil.halfFor(800) + padding, -halfHeight],
			to: [distMil.halfFor(800) + padding, halfHeight]
		}).withMirrored("x"));
	}
})();


// Rangefinder
sight.add(rgfd.getHighZoom([distMil.for(800), 2.25], {
	textSize: 0.6,
	textPosYAdjust: -0.08
})).repeatLastAdd();


// Binocular calibration reference
let binoCaliEles = binoCali.getHighZoom({
	pos: [distMil.halfFor(400), 10],
	upperTickShownDigit: 1,
});
sight.add(binoCaliEles);
sight.add(binoCaliEles.filter((ele) => (ele instanceof Line)));




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
