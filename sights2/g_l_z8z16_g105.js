import base from "./sight_bases/base_g_l_z8z16.js";
import Sight from "../_lib2/sight_main.js";

base.sightObj.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_radpanzer_90",
	"it_b1_centauro",
	"it_b1_centauro_romor",
	"it_of_40_mtca",
	"it_of_40_mk_2a",
])

base.init({
	shellSpeed: 1455 * 3.6,  // m/s * 3.6
	assumedMoveSpeed: 55,    // km/h
});
base.sightObj.printCode();
