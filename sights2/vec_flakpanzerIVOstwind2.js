// SCRIPT_COMPILE_TO=germ_flakpanzer_IV_Ostwind_2

import base from "./sight_bases/base_aa_lc_cmn_r.js";

// VEHICLE SPECIFIC PATH USED, SKIPPED TYPE MATCH DEF

base.init({
	showCenteralCircle: true,
	shellSpeed: 914 * 3.6,  // m/s * 3.6
	assumeTgtSpeedMain: 400, // km/h
	assumeTgtSpeedSubRange: [350, 450]
});
base.sightObj.printCode();
