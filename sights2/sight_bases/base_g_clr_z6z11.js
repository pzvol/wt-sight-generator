// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";


let sight = new Sight();


// Introduction comments
sight.addDescription(`
An experimental design as the universal sight for 6X~11X ZTZ96/99 series
with leading values for shooting APFSDS while moving

Modified from "g_nrnc_hizoom_g_1AroCSmp2" but with less text information,
making it easier to snapshoot.
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoom({ line: 1.6 }),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([110, -0.02425]),
	pd.basicBuild.detectAllyPos([110, -0.045]),
	pd.basicBuild.gunDistanceValuePos([-0.175, 0.035]),
	pd.basicBuild.shellDistanceTickVars(
		[-0.0100, -0.0100],
		[0, 0],
		[0.193, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// VEHICLE TYPES ////
// NOT DEFINED IN BASE


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 2000, shown: 20, shownPos: [0.0035, 0.007] },
	{ distance: 4000, shown: 40, shownPos: [0.0035, 0.007] },
]);


//// SIGHT DESIGNS ////
sight.lines.addComment("Sight center arrow and bold");
for (let CenterBoldPadY of Toolbox.rangeIE(0, 0.2, 0.04)) {
	sight.add(new Line({
		from: [0, CenterBoldPadY], to: [0.6, 1.5]
	}).move([0, 0.02]).withMirrored("x"));
	// ^ Moving down a little bit to let the arrow vertex stays the center
	//   with being less effected by line widths
}


sight.lines.addComment("Gun center");
sight.add(new Line({
	from: [0.0035, 0], to: [0.0055, 0], move: true, thousandth: false
}).withMirrored("x"));


sight.lines.addComment("0m correction line");
sight.add(new Line({ from: [-0.203, 0.0], to: [-0.193, 0.0], move: true, thousandth: false }));


let init = ({
	shellSpeed,
	assumedMoveSpeed,
	horiCurve = [88, 92]
} = {}) => {
	let getLdn = (aa) => Toolbox.calcLeadingMil(shellSpeed, assumedMoveSpeed, aa);

	sight.lines.addComment("Vertical lines");
	sight.add(new Line({ from: [0, -8.25], to: [0, -450] }));
	sight.add(new Line({ from: [0, 2], to: [0, 450] }));
	sight.lines.addComment("bold");
	for (let p of [
		[0.04, -25], [0.08, -40], [0.12, -40]  // params: [lnShift, startingY]
	]) { sight.add(new Line({ from: p, to: [p[0], -450] }).withMirrored("x")); }
	for (let p of [
		[0.03, 4.8], [0.08, 40], [0.12, 40]  // params: [lnShift, startingY]
	]) { sight.add(new Line({ from: p, to: [p[0], 450] }).withMirrored("x")); }


	sight.lines.addComment("Horizontal lines");
	let horiLine = new Line({ from: [getLdn(0.75), 0], to: [450, 0] }).withMirrored("x");
	sight.add(horiLine);
	sight.lines.addComment("bold");
	for (let p of [
		[getLdn(1)*2, 0.02], [40, 0.04], [60, 0.08], [80, 0.12]  // params: [startingX, lnShift]
	]) { sight.add(new Line({ from: p, to: [450, 0] }).withMirrored("xy")); }

	sight.addComment("Horizontal general leading for APFSDS", ["texts", "circles"]);
	sight.add(new TextSnippet({ text: assumedMoveSpeed.toFixed(), pos: [getLdn(1), -0.05], size: 0.4 }).withMirrored("x"));
	horiLine.addBreakAtX(getLdn(1), 1.1);
	// ^ 4/4 AA
	sight.add(new Circle({ segment: horiCurve, diameter: getLdn(0.75) * 2, size: 2 }).withMirroredSeg("x"));
	sight.add(new TextSnippet({ text: "2", pos: [getLdn(0.5), -0.05], size: 0.4 }).withMirrored("x"));
	sight.add(new Circle({ segment: [87, 93], diameter: getLdn(0.25) * 2, size: 2 }).withMirroredSeg("x"));
};


//// OUTPUT ////
export default {
	sightObj: sight,
	requireInfoAbout: [
		"matchVehicle",
	],
	init: init,
};
