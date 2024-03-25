// SCRIPT_COMPILE_TO=cn_zbd_04a

import Toolbox from "../../_lib2/sight_toolbox.js";
import * as pd from "../../_lib2/predefined.js";

import base from "./vec_cnZbd04A.js";
let sight = base.sightObj;



//// ADDITIONAL MODIFICATIONS ////
// Manual length adjustment for main and sub ticks having same length set
let shellDistTickAdj = 0.0018;

// Update shell dist settings
sight.updateOrAddSettings(
	pd.basicBuild.shellDistanceTickVars(
		[-0.01 + shellDistTickAdj, shellDistTickAdj],
		[0.0005, 0],
		[0.2 + shellDistTickAdj, 0]
	),
)


// Re-define shell distances
sight.components.shellDistances.clear();
for (let d of Toolbox.range(0, 4000, 50, {includeStart: false, includeEnd: true})) {
	// main ticks
	if ([400, 800, 2000, 4000].find(v => v === d)) {
		sight.addShellDistance({
			distance: d, shown: d/100,
			shownPos: [(d < 1000 ? 10 : -0.01), -0.0009]
		});

	// sub ticks
	} else if (d > 400) {
		sight.addShellDistance({ distance: d });
	}
}



//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
