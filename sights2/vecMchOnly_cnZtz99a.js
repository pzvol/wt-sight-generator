import base from "./sight_bases/base_g_l_z6z11.js";

base.sightObj.matchVehicle([
	"cn_ztz_99a",
	"cn_wz_1001"
])

base.init({
	shellSpeed: 1770 * 3.6,  // m/s * 3.6
	assumedMoveSpeed: 50,    // km/h
	horiCurve: [86, 94],
});
base.sightObj.printCode();
