// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";


let sight = new Sight();


// Introduction comments
sight.addDescription(`
Generic sight for 4X~12X with leading values for shooting APFSDS while moving

Modified from "g_nrnc_hizoom_sf_g_3AroA" but with less text information,
making it easier to snapshoot.
`.trim());


let init = ({
	assumedMoveSpeed = 55,
	shellSpeed = 1650 * 3.6,
	// leading divisions use apporiximate speed instead of denominators
	leadingDivisionsDrawSpeed = false,
} = {}) => {

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basic.scales.getHighZoomSmallFont({ line: 1.6 }),
		pd.basic.colors.getGreenRed(),
		pd.basicBuild.rgfdPos([135, -0.01725]),
		pd.basicBuild.detectAllyPos([135, -0.045]),
		pd.basicBuild.gunDistanceValuePos([-0.177, 0.035]),
		pd.basicBuild.shellDistanceTickVars(
			[-0.008, -0.008],
			[0, 0.0005],
			[0.22, 0]
		),
		pd.basic.miscVars.getCommon(),
	));


	//// VEHICLE TYPES ////
	// NOT DEFINED IN BASE


	//// SHELL DISTANCES ////
	sight.addShellDistance([
		{ distance: 400 },
		{ distance: 800 },
		{ distance: 2000, shown: 20, shownPos: [0.0045, 0.0065] },
		{ distance: 4000, shown: 40, shownPos: [0.0045, 0.0065] },
	]);


	//// SIGHT DESIGNS ////
	let getLdn = (speed, aa) => Toolbox.calcLeadingMil(shellSpeed, speed, aa);


	sight.lines.addComment("0m correction line");
	sight.add(new Line({ from: [-0.228, 0.0], to: [-0.22, 0.0], move: true, thousandth: false }));

	sight.texts.addComment("Arrow for correction value check");
	let corrValLine = [
		new Line({ from: [0.0045, 0.00035], to: [0.016, 0.00035], thousandth: false }).withMirrored("y"),  // mirrored for bold
		new Line({ from: [-0.0045, 0.00035], to: [-0.016, 0.00035], thousandth: false }).withMirrored("y"),  // mirrored for bold
	];
	// move arrow to apporiate place
	corrValLine.forEach((l) => { l.move([-0.224, 0]); });  //
	sight.add(corrValLine);


	sight.lines.addComment("Gun center");
	sight.add(new Line({
		from: [0.005, 0], to: [0.0075, 0], move: true, thousandth: false
	}).withMirrored("x"));
	sight.lines.addComment("bold");
	sight.add(new Line({
		from: [0.005, 0], to: [0.0075, 0], move: true, thousandth: false
	}).withMirrored("xy"));
	sight.add(new Line({
		from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
	}));  // center dot


	let centerArrowDeg = 40;

	sight.lines.addComment("Center arrow line and bolds");
	let arrowLineBasis = new Line({
		from: [0, 0],
		to: [Math.tan(Toolbox.degToRad(centerArrowDeg)) * 450, 450]
	}).withMirrored("x").move([0, 0.02]);
	// ^ Moving down a little bit to let the arrow vertex stays the center
	//   with being less effected by line widths
	for (let posYBias of Toolbox.rangeIE(0, 0.08, 0.02)) {
		sight.add(arrowLineBasis.copy().move([0, posYBias]));
	}


	sight.lines.addComment("Center prompt crossline starting from screen sides");
	sight.lines.addComment("horizontal");
	sight.add(new Line({ from: [450, 0], to: [100, 0] }).withMirrored("x"));
	sight.lines.addComment("horizontal bold");
	for (let posYBias of [0.1, 0.2]) {
		sight.add(new Line({
			from: [450, posYBias], to: [132, posYBias]
		}).withMirrored("xy"));
	}
	sight.lines.addComment("vertical upper");
	sight.add(new Line({ from: [0, -450], to: [0, -45] }));
	sight.lines.addComment("vertical upper bold");
	for (let posXBias of [0.1, 0.2]) {
		sight.add(new Line({
			from: [posXBias, -450], to: [posXBias, -77.5]
		}).withMirrored("x"));
	}
	sight.lines.addComment("vertical lower");
	sight.add(new Line({ from: [0, 450], to: [0, getLdn(assumedMoveSpeed, 0.5)] }));
	sight.lines.addComment("vertical lower bold");
	sight.add(new Line({ from: [0.03, 450], to: [0.03, getLdn(assumedMoveSpeed, 0.75)] }).withMirrored("x"));


	sight.circles.addComment("Center arrow position prompt curve");
	sight.add(new Circle({
		segment: [-centerArrowDeg, centerArrowDeg],
		diameter: getLdn(assumedMoveSpeed, 0.5) * 2,
		size: 1.2
	}));


	// leading values for shooting while moving
	sight.addComment(`Horizontal line with leading for APFSDS - ${assumedMoveSpeed}kph`, ["texts", "lines"]);
	sight.add(
		new Line({ from: [getLdn(assumedMoveSpeed, 1), 0], to: [getLdn(assumedMoveSpeed, 0.5), 0] }).
			addBreakAtX(getLdn(assumedMoveSpeed, 1), 1.2).
			addBreakAtX(getLdn(assumedMoveSpeed, 0.75), leadingDivisionsDrawSpeed ? 1 : 0.7).
			addBreakAtX(getLdn(assumedMoveSpeed, 0.5), leadingDivisionsDrawSpeed ? 1 : 0.7).
			withMirrored("xy")  // y for bold
	);
	Toolbox.repeat(2, () => {
		sight.texts.add(new TextSnippet({ text: assumedMoveSpeed.toFixed(), pos: [getLdn(assumedMoveSpeed, 1), -0.03], size: 0.6 }).withMirrored("x"));
		sight.texts.add(new TextSnippet({
			text: leadingDivisionsDrawSpeed ? Toolbox.roundToHalf(0.75*assumedMoveSpeed, -1).toString() : "3",
			pos: [getLdn(assumedMoveSpeed, 0.75), -0.03], size: 0.45
		}).withMirrored("x"));
		sight.texts.add(new TextSnippet({
			text: leadingDivisionsDrawSpeed ? Toolbox.roundToHalf(0.5*assumedMoveSpeed, -1).toString() : "2",
			pos: [getLdn(assumedMoveSpeed, 0.5), -0.03], size: 0.45
		}).withMirrored("x"));
	});
	sight.lines.addComment(`Horizontal leading for APFSDS - 1/4 AA`);
	for (let biasY of Toolbox.rangeIE(-0.075, 0.075, 0.075)) {
		let Xradius = 0.05;
		sight.add(new Line({
			from: [getLdn(assumedMoveSpeed, 0.25) - Xradius, biasY],
			to: [getLdn(assumedMoveSpeed, 0.25) + Xradius, biasY],
		}).withMirrored("x"))
	}

	sight.add(new TextSnippet({
		text: `ASM MOVE - ${assumedMoveSpeed.toFixed()} kph`,
		align: "right",
		pos: [134, -1.9],
		size: 1.6
	}));
	sight.add(new TextSnippet({
		text: `ASM SHELL - ${(shellSpeed / 3.6).toFixed()} m/s`,
		align: "right",
		pos: [134, 1.5],
		size: 1.6
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