// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";

import * as rgfd from "../sight_components/rangefinder.js"

let sight = new Sight();


// Introduction comment
sight.addDescription(`
Generic sight for tanks with common zoom multiplier

TODO: Revision needed
`.trim());


let init = ({
	binocularCalibrationTickIntervalPrompt = false,
	boldCrossingBias = 0
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
		)
	));


	//// VEHICLE TYPES ////
	// NOT DEFINED IN BASE


	//// SHELL DISTANCES ////
	// NOT DEFINED IN BASE


	//// SIGHT DESIGNS ////
	sight.circles.addComment("Center dot");
	sight.add(new Circle({ pos: [0, 0], diameter: 0.3, size: 4 }));
	sight.add(new Circle({ pos: [0, 0], diameter: 0.6, size: 2 }));

	sight.lines.addComment("Gun center");
	sight.add(new Line({ from: [-0.5, 0], to: [0.5, 0], move: true }));
	sight.add(new Line({ from: [0, -0.5], to: [0, 0.5], move: true }));

	sight.lines.addComment("Vertical line");
	sight.add(new Line({ from: [0, -450], to: [0, -33] }));
	sight.add(new Line({ from: [0, 450], to: [0, 16.5] }));

	sight.lines.addComment("Horizontal line");
	sight.add(new Line({ from: [450, 0], to: [8.25, 0.0] })
		.withExtra({ mirrorX: true }));


	sight.lines.addComment("Vertical rangefinder on the horizon");
	let rgfdAssumeWidth = 3.3;
	for (let t of [
		{ distance: 100, lineY: [0, -3] },
		{ distance: 200, lineY: [0, 2.5] },
		{ distance: 400, lineY: [0, -0.75] },
	]) {
		let thHalfWidth = Toolbox.calcDistanceMil(rgfdAssumeWidth, t.distance) / 2;
		sight.add(new Line({
			from: [thHalfWidth, t.lineY[0]],
			to: [thHalfWidth, t.lineY[1]],
		}).withExtra({ mirrorX: true }));
	}
	sight.texts.addComment("Vertical rangefinder on the horizon");
	sight.add(new TextSnippet({
		text: "1",
		align: "center",
		pos: [19, -2.5],
		size: 0.6
	}).withExtra({ mirrorX: true }));
	sight.add(new TextSnippet({
		text: "2",
		align: "right",
		pos: [9, 2],
		size: 0.6
	}));


	sight.addComment("Vertical rangefinder", ["lines", "texts"]);
	sight.add(rgfd.default.getCommon([8.25, -6.25], {
		showMiddleLine: true,
		mirrorY: true,
		assumeWidth: rgfdAssumeWidth,
	}));


	sight.addComment("Binocular Calibration Reference", ["lines", "texts"]);
	sight.lines.addComment("- 1 tick");
	sight.add(new Line({ from: [-5.25, -48], to: [0, -48] }));
	sight.add(new Line({ from: [-5.25, -45], to: [0, -45] }));
	sight.add(new Line({ from: [-5.25, -45], to: [-5.25, -48] }));
	sight.lines.addComment("- 800m size");
	sight.add(new Line({ from: [-4.125, -46], to: [-4.125, -47] }));
	sight.add(new TextSnippet({ text: "8", pos: [-4.125, -50], size: 0.55 }));
	sight.lines.addComment("- 1200m size / approximate 0.5 tick");
	sight.add(new Line({ from: [-2.75, -45], to: [-2.75, -46] }));
	sight.add(new Line({ from: [-2.75, -47], to: [-2.75, -48] }));
	sight.lines.addComment("- 1600m size");
	sight.add(new Line({ from: [-2.0625, -46.25], to: [-2.0625, -46.75] }));


	// Additional parts
	if (binocularCalibrationTickIntervalPrompt) {
		sight.texts.addComment("Binocular Calibration Reference - tick interval prompt");
		sight.add(new TextSnippet({
			text: "4/ tk >",
			align: "left",
			pos: [-3.5, -52.5],
			size: 0.45
		}));
	}

	if (boldCrossingBias !== 0) {
		sight.lines.addComment("Vertical line bottom bold")
		sight.add(new Line({from: [0, 450], to: [0, 33]}
			).move([boldCrossingBias, 0]).withExtra({mirrorX: true}));
		sight.lines.addComment("Horizontal line bold")
		sight.add(new Line({from: [450, 0], to: [25, 0]}
			).move([0, boldCrossingBias]).withExtra({mirrorX: true, mirrorY: true}));
	}
};




//// OUTPUT ////
export default {
	sightObj: sight,
	requireInfoAbout: ["matchVehicle", "addShellDistance"],
	init: init,
};
