// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";

import rgfd from "../sight_components/rangefinder.js"
import tgtLegend from "../sight_components/target_legend.js"
import binoCali from "../sight_components/binocular_calibration_2.js"


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Generic sight for tanks with 2X~4X.
`.trim());


let init = ({
	useLooseShellDistTicks = false,
	useTwoSideShellDistTicks = false,

	showCompleteRangefinder = true,
	showBinocularReference = true,
	showTargetAngleLegend = true,

	assumedTgtWidth = 3.3,
	assumedTgtLength = 6.6,

	crossLineBold = 0,  // Use 0 to disable the bold
	rangefinderHoriTextSize = 0.6,
	rangefinderVertTextSize = 0.55,
} = {}) => {

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basic.scales.getCommon(),
		pd.basic.colors.getGreenRed(),
		pd.basicBuild.rgfdPos([90, -0.0145]),
		pd.basicBuild.detectAllyPos([90, -0.04]),
		pd.basicBuild.gunDistanceValuePos([-0.15, 0.03]),
		pd.basicBuild.shellDistanceTickVars(
			[0, 0],
			[0.005, 0.0015],
			[0.005, 0]
		),
		pd.basic.miscVars.getCommon(),
	));


	//// VEHICLE TYPES ////
	// NOT DEFINED IN BASE


	//// SHELL DISTANCES ////
	(() => {
		let tickPosRight = useTwoSideShellDistTicks ? 0.03 : 0;
		if (useLooseShellDistTicks) {
			sight.addShellDistance(pd.shellDists.getFullLoose(tickPosRight));
		} else {
			sight.addShellDistance(pd.shellDists.getFull(tickPosRight));
		}
	})();


	//// SIGHT DESIGNS ////
	let getMil = (dist) => Toolbox.calcDistanceMil(assumedTgtWidth, dist);

	// Dot Center
	// sight.addComment("Sight center", "circles");
	// sight.add(new Circle({ diameter: 0.3, size: 4 }));
	// sight.add(new Circle({ diameter: 0.6, size: 2 }));
	// sight.addComment("Gun center", "circles");
	// sight.add(new Line({ from: [-0.5, 0], to: [0.5, 0], move: true }));
	// sight.add(new Line({ from: [0, -0.5], to: [0, 0.5], move: true }));

	// OR, Arrow Center
	sight.addComment("Sight center arrow and bold", "lines");
	for (let CenterBoldPadY of Toolbox.rangeIE(0, 0.8, 0.1)) {
		sight.add(new Line({
			from: [0, CenterBoldPadY], to: [0.9, 2.25]
		}).move([0, 0.05]).withMirrored("x"));
		// ^ Moving down a little bit to let the arrow vertex stays the center
		//   with being less effected by line widths
	}
	sight.addComment("Gun center", "lines");
	sight.add(new Line({
		from: [0.004, 0], to: [0.007, 0], move: true, thousandth: false
	}).withMirrored("xy"));  // y mirroring for bold


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
			from: [450, crossLineBold], to: [25, crossLineBold]
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
			pos: [ (getMil(200) / 2) + 0.75, 2],
			size: rangefinderHoriTextSize
		}));
	});
	sight.add(new Line({
		from: [getMil(200) / 2, 0],
		to: [getMil(200) / 2, 2]
	}).withMirrored("x"));


	if (showCompleteRangefinder) {
		sight.addComment("Rangefinder", ["lines", "texts"]);
		sight.add(rgfd.getCommon([getMil(200)/2, -6.25], {
			mirrorY: true,
			showMiddleLine: true,
			textSize: rangefinderVertTextSize,
		}));
	}


	if (showBinocularReference) {
		sight.addComment("Binocular calibration reference", ["lines", "texts"]);
		let binoCaliEles = binoCali.getCommonRealMil({
			pos: [getMil(400), 20],
			drawTwoTicks: true,
		});
		sight.add(binoCaliEles);
	}

	if (showTargetAngleLegend) {
		sight.addComment("Target angle legend", ["lines", "texts"]);
		sight.add(tgtLegend.getAngleLegendGround({
			pos: [getMil(400), 42],
			assumedTargetWidth: assumedTgtWidth,
			assumedTargetLength: assumedTgtLength,
			assumedTargetHeight: 1,
			textSize: 0.5
		}));
	}
};




//// OUTPUT ////
export default {
	sightObj: sight,
	requireInfoAbout: ["matchVehicle"],
	init: init,
};
