// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";
import templateComp from "./template_components/all.js"
import binoCali from "../sight_components/binocular_calibration_2.js"
import turretAngleLegend from "../../sights3/extra_modules/turret_angle_legend.js";

import ENV_SET from "./_env_settings.js"


let sight = new Sight();


// Introduction comments
sight.addDescription(`
Sight for 8X~16X including leading offsets for shooting while moving.
`.trim());


let init = ({
	assumedMoveSpeed = 55,
	shellSpeed = 1650 * 3.6,

	// cross at display borders for quickly finding the center of sight.
	drawPromptCross = true,
	// binocular estimation for 3.3m target
	drawBinoCali = false,
	// Use arrows for leading ticks
	leadingDivisionsUseArrowType = false,
	// leading divisions use apporiximate speed instead of denominators;
	// for arrow type ticks, denominators will be hidden instead
	leadingDivisionsDrawSpeed = false,

} = {}) => {
	let displayRatioHoriMult = ENV_SET.DISPLAY_RATIO_NUM / (16/9);

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basic.scales.getHighZoom(),
		pd.basic.colors.getGreenRed(),
		pd.basicBuild.rgfdPos([
			110 / displayRatioHoriMult,
			leadingDivisionsUseArrowType ? -0.03925 : -0.01925
		]),
		pd.basicBuild.detectAllyPos([
			110 / displayRatioHoriMult,
			leadingDivisionsUseArrowType ? -0.06 : -0.04
		]),
		pd.basicBuild.gunDistanceValuePos([
			(leadingDivisionsUseArrowType ? -0.16 : -0.175) * displayRatioHoriMult,
			leadingDivisionsUseArrowType ? 0.053 : 0.03
		]),
		pd.basicBuild.shellDistanceTickVars(
			// [-0.0050, -0.0050],
			[0, 0],
			[0, 0.0005],
			[0.193, 0]
		),
		pd.basic.miscVars.getCommon(),
	));


	//// VEHICLE TYPES ////
	// NOT DEFINED IN BASE


	//// SHELL DISTANCES ////
	sight.addShellDistance([
		{ distance: 400 },
		{ distance: 800 },
		{ distance: 2000, shown: 0, shownPos: [
			0.01 - (1-displayRatioHoriMult) * 0.02, 0.0065
		] },
		{ distance: 4000, shown: 0, shownPos: [
			0.01 - (1-displayRatioHoriMult) * 0.02, 0.0065
		] },
	]);


	//// SIGHT DESIGNS ////
	let getLdn = (speed, aa) => Toolbox.calcLeadingMil(shellSpeed, speed, aa);


	// // 0m correction line
	// sight.add(new Line({ from: [-0.198, 0.0], to: [-0.193, 0.0], move: true, thousandth: false }));

	// // Reticle for correction value check
	// let corrValLine = [
	// 	new Line({ from: [0.003, 0.0003], to: [0.014, 0.0003], thousandth: false }).withMirrored("y"),  // mirrored for bold
	// 	new Line({ from: [-0.003, 0.0003], to: [-0.014, 0.0003], thousandth: false }).withMirrored("y"),  // mirrored for bold
	// ];
	// // move reticle to apporiate place
	// corrValLine.forEach((l) => { l.move([-0.1955, 0]); });  //
	// sight.add(corrValLine);


	// Gun center
	sight.add(new Line({
		from: [0.0045, 0], to: [0.008, 0], move: true, thousandth: false
	}).withMirrored("x")).repeatLastAdd();
	sight.add(new Line({
		from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
	}));  // center dot


	// Sight center arrow
	sight.add(templateComp.centerArrowFullscreen({
		...templateComp.centerArrowFullscreen.presetPartial["z8z16"],
		promptCurveRadius: getLdn(assumedMoveSpeed, 0.4),
	}));
	// vertical lower bold
	sight.add(new Line({
		from: [0.03, 450],
		to: [0.03, getLdn(assumedMoveSpeed, 0.4)]
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
			pos: [0, 13],
			drawCenterCross: false,
			horiLineType: "broken",
			binoMainTickHeight: 0.8,
			binoSubTickPer: 1,
			binoHalfTickLength: 0.3,

			binoTextSizeMain: 0.6,
			binoTextYMain: 0.55,
			binoTextSizeSub: 0.42,
			binoTextYSub: 0.4,

			distTextY: -0.52,
		});
		sight.add(binoCaliEles);
		sight.add(binoCaliEles.filter((ele) => (ele instanceof Line)));
	}

	// Leading offsets
	if (leadingDivisionsUseArrowType) {
		// Arrow type
		let leadingParams = {
			assumedMoveSpeed: assumedMoveSpeed,
			shellSpeed: shellSpeed,

			textYPosDefault: 0.8 - 0.03,
			textSizeDefault: 0.5,
			lineTickXOffsetsDefault: [-0.02, 0.02],

			tickParams: [
				{
					type: "arrow", aa: 1, yLen: 0.3,
					text: "_tick_speed_", textRepeated: true
				},
				{ type: "line", aa: 0.75, yLen: 0.15 },
				{ type: "arrow", aa: 0.5, yLen: 0.3,},
				{ type: "line", aa: 0.25, yLen: 0.15 },
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
					textSize: 0.6, textRepeated: false,
					horiLineBreakWidth: 1.2
				},
				{
					aa: 0.75, type: "text",
					text: leadingDivisionsDrawSpeed ? "_tick_speed_" : "3",
					textSize: 0.5, textRepeated: false,
				},
				{
					aa: 0.5, type: "text",
					text: leadingDivisionsDrawSpeed ? "_tick_speed_" : "2",
					textSize: 0.5, textRepeated: false,
				},
				{
					aa: 0.25, type: "line",
				},
			],

			horiLineAARange: [1, 0.5],
			horiLineRepeated: true,
			horiLineBreakWidthDefault: leadingDivisionsDrawSpeed ? 1.1 : 0.6,

			textYPosDefault: -0.03,

			lineTickXOffsetsDefault: Toolbox.rangeIE(-0.045, 0.045, 0.015),
			lineTickYLenDefault: 0.09
		}));

	}


	// Leading offset prompt text
	let leadingPromptParams = {
		assumedMoveSpeedParams: { value: assumedMoveSpeed, pos: [0, 0] },
		shellSpeedParams: { value: shellSpeed, pos: [0, 0] },
		textSize: 0.9
	};
	if (drawPromptCross) {
		leadingPromptParams.formatType = "full_with_dash";
		leadingPromptParams.assumedMoveSpeedParams.pos = [66.5 * displayRatioHoriMult, -1.2];
		leadingPromptParams.shellSpeedParams.pos = [66.5 * displayRatioHoriMult, 1];
		leadingPromptParams.textAlign = "right";
		leadingPromptParams.useThousandth = true;
	} else {
		// leadingPromptParams.formatType = "full_with_space";
		// leadingPromptParams.assumedMoveSpeedParams.pos = [0.818 * displayRatioHoriMult, -0.0098];
		// leadingPromptParams.shellSpeedParams.pos = [0.818 * displayRatioHoriMult, 0.0075];
		// leadingPromptParams.textAlign = "right"
		// leadingPromptParams.useThousandth = false;
		// Alternatively, values only:
		leadingPromptParams.formatType = "values_only";
		leadingPromptParams.assumedMoveSpeedParams.pos = [0.972 * displayRatioHoriMult, -0.0098];
		leadingPromptParams.shellSpeedParams.pos = [0.972 * displayRatioHoriMult, 0.0075];
		leadingPromptParams.textAlign = "left";
		leadingPromptParams.useThousandth = false;
	}
	sight.add(templateComp.leadingParamText(leadingPromptParams));

	// Angle indicator from V3. TODO REWRITE THIS SIGHT
	sight.collections["turretAngleLegends"] = [];
	sight.add(turretAngleLegend.getTurretAngleLegend({
		pos: [18.94 * 0.753, 14.2 * 0.753],
		turretCircleDiameter: 2.15 * 0.753,
		textSizeMain: 0.55 * 0.753,
		textSizeSub: 0.4 * 0.753,
		circleSize: 2.2 * 0.753,
		showSideIndicator: false,
	}));
	sight.collections["turretAngleLegends"].push(...sight.lastAddedElements);

	sight.add(turretAngleLegend.getTurretAngleLegend({
		pos: [57.14 * 0.496, 42.76 * 0.496],
		turretCircleDiameter: 6.45 * 0.496,
		textSizeMain: 1.65 * 0.496,
		textSizeSub: 1.2 * 0.496,
		circleSize: 6.05 * 0.496,
		showSideIndicator: false,
	}));
	sight.collections["turretAngleLegends"].push(...sight.lastAddedElements);
};




//// OUTPUT ////
export default {
	sightObj: sight,
	requireInfoAbout: [
		"matchVehicle",
	],
	init: init,
};