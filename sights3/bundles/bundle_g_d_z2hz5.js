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
	pd.sScale.getMidHighZoom({ line: 1.3 }),
	pd.sColor.getGreenRed(),
	pd.sRgfd.build([110 / horiRatioMult, -0.0145]),
	pd.sDetectAlly.build([110 / horiRatioMult, -0.04]),
	pd.sGunDistValue.build([(-0.17) * horiRatioMult, 0.03]),
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
sight.add(horiLine).repeatLastAdd();
// vertical lines
sight.add(new Line({ from: [0, 450], to: [0, 16.5] }));


// Rangefinder on the horizon
let rangefinderHoriTextSize = 0.7;
let rangefinderVertTextSize = 0.55;
// 100m
sight.add(new TextSnippet({
	text: "1",
	pos: [distMil.halfFor(100), -0.3],
	size: rangefinderHoriTextSize
}).withMirrored("x"));
horiLine.addBreakAtX(distMil.halfFor(100), 2.4);
// 200m
sight.add(new TextSnippet({
	text: "2", align: "right",
	pos: [distMil.halfFor(200) + 0.75, 1.7],
	size: rangefinderHoriTextSize
}));
sight.add(new Line({
	from: [distMil.halfFor(200), 0],
	to: [distMil.halfFor(200), 1.75]
}).withMirrored("x")).repeatLastAdd();
//   90deg angle smooth
for (let padding of Toolbox.range(0, 0.4, 0.1, { includeStart: false })) {
	sight.add(new Line({
		from: [distMil.halfFor(200) + padding, 0],
		to: [distMil.halfFor(200), padding]
	}).withMirrored("x"));
}
// 400m
sight.add(new Line({
	from: [distMil.halfFor(400), -0.6],
	to: [distMil.halfFor(400), 0.2]
}).withMirrored("x"));


// Rangefinder
sight.add(rgfd.getCommon([distMil.halfFor(200), -6.25], {
	mirrorY: true,
	showMiddleLine: true,
	textSize: rangefinderVertTextSize,
	tickLength: 1.5,
	tickInterval: 0.75,
	tickDashWidth: 0.6
}));



//// SELECTABLE SIGHT PARTS ////
let parts = {
	sightAndGunCenter: {
		dot: (() => {
			let elements = [];
			// Sight center
			elements.push(new Circle({ diameter: 0.35, size: 4 }));
			elements.push(new Circle({ diameter: 0.7, size: 2 }));
			// Gun center
			elements.push(new Line({ from: [-0.4, 0], to: [0.4, 0], move: true }));
			elements.push(new Line({ from: [0, -0.4], to: [0, 0.4], move: true }));
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
			from: [450, boldValue], to: [41, boldValue]
		}).withMirrored("xy"),
		// vertical lower
		new Line({
			from: [boldValue, 450], to: [boldValue, distMil.halfFor(50)]
		}).withMirrored("x")
	],

	binoCali: {
		oneTick: binoCali.getCommonRealMil({
			pos: [distMil.halfFor(200), 20],
			zeroLineExceeds: [-2, 0],
			quadHeight: 2,
			textSizeLarge: 0.55,
			textSizeSmall: 0.45,
			upperLargeTextY: -1.4,
			upperSmallTextY: -1.3,
			lowerLargeTextY: 1.1,
			lowerSmallTextY: 1.0,
		}),
		twoTick: (() => {
			let binoCaliEles = binoCali.getCommonRealMil({
				pos: [distMil.halfFor(200), 20],
				drawTwoTicks: false,
				zeroLineExceeds: [-2, 0],
				quadHeight: 2,
				textSizeLarge: 0.55,
				textSizeSmall: 0.45,
				upperLargeTextY: -1.4,
				upperSmallTextY: -1.3,
				lowerLargeTextY: 1.1,
				lowerSmallTextY: 1.0,
			});
			return [
				...binoCaliEles,
				...binoCaliEles.filter((ele) => (ele instanceof Line))
			];
		})(),
	},

	targetAngleLegend: (() => {
		let tgtAngleLegend = tgtLegend.getAngleLegendGround({
			pos: [distMil.halfFor(200), 32],
			assumedTargetWidth: ENV_SET.DEFAULT_ASSUMED_TARGET_WIDTH,
			widthOnSight: 3.5,
			assumedTargetLength: assumedTargetLength,
			assumedTargetHeight: 0.8,
			textRowInterval: 1.5,
			widthIndicationArrowHeight: 0.5,

			textColumnWidth: 3.5,
			textSize: 0.5,
			textPaddingY: -0.2,
		});
		return [
			...tgtAngleLegend,
			...tgtAngleLegend.filter((ele) => (ele instanceof Line)),
		];
	})(),
}


//// SHORTHAND INIT PROMPT METHOD ////
let init = ({
	shellDists,
	sightAndGunCenter = parts.sightAndGunCenter.tinyArrow,
	binoCali = parts.binoCali.twoTick,
	crossBold = parts.createCrossBold(0.12),
	targetAngleLegend = parts.targetAngleLegend,
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
