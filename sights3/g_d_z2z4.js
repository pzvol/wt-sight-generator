import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";

import ENV_SET from "./helper/env_settings.js";
import * as pd from "./helper/predefined.js";
import * as calc from "./helper/calculators.js";
import comp from "./components/all.js";

import rgfd from "./extra_modules/rangefinder.js"
import binoCali from "./extra_modules/binocular_calibration_2.js"


import base from "./bundles/bundle_g_d_z2z4.js";
let sight = base.sightObj;
let parts = base.parts;
// let horiRatioMult = new calc.HoriRatioMultCalculator(
// 	16 / 9, ENV_SET.DISPLAY_RATIO_NUM
// ).getMult();
// let distMil = new calc.DistMilCalculator(ENV_SET.DEFAULT_ASSUMED_TARGET_WIDTH);


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_sdkfz_234_2",
	"germ_sdkfz_234_2_td",
	"germ_pzkpfw_38t_Marder_III",
	"germ_pzkpfw_38t_Marder_III_ausf_H",
	"germ_pzkpfw_IV_ausf_F2",
	"germ_pzkpfw_IV_ausf_G",
	"germ_pzkpfw_IV_ausf_H",
	"germ_pzkpfw_IV_ausf_J",
	"germ_panzerbefelhswagen_IV_ausf_J",
]);


//// COMBINE SELECTIVE PARTS ////
base.init({
	shellDists: pd.shellDistTicks.getFullLoose({
		useTwoSideTicks: false,
	}),
});


//// ADDITIONAL ELEMENTS (IF ANY) ////
// sight.add(/*TODO*/);




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
