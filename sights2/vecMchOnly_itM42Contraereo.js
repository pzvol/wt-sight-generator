import base from "./sight_bases/base_aa_lc_z2z4.js";

base.sightObj.matchVehicle("it_m15_42_contraereo");
base.init({
	showCenteralCircle: true,
	shellSpeed: 830 * 3.6,  // m/s * 3.6
	assumeTgtSpeedMain: 400, // km/h
	assumeTgtSpeedSubRange: [300, 450],
	rgfdNumPosX: 220,
	gunDistValuePosX: -0.28
});
base.sightObj.printCode();
