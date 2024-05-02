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
Sight for 8X including leading offsets for shooting while moving.
`.trim());


let init = ({
	assumedMoveSpeed = 55,
	shellSpeed = 1650 * 3.6,

	promptCurveAA = 0.5,
	// Cross at display borders for quickly finding the center of sight.
	drawPromptCross = true,
	// binocular estimation for 3.3m target
	drawBinoCali = false,
	// Use narrower gun center, and
	// for arrow type leading reticles, use smaller arrows and ticks
	useNarrowCentralElements = false,

	// Use arrows for leading ticks
	leadingDivisionsUseArrowType = false,

} = {}) => {
	let displayRatioHoriMult = ENV_SET.DISPLAY_RATIO_NUM / (16/9);

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basic.scales.getHighZoomLargeFont(),
		pd.basic.colors.getGreenRed(),
		pd.basicBuild.rgfdPos([135 / displayRatioHoriMult, -0.01425]),
		pd.basicBuild.detectAllyPos([135 / displayRatioHoriMult, -0.036]),
		pd.basicBuild.gunDistanceValuePos([-0.195 * displayRatioHoriMult, 0.03]),
		pd.basicBuild.shellDistanceTickVars(
			[0, 0],
			[0.0060, 0.001],
			[0.005, 0]
		),
		pd.basic.miscVars.getCommon(),
	));


	//// VEHICLE TYPES ////
	// NOT DEFINED IN BASE


	//// SHELL DISTANCES ////
	sight.addShellDistance([
		{ distance: 400 },
		{ distance: 2000, shown: 20, shownPos: [10, 0]},
		{ distance: 4000, shown: 40 },
	]);


	//// SIGHT DESIGNS ////
	let getLdn = (speed, aa) => Toolbox.calcLeadingMil(shellSpeed, speed, aa);


	// Gun center
	sight.add(new Line({
		from: [
			(useNarrowCentralElements ? 0.0025 : 0.0055),
			(useNarrowCentralElements ? 0.0001 : 0)
		],
		to: [
			(useNarrowCentralElements ? 0.004 : 0.0085),
			(useNarrowCentralElements ? 0.0001 : 0)
		],
		move: true, thousandth: false
	}).withMirrored("xy"));  // y for bold
	// sight.add(new Line({
	// 	from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
	// }));  // center dot


	// Sight center arrow
	sight.add(templateComp.centerArrowFullscreen({
		overallYPadding: 0.02,
		boldYOffests: Toolbox.rangeIE(0, 0.12, 0.03),
		promptCurveRadius: getLdn(assumedMoveSpeed, promptCurveAA),
		promptCurveSize: 1.2,
	}))
	// vertical lower bold
	sight.add(new Line({
		from: [0.03, 450], to: [0.03, getLdn(assumedMoveSpeed, promptCurveAA)]
	}).withMirrored("x"));


	// Center prompt crossline starting from edges
	if (drawPromptCross) {
		sight.add(templateComp.promptCross({
			horiLines: [
				{ to: 66 * displayRatioHoriMult, offsets: [0, 0.1] },
			],
			vertLines: [
				{ to: 24.75, offsets: [0] },
				{ to: 40, offsets: [0.1] },
			],
		}));
	}


	if (drawBinoCali) {
		sight.addComment("Binocular reference", ["lines", "texts"]);
		let binoCaliEles = binoCali.getBinoCaliSimplified({
			pos: [0, 23],
			drawCenterCross: false,
			horiLineType: "full",
			binoMainTickHeight: 1.2,
			binoSubTickPer: 1,
			binoHalfTickLength: 0.4,

			binoTextSizeMain: 0.6,
			binoTextYMain: 0.95,
			binoTextYSub: 0.7,
			distTextSize: 0.5,
			distTextY: -0.9,
		})
		sight.add(binoCaliEles);
		sight.add(binoCaliEles.filter((ele) => (ele instanceof Line)));
	}


	// Leading offsets
	if (leadingDivisionsUseArrowType) {
		// Arrow type
		let leadingParams = {
			assumedMoveSpeed: assumedMoveSpeed,
			shellSpeed: shellSpeed,

			tickParams: [
				{
					type: "arrow", aa: 1,
					yLen: useNarrowCentralElements ? 0.6 : 0.8,
					text: "_tick_speed_",
					textYPos: (useNarrowCentralElements ? 1.4 : 1.7)-0.08,
					textSize: useNarrowCentralElements ? 0.41 : 0.5,
					textRepeated: true
				},
				{
					type: "line", aa: 0.75,
					yLen: useNarrowCentralElements ? 0.2 : 0.3,
					lineTickXOffsets: [-0.04, 0.04]
				},
				{
					type: "arrow", aa: 0.5,
					yLen: useNarrowCentralElements ? 0.5 : 0.7,
				},
				{
					type: "line", aa: 0.25,
					yLen: useNarrowCentralElements ? 0.15 : 0.25,
					lineTickXOffsets: [-0.035, 0.035]
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
			horiLineRepeated: true,
			horiLineBreakWidthDefault: 0.6,

			textYPosDefault: -0.08,
			textSizeDefault: 0.5,
			lineTickXOffsetsDefault: [-0.02, 0.02],
			lineTickYLenDefault: 0.35,
			tickParams: [
				{
					aa: 1, type: "text", text: "_tick_speed_",
					textRepeated: true,
					horiLineBreakWidth: 1.6,
				},
				{
					aa: 0.75, type: "line",
				},
				{
					aa: 0.5, type: "line",
					lineTickXOffsets: [0, 0],
				},
				{
					aa: 0.25, type: "line",
					lineTickYLen: 0.03,
				},
			],
		}));
	}


	let leadingPromptParams = {
		assumedMoveSpeedParams: { value: assumedMoveSpeed, pos: [0, 0] },
		shellSpeedParams: { value: shellSpeed, pos: [0, 0] },
		textSize: 0.5
	};
	if (drawPromptCross) {
		leadingPromptParams.formatType = "full_with_dash";
		leadingPromptParams.assumedMoveSpeedParams.pos = [67 * displayRatioHoriMult, -1.1];
		leadingPromptParams.shellSpeedParams.pos = [67 * displayRatioHoriMult, 0.9];
		leadingPromptParams.textAlign = "right";
		leadingPromptParams.useThousandth = true;
	} else {
		// leadingPromptParams.formatType = "full_with_space";
		// leadingPromptParams.assumedMoveSpeedParams.pos = [66 * displayRatioHoriMult, -0.9];
		// leadingPromptParams.shellSpeedParams.pos = [66 * displayRatioHoriMult, 0.7];
		// leadingPromptParams.textAlign = "right"
		// leadingPromptParams.useThousandth = true;
		//
		// Positions w/o thousandths (not ideal for zoomed in positions):
		// [0.439, -0.0059]
		// [0.439, 0.005]
		// Alternatively, values only:
		leadingPromptParams.formatType = "values_only";
		leadingPromptParams.assumedMoveSpeedParams.pos = [0.584 * displayRatioHoriMult, -0.0059];
		leadingPromptParams.shellSpeedParams.pos = [0.584 * displayRatioHoriMult, 0.005];
		leadingPromptParams.textAlign = "left";
		leadingPromptParams.useThousandth = false;
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