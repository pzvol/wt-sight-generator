import base from "./sight_bases/base_aa_lc_z1hz6.js";

base.sightObj.matchVehicle("cn_zsd63_pg87");
base.init({
	showCenteralCircle: true,
	shellSpeed: 1050 * 3.6,  // m/s * 3.6
	assumeTgtSpeedMain: 400, // km/h
	assumeTgtSpeedSubRange: [350, 450],
});
base.sightObj.printCode();
