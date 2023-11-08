// SCRIPT_COMPILE_TO=cn_wz_305

import base from "./sight_bases/base_aa_lc_z2z4.js";

// VEHICLE SPECIFIC PATH USED, SKIPPED TYPE MATCH DEF

base.init({
	showCenteralCircle: true,
	shellSpeed: 1012 * 3.6,  // m/s * 3.6
	assumeTgtSpeedMain: 550, // km/h
	assumeTgtSpeedSubRange: [500, 600],
});
base.sightObj.printCode();
