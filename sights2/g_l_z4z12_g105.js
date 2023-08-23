import base from "./sight_bases/base_g_l_z4z12.js";
import Sight from "../_lib2/sight_main.js";

base.sightObj.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_leopard_2av",
	"germ_thyssen_henschel_tam_2c",
]);

base.init({
	shellSpeed: 1455 * 3.6,  // m/s * 3.6
	assumedMoveSpeed: 55,    // km/h
});
base.sightObj.printCode();
