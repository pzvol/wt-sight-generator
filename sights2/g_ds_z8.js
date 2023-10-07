import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Generic sight for 8X optics with simplified target distance ticks
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoomLargeFont(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([135, -0.01425]),
	pd.basicBuild.detectAllyPos([135, -0.036]),
	pd.basicBuild.gunDistanceValuePos([-0.195, 0.03]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0060, 0.001],
		[0.005, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"cn_ztz_96",
]);


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 2000 },
	{ distance: 4000, shown: 40 },
]);


//// SIGHT DESIGNS ////
let assumedTgtWidth = 3.3;
let centerArrowDeg = 40;
let promptCurveDistMil = 300;

let centerArrowDegTan = Math.tan(Toolbox.degToRad(centerArrowDeg));
let getMil = (dist) => Toolbox.calcDistanceMil(assumedTgtWidth, dist);
let getMilHalf = (dist) => (Toolbox.calcDistanceMil(assumedTgtWidth, dist) / 2);


// Gun center
sight.add(new Line({
	from: [0.0055, 0], to: [0.0085, 0], move: true, thousandth: false
}).withMirrored("xy"));  // y for bold
// sight.add(new Line({
// 	from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
// }));  // center dot


// Center arrow line and bolds
let arrowLineBasis = new Line({
	from: [0, 0],
	to: [centerArrowDegTan * 450, 450]
}).withMirrored("x").move([0, 0.02]);
// ^ Moving down a little bit to let the arrow vertex stays the center
//   with being less effected by line widths
let drawArrow = () => {  // CALLED AT THE END TO DRAW AFTER DEFINING
	for (let posYBias of Toolbox.rangeIE(0, 0.06, 0.03)) {
		sight.add(arrowLineBasis.copy().move([0, posYBias]));
	}
};


// Center prompt crossline starting from screen sides
// horizontal and bold
sight.add(new Line({ from: [450, 0], to: [66, 0] }).withMirrored("x"));
for (let posYBias of [0.1]) {
	sight.add(new Line({
		from: [450, posYBias], to: [66, posYBias]
	}).withMirrored("xy"));
}
// vertical upper and bold
sight.add(new Line({ from: [0, -450], to: [0, -24.75] }));
for (let posXBias of [0.1]) {
	sight.add(new Line({
		from: [posXBias, -450], to: [posXBias, -40]
	}).withMirrored("x"));
}
// vertical lower and bold
sight.add(new Line({ from: [0, 450], to: [0, getMilHalf(promptCurveDistMil)] }));
sight.add(new Line({ from: [0.03, 450], to: [0.03, getMilHalf(promptCurveDistMil)] }).withMirrored("x"));

// Arrow position prompt curve
sight.add(new Circle({
	segment: [-centerArrowDeg, centerArrowDeg],
	diameter: getMil(promptCurveDistMil),
	size: 1.2
}));


// Simple rangefinder elements
let rfHoriLine = new Line({ from: [getMilHalf(100), 0], to: [getMilHalf(400), 0] }).withMirrored("xy");
rfHoriLine.addBreakAtX(getMilHalf(200), 0.6)
sight.add(rfHoriLine);
for (let t of [
	{ dist: 100, tSize: 0.8, breakWidth: 1.8 },
	{ dist: 200, tSize: 0.6, breakWidth: 1.6 },
	// { dist: 400, tSize: 0.5, breakWidth: 1 },
]) {
	let pos = [getMilHalf(t.dist), getMilHalf(t.dist) / centerArrowDegTan];
	// Value text
	Toolbox.repeat(1, () => {
		sight.add(new TextSnippet({
			text: (t.dist / 100).toFixed(),
			pos: pos, size: t.tSize
		}).withMirrored("x"));
	});  // repeat for bold
	// Break on arrow lines
	arrowLineBasis.addBreakAtX(pos[0], t.breakWidth);
	// Tick on the horizon
	sight.add(new Circle({ segment:[90, 92], diameter: pos[0] * 2, size: 2 }).withMirroredSeg("x"));
}


// Draw gun center arrow
drawArrow();


//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
