import base from "./sight_bases/base_g_l_z6z11.js";

base.sightObj.matchVehicle([
	"cn_ztz_96a",
	"cn_ztz_96a_prot"
])

base.init({
	shellSpeed: 1730 * 3.6,  // m/s * 3.6
	assumedMoveSpeed: 35,    // km/h
	drawPromptCross: false,

	leadingDivisionsType: "arrow",
	// useLongerLeadLine: true,
	// useWiderLeadLineBreak: false,

	leadingDivisionsDrawSpeed: false,
});
base.sightObj.printCode();
