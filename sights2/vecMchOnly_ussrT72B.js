import base from "./sight_bases/base_g_l_z8.js";
import Sight from "../_lib2/sight_main.js";

base.sightObj.matchVehicle([
	"ussr_t_72b",
	"ussr_t_72b_1989",
]);

base.init({
	shellSpeed: 1700 * 3.6,  // m/s * 3.6 (3BM22)
	assumedMoveSpeed: 35,    // km/h
	promptCurveAA: 0.75,
	drawPromptCross: false,
	useNarrowCentralElements: true,
	leadingDivisionsUseArrowType: true
});



//// OUTPUT ////
export default { sightObj: base.sightObj };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { base.sightObj.printCode(); }
