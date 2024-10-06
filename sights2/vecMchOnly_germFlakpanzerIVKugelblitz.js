import base from "./sight_bases/base_aa_lc_z2z4.js";

base.sightObj.matchVehicle("germ_flakpanzer_IV_Kugelblitz");
base.init({
	showCenteralCircle: true,
	shellSpeed: 920 * 3.6,  // m/s * 3.6
	assumeTgtSpeedMain: 550, // km/h
	assumeTgtSpeedSubRange: [500, 600],
	rgfdNumPosX: 120,
	gunDistValuePosX: -0.2
});
base.sightObj.printCode();
