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


let sight = new Sight();
let horiRatioMult = new calc.HoriRatioMultCalculator(
	16 / 9, ENV_SET.DISPLAY_RATIO_NUM
).getMult();
let distMil = new calc.DistMilCalculator(ENV_SET.DEFAULT_ASSUMED_TARGET_WIDTH);



// Introduction comment
sight.addDescription(`Sight for 5X optics`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatSettings(
	pd.sScale.getCommonLargeFont(),
	pd.sColor.getGreenRed(),
	pd.sRgfd.build([90 / horiRatioMult, -0.0195]),
	pd.sDetectAlly.build([90 / horiRatioMult, -0.045]),
	pd.sGunDistValue.build([(-0.13) * horiRatioMult, 0.03]),
	pd.sShellDistTick.getCentralTickCommon({
		sub: [0.006, 0.002],
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
	size: rangefinderHoriTextSize + 0.1
}).withMirrored("x")).repeatLastAdd();
horiLine.addBreakAtX(distMil.halfFor(100), 2);
// 200m
sight.add(new TextSnippet({
	text: "2", align: "right",
	pos: [distMil.halfFor(200) + 0.75, 1.7],
	size: rangefinderHoriTextSize
})).repeatLastAdd();
sight.add(new Line({
	from: [distMil.halfFor(200), 0],
	to: [distMil.halfFor(200), 1.75]
}).withMirrored("x"));
// 400m
sight.add(new Line({
	from: [distMil.halfFor(400), -0.75],
	to: [distMil.halfFor(400), 0]
}).withMirrored("x"));


// Rangefinder
sight.add(rgfd.getCommon([distMil.halfFor(200), -7.5], {
	mirrorY: true,
	showMiddleLine: true,
	textSize: rangefinderVertTextSize,
	tickLength: 1.5,
	tickInterval: 0.75,
	tickDashWidth: 0.6
}));



//// SELECTABLE SIGHT PARTS ////
let parts = {
	shellDists: {
		loose: pd.shellDistTicks.getFullLoose(),
		looseTwoSide: pd.shellDistTicks.getFullLoose({
			useTwoSideTicks: true,
			twoSideRightTextPosX: 0.0295,
		}),
		full: pd.shellDistTicks.getFull(),
		fullTwoSide: pd.shellDistTicks.getFull({
			useTwoSideTicks: true,
			twoSideRightTextPosX: 0.0295,
		}),
	},

	sightAndGunCenter: {
		dot: (() => {
			let elements = [];
			// Sight center
			elements.push(new Circle({ diameter: 0.4, size: 4 }));
			elements.push(new Circle({ diameter: 0.8, size: 2 }));
			// Gun center
			for (let padding of Toolbox.rangeIE(-0.05, 0.05, 0.05)) {
				elements.push(new Line({ from: [-0.45, padding], to: [0.45, padding], move: true }));
				elements.push(new Line({ from: [padding, -0.45], to: [padding, 0.45], move: true }));
			}
			return elements;
		})(),

		tinyArrow: (() => {
			let elements = [];
			// Sight center
			for (let CenterBoldPadY of Toolbox.rangeIE(0, 0.8, 0.1)) {
				elements.push(new Line({
					from: [0, CenterBoldPadY], to: [0.6, 1.5]
				}).move([0, 0.05]).withMirrored("x"));
				// ^ Moving down a little bit to let the arrow vertex stays the center
				//   with being less effected by line widths
			}
			// Gun center
			elements.push(new Line({
				from: [0.004, 0], to: [0.007, 0], move: true, thousandth: false
			}).withMirrored("xy"));  // y mirroring for bold
			elements.push(new Line({
				from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
			}));  // center dot
			return elements;
		})(),
	},

	createCrossBold: (boldValue) => [
		// horizontal
		new Line({
			from: [450, boldValue], to: [35, boldValue]
		}).withMirrored("xy"),
		// vertical lower
		new Line({
			from: [boldValue, 450], to: [boldValue, distMil.halfFor(50)]
		}).withMirrored("x")
	],

	binoCali: {
		oneTick: binoCali.getCommonRealMil({
			pos: [distMil.halfFor(200), 15],
			zeroLineExceeds: [-2.5, 0],
			quadHeight: 2.5,
			textSizeLarge: 0.55,
			textSizeSmall: 0.45,
			upperLargeTextY: -1.7,
			upperSmallTextY: -1.5,
			lowerLargeTextY: 1.3,
			lowerSmallTextY: 1.1,
		}),
		twoTick: (() => {
			let binoCaliEles = binoCali.getCommonRealMil({
				pos: [distMil.halfFor(200), 15],
				drawTwoTicks: false,
				zeroLineExceeds: [-2.5, 0],
				quadHeight: 2.5,
				textSizeLarge: 0.55,
				textSizeSmall: 0.45,
				upperLargeTextY: -1.7,
				upperSmallTextY: -1.5,
				lowerLargeTextY: 1.3,
				lowerSmallTextY: 1.1,
			});
			return [
				...binoCaliEles,
				...binoCaliEles.filter((ele) => (ele instanceof Line))
			];
		})(),
	}
}


//// SHORTHAND INIT PROMPT METHOD ////
let init = ({ partName1 = parts.partType1, } = {}) => {
	throw new Error("Init method not implemented");
}




//// OUTPUT ////
export default {
	sightObj: sight,
	parts: parts,
	init: init,
};
