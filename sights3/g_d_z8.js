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
Generic sight for tanks with 8X optics.
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatSettings(
	pd.sScale.getHighZoomLargeFont({ font: 1.4, line: 1.4 }),
	pd.sColor.getGreenRed(),
	pd.sRgfd.build([175 / horiRatioMult, -0.01425 - 0.002]),
	pd.sDetectAlly.build([175 / horiRatioMult, -0.036 - 0.002]),
	pd.sGunDistValue.build([(-0.205) * horiRatioMult, 0.03]),
	pd.sShellDistTick.getCentralTickCommon({
		horiPosOffset: -(1 - horiRatioMult) * 0.017
	}),
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_mkpz_m47",
	"germ_mkpz_m48a2c",
	"it_m47_105",
	"jp_m47_patton_II",
	"us_m47_patton_II",
]);


//// SHELL DISTANCES ////
sight.addShellDistance(pd.shellDistTicks.getFullLoose());


//// SIGHT DESIGNS ////
let assumedTgtWidth = 3.3;
let distMil = new calc.DistMilCalculator(assumedTgtWidth);


// Gun center
sight.add([
	new Line({ from: [-0.24, 0], to: [0.24, 0], move: true }),
	new Line({ from: [0, 0], to: [0, 0.4], move: true }),
], "gunCenter");


// Sight center
sight.add([
	new Circle({ diameter: 0.225, size: 4 }),
	new Circle({ diameter: 0.225 * 2, size: 2 }),
], "sightCenter");
// Sight cross
let horiLine = new Line({
	from: [450, 0], to: [distMil.halfFor(400), 0]
}).withMirrored("x");
sight.add(horiLine, "sightCross");
//   vert lines
sight.add(new Line({ from: [0, 450], to: [0, 12.25] }), "sightCross");
sight.add(new Line({ from: [0, -450], to: [0, -17.5] }), "sightCross");
// Bold at borders
sight.add(new Line({ from: [450, 0.1], to: [70, 0.1] }).withMirrored("xy"), "sightCross");
sight.add(new Line({ from: [0.1, -450], to: [0.1, -40] }).withMirrored("x"), "sightCross");



// Rangefinder ticks on the horizon
// 100m
sight.add(new TextSnippet({
	text: "1", pos: [distMil.halfFor(100), -0.2], size: 1.0
}).withMirrored("x")).repeatLastAdd();
horiLine.addBreakAtX(distMil.halfFor(100), 1.1);
// 200m
sight.add(new TextSnippet({
	text: "2", pos: [distMil.halfFor(200), -0.12], size: 0.75
}).withMirrored("x")).repeatLastAdd();
horiLine.addBreakAtX(distMil.halfFor(200), 1.1);
// 400m
sight.add(new Circle({
	segment: [80, 100], diameter: distMil.for(400), size: 1.3,
}).withMirroredSeg("x"));
sight.add(new TextSnippet({
	text: "4", pos: [distMil.halfFor(400) + 0.675, 0.8], size: 0.6
}));
sight.add(new TextSnippet({
	text: "4", pos: [-(distMil.halfFor(400) + 0.675), 0.8], size: 0.5
}));
// 800m
sight.add(new Line({
	from: [distMil.halfFor(800), -0.2], to: [distMil.halfFor(800), 0.2]
}).withMirrored("x"));


// Rangefinder
sight.add(rgfd.getHighZoom([distMil.for(800), -8], {
	mirrorY: true, showMiddleLine: true,
	distances: [800, 1000, 1200, 1400, 1600, 2000],
	distancesDashed: [800],
	distancesLined: [],
	tickLength: 0.8,
	tickInterval: 0.8,
	tickDashWidth: 0.3,
	textSize: 0.6,
	textSpace: 0.475,
	textPosYAdjust: -0.14
})).repeatLastAdd();


// Binocular calibration reference
let binoCaliEles = binoCali.getHighZoom({
	pos: [distMil.halfFor(400), 10],
	mirrorX: false,
	zeroLineExceeds: [-1.5, 0],

	quadHeight: 1.5,
	mainTickIntervalPer: 0.47,
	subTickPer: 0.33,

	upperTextSize: 0.55,
	lowerTextSize: 0.55,
	upperTextY: -1.0,
	lowerTextY: 0.7,
});
sight.add(binoCaliEles);
sight.add(binoCaliEles.filter((ele) => (ele instanceof Line)));




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
