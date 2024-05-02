// SCRIPT_COMPILE_TO=cn_zsd63_pg87

import base from "./sight_bases/base_aa_lc_z1hz6.js";

// VEHICLE SPECIFIC PATH USED, SKIPPED TYPE MATCH DEF

base.init({
	showCenteralCircle: true,
	shellSpeed: 1050 * 3.6,  // m/s * 3.6
	assumeTgtSpeedMain: 400, // km/h
	assumeTgtSpeedSubRange: [350, 450],
});
base.sightObj.printCode();
