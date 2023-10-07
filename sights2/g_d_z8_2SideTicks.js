import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

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
sight.addShellDistance(pd.shellDists.getFullLoose([0.0295, 0]));



//// OUTPUT ////
export default { sightObj: sight, taggedComponents: base.taggedComponents };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
