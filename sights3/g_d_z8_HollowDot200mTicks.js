import Sight from "../_lib2/sight_main.js";
import * as pd from "./helper/predefined.js";

import base from "./g_d_z8_HollowDot.js";
let sight = base.sightObj;


//// VEHICLE TYPES ////
sight.components.matchVehicleClasses.clear();
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_bmp_1_ddr",
	"ussr_bmp_1",
]);


//// ADDITIONAL ELEMENTS (IF ANY) ////
sight.components.shellDistances.clear();
sight.addShellDistance(pd.shellDistTicks.getFull());



//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
