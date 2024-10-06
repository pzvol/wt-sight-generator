import base from "./sight_bases/base_aa_lc_z2z6.js";

base.sightObj.matchVehicle("germ_wiesel_1_mk20");
base.init({
	showCenteralCircle: true,
	shellSpeed: 1100 * 3.6,  // m/s * 3.6
	assumeTgtSpeedMain: 550, // km/h
	assumeTgtSpeedSubRange: [500, 600],
});
base.sightObj.printCode();
