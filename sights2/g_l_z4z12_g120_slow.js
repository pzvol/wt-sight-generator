import base from "./sight_bases/base_g_l_z4z12.js";
import Sight from "../_lib2/sight_main.js";

base.sightObj.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_leopard_2a4",
	"germ_leopard_2a5",
	"germ_leopard_2a5_pso",
	"germ_leopard_2a6",
	"germ_leopard_2a7v",
	"germ_leopard_2pl",
])

base.init({
	shellSpeed: 1650 * 3.6,  // m/s * 3.6
	assumedMoveSpeed: 45,    // km/h
	drawPromptCross: false,
	drawBinoCali: true,
	leadingDivisionsUseArrowType: true,
	turretLimitAngles: [-(180 - 75), (180 - 75)],
});

export default { sightObj: base.sightObj };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { base.sightObj.printCode(); }
