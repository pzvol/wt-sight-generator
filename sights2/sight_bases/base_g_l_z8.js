// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";


let sight = new Sight();


// Introduction comments
sight.addDescription(`
Generic sight for fixed 8X with leading values for shooting APFSDS while moving

Modified from "base_g_l_z8z16" and "g_nrnc_hizoom_hf_g_1Smp"
`.trim());


let init = ({
	assumedMoveSpeed = 55,
	shellSpeed = 1650 * 3.6
} = {}) => {

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
	// NOT DEFINED IN BASE


	//// SHELL DISTANCES ////
	sight.addShellDistance([
		{ distance: 400 },
		{ distance: 2000 },
		{ distance: 4000, shown: 40 },
	]);


	//// SIGHT DESIGNS ////
	let getLdn = (speed, aa) => Toolbox.calcLeadingMil(shellSpeed, speed, aa);


	sight.lines.addComment("Gun center");
	sight.add(new Line({
		from: [0.0055, 0], to: [0.0085, 0], move: true, thousandth: false
	}).withMirrored("xy"));  // y for bold
	// sight.add(new Line({
	// 	from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
	// }));  // center dot


	let centerArrowDeg = 40;
	let promptCurveAA = 0.5;

	sight.lines.addComment("Center arrow line and bolds");
	let arrowLineBasis = new Line({
		from: [0, 0],
		to: [Math.tan(Toolbox.degToRad(centerArrowDeg)) * 450, 450]
	}).withMirrored("x").move([0, 0.02]);
	// ^ Moving down a little bit to let the arrow vertex stays the center
	//   with being less effected by line widths
	for (let posYBias of Toolbox.rangeIE(0, 0.06, 0.03)) {
		sight.add(arrowLineBasis.copy().move([0, posYBias]));
	}


	sight.lines.addComment("Center prompt crossline starting from screen sides");
	sight.lines.addComment("horizontal");
	sight.add(new Line({ from: [450, 0], to: [66, 0] }).withMirrored("x"));
	sight.lines.addComment("horizontal bold");
	for (let posYBias of [0.1]) {
		sight.add(new Line({
			from: [450, posYBias], to: [66, posYBias]
		}).withMirrored("xy"));
	}
	sight.lines.addComment("vertical upper");
	sight.add(new Line({ from: [0, -450], to: [0, -24.75] }));
	sight.lines.addComment("vertical upper bold");
	for (let posXBias of [0.1]) {
		sight.add(new Line({
			from: [posXBias, -450], to: [posXBias, -40]
		}).withMirrored("x"));
	}
	sight.lines.addComment("vertical lower");
	sight.add(new Line({ from: [0, 450], to: [0, getLdn(assumedMoveSpeed, promptCurveAA)] }));
	sight.lines.addComment("vertical lower bold");
	sight.add(new Line({ from: [0.03, 450], to: [0.03, getLdn(assumedMoveSpeed, promptCurveAA)] }).withMirrored("x"));


	sight.circles.addComment("Center arrow position prompt curve");
	sight.add(new Circle({
		segment: [-centerArrowDeg, centerArrowDeg],
		diameter: getLdn(assumedMoveSpeed, promptCurveAA) * 2,
		size: 1.2
	}));


	// leading values for shooting while moving
	sight.addComment(`Horizontal line with general leading for APFSDS - ${assumedMoveSpeed}kph`, ["texts", "lines"]);
	sight.add(
		new Line({ from: [getLdn(assumedMoveSpeed, 1), 0], to: [getLdn(assumedMoveSpeed, 0.5), 0] }).
			addBreakAtX(getLdn(assumedMoveSpeed, 1), 1.6).
			addBreakAtX(getLdn(assumedMoveSpeed, 0.75), 0.6).
			addBreakAtX(getLdn(assumedMoveSpeed, 0.5), 0.6).
			withMirrored("xy")  // y for bold
	);
	Toolbox.repeat(2, () => {
		sight.texts.add(new TextSnippet({ text: assumedMoveSpeed.toFixed(), pos: [getLdn(assumedMoveSpeed, 1), -0.08], size: 0.5 }).withMirrored("x"));
	})
	sight.circles.addComment(`Horizontal general leading for APFSDS - 1/4~3/4 AA`);
	sight.add(new Circle({ segment: [88, 92], diameter: getLdn(assumedMoveSpeed, 0.25) * 2, size: 2.4 }).withMirroredSeg("x"));
	sight.add(new Circle({ segment: [87, 93], diameter: getLdn(assumedMoveSpeed, 0.5) * 2, size: 1.8 }).withMirroredSeg("x"));
	sight.add(new Circle({ segment: [88, 92], diameter: getLdn(assumedMoveSpeed, 0.75) * 2, size: 2.4 }).withMirroredSeg("x"));

	sight.add(new TextSnippet({
		text: `ASM MOVE - ${assumedMoveSpeed.toFixed()} kph`,
		align: "right",
		pos: [67, -1.2],
		size: 0.55
	}));
	sight.add(new TextSnippet({
		text: `ASM SHELL - ${(shellSpeed / 3.6).toFixed()} m/s`,
		align: "right",
		pos: [67, 1],
		size: 0.55
	}));
};




//// OUTPUT ////
export default {
	sightObj: sight,
	requireInfoAbout: [
		"matchVehicle",
	],
	init: init,
};