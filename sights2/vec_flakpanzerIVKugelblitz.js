// SCRIPT_COMPILE_TO=germ_flakpanzer_IV_Kugelblitz

import base from "./sight_bases/base_aa_lc_z2z4.js";

// VEHICLE SPECIFIC PATH USED, SKIPPED TYPE MATCH DEF

base.init({
	showCenteralCircle: true,
	shellSpeed: 920 * 3.6,  // m/s * 3.6
	assumeTgtSpeedMain: 500, // km/h
	assumeTgtSpeedSubRange: [400, 550],
	rgfdNumPosX: 120,
	gunDistValuePosX: -0.2
});
base.sightObj.printCode();
