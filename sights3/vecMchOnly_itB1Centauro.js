import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";

import ENV_SET from "./helper/env_settings.js";
import * as pd from "./helper/predefined.js";
import * as calc from "./helper/calculators.js";
import comp from "./components/all.js";

import rgfd from "./extra_modules/rangefinder.js"
import binoCali from "./extra_modules/binocular_calibration_2.js"
import turretAngleLegend from "./extra_modules/turret_angle_legend.js";

let sight = new Sight();
let horiRatioMult = new calc.HoriRatioMultCalculator(
	16 / 9, ENV_SET.DISPLAY_RATIO_NUM
).getMult();
let distMil = new calc.DistMilCalculator(ENV_SET.DEFAULT_ASSUMED_TARGET_WIDTH);



let shellSpeed = 1455 * 3.6;  // m/s * 3.6
let assumedMoveSpeed = 55;

// Use arrows for leading ticks
let leadingDivisionsUseArrowType = true;
// leading divisions use apporiximate speed instead of denominators;
// for arrow type ticks, denominators will be hidden instead
let leadingDivisionsDrawSpeed = true;


//// BASIC SETTINGS ////
sight.addSettings(pd.concatSettings(
	pd.sScale.getHighZoom(),
	pd.sColor.getGreenRed(),
	pd.sRgfd.build([
		110 / horiRatioMult,
		leadingDivisionsUseArrowType ? -0.03925 : -0.01925
	]),
	pd.sDetectAlly.build([
		110 / horiRatioMult,
		leadingDivisionsUseArrowType ? -0.06 : -0.04
	]),
	pd.sGunDistValue.build([
		(leadingDivisionsUseArrowType ? -0.16 : -0.175) * horiRatioMult,
		leadingDivisionsUseArrowType ? 0.053 : 0.03
	]),
	pd.sShellDistTick.build(
		// [-0.0050, -0.0050],
		[0, 0],
		[0, 0.0005],
		[0.193, 0]
	),
	pd.sMisc.getCommon(),
));


//// VEHICLE TYPES ////
sight.matchVehicle([
	"it_b1_centauro",
	"it_b1_centauro_romor",
]);


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{
		distance: 2000, shown: 0, shownPos: [
			0.01 - (1 - horiRatioMult) * 0.02, 0.0065
		]
	},
	{
		distance: 4000, shown: 0, shownPos: [
			0.01 - (1 - horiRatioMult) * 0.02, 0.0065
		]
	},
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
sight.add(comp.centerArrowFullscreen({
	...comp.centerArrowFullscreen.presetPartial["z8z16"],
	promptCurveRadius: getLdn(assumedMoveSpeed, 0.4),
}));
// vertical lower bold
sight.add(new Line({
	from: [0.03, 450],
	to: [0.03, getLdn(assumedMoveSpeed, 0.4)]
}).withMirrored("x"));


// Binocular reference
// let binoCaliEles = binoCali.getBinoCaliSimplified({
// 	pos: [0, 13],
// 	drawCenterCross: false,
// 	horiLineType: "broken",
// 	binoMainTickHeight: 0.8,
// 	binoSubTickPer: 1,
// 	binoHalfTickLength: 0.3,
//
// 	binoTextSizeMain: 0.6,
// 	binoTextYMain: 0.55,
// 	binoTextSizeSub: 0.42,
// 	binoTextYSub: 0.4,
//
// 	distTextY: -0.52,
// });
// sight.add(binoCaliEles);
// sight.add(binoCaliEles.filter((ele) => (ele instanceof Line)));


// Leading offsets
if (leadingDivisionsUseArrowType) {
	// Arrow type
	let leadingParams = {
		assumedMoveSpeed: assumedMoveSpeed,
		shellSpeed: shellSpeed,

		textYPosDefault: 0.9 - 0.03,
		textSizeDefault: 0.55,
		lineTickXOffsetsDefault: [-0.03, -0.02, 0.02, 0.03],

		tickParams: [
			{
				type: "arrow", aa: 1, yLen: 0.4,
				text: "_tick_speed_", textRepeated: true
			},
			{ type: "line", aa: 0.75, yLen: 0.25 },
			{ type: "arrow", aa: 0.5, yLen: 0.4, },
			{ type: "line", aa: 0.25, yLen: 0.25 },
		],
	};
	if (leadingDivisionsDrawSpeed) {
		leadingParams.tickParams.forEach((t) => {
			if (t.aa == 0.75 || t.aa == 0.5) {
				t.text = "_tick_speed_";
				t.textSize = 0.5;
			}
		});
	}
	// draw
	let leadingElements = comp.leadingReticleArrowType(leadingParams);
	sight.add(leadingElements);
	// sight.add(leadingElements.filter((v) => (v instanceof TextSnippet)));

} else {
	// Line type
	sight.add(comp.leadingReticleLineType({
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


// // Leading offset prompt text
// let leadingPromptParams = {
// 	assumedMoveSpeedParams: { value: assumedMoveSpeed, pos: [0, 0] },
// 	shellSpeedParams: { value: shellSpeed, pos: [0, 0] },
// 	textSize: 0.9
// };
// // leadingPromptParams.formatType = "full_with_space";
// // leadingPromptParams.assumedMoveSpeedParams.pos = [0.818 * horiRatioMult, -0.0098];
// // leadingPromptParams.shellSpeedParams.pos = [0.818 * horiRatioMult, 0.0075];
// // leadingPromptParams.textAlign = "right"
// // leadingPromptParams.useThousandth = false;
// // Alternatively, values only:
// leadingPromptParams.formatType = "values_only";
// leadingPromptParams.assumedMoveSpeedParams.pos = [0.972 * horiRatioMult, -0.0098];
// leadingPromptParams.shellSpeedParams.pos = [0.972 * horiRatioMult, 0.0075];
// leadingPromptParams.textAlign = "left";
// leadingPromptParams.useThousandth = false;
// sight.add(comp.leadingParamText(leadingPromptParams));


// Angle indicator
sight.add(turretAngleLegend.getTurretAngleLegend({
	pos: [18.94, 14.2],
	turretCircleDiameter: 2.15,
	textSizeMain: 0.55,
	textSizeSub: 0.4,
	circleSize: 2.2,
	showSideIndicator: false,
}));
sight.add(turretAngleLegend.getTurretAngleLegend({
	pos: [57.14 * 0.496, 42.76 * 0.496],
	turretCircleDiameter: 6.45 * 0.496,
	textSizeMain: 1.65 * 0.496,
	textSizeSub: 1.2 * 0.496,
	circleSize: 6.05 * 0.496,
	showSideIndicator: false,
	shellSpeedShown: shellSpeed / 3.6
}));



//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
