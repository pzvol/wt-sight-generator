import Sight from "../_lib2/sight_main.js";
import * as pd from "./helper/predefined.js";

import base from "./g_d_z8.js";
let sight = base.sightObj;


//// VEHICLE TYPES ////
sight.components.matchVehicleClasses.clear();
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_mkpz_m48a2ga2",
	"sw_strv_74",
	"sw_strv_81",
	"sw_strv_81_rb52",
	"sw_strv_101",
	"sw_strv_104",
	"sw_strv_105",

	"ussr_t_64a_1971",
]);


//// ADDITIONAL ELEMENTS (IF ANY) ////
sight.components.shellDistances.clear();
sight.addShellDistance(pd.shellDistTicks.getFullLoose({
	useTwoSideTicks: true,
}));




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
