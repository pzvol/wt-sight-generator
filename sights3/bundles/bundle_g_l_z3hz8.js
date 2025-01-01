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
sight.addDescription(`Sight for 3.5~8X optics`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatSettings(
	pd.sScale.getMidHighZoom(),
	pd.sColor.getLightGreenRed(),
	pd.sRgfd.build([115 / horiRatioMult, -0.015]),
	pd.sDetectAlly.build([115 / horiRatioMult, -0.04]),
	pd.sGunDistValue.build([-0.18 * horiRatioMult, 0.027]),
	pd.sShellDistTick.build([0, 0], [0, 0], [0, 0]),
));


//// VEHICLE TYPES ////
// NOT DEFINED HERE


//// SHARED SHELL DISTANCES, COMMON SIGHT DESIGNS, ETC. ////

// Center prompt crossline starting from edges
sight.add(comp.promptCross({
	horiLines: [
		{ to: 72 * horiRatioMult, offsets: [0] },
		{ to: 120 * horiRatioMult, offsets: [0.05, 0.1, 0.15] },
		{ to: 170 * horiRatioMult, offsets: [0.2, 0.25] },
	],
	vertLines: [
		{ to: 6, offsets: [0] },
		{ to: 33, offsets: [0.05] },
		{ to: 40, offsets: [0.1, 0.15] },
		{ to: 85, offsets: [0.2, 0.25] },
	],
}));
// additional prompt dots for vertical upper line
for (let yPos of [-5.5, -5]) {
	sight.add(new Circle({ pos: [0, yPos], diameter: 0.1, size: 1 }));
}




