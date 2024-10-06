import base from "./sight_bases/base_aa_lc_z2z4.js";

base.sightObj.matchVehicle("it_oto_r3_t20_fa");
base.init({
	showCenteralCircle: true,
	shellSpeed: 1054 * 3.6,  // m/s * 3.6
	assumeTgtSpeedMain: 400, // km/h
	assumeTgtSpeedSubRange: [350, 450],
});
base.sightObj.printCode();
