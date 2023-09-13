// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";

import rgfd from "../sight_components/rangefinder.js"
import binoCali from "../sight_components/binocular_calibration.js"


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Generic sight for tanks with 5X. Should also be appliable for 4X ones.
`.trim());


let init = ({
	useLooseShellDistTicks = false,
	useTwoSideShellDistTicks = false,
	assumedTgtWidth = 3.3,

	crossLineBold = 0,  // Use 0 to disable the bold
	rangefinderHoriTextSize = 0.6,
	rangefinderVertTextSize = 0.55,
} = {}) => {

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basic.scales.getCommonLargeFont(),
		pd.basic.colors.getGreenRed(),
		pd.basicBuild.rgfdPos([90, -0.0195]),
		pd.basicBuild.detectAllyPos([90, -0.045]),
		pd.basicBuild.gunDistanceValuePos([-0.13, 0.032]),
		pd.basicBuild.shellDistanceTickVars(
			[0, 0],
			[0.006, 0.002],
			[0.005, 0]
		),
		pd.basic.miscVars.getCommon(),
	));


	//// VEHICLE TYPES ////
	// NOT DEFINED IN BASE


	//// SHELL DISTANCES ////
	(() => {
		let tickPosRight = useTwoSideShellDistTicks ? [0.03, 0] : [0, 0];
		if (useLooseShellDistTicks) {
			sight.addShellDistance(pd.shellDists.getFullLoose(tickPosRight));
		} else {
			sight.addShellDistance(pd.shellDists.getFull(tickPosRight));
		}
	})();


	//// SIGHT DESIGNS ////
	let getMil = (dist) => Toolbox.calcDistanceMil(assumedTgtWidth, dist);


	// Dot Center
	sight.addComment("Sight center", "circles");
	sight.add(new Circle({ diameter: 0.4, size: 4 }));
	sight.add(new Circle({ diameter: 0.8, size: 2 }));
	sight.addComment("Gun center", "circles");
	for (let padding of Toolbox.rangeIE(-0.05, 0.05, 0.05)) {
		sight.add(new Line({ from: [-0.45, padding], to: [0.45, padding], move: true }));
		sight.add(new Line({ from: [padding, -0.45], to: [padding, 0.45], move: true }));
	}

	// OR, Arrow Center
	// sight.addComment("Sight center arrow and bold", "lines");
	// for (let CenterBoldPadY of Toolbox.rangeIE(0, 0.8, 0.1)) {
	// 	sight.add(new Line({
	// 		from: [0, CenterBoldPadY], to: [0.6, 1.5]
	// 	}).move([0, 0.05]).withMirrored("x"));
	// 	// ^ Moving down a little bit to let the arrow vertex stays the center
	// 	//   with being less effected by line widths
	// }
	// sight.addComment("Gun center", "lines");
	// sight.add(new Line({
	// 	from: [0.004, 0], to: [0.007, 0], move: true, thousandth: false
	// }).withMirrored("xy"));  // y mirroring for bold
	// sight.add(new Line({
	// 	from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
	// }));  // center dot


	sight.addComment("Sight cross", "lines");
	let horiLine = new Line({ from: [450, 0], to: [getMil(400), 0] }).withMirrored("x");
	sight.add(horiLine);
	// vertical lines
	// sight.add(new Line({ from: [0, -450], to: [0, -33] }));
	sight.add(new Line({ from: [0, 450], to: [0, 16.5] }));


	// Bold of sight cross (if required)
	if (crossLineBold > 0) {
		sight.addComment("Cross bold", "lines");
		// horizontal
		sight.add(new Line({
			from: [450, crossLineBold], to: [35, crossLineBold]
		}).withMirrored("xy"));
		// vertical lower
		sight.add(new Line({
			from: [crossLineBold, 450], to: [crossLineBold, 33]
		}).withMirrored("x"));
	}


	sight.addComment("Rangefinder ticks on the horizon", ["texts", "lines"])
	// 100m
	sight.add(new TextSnippet({
		text: "1",
		pos: [getMil(100) / 2, -0.3],
		size: rangefinderHoriTextSize
	}).withMirrored("x"));
	horiLine.addBreakAtX(getMil(100)/2, 2);
	// 200m
	Toolbox.repeat(2, () => {
		sight.add(new TextSnippet({
			text: "2", align: "right",
			pos: [ (getMil(200) / 2) + 0.75, 1.7],
			size: rangefinderHoriTextSize
		}));
	});
	sight.add(new Line({
		from: [getMil(200) / 2, 0],
		to: [getMil(200) / 2, 1.75]
	}).withMirrored("x"));
	// 400m
	sight.add(new Line({
		from: [getMil(400) / 2, -0.75],
		to: [getMil(400) / 2, 0]
	}).withMirrored("x"));


	sight.addComment("Rangefinder", ["lines", "texts"]);
	sight.add(rgfd.getCommon([getMil(200)/2, -7.5], {
		mirrorY: true,
		showMiddleLine: true,
		textSize: rangefinderVertTextSize,
		tickLength: 1.5,
		tickInterval: 0.75,
		tickDashWidth: 0.6
	}));


	sight.addComment("Binocular calibration reference", ["lines", "texts"]);
	let binoCaliEles = binoCali.getCommon([getMil(400), 15]);
	sight.add(binoCaliEles);
};




//// OUTPUT ////
export default {
	sightObj: sight,
	requireInfoAbout: ["matchVehicle"],
	init: init,
};
