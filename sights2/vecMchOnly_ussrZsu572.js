import base from "./sight_bases/base_aa_lc_z2z4.js";

// VEHICLE SPECIFIC PATH USED, SKIPPED TYPE MATCH DEF
base.sightObj.matchVehicle("ussr_zsu_57_2");
base.init({
	showCenteralCircle: true,
	shellSpeed: 1000 * 3.6,  // m/s * 3.6
	assumeTgtSpeedMain: 500, // km/h
	assumeTgtSpeedSubRange: [400, 550],
});
base.sightObj.printCode();
