// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import templateComp from "./template_components/all.js"
import * as pd from "../../_lib2/predefined.js";

import ENV_SET from "./_env_settings.js"


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Sight for 4X~9X optics with leading offsets for shooting while moving.
`.trim());


let init = ({
	assumedMoveSpeed = 45,
	shellSpeed = 1700 * 3.6,

	centerPromptCurveAA = 1,
	// cross at display borders for quickly finding the center of sight;
	// can be disabled for cleaner view on this low-magnification optics.
	drawPromptCross = true,
	// Use arrows for leading ticks
	leadingDivisionsUseArrowType = false,

} = {}) => {
	let displayRatioHoriMult = ENV_SET.DISPLAY_RATIO_NUM / (16/9);

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basicBuild.scale({font: 0.8, line: 1.5}),
		pd.basic.colors.getGreenRed(),
		pd.basicBuild.rgfdPos([90 / displayRatioHoriMult, -0.04375]),
		pd.basicBuild.detectAllyPos([90 / displayRatioHoriMult, -0.067]),
		pd.basicBuild.gunDistanceValuePos([-0.13 * displayRatioHoriMult, 0.06]),
		pd.basicBuild.shellDistanceTickVars(
			[-0.01, -0.01],
			[0, 0.0002],
			[0.15, 0]
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
	// Gun center
	sight.add(new Line({
		from: [0.002, 0], to: [0.004, 0], move: true, thousandth: false
	}).withMirrored("x")).repeatLastAdd();
	// sight.add(new Line({
	// 	from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
	// }));  // center dot

	// 0m correction on left
	sight.add(new Line({ from: [-0.16, 0.0], to: [-0.15, 0.0], move: true, thousandth: false }));

	// correction value indication
	let corrValLine = [
		new Line({ from: [0.0055, 0.00035], to: [0.016, 0.00035], thousandth: false }).withMirrored("y"),  // mirrored for bold
		new Line({ from: [-0.0055, 0.00035], to: [-0.016, 0.00035], thousandth: false }).withMirrored("y"),  // mirrored for bold
	];
	// move arrow to apporiate place
	corrValLine.forEach((l) => { l.move([-0.155, 0]); });
	sight.add(corrValLine);


	let getLdn = (aa) => Toolbox.calcLeadingMil(shellSpeed, assumedMoveSpeed, aa);

	// Sight Center arrow
	sight.add(templateComp.centerArrowFullscreen({
		...templateComp.centerArrowFullscreen.presetPartial["z4z9"],
		promptCurveRadius: getLdn(centerPromptCurveAA),
	}));
	// vertical lower bold
	sight.add(new Line({ from: [0.03, 450], to: [0.03, getLdn(1.5)] }).withMirrored("x"));


	if (drawPromptCross) {
		sight.add(templateComp.promptCross({
			horiLines: [
				{ to: 137 * displayRatioHoriMult, offsets: [0, 0.15, 0.3] },
			],
			vertLines: [
				{ to: 70, offsets: [0, 0.125, 0.25] },
			],
		}));
	}


	// leading values for shooting while moving
	if (leadingDivisionsUseArrowType) {
		// Arrow type
		let leadingParams = {
			assumedMoveSpeed: assumedMoveSpeed,
			shellSpeed: shellSpeed,

			textYPosDefault: 1.3 - 0.1,
			textSizeDefault: 0.4,

			tickParams: [
				{
					type: "arrow", aa: 1, yLen: 0.5,
					text: "_tick_speed_", textRepeated: true,
				},
				{
					type: "line", aa: 0.75, yLen: 0.2,
					lineTickXOffsets: [-0.04, 0.04],
				},
				{
					type: "arrow", aa: 0.5, yLen: 0.32,
				},
				{
					type: "line", aa: 0.25, yLen: 0.1,
					lineTickXOffsets: [-0.02, 0.02],
				},
			],
		};
		// draw
		sight.add(templateComp.leadingReticleArrowType(leadingParams));

	} else {
		// Line type
		sight.add(templateComp.leadingReticleLineType({
			assumedMoveSpeed: assumedMoveSpeed,
			shellSpeed: shellSpeed,

			horiLineAARange: [1, 0.5],
			horiLineRepeated: false,

			textYPosDefault: -0.1,
			textSizeDefault: 0.5,
			lineTickXOffsetsDefault: Toolbox.rangeIE(-0.05, 0.05, 0.05),
			lineTickYLenDefault: 0.1,
			tickParams: [
				{
					aa: 1, type: "text", text: "_tick_speed_",
					textRepeated: true,
					horiLineBreakWidth: 1.7,
				},
				{
					aa: 0.75, type: "line",
					horiLineBreakWidth: 0.7,
				},
				{
					aa: 0.5, type: "line",
				},
				{
					aa: 0.25, type: "line",
				},
			],
		}));
	}


	let leadingPromptParams = {
		assumedMoveSpeedParams: { value: assumedMoveSpeed, pos: [0, 0] },
		shellSpeedParams: { value: shellSpeed, pos: [0, 0] },
		textSize: 1
	};
	if (drawPromptCross) {
		leadingPromptParams.formatType = "full_with_dash";
		leadingPromptParams.assumedMoveSpeedParams.pos = [139 * displayRatioHoriMult, -2.2];
		leadingPromptParams.shellSpeedParams.pos = [139 * displayRatioHoriMult, 1.8];
		leadingPromptParams.textAlign = "right";
		leadingPromptParams.useThousandth = true;

	} else {
		leadingPromptParams.formatType = "full_with_space";
		leadingPromptParams.assumedMoveSpeedParams.pos = [0.925 * displayRatioHoriMult, -0.011];
		leadingPromptParams.shellSpeedParams.pos = [0.925 * displayRatioHoriMult, 0.008];
		leadingPromptParams.textAlign = "right"
		leadingPromptParams.useThousandth = false;
		leadingPromptParams.extraNormalSpaceNum = 1;

		// Alternatively, values only:
		// leadingPromptParams.formatType = "values_only";
		// leadingPromptParams.assumedMoveSpeedParams.pos = [1.0935 * displayRatioHoriMult, -0.011];
		// leadingPromptParams.shellSpeedParams.pos = [1.0935 * displayRatioHoriMult, 0.008];
		// leadingPromptParams.textAlign = "left";
		// leadingPromptParams.useThousandth = false;
	}
	sight.add(templateComp.leadingParamText(leadingPromptParams));

};




//// OUTPUT ////
export default {
	sightObj: sight,
	requireInfoAbout: ["matchVehicle"],
	init: init,
};
