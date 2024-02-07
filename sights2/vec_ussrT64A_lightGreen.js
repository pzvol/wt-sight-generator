// SCRIPT_COMPILE_TO=ussr_t_64a_1971

import base from "./vec_ussrT64A.js"
import * as pd from "../_lib2/predefined.js";


let sight = base.sightObj;

sight.updateOrAddSettings(
	pd.basic.colors.getLightGreenRed()
);



//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
