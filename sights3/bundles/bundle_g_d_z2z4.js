// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";

import ENV_SET from "../helper/env_settings.js";
import * as pd from "../helper/predefined.js";
import * as calc from "../helper/calculators.js";
import comp from "../components/all.js";

import rgfd from "../extra_modules/rangefinder.js"
import binoCali from "../extra_modules/binocular_calibration_2.js"
import tgtLegend from "../extra_modules/target_legend.js"


let sight = new Sight();
let horiRatioMult = new calc.HoriRatioMultCalculator(
	16 / 9, ENV_SET.DISPLAY_RATIO_NUM
).getMult();
let distMil = new calc.DistMilCalculator(ENV_SET.DEFAULT_ASSUMED_TARGET_WIDTH);

let assumedTargetLength = ENV_SET.DEFAULT_ASSUMED_TARGET_WIDTH * 2;


// Introduction comment
sight.addDescription(`Sight for 2.5~5X optics`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatSettings(
	pd.sScale.getCommon(),
	pd.sColor.getGreenRed(),
	pd.sRgfd.build([90 / horiRatioMult, -0.0145]),
	pd.sDetectAlly.build([90 / horiRatioMult, -0.04]),
	pd.sGunDistValue.build([(-0.15) * horiRatioMult, 0.03]),
	pd.sShellDistTick.getCentralTickCommon({
		sub: [0.005, 0.0015],
		horiPosOffset: -(1 - horiRatioMult) * 0.015
	}),
));


//// VEHICLE TYPES ////
// NOT DEFINED HERE


//// SHARED SHELL DISTANCES, COMMON SIGHT DESIGNS, ETC. ////

// Sight Cross
let horiLine = new Line({
	from: [450, 0], to: [distMil.halfFor(200), 0]
}).withMirrored("x");
sight.add(horiLine);
// vertical lines
sight.add(new Line({ from: [0, 450], to: [0, 16.5] }));


// Rangefinder on the horizon
let rangefinderHoriTextSize = 0.6;
let rangefinderVertTextSize = 0.55;
// 100m
sight.add(new TextSnippet({
	text: "1",
	pos: [distMil.halfFor(100), -0.3],
	size: rangefinderHoriTextSize
}).withMirrored("x"));
horiLine.addBreakAtX(distMil.halfFor(100), 2);
// 200m
sight.add(new TextSnippet({
	text: "2", align: "right",
	pos: [distMil.halfFor(200) + 0.75, 2],
	size: rangefinderHoriTextSize
})).repeatLastAdd();
sight.add(new Line({
	from: [distMil.halfFor(200), 0],
	to: [distMil.halfFor(200), 2]
}).withMirrored("x"));
// // 400m
// sight.add(new Line({
// 	from: [distMil.halfFor(400), -0.6],
// 	to: [distMil.halfFor(400), 0.2]
// }).withMirrored("x"));


// Rangefinder
sight.add(rgfd.getCommon([distMil.halfFor(200), -6.25], {
	mirrorY: true,
	showMiddleLine: true,
	textSize: rangefinderVertTextSize,
}));



//// SELECTABLE SIGHT PARTS ////
let parts = {
	sightAndGunCenter: {
		dot: (() => {
			let elements = [];
			// Sight center
			elements.push(new Circle({ diameter: 0.3, size: 4 }));
			elements.push(new Circle({ diameter: 0.6, size: 2 }));
			// Gun center
			elements.push(new Line({ from: [-0.5, 0], to: [0.5, 0], move: true }));
			elements.push(new Line({ from: [0, -0.5], to: [0, 0.5], move: true }));
			return elements;
		})(),

		tinyArrow: (() => {
			let elements = [];
			// Sight center
			for (let CenterBoldPadY of Toolbox.rangeIE(0, 0.8, 0.1)) {
				elements.push(new Line({
					from: [0, CenterBoldPadY], to: [0.9, 2.25]
				}).move([0, 0.05]).withMirrored("x"));
				// ^ Moving down a little bit to let the arrow vertex stays the center
				//   with being less effected by line widths
			}
			// Gun center
			elements.push(new Line({
				from: [0.004, 0], to: [0.007, 0], move: true, thousandth: false
			}).withMirrored("xy"));  // y mirroring for bold
			return elements;
		})(),
	},

	createCrossBold: (boldValue) => [
		// horizontal
		new Line({
			from: [450, boldValue], to: [25, boldValue]
		}).withMirrored("xy"),
		// vertical lower
		new Line({
			from: [boldValue, 450], to: [boldValue, distMil.halfFor(50)]
		}).withMirrored("x")
	],

	binoCali: {
		oneTick: binoCali.getCommonRealMil({
			pos: [distMil.halfFor(200), 20],
		}),
		twoTick: (() => {
			let binoCaliEles = binoCali.getCommonRealMil({
				pos: [distMil.halfFor(200), 20],
				drawTwoTicks: true,
			});
			return [
				...binoCaliEles,
				...binoCaliEles.filter((ele) => (ele instanceof Line))
			];
		})(),
	},

	targetAngleLegend: (() => {
		let tgtAngleLegend = tgtLegend.getAngleLegendGround({
			pos: [distMil.halfFor(200), 42],
			assumedTargetWidth: ENV_SET.DEFAULT_ASSUMED_TARGET_WIDTH,
			assumedTargetLength: assumedTargetLength,
			assumedTargetHeight: 1,
			textSize: 0.5
		});
		return [
			...tgtAngleLegend,
			// ...tgtAngleLegend.filter((ele) => (ele instanceof Line)),
		];
	})(),
}


//// SHORTHAND INIT PROMPT METHOD ////
let init = ({
	shellDists,
	sightAndGunCenter = parts.sightAndGunCenter.tinyArrow,
	binoCali = parts.binoCali.twoTick,
	crossBold = parts.createCrossBold(0.1),
	targetAngleLegend = null,
} = {}) => {
	sight.addShellDistance(shellDists);
	sight.add(sightAndGunCenter);
	if (binoCali) { sight.add(binoCali); }
	if (crossBold) { sight.add(crossBold); }
	if (targetAngleLegend) { sight.add(targetAngleLegend); }
}




//// OUTPUT ////
export default {
	sightObj: sight,
	parts: parts,
	init: init,
};
