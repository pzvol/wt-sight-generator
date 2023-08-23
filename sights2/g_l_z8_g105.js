import base from "./sight_bases/base_g_l_z8.js";
import Sight from "../_lib2/sight_main.js";

base.sightObj.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_thyssen_henschel_tam",
	"germ_thyssen_henschel_tam_2ip",
])

base.init({
	shellSpeed: 1455 * 3.6,  // m/s * 3.6
	assumedMoveSpeed: 55,    // km/h
});
base.sightObj.printCode();
