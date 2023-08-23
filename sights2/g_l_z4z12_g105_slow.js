import base from "./sight_bases/base_g_l_z4z12.js";
import Sight from "../_lib2/sight_main.js";

base.sightObj.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_leopard_1a5",
	"germ_leopard_a1a1_120",
	"germ_mkpz_super_m48",
	"it_leopard_1a5",
]);

base.init({
	shellSpeed: 1455 * 3.6,  // m/s * 3.6
	assumedMoveSpeed: 45,    // km/h
});
base.sightObj.printCode();
