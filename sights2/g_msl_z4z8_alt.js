import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";
import rgfd from "./sight_components/rangefinder.js"
import bino from "./sight_components/binocular_calibration_2.js"

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
	"germ_wiesel_1_tow",
	"it_m113a1_tow",
	"sw_pvrbv_551",
])


//// SHELL DISTANCES ////
// sight.addShellDistance(/*TODO*/);


//// SIGHT DESIGNS ////
let assumedTgtWidth = 3.3;
let getMil = (dist) => Toolbox.calcDistanceMil(assumedTgtWidth, dist);
let getHalfMil = (dist) => (getMil(dist) / 2);

// Sight center segments (tiny cross)
for (let direction of [90, 180, 270, 360]) {
	let curveHalfWidth = 15;
	sight.add(new Circle({
		segment: [direction - curveHalfWidth, direction + curveHalfWidth],
		diameter: 1.6,
		size: 4.8,
	}));
}

// Sight cross
for (let p of Toolbox.rangeIE(-0.04, 0.04, 0.02)) {
	sight.add([
		new Line({
			from: [getHalfMil(200), p], to: [getHalfMil(100), p]
		}).withMirrored("x"),
		new Line({
			from: [p, getHalfMil(200)], to: [p, getHalfMil(100)]
		}).withMirrored("y"),
	]);
}

// Gun center height
for (let p of Toolbox.rangeIE(-0.04, 0.04, 0.02)) {
	sight.add(new Line({
		from: [getHalfMil(100) + 1.2, p],
		to: [getHalfMil(100) + 1.4, p], move: true
	}).withMirrored("x"));
}

// Vertical upper line
for (let p of Toolbox.rangeIE(-0.04, 0.04, 0.02)) {
	sight.add(new Line({from: [p, -32], to: [p, -450]}));
}

// Simplified rangefinder ticks on the horizon
// 100
sight.add(new TextSnippet({
	text: "1", pos: [getHalfMil(100), 0.8], size: 0.8
}).withMirrored("x"))
// 200
// sight.add(new TextSnippet({
// 	text: "2", pos: [getHalfMil(200), 0.8], size: 0.8
// }).withMirrored("x"))


let rgfdElements = rgfd.getHighZoom([getHalfMil(200), getHalfMil(200)], {
	assumeWidth: assumedTgtWidth,
	distances: [400, 600, 800, 1000, 1200, 1400, 1600, 2000],
	distancesDashed: [400],
	distancesLined: [],
	tickLength: 0.9,
	tickInterval: 0.3,
	textSize: 0.8
});
sight.add(rgfdElements);
//sight.add(rgfdElements.filter((ele) => (ele instanceof Line)));


let binoElements = bino.getHighZoom({
	pos: [0, getHalfMil(200) + 1.2*8 + 1.5],
	quadHeight: 1.2,
	zeroLineExceeds: [-1, 0],
	upperTextSize: 0.75,
	lowerTextSize: 0.7,
	upperTextY: -0.8,
	lowerTextY: 0.5
});
sight.add(binoElements);
sight.add(binoElements.filter((ele) => (ele instanceof Line)));


//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
