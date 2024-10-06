import base from "./sight_bases/base_g_l_z8.js";

base.sightObj.matchVehicle("cn_ztz_96");
base.init({
	shellSpeed: 1730 * 3.6,  // m/s * 3.6
	assumedMoveSpeed: 35,    // km/h
	drawPromptCross: false,
	leadingDivisionsUseArrowType: true,
	useNarrowCentralElements: true,
});

export default { sightObj: base.sightObj };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { base.sightObj.printCode(); }
