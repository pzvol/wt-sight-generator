import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import base from "./g_d_z4z12.js";
let sight = base.sightObj;


//// VEHICLE TYPES ////
// Same as base


//// ADDITIONAL ELEMENTS (IF ANY) ////
// Change to double-side ticks
sight.components.shellDistances.clear();
sight.components.shellDistances.add(
	pd.shellDists.getFullLoose(0.03)
);




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
