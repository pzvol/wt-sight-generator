import base from "./sight_bases/base_aa_lc_z2z4.js";

base.sightObj.matchVehicle("ussr_btr_zd");
base.init({
	showCenteralCircle: true,
	shellSpeed: 980 * 3.6,  // m/s * 3.6
	assumeTgtSpeedMain: 400, // km/h
	assumeTgtSpeedSubRange: [350, 450],

	rgfdNumPosX: 190,
	gunDistValuePosX: -0.26
});
base.sightObj.printCode();
