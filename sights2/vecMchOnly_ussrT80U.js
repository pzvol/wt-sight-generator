import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import base from "./sight_bases/base_g_l_z3z12.js";
let sight = base.sightObj;


//// VEHICLE TYPES ////
sight.matchVehicle([
	"sw_t_80u",
	"ussr_t_80u",
	"ussr_t_80um2",
	"ussr_t_80uk",
])


//// COMPILATION ////
base.init({
	assumedMoveSpeed: 50,
	shellSpeed: 1700 * 3.6,
	leadingDivisionsDrawSpeed: true,
});



//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
