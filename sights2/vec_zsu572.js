// SCRIPT_COMPILE_TO=ussr_zsu_57_2

import base from "./sight_bases/base_aa_lc_cmn_r.js";

// VEHICLE SPECIFIC PATH USED, SKIPPED TYPE MATCH DEF

base.init({
	showCenteralCircle: true,
	shellSpeed: 1000 * 3.6,  // m/s * 3.6
	assumeTgtSpeedMain: 500, // km/h
	assumeTgtSpeedSubRange: [400, 550],
});
base.sightObj.printCode();
