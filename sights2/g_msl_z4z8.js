import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Sight for ATGM carrier with 4X~8X optics
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoomSmallFont(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([105, -0.022]),
	pd.basicBuild.detectAllyPos([105, -0.047]),
	pd.basicBuild.gunDistanceValuePos([-0.17, 0.030]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0070, 0.0025],
		[0.005, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_raketenjagdpanzer_2_hot",
	"it_m113a1_tow",
	"sw_pvrbv_551",
])


//// SHELL DISTANCES ////
// sight.addShellDistance(/*TODO*/);


//// SIGHT DESIGNS ////
let assumedTgtWidth = 3.3;
let getMil = (dist) => Toolbox.calcDistanceMil(assumedTgtWidth, dist);
let getHalfMil = (dist) => (getMil(dist) / 2);


// Gun center
sight.add(new Line({
	from: [0.003, 0], to: [0.0075, 0], move: true, thousandth: false
}).withMirrored("x"));
sight.add(new Line({
	from: [0, -0.003], to: [0, -0.0045], move: true, thousandth: false
}));

// Sight center
sight.add(new Circle({ diameter: 0.4, size: 2.5 }));


// Cross
let horiLine = new Line({from: [getHalfMil(200), 0], to: [450, 0]}).withMirrored("x");
sight.add(horiLine);
sight.add(new Line({from: [0.0, -getHalfMil(800)], to: [0.0, -450]}))
// bold
// horizontal
for (let b of [
	{fromX: 33, biasY: 0.02},
	{fromX: 90, biasY: 0.1},
	{fromX: 120, biasY: 0.2},
	{fromX: 121, biasY: 0.3},
]) {
	sight.add(new Line({
		from: [b.fromX, b.biasY], to: [450, b.biasY]
	}).withMirrored("xy"));
}
// vertical
for (let b of [
	{fromY: -33, biasX: 0.02},
	{fromY: -66, biasX: 0.2},
]) {
	sight.add(new Line({
		from: [b.biasX, b.fromY], to: [b.biasX, -450]
	}).withMirrored("x"));
}


// Simplified rangefinder ticks on the horizon
// 100
sight.add(new TextSnippet({
	text: "1", pos: [getHalfMil(100), -0.2], size: 1.2
}).withMirrored("x"))
horiLine.addBreakAtX(getHalfMil(100), 1.2);
// 200
sight.add(new TextSnippet({
	text: "2", pos: [getHalfMil(200), -0.12], size: 1
}).withMirrored("x"))
horiLine.addBreakAtX(getHalfMil(200), 1);


// Central circle and lines
for (let biasY of [-0.02, 0, 0.02]) {
	sight.add(new Line({
		from: [getHalfMil(400)-0.5, biasY], to: [getHalfMil(800), biasY]
	}).withMirrored("x"));
}
sight.add(new Circle({
	segment: [60, 120], diameter: getMil(800), size: 3.2
}).withMirroredSeg("x"));
sight.add(new TextSnippet({
	text: "4", pos: [getHalfMil(400), -0.08], size: 0.6
}).withMirrored("x"))


//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
