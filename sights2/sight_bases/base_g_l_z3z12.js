// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";
import templateComp from "./template_components/all.js"

import ENV_SET from "./_env_settings.js"


let sight = new Sight();


// Introduction comments
sight.addDescription(`
Sight for 2.7X~12X with leading values for shooting while moving.
`.trim());


let init = ({
	assumedMoveSpeed = 55,
	shellSpeed = 1700 * 3.6,

	// cross at display borders for quickly finding the center of sight.
	drawPromptCross = true,
	// Use arrows for leading ticks
	leadingDivisionsUseArrowType = false,
	// leading divisions use apporiximate speed instead of denominators;
	// for arrow type ticks, denominators will be hidden instead
	leadingDivisionsDrawSpeed = false,

} = {}) => {
	let displayRatioHoriMult = ENV_SET.DISPLAY_RATIO_NUM / (16/9);

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basic.scales.getHighZoomSmall2Font(),
		pd.basic.colors.getGreenRed(),
		pd.basicBuild.rgfdPos([
			(leadingDivisionsUseArrowType ? 120 : 110) / displayRatioHoriMult,
			-0.02225
		]),
		pd.basicBuild.detectAllyPos([
			(leadingDivisionsUseArrowType ? 120 : 110) / displayRatioHoriMult,
			-0.050
		]),
		pd.basicBuild.gunDistanceValuePos([
			(leadingDivisionsUseArrowType ? -0.173 : -0.167) * displayRatioHoriMult,
			leadingDivisionsUseArrowType ? 0.038 : 0.035
		]),
		pd.basicBuild.shellDistanceTickVars(
			[-0.01, -0.01],
			[0, 0.0005],
			[0.2, 0]
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
			0.0035 - (1-displayRatioHoriMult) * 0.012, 0.0065
		] },
		{ distance: 4000, shown: 40, shownPos: [
			0.0035 - (1-displayRatioHoriMult) * 0.012, 0.0065
		] },
	]);


	//// SIGHT DESIGNS ////
	let getLdn = (speed, aa) => Toolbox.calcLeadingMil(shellSpeed, speed, aa);


	// 0m correction line
	sight.add(new Line({ from: [-0.20, 0.0], to: [-0.21, 0.0], move: true, thousandth: false }));

	// Reticle for correction value check
	let corrValLine = [
		new Line({ from: [0.006, 0], to: [0.016, 0], thousandth: false }),
		new Line({ from: [-0.006, 0], to: [-0.016, 0], thousandth: false }),
		new Line({ from: [0.006, 0.0006], to: [0.016, 0.0006], thousandth: false }).withMirrored("y"),  // mirrored for bold
		new Line({ from: [-0.006, 0.0006], to: [-0.016, 0.0006], thousandth: false }).withMirrored("y"),  // mirrored for bold
	];
	// move reticle to apporiate place
	corrValLine.forEach((l) => { l.move([-0.205, 0]); });
	sight.add(corrValLine);


	// Gun center
	sight.add(new Line({
		from: [0.005, 0.0], to: [0.008, 0.0], move: true, thousandth: false
	}).withMirrored("x"));
	sight.add(new Line({
		from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
	}));  // center dot


	// Sight center arrow
	sight.add(templateComp.centerArrowFullscreen({
		...templateComp.centerArrowFullscreen.presetPartial["z4z12"],
		promptCurveRadius: getLdn(assumedMoveSpeed, 0.5),
	}));
	// vertical lower bold
	sight.add(new Line({ from: [0.03, 450], to: [0.03, getLdn(assumedMoveSpeed, 0.75)] }).withMirrored("x"));


	// Center prompt crossline starting from edges
	if (drawPromptCross) {
		sight.add(templateComp.promptCross({
			horiLines: [
				{ to: 200 * displayRatioHoriMult, offsets: [0, 0.2, 0.4] },
			],
			vertLines: [
				{ to: 105, offsets: [0, 0.2, 0.3] },
			],
		}));
	}


	sight.addComment(`Leading values for shooting while moving - ${assumedMoveSpeed}kph`, ["texts", "lines"]);
	if (leadingDivisionsUseArrowType) {
		// Arrow type
		let leadingParams = {
			assumedMoveSpeed: assumedMoveSpeed,
			shellSpeed: shellSpeed,

			tickYLenDefault: 0.43,
			textYPosDefault: 0.97 - 0.03,
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

			lineTickXOffsetsDefault: Toolbox.rangeIE(-0.045, 0.045, 0.015),
			lineTickYLenDefault: 0.14,
			textYPosDefault: -0.03,
			tickParams: [
				{
					aa: 1, type: "text", text: "_tick_speed_",
					textSize: 0.55, textRepeated: true,
					horiLineBreakWidth: 1.2, textYPos: -0.05
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
		}));
	}


	let leadingPromptParams = {
		assumedMoveSpeedParams: { value: assumedMoveSpeed, pos: [0, 0] },
		shellSpeedParams: { value: shellSpeed, pos: [0, 0] },
		textSize: 2
	};
	if (drawPromptCross) {
		leadingPromptParams.formatType = "full_with_dash";
		leadingPromptParams.assumedMoveSpeedParams.pos = [203 * displayRatioHoriMult, -2.7];
		leadingPromptParams.shellSpeedParams.pos = [203 * displayRatioHoriMult, 2.3];
		leadingPromptParams.textAlign = "right";
		leadingPromptParams.useThousandth = true;
	} else {
		leadingPromptParams.formatType = "full_with_space";
		leadingPromptParams.assumedMoveSpeedParams.pos = [2.166 * displayRatioHoriMult, -0.024];
		leadingPromptParams.shellSpeedParams.pos = [2.166 * displayRatioHoriMult, 0.0205];
		leadingPromptParams.textAlign = "right";
		leadingPromptParams.useThousandth = false;
		leadingPromptParams.extraNormalSpaceNum = 1;
		// Alternatively, values only:
		// leadingPromptParams.formatType = "values_only";
		// leadingPromptParams.assumedMoveSpeedParams.pos = [2.505 * displayRatioHoriMult, -0.024];
		// leadingPromptParams.shellSpeedParams.pos = [2.505 * displayRatioHoriMult, 0.0205];
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