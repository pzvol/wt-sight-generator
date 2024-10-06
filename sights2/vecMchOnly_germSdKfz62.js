import base from "./sight_bases/base_aa_lc_z2z4.js";

base.sightObj.matchVehicle("germ_sdkfz_6_2_flak36");
base.init({
	showCenteralCircle: true,
	shellSpeed: 914 * 3.6,  // m/s * 3.6
	assumeTgtSpeedMain: 350, // km/h
	assumeTgtSpeedSubRange: [300, 400]
});
base.sightObj.printCode();
