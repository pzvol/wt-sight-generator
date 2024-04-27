// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import templateComp from "./template_components/all.js"
import * as pd from "../../_lib2/predefined.js";

import ENV_SET from "./_env_settings.js"


let sight = new Sight();


// Introduction comments
sight.addDescription(`
Sight for 8X including leading offsets for shooting while moving.
The version provides a reverse T layout.
`.trim());


let init = ({
	assumedMoveSpeed = 55,
	shellSpeed = 1650 * 3.6,
	useHollowCenterDot = false,
	useShortHorizontalLine = false,

	// Multiplier for adjusting elements for non-16:9 screen
	// for 16:9 screen, the value should be 1;
	// for 16:10 -> (16/10) / (16/9) = 0.9;
	displayRatioMultHori = ENV_SET.DISPLAY_RATIO_MULT_HORI,
} = {}) => {

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basic.scales.getHighZoomLargeFont(),
		pd.basic.colors.getGreenRed(),
		pd.basicBuild.rgfdPos([130 / displayRatioMultHori, -0.01425]),
		pd.basicBuild.detectAllyPos([130 / displayRatioMultHori, -0.036]),
		pd.basicBuild.gunDistanceValuePos([-0.165 * displayRatioMultHori, 0.0275]),
		pd.basicBuild.shellDistanceTickVars(
			[0, 0],
			[0.0070, 0.0025],
			[0.005, 0]
		),
		pd.basic.miscVars.getCommon(),
	));


	//// VEHICLE TYPES ////
	// NOT DEFINED IN BASE


	//// SHELL DISTANCES ////
	sight.addShellDistance([
		{ distance: 400 },
		{ distance: 2000 },
		{ distance: 4000, shown: 40 },
	]);


	//// SIGHT DESIGNS ////
	let getLdn = (speed, aa) => Toolbox.calcLeadingMil(shellSpeed, speed, aa);

	if (useHollowCenterDot) {
		// Gun center
		sight.add(new Line({ from: [0, -0.5], to: [0, -0.3], move: true }));
		sight.add(new Line({ from: [0.5, 0], to: [0.3, 0], move: true }).withMirrored("x"));
		// Sight center circle
		sight.add(new Circle({ diameter: 0.6, size: 2 }));
	} else {
		// Gun center
		sight.add(new Line({ from: [0, -0.0015], to: [0, 0.0015], move: true, thousandth: false }));
		sight.add(new Line({ from: [-0.0015, 0], to: [0.0015, 0], move: true, thousandth: false }));
		// Sight center circle
		sight.add(new Circle({ diameter: 0.2, size: 4 }));
		sight.add(new Circle({ diameter: 0.4, size: 2 }));
	}


	let leadingOffsetSpeedTickBreakWidth = 1.8;

	// Leading offsets
	sight.add(templateComp.leadingReticleLineType({
		assumedMoveSpeed: assumedMoveSpeed,
		shellSpeed: shellSpeed,
		tickParams: [
			{
				aa: 1, type: "text", text: "_tick_speed_",
				textSize: 0.5, textYPos: -0.1, textRepeated: true,
				horiLineBreakWidth: leadingOffsetSpeedTickBreakWidth
			},
			{
				aa: 0.75, type: "line",
				lineTickXOffsets: [-0.01, 0.01],
				lineTickYLen: 0.23,
				horiLineBreakWidth: 0.6,
			},
			// 2/2 AA are drawn separately later since we use a curve for it
			// 1/2 AA:
			// {
			// 	aa: 0.25, type: "line",
			// 	lineTickXOffsets: [-0.01, 0.01],
			// 	lineTickYLen: 0.1,
			// },
		],

		horiLineAARange: [1, 0.5],
		horiLineRepeated: true,
	}));
	// 2/2 AA curve
	sight.add(new Circle({
		segment: [81, 99], diameter: getLdn(assumedMoveSpeed, 0.5) * 2,
		size: 1.3
	}).withMirroredSeg("x"))


	// Center prompt crossline starting from edges
	sight.add(templateComp.promptCross({
		horiLines: [
			{
				to: getLdn(assumedMoveSpeed, 1) + leadingOffsetSpeedTickBreakWidth / 2,
				offsets: useShortHorizontalLine ? [] : [0, 0]
				// draws twice to bold
				// will not be drawn if using short horizontal line
			},
			{
				to: useShortHorizontalLine ? 50 * displayRatioMultHori : 33,
				offsets: [0, 0.05]
			},
			{ to: 66 * displayRatioMultHori, offsets: [0.1, 0.15] },
		],
		vertLines: [
			{ to: 6, offsets: [0] },
			{ to: 33, offsets: [0.05] },
			{ to: 40, offsets: [0.1, 0.15] },
		],
	}));
	// additional prompt dots for vertical upper line
	for (let yPos of [-5.5, -5]) {
		sight.add(new Circle({ pos: [0, yPos], diameter: 0.1, size: 1 }));
	}


	let leadingPromptParams = {
		assumedMoveSpeedParams: { value: assumedMoveSpeed, pos: [0, 0] },
		shellSpeedParams: { value: shellSpeed, pos: [0, 0] },
		textSize: 0.55
	};
	leadingPromptParams.formatType = "full_with_dash";
	leadingPromptParams.assumedMoveSpeedParams.pos = [67 * displayRatioMultHori, -1.2];
	leadingPromptParams.shellSpeedParams.pos = [67 * displayRatioMultHori, 1];
	leadingPromptParams.textAlign = "right";
	leadingPromptParams.useThousandth = true;
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