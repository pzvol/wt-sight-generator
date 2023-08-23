import base from "./sight_bases/base_g_l_z4z12.js";
import Sight from "../_lib2/sight_main.js";

base.sightObj.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_leopard_2a4",
	"germ_leopard_2a5",
	"germ_leopard_2a6",
	"germ_leopard_2pl",
])

base.init({
	shellSpeed: 1650 * 3.6,  // m/s * 3.6
	assumedMoveSpeed: 55,    // km/h
});
base.sightObj.printCode();
