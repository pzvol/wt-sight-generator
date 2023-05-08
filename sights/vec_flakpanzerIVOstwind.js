// SCRIPT_COMPILE_TO=germ_flakpanzer_IV_Ostwind

import * as comp from "../_lib/sight_lib.js";
import * as pd from "../_lib/sight_predefined_info.js";


import code, * as sightBase from "./sight_bases/base_aa_lc_cmn_r.js"
let {
	sight,
	matchVehicleClasses,
	horizontalThousandths,
	shellDistances,
	circles,
	lines,
	texts
} = code.getComponents();


//// VEHICLE TYPES
// VEHICLE SPECIFIC PATH USED, SKIP THIS PART


//// SIGHT DESIGNS
sightBase.compileSightDesign({
	showCenteralCircle: true,
	shellSpeed: 914 * 3.6,  // m/s * 3.6
	assumeTgtSpeedMain: 350, // km/h
	assumeTgtSpeedSubRange: [300, 400]
})


//// OUTPUT
code.compileSightBlocks();
code.printCode();