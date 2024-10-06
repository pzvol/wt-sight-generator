import base from "./sight_bases/base_g_l_z3z12.js";
let sight = base.sightObj;


//// VEHICLE TYPES ////
sight.matchVehicle("ussr_t_90a");



//// COMPILATION ////
base.init({
	assumedMoveSpeed: 40,
	shellSpeed: 1700 * 3.6,  // 1700 3bm42; 1660 3bm60
	drawPromptCross: false,
	leadingDivisionsUseArrowType: true,
	leadingDivisionsDrawSpeed: false,
});



//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
