// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";


let sight = new Sight();


// Introduction comments
sight.addDescription(`
An experimental design as the generic sight for fixed 8X
with leading values for shooting APFSDS while moving

Modified from "g_nrnc_hizoom_hf_g_1Smp"
`.trim());


let init = ({
	assumedMoveSpeed = 55,
	shellSpeed = 1650 * 3.6,
	useHollowCenterDot = false,
	useShortHorizontalLine = false,
} = {}) => {

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basic.scales.getHighZoomLargeFont(),
		pd.basic.colors.getGreenRed(),
		pd.basicBuild.rgfdPos([130, -0.01425]),
		pd.basicBuild.detectAllyPos([130, -0.036]),
		pd.basicBuild.gunDistanceValuePos([-0.165, 0.0275]),
		pd.basicBuild.shellDistanceTickVars(
			[0, 0],
			[0.0070, 0.0025],
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

	if (useHollowCenterDot) {
		sight.lines.addComment("Gun center");
		sight.add(new Line({ from: [0, -0.5], to: [0, -0.3], move: true }));
		sight.add(new Line({ from: [0.5, 0], to: [0.3, 0], move: true }).withMirrored("x"));

		sight.circles.addComment("Sight center circle");
		sight.add(new Circle({ diameter: 0.6, size: 2 }));
	} else {
		sight.lines.addComment("Gun center");
		sight.add(new Line({ from: [0, -0.0015], to: [0, 0.0015], move: true, thousandth: false }));
		sight.add(new Line({ from: [-0.0015, 0], to: [0.0015, 0], move: true, thousandth: false }));

		sight.circles.addComment("Sight center dot");
		sight.add(new Circle({ diameter: 0.2, size: 4 }));
		sight.add(new Circle({ diameter: 0.4, size: 2 }));
	}


	sight.lines.addComment("Center prompt bold at screen borders");
	sight.lines.addComment("horizontal");
	for (let p of [
		{toX: useShortHorizontalLine ? 50 : 33, biasY: 0.05},
		{toX: 66, biasY: 0.1},
		{toX: 66, biasY: 0.15},
	]) {
		sight.add(new Line({
			from: [450, p.biasY], to: [p.toX, p.biasY]
		}).withMirrored("xy"));
	}
	sight.lines.addComment("vertical upper");
	for (let p of [
		{toY: -33, biasX: 0.05},
		{toY: -40, biasX: 0.1},
		{toY: -40, biasX: 0.15},
	]) {
		sight.add(new Line({
			from: [p.biasX, -450], to: [p.biasX, p.toY]
		}).withMirrored("x"));
	}

	sight.addComment("Center cross vertical", ["lines", "circles"]);
	sight.add(new Line({ from: [0, -6], to: [0, -450] }));
	sight.add(new Circle({ pos: [0, -5.5], diameter: 0.1, size: 1 }));
	sight.add(new Circle({ pos: [0, -5], diameter: 0.1, size: 1 }));
	sight.lines.addComment("Center cross horizontal");
	let horiLine = new Line({
		from: [ getLdn(assumedMoveSpeed, 0.5), 0],
		to: [useShortHorizontalLine ? getLdn(assumedMoveSpeed, 1) : 450, 0]
	}).withMirrored("xy");  // y for bold
	sight.add(horiLine);


	sight.addComment(`Horizontal leading for APFSDS - ${assumedMoveSpeed}kph`, ["circles", "texts"]);
	// 4/4 AA
	Toolbox.repeat(2, () => {
		sight.texts.add(new TextSnippet({
			text: assumedMoveSpeed.toFixed(),
			pos: [getLdn(assumedMoveSpeed, 1), -0.1],
			size: 0.5
		}).withMirrored("x"));
	});
	horiLine.addBreakAtX(getLdn(assumedMoveSpeed, 1), 1.8);

	// 3/4 AA
	sight.add(new Circle({ segment: [88, 92], diameter: getLdn(assumedMoveSpeed, 0.75) * 2, size: 2.4 }).withMirroredSeg("x"));
	horiLine.addBreakAtX(getLdn(assumedMoveSpeed, 0.75), 0.6);

	// 2/4 AA
	sight.add(new Circle({
		segment: [81, 99], diameter: getLdn(assumedMoveSpeed, 0.5) * 2,
		size: 1.3
	}).withMirroredSeg("x"))

	// 1/4 AA
	//sight.add(new Circle({ segment: [88, 92], diameter: getLdn(assumedMoveSpeed, 0.25) * 2, size: 2.4 }).withMirroredSeg("x"));


	sight.add(new TextSnippet({
		text: `ASM MOVE`,
		align: "right",
		pos: [67, -1.2],
		size: 0.55
	}));
	sight.add(new TextSnippet({
		text: `- ${assumedMoveSpeed.toFixed()} kph`,
		align: "right",
		pos: [74, -1.2],
		size: 0.55
	}));
	sight.add(new TextSnippet({
		text: `ASM SHELL`,
		align: "right",
		pos: [67, 1],
		size: 0.55
	}));
	sight.add(new TextSnippet({
		text: `- ${(shellSpeed / 3.6).toFixed()} m/s`,
		align: "right",
		pos: [74, 1],
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