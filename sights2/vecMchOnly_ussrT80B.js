import base from "./sight_bases/base_g_l_z4z9.js";
let sight = base.sightObj;


//// VEHICLE TYPES ////
sight.matchVehicle([
	"ussr_t_80b",
]);


//// COMPILATION ////
base.init({
	assumedMoveSpeed: 45,
	shellSpeed: 1700 * 3.6,
	drawPromptCross: false,
	centerPromptCurveAA: 0.75,
});



//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
