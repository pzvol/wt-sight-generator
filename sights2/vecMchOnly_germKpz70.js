import base from "./sight_bases/base_g_l_z8z16.js";


//// COMPILATION ////
base.sightObj.matchVehicle("germ_kpz_70");
base.init({
	assumedMoveSpeed: 55,
	shellSpeed: 1509 * 3.6  // HE: 754; APFSDS: 1509
});



//// OUTPUT ////
export default { sightObj: base.sightObj };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { base.sightObj.printCode(); }
