import base from "./sight_bases/base_g_l_z6z11.js";

base.sightObj.matchVehicle([
	"cn_ztz_99",
	"cn_ztz_99_w"
])

base.init({
	shellSpeed: 1770 * 3.6,  // m/s * 3.6
	assumedMoveSpeed: 45,    // km/h
	drawPromptCross: false,
	leadingDivisionsType: "line",
	useLongerLeadLine: true,
	useWiderLeadLineBreak: true,
});
base.sightObj.printCode();
