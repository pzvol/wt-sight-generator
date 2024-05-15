// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";
import templateComp from "./template_components/all.js"
import binoCali from "../sight_components/binocular_calibration_2.js"

import ENV_SET from "./_env_settings.js"


let sight = new Sight();


// Introduction comments
sight.addDescription(`
Sight for 4X~12X including leading offsets for shooting while moving.
`.trim());


let init = ({
	assumedMoveSpeed = 55,
	shellSpeed = 1650 * 3.6,

	// cross at display borders for quickly finding the center of sight.
	drawPromptCross = true,
	// binocular estimation for 3.3m target
	drawBinoCali = false,
	// Make gun distance and rangefinder texts placed lower, avoiding overlapping
	// with arrow type leading elements
	useLowerGunDistTexts = false,
	// Use arrows for leading ticks
	leadingDivisionsUseArrowType = false,
	// leading divisions use apporiximate speed instead of denominators;
	// for arrow type ticks, denominators will be hidden instead
	leadingDivisionsDrawSpeed = false,

} = {}) => {
	let displayRatioHoriMult = ENV_SET.DISPLAY_RATIO_NUM / (16/9);

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basic.scales.getHighZoomSmallFont({ line: 1.6 }),
		pd.basic.colors.getGreenRed(),
		pd.basicBuild.rgfdPos([
			135 / displayRatioHoriMult,
			useLowerGunDistTexts ? -0.03225 : -0.02225
		]),
		pd.basicBuild.detectAllyPos([
			135 / displayRatioHoriMult,
			useLowerGunDistTexts ? -0.06 : -0.05
		]),
		pd.basicBuild.gunDistanceValuePos([
			(useLowerGunDistTexts ? -0.190 : -0.177) * displayRatioHoriMult,
			useLowerGunDistTexts ? 0.045 : 0.035
		]),
		// Backup of old setup:
		//
		// pd.basicBuild.rgfdPos([
		// 	135 / displayRatioHoriMult,
		// 	useLowerGunDistTexts ? -0.03225 : -0.01725
		// ]),
		// pd.basicBuild.detectAllyPos([
		// 	135 / displayRatioHoriMult,
		// 	useLowerGunDistTexts ? -0.06 : -0.045
		// ]),
		// pd.basicBuild.gunDistanceValuePos([
		// 	(useLowerGunDistTexts ? -0.190 : -0.177) * displayRatioHoriMult,
		// 	useLowerGunDistTexts ? 0.045 : 0.035
		// ]),
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
		{ distance: 2000, shown: 20, shownPos: [
			0.0045 - (1-displayRatioHoriMult) * 0.01, 0.0065
		] },
		{ distance: 4000, shown: 40, shownPos: [
			0.0045 - (1-displayRatioHoriMult) * 0.01, 0.0065
		] },
	]);


	//// SIGHT DESIGNS ////
	let getLdn = (speed, aa) => Toolbox.calcLeadingMil(shellSpeed, speed, aa);

	// 0m correction line
	sight.add(new Line({ from: [-0.228, 0.0], to: [-0.22, 0.0], move: true, thousandth: false }));

	// Reticle for correction value check
	let corrValLine = [
		new Line({ from: [0.0045, 0.00035], to: [0.016, 0.00035], thousandth: false }).withMirrored("y"),  // mirrored for bold
		new Line({ from: [-0.0045, 0.00035], to: [-0.016, 0.00035], thousandth: false }).withMirrored("y"),  // mirrored for bold
	];
	// move reticle to apporiate place
	corrValLine.forEach((l) => { l.move([-0.224, 0]); });
	sight.add(corrValLine);


	// Gun center
	sight.add(new Line({
		from: [0.005, 0], to: [0.0075, 0], move: true, thousandth: false
	}).withMirrored("x"));  //.repeatLastAdd()
	sight.add(new Line({
		from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
	}));  // center dot


	// Sight center arrow
	sight.add(templateComp.centerArrowFullscreen({
		...templateComp.centerArrowFullscreen.presetPartial["z4z12"],
		promptCurveRadius: getLdn(assumedMoveSpeed, 0.5),
	}))
	// vertical lower bold
	sight.add(new Line({ from: [0.03, 450], to: [0.03, getLdn(assumedMoveSpeed, 0.75)] }).withMirrored("x"));


	// Center prompt crossline starting from edges
	if (drawPromptCross) {
		sight.add(templateComp.promptCross({
			horiLines: [
				{ to: 100 * displayRatioHoriMult, offsets: [0] },
				{ to: 132 * displayRatioHoriMult, offsets: [0.1, 0.2] },
			],
			vertLines: [
				{ to: 45, offsets: [0] },
				{ to: 77.5, offsets: [0.1, 0.2] },
			],
		}));
	}


	// Binocular reference
	if (drawBinoCali) {
		let binoCaliEles = binoCali.getBinoCaliSimplified({
			pos: [0, 14.5],
			drawCenterCross: false,
			horiLineType: "broken",
			binoMainTickHeight: 1.2,
			binoSubTickPer: 1,
		})
		sight.add(binoCaliEles);
		// sight.add(binoCaliEles.filter((ele) => (ele instanceof Line)));
	}


	// Leading offsets
	if (leadingDivisionsUseArrowType) {
		// Arrow type
		let leadingParams = {
			assumedMoveSpeed: assumedMoveSpeed,
			shellSpeed: shellSpeed,

			tickYLenDefault: 0.4,
			textYPosDefault: 1 - 0.03,
			textSizeDefault: 0.5,
			lineTickXOffsetsDefault: [-0.02, 0.02],

			tickParams: [
				{
					type: "arrow", aa: 1,
					text: "_tick_speed_", textRepeated: true
				},
				{ type: "line", aa: 0.75, yLen: 0.2 },
				{ type: "arrow", aa: 0.5, },
				{ type: "line", aa: 0.25, yLen: 0.2 },
			],
		};
		if (leadingDivisionsDrawSpeed) {
			leadingParams.tickParams.forEach((t) => {
				if (t.aa == 0.75 || t.aa == 0.5) {
					t.text = "_tick_speed_";
					t.textSize = 0.45
				}
			});
		}
		// draw
		sight.add(templateComp.leadingReticleArrowType(leadingParams));

	} else {
		// Line type
		sight.add(templateComp.leadingReticleLineType({
			assumedMoveSpeed: assumedMoveSpeed,
			shellSpeed: shellSpeed,
			tickParams: [
				{
					aa: 1, type: "text", text: "_tick_speed_",
					textSize: 0.6, textRepeated: true,
					horiLineBreakWidth: 1.2
				},
				{
					aa: 0.75, type: "text",
					text: leadingDivisionsDrawSpeed ? "_tick_speed_" : "3",
					textSize: 0.45, textRepeated: true,
				},
				{
					aa: 0.5, type: "text",
					text: leadingDivisionsDrawSpeed ? "_tick_speed_" : "2",
					textSize: 0.45, textRepeated: true,
				},
				{
					aa: 0.25, type: "line",
				},
			],

			horiLineAARange: [1, 0.5],
			horiLineRepeated: true,
			horiLineBreakWidthDefault: leadingDivisionsDrawSpeed ? 1 : 0.7,

			textYPosDefault: -0.03,

			lineTickXOffsetsDefault: Toolbox.rangeIE(-0.045, 0.045, 0.015),
			lineTickYLenDefault: 0.14
		}));

	}


	// Leading offset prompt text
	let leadingPromptParams = {
		assumedMoveSpeedParams: { value: assumedMoveSpeed, pos: [0, 0] },
		shellSpeedParams: { value: shellSpeed, pos: [0, 0] },
		textSize: 1.6
	};
	if (drawPromptCross) {
		leadingPromptParams.formatType = "full_with_dash";
		leadingPromptParams.assumedMoveSpeedParams.pos = [134 * displayRatioHoriMult, -1.9];
		leadingPromptParams.shellSpeedParams.pos = [134 * displayRatioHoriMult, 1.5];
		leadingPromptParams.textAlign = "right";
		leadingPromptParams.useThousandth = true;
	} else {
		leadingPromptParams.formatType = "full_with_space";
		leadingPromptParams.assumedMoveSpeedParams.pos = [1.487 * displayRatioHoriMult, -0.021];
		leadingPromptParams.shellSpeedParams.pos = [1.487 * displayRatioHoriMult, 0.0165];
		leadingPromptParams.textAlign = "right";
		leadingPromptParams.useThousandth = false;
		// Alternatively, values only:
		// leadingPromptParams.formatType = "values_only";
		// leadingPromptParams.assumedMoveSpeedParams.pos = [1.75 * displayRatioHoriMult, -0.021];
		// leadingPromptParams.shellSpeedParams.pos = [1.75 * displayRatioHoriMult, 0.0165];
		// leadingPromptParams.textAlign = "left";
		// leadingPromptParams.useThousandth = false;
	}
	sight.add(templateComp.leadingParamText(leadingPromptParams));

};




//// OUTPUT ////
export default {
	sightObj: sight,
	requireInfoAbout: [
		"matchVehicle",
	],
	init: init,
};