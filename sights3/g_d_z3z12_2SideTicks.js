import * as pd from "./helper/predefined.js";

import base from "./g_d_z3z12.js";
let sight = base.sightObj;


//// VEHICLE TYPES ////
// Same as base


//// ADDITIONAL ELEMENTS (IF ANY) ////
// Change to double-side ticks
sight.components.shellDistances.clear();
sight.components.shellDistances.add(pd.shellDistTicks.getFullLoose({
	useTwoSideTicks: true,
}));




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
