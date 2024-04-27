// SCRIPT_COMPILE_TO=germ_schutzenpanzer_puma

import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";
import templateComp from "./sight_bases/template_components/all.js"

import ENV_SET from "./sight_bases/_env_settings.js";


let sight = new Sight();


//// SETTINGS ////
let assumedMoveSpd = 50;  // kph
let shellSpd = 1405 * 3.6;  // m/s

let getLeadingMil = (aa) => Toolbox.calcLeadingMil(
	shellSpd, assumedMoveSpd, aa
);

// leading divisions use apporiximate speed instead of denominators
let leadingDivisionsDrawSpeed = true;


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basicBuild.scale({ font: 0.24, line: 1.2 }),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([
		135, -0.02425
	]),
	pd.basicBuild.detectAllyPos([
		135, -0.052
	]),
	pd.basicBuild.gunDistanceValuePos([
		-0.187, 0.04
	]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0035, 0.002],
		[0.002, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 2000, shown: 20 },
	{ distance: 4000, shown: 40 },
]);


//// SIGHT DESIGNS ////
// Gun center
sight.add(new Line({
	from: [0.003, 0], to: [0.007, 0], move: true, thousandth: false
}).withMirrored("x"));
// bold
sight.add(new Line({
	from: [0.003, 0.0004], to: [0.007, 0.0004], move: true, thousandth: false
}).withMirrored("xy"));
sight.add(new Line({
	from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
}));  // center dot


// Center arrow
sight.add(templateComp.centerArrowFullscreen({
	overallYPadding: 0.02,
	boldYOffests: Toolbox.rangeIE(0, 0.10, 0.02),
	promptCurveRadius: getLeadingMil(0.25),
	promptCurveSize: 1.2,
}))
// vertical lower bold
for (let bias of Toolbox.range(0, 0.06, 0.03, {includeStart: false, includeEnd: true})) {
	sight.add(new Line({
		from: [bias, 450],
		to: [bias, getLeadingMil(0.75) / Math.tan(Toolbox.degToRad(40))]
	}).withMirrored("x"));
}


// Leading offset
let leadingParams = {
	assumedMoveSpeed: assumedMoveSpd,
	shellSpeed: shellSpd,

	tickYLenDefault: 0.4,
	textYPosDefault: 0.9 - 0.03,
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
			t.textSize = 0.45;
		}
	});
}
// draw
sight.add(templateComp.leadingReticleArrowType(leadingParams));


sight.add(templateComp.leadingParamText({
	assumedMoveSpeedParams: {
		value: assumedMoveSpd,
		pos: [323 * ENV_SET.DISPLAY_RATIO_MULT_HORI, -3.0]
	},
	shellSpeedParams: {
		value: shellSpd,
		pos: [323 * ENV_SET.DISPLAY_RATIO_MULT_HORI, 2.2]
	},
	formatType: "values_only",
	textSize: 2.8,
	textAlign: "left",
}));





//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
