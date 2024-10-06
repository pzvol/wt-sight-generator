import base from "./sight_bases/base_aa_lc_z2z4.js";

base.sightObj.matchVehicle("germ_flakpanzer_IV_Wirbelwind");
base.init({
	showCenteralCircle: true,
	shellSpeed: 900 * 3.6,  // m/s * 3.6
	assumeTgtSpeedMain: 400, // km/h
	assumeTgtSpeedSubRange: [300, 450]
});
base.sightObj.printCode();
