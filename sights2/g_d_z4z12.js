import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import rgfd from "./sight_components/rangefinder.js"
import binoCali from "./sight_components/binocular_calibration_2.js"


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Generic sight for tanks with 4X~12X.
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoomSmallFont({ line: 1.6 }),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([125, -0.01725]),
	pd.basicBuild.detectAllyPos([125, -0.045]),
	pd.basicBuild.gunDistanceValuePos([-0.17, 0.035]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.007, 0.003],
		[0.005, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds);


//// SHELL DISTANCES ////
sight.addShellDistance(pd.shellDists.getFullLoose());


//// SIGHT DESIGNS ////
let assumedTgtWidth = 3.3;
let getDistMil = (dist) => Toolbox.calcDistanceMil(assumedTgtWidth, dist);
let getDistMilHalf = (dist) => getDistMil(dist) / 2;


// Gun center
Toolbox.repeat(3, () => {
	sight.add(new Line({
		from: [0.005, 0], to: [0.0075, 0], move: true, thousandth: false
	}).withMirrored("x"));
})
sight.add(new Line({
	from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
}));  // center dot


let centerArrowDeg = 40;

// Center arrow and bold
let arrowLineBasis = new Line({
	from: [0, 0],
	to: [Math.tan(Toolbox.degToRad(centerArrowDeg)) * 450, 450]
}).withMirrored("x").move([0, 0.02]);
// ^ Moving down a little bit to let the arrow vertex stays the center
//   with being less effected by line widths
for (let posYBias of Toolbox.rangeIE(0, 0.08, 0.02)) {
	sight.add(arrowLineBasis.copy().move([0, posYBias]));
}


// Center prompt crossline starting from screen sides
// - horizontal and bold
sight.add(new Line({ from: [450, 0], to: [100, 0] }).withMirrored("x"));
for (let posYBias of [0.1, 0.2]) {
	sight.add(new Line({
		from: [450, posYBias], to: [132, posYBias]
	}).withMirrored("xy"));
}
// - vertical upper and bold
sight.add(new Line({ from: [0, -450], to: [0, -45] }));
for (let posXBias of [0.1, 0.2]) {
	sight.add(new Line({
		from: [posXBias, -450], to: [posXBias, -77.5]
	}).withMirrored("x"));
}
// - vertical lower and bold
sight.add(new Line({ from: [0, 450], to: [0, getDistMilHalf(400)] }));
sight.add(new Line({ from: [0.03, 450], to: [0.03, getDistMilHalf(200)] }).withMirrored("x"));


// Rangefinder line on the horizon
let rfHoriLine = new Line({
	from: [getDistMilHalf(100), 0], to: [getDistMilHalf(400), 0]
}).withMirrored("x");
sight.add(rfHoriLine);
sight.add(rfHoriLine);  // repeat for bold
sight.add(new TextSnippet({text: "1", pos: [getDistMilHalf(100), -0.15], size: 1}).withMirrored("x"));
rfHoriLine.addBreakAtX(getDistMilHalf(100), 1);
sight.add(new TextSnippet({text: "2", pos: [getDistMilHalf(200), -0.1], size: 0.8}).withMirrored("x")).repeatLastAdd();
rfHoriLine.addBreakAtX(getDistMilHalf(200), 1);
sight.add(new TextSnippet({text: "4", pos: [getDistMilHalf(400), -0.06], size: 0.6}).withMirrored("x")).repeatLastAdd();
rfHoriLine.addBreakAtX(getDistMilHalf(400), 1.1);
sight.add(new Circle({segment: [86, 94], diameter: getDistMil(800), size: 1.6}).withMirroredSeg("x"))


// Rangefinder
sight.add(rgfd.getHighZoom([getDistMil(800), getDistMilHalf(200)-1], { textSize: 0.6 }));


// Binocular calibration reference
let binoCaliEles = binoCali.getHighZoom({
	pos: [getDistMil(800), 16],
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
