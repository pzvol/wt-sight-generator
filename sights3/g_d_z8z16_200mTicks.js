import Sight from "../_lib2/sight_main.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "./helper/predefined.js";

import base from "./g_d_z8z16.js";
let sight = base.sightObj;


//// VEHICLE TYPES ////
sight.components.matchVehicleClasses.clear();
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"sw_pvkv_II",
	"sw_pvkv_m43_1946",
	"sw_pvkv_m43_1963",
]);


//// ADDITIONAL ELEMENTS (IF ANY) ////
// Change to 200m ticks
sight.components.shellDistances.clear();
sight.components.shellDistances.add(pd.shellDistTicks.getFull());
// Prompt
sight.add(new TextSnippet({
	text: "Dist 200m/ tk", align: "right", pos: [31, 0.5], size: 0.55
}));


//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
