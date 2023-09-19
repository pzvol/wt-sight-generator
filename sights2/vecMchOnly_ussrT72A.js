import base from "./sight_bases/base_g_l_z8.js";
import Sight from "../_lib2/sight_main.js";

base.sightObj.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_kpz_t72m1",
	"sw_t_72m1",
	"ussr_t_72a",
]);

base.init({
	shellSpeed: 1760 * 3.6,  // m/s * 3.6 (3BM22)
	assumedMoveSpeed: 40,    // km/h

	promptCurveAA: 0.75,
});



//// OUTPUT ////
export default { sightObj: base.sightObj };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { base.sightObj.printCode(); }
