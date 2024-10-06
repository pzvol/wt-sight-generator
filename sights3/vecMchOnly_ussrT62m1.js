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
	"ussr_t_62m1",
]);


//// COMBINE SELECTIVE PARTS ////
sight.add(parts.sightAndGunCenter.hollowDot);
sight.add(parts.createLeadingReticle(
	35,          // km/h
	1600 * 3.6,  // m/s * 3.6
));
sight.add(parts.binoCali.twoTick);
parts.shellDistPatterns.applySimpleCentered();


//// ADDITIONAL ELEMENTS (IF ANY) ////


//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
