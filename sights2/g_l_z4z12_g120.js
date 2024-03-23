import base from "./sight_bases/base_g_l_z4z12.js";
import Sight from "../_lib2/sight_main.js";

base.sightObj.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
])

base.init({
	shellSpeed: 1650 * 3.6,  // m/s * 3.6
	assumedMoveSpeed: 55,    // km/h
	drawPromptCross: false,
	drawBinoCali: true,
	leadingDivisionsUseArrowType: true, useLowerGunDistTexts: true,
	leadingDivisionsDrawSpeed: true,
});

export default { sightObj: base.sightObj };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { base.sightObj.printCode(); }
