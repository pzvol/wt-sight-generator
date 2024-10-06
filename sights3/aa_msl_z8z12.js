import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";

import ENV_SET from "./helper/env_settings.js";
import * as pd from "./helper/predefined.js";
import * as calc from "./helper/calculators.js";
import comp from "./components/all.js";

import rgfd from "./extra_modules/rangefinder.js"
import binoCali from "./extra_modules/binocular_calibration_2.js"


let sight = new Sight();
let horiRatioMult = new calc.HoriRatioMultCalculator(
	16 / 9, ENV_SET.DISPLAY_RATIO_NUM
).getMult();
// let distMil = new calc.DistMilCalculator(ENV_SET.DEFAULT_ASSUMED_TARGET_WIDTH);


// Introduction comment
sight.addDescription(`
Generic sight for missile SPAAs with 8X~12X optics
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatSettings(
	pd.sScale.getHighZoom(),
	pd.sColor.getRedLightGreen(),
	pd.sRgfd.build([125 / horiRatioMult, -0.01725]),
	pd.sDetectAlly.build([125 / horiRatioMult, -0.045]),
	pd.sGunDistValue.build([-0.13 / horiRatioMult, 0.035]),
	pd.sShellDistTick.getCentralTickCommon({
		sub: [0.007, 0.002],
		horiPosOffset: -(1 - horiRatioMult) * 0.015
	}),
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.spaas).matchVehicle([
	"germ_flarakpz_1",
	"germ_flarakrad",
]);


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 200 },
	{ distance: 3600 },
]);


//// SIGHT DESIGNS ////
// Sight center segments (tiny cross)
for (let direction of [90, 180, 270, 360]) {
	let curveHalfWidth = 15;
	sight.add(new Circle({
		segment: [direction - curveHalfWidth, direction + curveHalfWidth],
		diameter: 1.2,
		size: 3.2,
	}));
}

let crossMil = { from: 7, to: 14 };
for (let offset of Toolbox.rangeIE(0, 0.05, 0.05)) {
	// cross
	sight.add([
		new Line({
			from: [crossMil.from, offset], to: [crossMil.to, offset]
		}).withMirrored("xy"),
		new Line({
			from: [offset, crossMil.from], to: [offset, crossMil.to]
		}).withMirrored("xy"),
	]);

	// 0m indication
	sight.add(new Line({
		from: [crossMil.to + 0.3, offset],
		to: [crossMil.to + 0.3 + 0.1, offset],
		move: true
	}).withMirrored("xy"));
}

for (let offset of Toolbox.rangeIE(0, 0.02, 0.02)) {
	// Vertical upper line
	sight.add(new Line({
		from: [offset, -32], to: [offset, -450]
	}).withMirrored("x"));
}






//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
