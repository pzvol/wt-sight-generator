import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import * as rgfd from "./sight_components/rangefinder.js"


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Generic sight for tanks with midium-high zoom multiplier
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getMidHighZoom(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([120, -0.02175]),
	pd.basicBuild.detectAllyPos([120, -0.045]),
	pd.basicBuild.gunDistanceValuePos([-0.18, 0.035]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0070, 0.0025],
		[0.005, 0]
	),
	pd.basic.miscVars.getCommon()
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"cn_type_59",
	"ussr_is_4m",
	"ussr_object_120",
	"ussr_object_906",
	"ussr_t_10a",
	"ussr_t_54_1947",
	"ussr_t_54_1949",
	"ussr_t_55a",
	"ussr_t_62",
]);


//// SHELL DISTANCES ////
sight.addShellDistance(
	pd.shellDists.getFullLoose([0.0295, 0])
);


//// SIGHT DESIGNS ////
let rgfdAssumeWidth = 3.3;

sight.circles.addComment("Center dot");
sight.add([
	new Circle({ pos: [0, 0], diameter: 0.2, size: 4 }),
	new Circle({ pos: [0, 0], diameter: 0.4, size: 2 }),
	new Circle({ pos: [0, 0], diameter: 0.6, size: 1.5 }),
]);


sight.lines.addComment("Gun center T");
sight.add(new Line({ from: [-0.002, 0], to: [0.002, 0], move: true, thousandth: false }));
sight.add(new Line({ from: [0, 0], to: [0, 0.005], move: true, thousandth: false }));


sight.addComment("Vertical Rangefinder", ["circles", "texts"]);
sight.add(rgfd.default.getCircledMidHighZoom([4.125, -4], { mirrorY: true }));


// Vertical Rangefinder on the horizon - numbers and horizontal line
let horiLine = new Line({
	from: [450, 0],
	to: [Toolbox.calcDistanceMil(rgfdAssumeWidth, 400) / 2, 0]
}).withMirrored("x");
sight.texts.addComment("Vertical rangefinder on the horizon");
for (let t of [
	{ distance: 100, textPosMove: [0, -0.3], textSize: 1 },
	{ distance: 200, textPosMove: [0, -0.15], textSize: 0.7 },
	{ distance: 400, textPosMove: [1, -0.15], textSize: 0.65 },
]) {
	let thHalfWidth = Toolbox.calcDistanceMil(rgfdAssumeWidth, t.distance) / 2;
	let textPos = [(thHalfWidth + t.textPosMove[0]), (0 + t.textPosMove[1])];
	sight.add(new TextSnippet({
		text: (t.distance / 100).toFixed(),
		pos: textPos,
		size: t.textSize
	}).withMirrored("x"));

	// Add break to horizontal line
	horiLine.addBreakAtX(textPos[0], t.textSize * 2);
}
// Append horizontal line code
sight.lines.addComment("Horizontal lines with breaks for vertical rangefinder");
sight.add(horiLine);

// On-the-horizon circles
sight.circles.addComment("Vertical rangefinder on the horizon");
for (let t of [
	{ segment: [70, 110], distance: 400, lineSize: 1.7 },
	{ segment: [80, 100], distance: 800, lineSize: 1.7 }
]) {
	sight.addComment(`${t.distance}m`);
	sight.add(new Circle({
		segment: t.segment,
		pos: [0, 0],
		diameter: Toolbox.calcDistanceMil(rgfdAssumeWidth, t.distance),
		size: t.lineSize,
	}).withMirroredSeg("x"));
}


sight.lines.addComment("Vertical lines");
let vertLineUpper = new Line({ from: [0, -450], to: [0, -16.5] });
let vertLineLower = new Line({ from: [0, 450], to: [0, 16.5] });
sight.add(vertLineUpper).add(vertLineLower);


sight.lines.addComment("Horizontal lines bold");
sight.add(horiLine.copy().move([0, 0.02]).withMirrored("xy"));
for (let diff of Toolbox.rangeIE(0.08, 0.14, 0.02)) {
	sight.add(new Line({ from: [450, 0], to: [60, 0] }).move([0, diff]).withMirrored("xy"));
}
for (let diff of Toolbox.rangeIE(0.16, 0.38, 0.02)) {
	sight.add(new Line({ from: [450, 0], to: [130, 0] }).move([0, diff]).withMirrored("xy"));
}

sight.lines.addComment("Vertical lines bold");
sight.add(vertLineLower.copy().move([0.02, 0]).withMirrored("x"));
for (let diff of Toolbox.rangeIE(0.08, 0.14, 0.02)) {
	sight.add(new Line({ from: [0, 450], to: [0, 40] }).move([0, diff]).withMirrored("xy"));
}
for (let diff of Toolbox.rangeIE(0.16, 0.38, 0.02)) {
	sight.add(new Line({ from: [0, 450], to: [0, 70] }).move([diff, 0]).withMirrored("xy"));
}




//// OUTPUT ////
sight.printCode();