//// SELECTABLE SIGHT PARTS ////
let parts = {
	shellDistPatterns: {
		applySimpleCenteredLabeled: () => {
			sight.updateOrAddSettings(pd.sShellDistTick.build(
				[0, 0],
				[0.005 * horiRatioMult, 0.0005],
				[0.015 / horiRatioMult, 0]
			));

			sight.addShellDistance([
				{ distance: 400 },
				{ distance: 800 },
				{ distance: 2000, shown: 20 },
				{ distance: 4000, shown: 40 },
			]);

			// // 0m line
			// sight.add(new Line({
			// 	from: [-0.085, 0],
			// 	to: [-0.08 + (0.001 * horiRatioMult), 0], thousandth: false, move: true
			// }).move([(1 - horiRatioMult) * 0.08, 0]));
			// // Correction indicator
			// sight.add(new Line({
			// 	from: [0, 0], to: [-0.005, 0.002], thousandth: false
			// }).withMirrored("y").move([
			// 	-0.086 * horiRatioMult - 0.005 * (1 - horiRatioMult), 0]));
			// sight.add(new Line({
			// 	from: [-0.005, 0.0009], to: [-0.005, 0.002], thousandth: false
			// }).withMirrored("y").move([
			// 	-0.086 * horiRatioMult - 0.005 * (1 - horiRatioMult), 0]));
		},

		applySimpleCentered: () => {
			sight.updateOrAddSettings(pd.sShellDistTick.build(
				[0, 0],
				[0.0070 * horiRatioMult, 0.0025 * horiRatioMult],
				[0.005 / horiRatioMult, 0]
			));

			sight.addShellDistance([
				{ distance: 400 },
				{ distance: 2000 },
				{ distance: 4000, shown: 40 },
			]);
		},
	},

	sightAndGunCenter: {
		dot: (() => {
			let elements = [];
			// Gun center
			elements.push(new Line({ from: [0, -0.0015], to: [0, 0.0015], move: true, thousandth: false }));
			elements.push(new Line({ from: [-0.0015, 0], to: [0.0015, 0], move: true, thousandth: false }));
			// Sight center circle
			elements.push(new Circle({ diameter: 0.2, size: 4 }));
			elements.push(new Circle({ diameter: 0.4, size: 2 }));
			return elements;
		})(),

		dotLarger: (() => {
			let elements = [];
			// Gun center
			elements.push(new Line({ from: [0.0001, -0.00175], to: [0.0001, 0.00175], move: true, thousandth: false }).withMirrored("x"));
			elements.push(new Line({ from: [-0.00175, 0.0001], to: [0.00175, 0.0001], move: true, thousandth: false }).withMirrored("y"));
			// Sight center circle
			elements.push(new Circle({ diameter: 0.25, size: 4 }));
			elements.push(new Circle({ diameter: 0.5, size: 2 }));
			return elements;
		})(),

		hollowDot: (() => {
			let elements = [];
			// Gun center
			elements.push(new Line({ from: [0, -0.55], to: [0, -0.35], move: true }).withMirrored("x"));
			elements.push(new Line({ from: [0.55, 0], to: [0.35, 0], move: true }).withMirrored("xy"));
			// Sight center circle
			elements.push(new Circle({ diameter: 0.6, size: 2 }));
			elements.push(new Circle({ diameter: 0.8, size: 1 }));
			return elements;
		})(),
	},



	createLeadingReticle: (assumedMoveSpeed, shellSpeed) => {
		let elements = [];
		elements.push(...comp.leadingReticleLineType({
			assumedMoveSpeed: assumedMoveSpeed,
			shellSpeed: shellSpeed,
			tickParams: [
				{
					aa: 1, type: "text", text: "_tick_speed_",
					textSize: 0.5, textYPos: -0.1, textRepeated: true,
					horiLineBreakWidth: 1.8
				},
				{
					aa: 0.75, type: "line",
					lineTickXOffsets: [-0.01, 0.01],
					lineTickYLen: 0.23,
					horiLineBreakWidth: 0.6,
				},
				// 2/2 AA are drawn separately later since we use a curve for it
				// 1/2 AA:
				{
					aa: 0.25, type: "line",
					lineTickXOffsets: [-0.01, 0.01],
					lineTickYLen: 0.1,
				},
			],

			horiLineAARange: [1, 0.5],
			horiLineRepeated: true,
		}));
		elements.push(
			// 2/2 AA curve
			new Circle({
				segment: [81, 99],
				diameter: Toolbox.calcLeadingMil(shellSpeed, assumedMoveSpeed, 0.5) * 2,
				size: 1.3
			}).withMirroredSeg("x"),
		);

		elements.push(...comp.leadingParamText({
			assumedMoveSpeedParams: { value: assumedMoveSpeed, pos: [1.01 * horiRatioMult, -0.0145] },
			shellSpeedParams: { value: shellSpeed, pos: [1.01 * horiRatioMult, 0.011] },

			useThousandth: false,
			formatType: "full_with_space",
			textAlign: "right",
			textSize: 1,
		}))
		return elements;
	},

	binoCali: {
		twoTick: (() => {
			let binoCaliEles = binoCali.getBinoCaliSimplified({
				pos: [5, 20 + 2],
				mirrorX: false,
				mirrorY: true,
				centerCrossRadius: 0.4,
				binoMainTickHeight: 2,
				binoSubTickPer: 0.7,

				binoTextSizeMain: 0.57,
				binoTextYMain: 1.1,

				binoTextSizeSub: 0.37,
				binoTextYSub: 0.9,
				binoHalfTickLength: 0.25,

				distTextSize: 0.4
			});
			return [
				...binoCaliEles,
				...binoCaliEles.filter((ele) => (ele instanceof Line))
			];
		})(),
	}
}


//// SHORTHAND INIT PROMPT METHOD ////
let init = ({
	assumedMoveSpeed, shellSpeed,
	binoCali = null
} = {}) => {
	sight.add(parts.createLeadingReticle(assumedMoveSpeed, shellSpeed));

	if (binoCali) { sight.add(binoCali); }
}




//// OUTPUT ////
export default {
	sightObj: sight,
	parts: parts,
	init: init,
};
