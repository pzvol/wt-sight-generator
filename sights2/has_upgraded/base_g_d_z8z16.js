// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";

import rgfd from "../sight_components/rangefinder.js";
import binoCali from "../sight_components/binocular_calibration_2.js";

import ENV_SET from "./_env_settings.js"


let sight = new Sight();


// Introduction comments
sight.addDescription(`
Generic sight for tanks with 8X~16X
`.trim());


let init = ({
	useLooseShellDistTicks = false,
	useTwoSideShellDistTicks = false,
	assumedTgtWidth = 3.3,
} = {}) => {

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basic.scales.getHighZoom(),
		pd.basic.colors.getGreenRed(),
		pd.basicBuild.rgfdPos([110, -0.02125]),
		pd.basicBuild.detectAllyPos([110, -0.045]),
		pd.basicBuild.gunDistanceValuePos([-0.13, 0.035]),
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
	(() => {
		let tickPosRight = useTwoSideShellDistTicks ? 0.03 : 0;
		if (useLooseShellDistTicks) {
			sight.addShellDistance(pd.shellDists.getFullLoose(tickPosRight));
		} else {
			sight.addShellDistance(pd.shellDists.getFull(tickPosRight));
			sight.add(new TextSnippet({
				text: "Dist 200m/ tk", align: "right", pos: [31, 0.5], size: 0.55
			}));
		}
	})();


	//// SIGHT DESIGNS ////
	let getMil = (dist) => Toolbox.calcDistanceMil(assumedTgtWidth, dist);

	// Sight center
	sight.add(new Circle({ diameter: 0.3, size: 2 }));
	sight.add(new Circle({ diameter: 0.15, size: 4 }));

	// Gun center
	Toolbox.repeat(2, () => {
		sight.add(new Line({ from: [-0.16, 0], to: [0.16, 0], move: true }));
		sight.add(new Line({ from: [0, -0.16], to: [0, 0.16], move: true }));
	});


	// Sight cross
	let horiLine = new Line({ from: [450, 0], to: [getMil(800), 0] }).withMirrored("x");
	let vertLineLower = new Line({ from: [0, 450], to: [0, 10.5] });
	let vertLineHigher = new Line({ from: [0, -450], to: [0, -8.25] });
	sight.add([horiLine, vertLineLower, vertLineHigher]);
	// Sight cross bold
	//   referencing the same object to ensure following changes are all applied
	sight.add(horiLine);
	sight.add(vertLineLower);
	//   extra bold on borders
	//   - horizontal
	for (let info of [
		{ toX: 30, padding: 0.05 },
		{ toX: 63, padding: 0.1 },
	]) {
		sight.add(new Line({
			from: [450, info.padding], to: [info.toX, info.padding]
		}).withMirrored("xy"));
	}
	//   - vertical
	for (let info of [
		{ toY: 16, padding: 0.05 },
		{ toY: 32, padding: 0.1 },
	]) {
		sight.add(new Line({
			from: [info.padding, 450], to: [info.padding, info.toY]
		}).withMirrored("xy"));
	}


	// Rangefinder ticks on the horizon
	// 100m
	sight.add(new TextSnippet({
		text: "1",
		pos: [getMil(100) / 2, -0.14],
		size: 1.15
	}).withMirrored("x"));
	horiLine.addBreakAtX(getMil(100) / 2, 0.9);
	// 200m
	sight.add(new TextSnippet({
		text: "2",
		pos: [getMil(200) / 2, -0.1],
		size: 0.8
	}).withMirrored("x"));
	horiLine.addBreakAtX(getMil(200) / 2, 0.7);
	// 400m
	sight.add(new Circle({
		segment: [83, 97], diameter: getMil(400), size: 1.8,
	}).withMirroredSeg("x"));
	sight.add(new TextSnippet({
		text: "4",
		pos: [getMil(400) / 2 + 0.45, -0.08],
		size: 0.6
	}).withMirrored("x"));
	horiLine.addBreakAtX(getMil(400) / 2 + 0.45, 0.7);
	// 800m
	(() => {
		let halfHeight = 0.08;
		let halfWidth = 0.03;
		for (let padding of Toolbox.rangeIE(-halfWidth, halfWidth, 0.01)) {
			sight.add(new Line({
				from: [getMil(800) / 2 + padding, -halfHeight],
				to: [getMil(800) / 2 + padding, halfHeight]
			}).withMirrored("x"));
		}
	})();


	// Rangefinder
	Toolbox.repeat(2, () => {
		sight.add(rgfd.getHighZoom([getMil(800), 2.25], {
			textSize: 0.6,
			textPosYAdjust: -0.08
		}));
	});


	let binoCaliEles = binoCali.getHighZoom({
		pos: [getMil(800), 10],
		upperTickShownDigit: 1,
	});
	sight.add(binoCaliEles);
	sight.add(binoCaliEles.filter((ele) => (ele instanceof Line)));
};




//// OUTPUT ////
export default {
	sightObj: sight,
	requireInfoAbout: [
		"matchVehicle",
	],
	init: init,
};