// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";

import * as rgfd from "../sight_components/rangefinder.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Generic sight for tanks with 2.5X~5X
`.trim());


let init = ({
	useLooseShellDistTicks = false,
	useTwoSideShellDistTicks = false,
	assumedTgtWidth = 3.3,

	crossLineBold = 0,  // Use 0 to disable the bold
	rangefinderHoriTextSize = 0.7,
	rangefinderVertTextSize = 0.55,
} = {}) => {

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basic.scales.getMidHighZoom({ line: 1.3 }),
		pd.basic.colors.getGreenRed(),
		pd.basicBuild.rgfdPos([110, -0.0145]),
		pd.basicBuild.detectAllyPos([110, -0.04]),
		pd.basicBuild.gunDistanceValuePos([-0.17, 0.03]),
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
	// sight.addComment("Sight center", "circles");
	// sight.add(new Circle({ diameter: 0.35, size: 4 }));
	// sight.add(new Circle({ diameter: 0.7, size: 2 }));
	// sight.addComment("Gun center", "circles");
	// sight.add(new Line({ from: [-0.4, 0], to: [0.4, 0], move: true }));
	// sight.add(new Line({ from: [0, -0.4], to: [0, 0.4], move: true }));

	// OR, Arrow Center
	sight.addComment("Sight center arrow and bold", "lines");
	for (let CenterBoldPadY of Toolbox.rangeIE(0, 0.8, 0.1)) {
		sight.add(new Line({
			from: [0, CenterBoldPadY], to: [0.6, 1.5]
		}).move([0, 0.05]).withMirrored("x"));
		// ^ Moving down a little bit to let the arrow vertex stays the center
		//   with being less effected by line widths
	}
	sight.addComment("Gun center", "lines");
	sight.add(new Line({
		from: [0.004, 0], to: [0.007, 0], move: true, thousandth: false
	}).withMirrored("xy"));  // y mirroring for bold
	sight.add(new Line({
		from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
	}));  // center dot


	sight.addComment("Sight cross", "lines");
	let horiLine = new Line({ from: [450, 0], to: [getMil(400), 0] }).withMirrored("xy");
	// ^ "y" for bold the line
	sight.add(horiLine);
	// vertical lines
	// sight.add(new Line({ from: [0, -450], to: [0, -33] }));
	sight.add(new Line({ from: [0, 450], to: [0, 16.5] }));


	// Bold of sight cross (if required)
	if (crossLineBold > 0) {
		sight.addComment("Cross bold", "lines");
		// horizontal
		sight.add(new Line({
			from: [450, crossLineBold], to: [41, crossLineBold]
		}).withMirrored("xy"));
		// vertical lower
		sight.add(new Line({
			from: [crossLineBold, 450], to: [crossLineBold, 33]
		}).withMirrored("x"));
	}


	sight.addComment("Rangefinder ticks on the horizon", ["texts", "lines"]);
	// 100m
	sight.add(new TextSnippet({
		text: "1",
		pos: [getMil(100) / 2, -0.3],
		size: rangefinderHoriTextSize
	}).withMirrored("x"));
	horiLine.addBreakAtX(getMil(100) / 2, 2.4);
	// 200m
	sight.add(new TextSnippet({
		text: "2", align: "right",
		pos: [(getMil(200) / 2) + 0.75, 1.7],
		size: rangefinderHoriTextSize
	}));
	Toolbox.repeat(2, () => {
		sight.add(new Line({
			from: [getMil(200) / 2, 0],
			to: [getMil(200) / 2, 1.75]
		}).withMirrored("x"));
	});
	//   90deg angle smooth
	for (let padding of Toolbox.range(0, 0.4, 0.1, { includeStart: false })) {
		sight.add(new Line({
			from: [getMil(200) / 2 + padding, 0],
			to: [getMil(200) / 2, padding]
		}).withMirrored("x"));
	}
	// 400m
	sight.add(new Line({
		from: [getMil(400) / 2, -0.6],
		to: [getMil(400) / 2, 0.2]
	}).withMirrored("x"));


	sight.addComment("Rangefinder", ["lines", "texts"]);
	sight.add(rgfd.default.getCommon([getMil(200) / 2, -6.25], {
		mirrorY: true,
		showMiddleLine: true,
		textSize: rangefinderVertTextSize,
		tickLength: 1.5,
		tickInterval: 0.75,
		tickDashWidth: 0.6
	}));


	sight.addComment("Binocular calibration reference", ["lines", "texts"]);
	// Multiplier for converting binocular's USSR mil to sight's real mil
	let milMul = Toolbox.MIL.ussr.value / Toolbox.MIL.real.value;
	let binoCaliPos = [getMil(400), 20];
	let binoCaliEles = [
		// Middle line
		new Line({ from: [0, -3], to: [0, 3] }),

		// 1 tick (= 5 USSR mil) / around 600m
		new Line({ from: [5 * milMul, 3], to: [5 * milMul, 0] }),
		new Line({ from: [5 * milMul, 3], to: [0, 3] }),
		new Line({ from: [5 * milMul, 0], to: [0, 0] }),
		// 800m size
		new Line({ from: [getMil(800), 2], to: [getMil(800), 1] }),
		// 1200m size
		new Line({ from: [getMil(1200), 3], to: [getMil(1200), 2] }),
		new Line({ from: [getMil(1200), 1], to: [getMil(1200), 0] }),
		// 1600m size
		new Line({ from: [getMil(1600), 1.75], to: [getMil(1600), 1.25] }),

		new TextSnippet({ text: "6", pos: [5 * milMul, -1.6], size: 0.55 }),  // Actually around 630m
		new TextSnippet({ text: "8", pos: [getMil(800), 4.4], size: 0.55 }),
		new TextSnippet({ text: "12", pos: [getMil(1200), -1.4], size: 0.45 }),
		new TextSnippet({ text: "16", pos: [getMil(1600) / 2, 4.2], size: 0.45 }),  // Not aligned to 1600 for visibility
	];
	// Move to position and append elements
	for (let ele of binoCaliEles) { ele.move(binoCaliPos); }
	sight.add(binoCaliEles);
};




//// OUTPUT ////
export default {
	sightObj: sight,
	requireInfoAbout: ["matchVehicle"],
	init: init,
};
