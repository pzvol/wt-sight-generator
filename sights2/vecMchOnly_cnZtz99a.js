import base from "./sight_bases/base_g_l_z6z11.js";

base.sightObj.matchVehicle([
	"cn_ztz_99a",
	"cn_wz_1001",
	"cn_vt_4b"
]);

base.init({
	shellSpeed: 1770 * 3.6,  // m/s * 3.6
	assumedMoveSpeed: 50,    // km/h
	drawPromptCross: false,
	leadingDivisionsType: "values_only",
	leadingDivisionsDrawSpeed: true,
});
base.sightObj.printCode();
