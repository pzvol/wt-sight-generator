import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";

import ENV_SET from "./helper/env_settings.js";
import * as pd from "./helper/predefined.js";
import * as calc from "./helper/calculators.js";
import comp from "./components/all.js";

import rgfd from "./extra_modules/rangefinder.js"
import binoCali from "./extra_modules/binocular_calibration_2.js"


import base from "./bundles/bundle_g_l_z3hz8.js";
let sight = base.sightObj;
let parts = base.parts;
// let horiRatioMult = new calc.HoriRatioMultCalculator(
// 	16 / 9, ENV_SET.DISPLAY_RATIO_NUM
// ).getMult();
// let distMil = new calc.DistMilCalculator(ENV_SET.DEFAULT_ASSUMED_TARGET_WIDTH);


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"ussr_t_55_am",
	"ussr_t_55_amd_1",
]);


//// COMBINE SELECTIVE PARTS ////
sight.add(parts.sightAndGunCenter.hollowDot);
sight.add(parts.createLeadingReticle(
	35,          // km/h
	1430 * 3.6,  // m/s * 3.6  (3BM25)
));
sight.add(parts.binoCali.twoTick);
parts.shellDistPatterns.applySimpleSided();


//// ADDITIONAL ELEMENTS (IF ANY) ////
// Missile drop indication
// 100m
sight.add(new Circle({pos: [0, 2.5], size: 1, diameter: 1})).repeatLastAdd();
sight.add(new TextSnippet({
	text: "100",
	align: "center",
	pos: [4.0, 2.5 - 0.1], size: 0.5
}));
// 200m
sight.add(new Circle({pos: [0, 1.1], size: 1, diameter: 0.5})).repeatLastAdd();
sight.add(new TextSnippet({
	text: "200",
	align: "center",
	pos: [4.5, 1.1 - 0.1], size: 0.45
}));





//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
