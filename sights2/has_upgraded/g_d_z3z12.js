import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import rgfd from "./sight_components/rangefinder.js"
import binoCali from "./sight_components/binocular_calibration_2.js"

import ENV_SET from "./sight_bases/_env_settings.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Sight for 2.7X~12X optics. Also can be used on 2.5X~12X optics.
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoomSmall2Font(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([115, -0.02225]),
	pd.basicBuild.detectAllyPos([115, -0.050]),
	pd.basicBuild.gunDistanceValuePos([-0.166, 0.035]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.006, 0.0015],
		[0.005, 0]
	),
	pd.basic.miscVars.getCommon(),
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
sight.addShellDistance(pd.shellDists.getFullLoose());
sight.components.shellDistances.distLines.forEach((el) => {
	el.shownPos[0] -= (1 - (ENV_SET.DISPLAY_RATIO_NUM / (16/9))) * 0.015
});

//// SIGHT DESIGNS ////
let assumedTgtWidth = 3.3;
let centerArrowDeg = 40;


let centerArrowDegTan = Math.tan(Toolbox.degToRad(centerArrowDeg));
// Method for getting mil values for rf
let getHalfWidthMil = (d) => Toolbox.calcDistanceMil(assumedTgtWidth, d) / 2;


sight.lines.addComment("Gun center");
sight.add(new Line({
	from: [0.005, 0.0], to: [0.0085, 0.0], move: true, thousandth: false
}).withMirrored("xy"));  // y for bold
sight.add(new Line({
	from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
}));  // center dot


// Center arrow line and bolds DEFINTION
let arrowLineBasis = new Line({
	from: [0, 0], to: [centerArrowDegTan * 450, 450]
}).withMirrored("x").move([0, 0.02]);
// ^ Moving down a little bit to let the arrow vertex stays the center
//   with being less effected by line widths
sight.lines.addComment("Center arrow line and bolds");
for (let posYBias of Toolbox.rangeIE(0, 0.08, 0.02)) {
	sight.add(arrowLineBasis.copy().move([0, posYBias]));
}


// Rangefinder ticks
let rfHoriLine = new Line({ from: [getHalfWidthMil(100), 0], to: [getHalfWidthMil(400), 0] }).withMirrored("xy");
sight.add(rfHoriLine);
for (let t of [
	{ dist: 100, tSize: 0.8, tHeight: -0.14, breakWidth: 1.3 },
	{ dist: 200, tSize: 0.6, tHeight: -0.10, breakWidth: 1.1 },
	{ dist: 400, tSize: 0.55, tHeight: -0.07, breakWidth: 1.1 },
]) {
	let pos = [getHalfWidthMil(t.dist), t.tHeight];
	// Value text
	sight.add(new TextSnippet({
		text: (t.dist / 100).toFixed(),
		pos: pos, size: t.tSize
	}).withMirrored("x")).repeatLastAdd();
	// Line break
	rfHoriLine.addBreakAtX(pos[0], t.breakWidth);
}
// 800m tick
sight.add(new Circle({
	segment:[90 - 3.5, 90 + 3.5],
	diameter: getHalfWidthMil(800) * 2,
	size: 2.5
}).withMirroredSeg("x"));


sight.lines.addComment("Center position prompt vertical lower line");
sight.add(new Line({
	from: [0, 450], to: [0, getHalfWidthMil(400)]
}));
sight.lines.addComment("bold");
sight.add(new Line({
	from: [0.03, 450],
	to: [0.03, getHalfWidthMil(200) / centerArrowDegTan]
}).withMirrored("x"));

sight.circles.addComment("Center position prompt curve");
sight.add(new Circle({
	segment: [-centerArrowDeg, centerArrowDeg],
	diameter: getHalfWidthMil(400) * 2,
	size: 1.2
}));


// Rangefinder
sight.add(rgfd.getHighZoom([
	getHalfWidthMil(800) * 2,
	getHalfWidthMil(200)-0.6
], {
	tickLength: 0.65,
	tickInterval: 0.25,
	tickDashWidth: 0.3,
	textSize: 0.55,
}));


// Binocular calibration reference
let binoCaliEles = binoCali.getHighZoom({
	pos: [getHalfWidthMil(800) * 2, 16],
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
