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
Sight for 6X~11X including leading offsets for shooting while moving.
`.trim());


let init = ({
	shellSpeed = 1730 * 3.6,
	assumedMoveSpeed = 40,
	drawPromptCross = true,

	// Can be one of the following types:
	//   "line"
	//   "arrow"
	//   "values_only"
	leadingDivisionsType = "line",

	// Meaningful for line type only:
	useLongerLeadLine = false,
	useWiderLeadLineBreak = false,

	// leading divisions use apporiximate speed instead of denominators;
	// for arrow type ticks, denominators will be hidden instead
	leadingDivisionsDrawSpeed = false,

} = {}) => {
	let getLdn = (aa) => Toolbox.calcLeadingMil(shellSpeed, assumedMoveSpeed, aa);
	let displayRatioHoriMult = ENV_SET.DISPLAY_RATIO_NUM / (16/9);

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basic.scales.getHighZoom({ line: 1.6 }),
		pd.basic.colors.getLightGreenRed(),
		pd.basicBuild.rgfdPos([
			110 / displayRatioHoriMult,
			leadingDivisionsType === "arrow" ? -0.02225 : -0.01725
		]),
		pd.basicBuild.detectAllyPos([
			110 / displayRatioHoriMult,
			leadingDivisionsType === "arrow" ? -0.043 : -0.038
		]),
		pd.basicBuild.gunDistanceValuePos([
			(leadingDivisionsType === "arrow" ? -0.168 : -0.165) * displayRatioHoriMult,
			leadingDivisionsType === "arrow" ? 0.037 : 0.030
		]),
		pd.basicBuild.shellDistanceTickVars(
			[-0.0100, -0.0100],
			[0, 0.00015],
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
		{ distance: 2000, shown: 20, shownPos: [
			0.0035 - (1-displayRatioHoriMult) * 0.012, 0.007
		] },
		{ distance: 4000, shown: 40, shownPos: [
			0.0035 - (1-displayRatioHoriMult) * 0.012, 0.007
		] },
	]);


	//// SIGHT DESIGNS ////
	// Gun center
	sight.add(new Line({
		from: [0.0035, 0], to: [0.0055, 0], move: true, thousandth: false
	}).withMirrored("x"));
	sight.add(new Line({
		from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
	}));  // center dot

	// 0m correction line
	sight.add(new Line({ from: [-0.203, 0.0], to: [-0.193, 0.0], move: true, thousandth: false }));


	// Gun correction value indicator
	let corrValLine = [
		new Line({ from: [0.006, 0.00045], to: [0.0175, 0.00045], thousandth: false }).withMirrored("y"),  // mirrored for bold
		new Line({ from: [-0.006, 0.00045], to: [-0.0175, 0.00045], thousandth: false }).withMirrored("y"),  // mirrored for bold
	];
	// move arrow to apporiate place
	corrValLine.forEach((l) => { l.move([-0.198, 0]); });  //
	sight.add(corrValLine);


	// Sight center arrow and bold
	for (let CenterBoldPadY of Toolbox.rangeIE(0, 0.16, 0.04)) {
		sight.add(new Line({
			from: [0, CenterBoldPadY], to: [0.9, 2.25]
		}).move([0, 0.02]).withMirrored("x"));
		// ^ Moving down a little bit to let the arrow vertex stays the center
		//   with being less effected by line widths
	}

	// Vertical lower line and bold
	sight.add(templateComp.promptCross({
		horiLines: [],
		vertLines: [
			{
				to:
					leadingDivisionsType === "arrow" ? 2.5 :
					leadingDivisionsType === "line" ? 4 :
					leadingDivisionsType === "values_only" ? 3.5 :
					0,
				offsets: [0] },
			{ to: 23, offsets: [0.03] },
			{ to: 42, offsets: Toolbox.rangeIE(0.08, 0.12, 0.04)},
		],
		drawLowerVert: true,
		drawUpperVert: false,
	}));


	if (drawPromptCross) {
		sight.add(templateComp.promptCross({
			horiLines: [
				{ to: 75 * displayRatioHoriMult, offsets: Toolbox.rangeIE(0, 0.02, 0.02) },
				{ to: 88 * displayRatioHoriMult, offsets: Toolbox.rangeIE(0.04, 0.12, 0.04) },
			],
			vertLines: [
				{ to: 40, offsets: Toolbox.rangeIE(0, 0.04, 0.04) },
				{ to: 45, offsets: Toolbox.rangeIE(0.08, 0.12, 0.04) },
			],
		}));
	}


	// Leading offsets
	if (leadingDivisionsType === "arrow") {
		// Arrow type
		let leadingParams = {
			assumedMoveSpeed: assumedMoveSpeed,
			shellSpeed: shellSpeed,

			tickYLenDefault: 0.4,
			textYPosDefault: 1.1 - 0.05,

			tickParams: [
				{
					type: "arrow", aa: 1, yLen: 0.5,
					text: "_tick_speed_", textSize: 0.47, textRepeated: true,
				},
				{
					type: "line", aa: 0.75, yLen: 0.15,
					lineTickXOffsets: [-0.04, 0.04],
				},
				{ type: "arrow", aa: 0.5, yLen: 0.45, },
				{
					type: "line", aa: 0.25, yLen: 0.1,
					lineTickXOffsets: [-0.02, 0.02],
				},
			],
		};
		if (leadingDivisionsDrawSpeed) {
			leadingParams.tickParams.forEach((t) => {
				if (t.aa == 0.75 || t.aa == 0.5) {
					t.text = "_tick_speed_";
					t.textSize = 0.4
				}
			});
		}
		// draw
		sight.add(templateComp.leadingReticleArrowType(leadingParams));

	} else if (
		leadingDivisionsType === "line" ||
		leadingDivisionsType === "values_only"
	) {
		// Line type or Numbers only
		// Line elements
		sight.add(templateComp.leadingReticleLineType({
			assumedMoveSpeed: assumedMoveSpeed,
			shellSpeed: shellSpeed,

			horiLineAARange: leadingDivisionsType === "line" ?
				[1, (useLongerLeadLine ? 0.5 : 0.75)] :
				null,
			horiLineRepeated: false,

			tickParams: [
				{
					aa: 1, type: "text", text: "_tick_speed_",
					textSize: 0.5, textYPos: -0.05,
					horiLineBreakWidth: useWiderLeadLineBreak ? 1.4 : 1.2
				},
				{
					aa: 0.75, type: "text",
					text: leadingDivisionsDrawSpeed ? "_tick_speed_" : "3",
					textSize: 0.42, textYPos: -0.035,
					horiLineBreakWidth: (useWiderLeadLineBreak ? 0.7 : 0.6) +
						(leadingDivisionsDrawSpeed ? 0.45 : 0),
				},
				{
					aa: 0.5, type: "text",
					text: leadingDivisionsDrawSpeed ? "_tick_speed_" : "2",
					textSize: 0.42, textYPos: -0.035,
					horiLineBreakWidth: (useWiderLeadLineBreak ? 0.7 : 0.6) +
						(leadingDivisionsDrawSpeed ? 0.45 : 0),
				},
				// {
				// 	aa: 0.25, type: "line",
				// 	lineTickXOffsets: [0], lineTickYLen: 0.095
				// },
				//
				// 1/4 AA is drawn with circle manually to make it thinner
			]
		}));
		// 1/4 AA
		sight.add(new Circle({
			segment: [87, 93], diameter: getLdn(0.25) * 2, size: 2
		}).withMirroredSeg("x"));
	}


	let leadingPromptParams = {
		assumedMoveSpeedParams: { value: assumedMoveSpeed, pos: [0, 0] },
		shellSpeedParams: { value: shellSpeed, pos: [0, 0] },
	};
	if (drawPromptCross) {
		leadingPromptParams.formatType = "full_with_dash";
		leadingPromptParams.assumedMoveSpeedParams.pos = [90 * displayRatioHoriMult, -1.4];
		leadingPromptParams.shellSpeedParams.pos = [90 * displayRatioHoriMult, 1];
		leadingPromptParams.textAlign = "right";
		leadingPromptParams.useThousandth = true;
		leadingPromptParams.textSize = 0.9;

	} else {
		leadingPromptParams.formatType = "values_only";
		leadingPromptParams.assumedMoveSpeedParams.pos = [0.9708 * displayRatioHoriMult, -0.011];
		leadingPromptParams.shellSpeedParams.pos = [0.9708 * displayRatioHoriMult, 0.0075];
		leadingPromptParams.textAlign = "left";
		leadingPromptParams.useThousandth = false;
		leadingPromptParams.textSize = 0.8;
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
