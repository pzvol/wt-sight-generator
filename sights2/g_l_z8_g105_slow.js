import base from "./sight_bases/base_g_l_z8_line.js";
import Sight from "../_lib2/sight_main.js";

base.sightObj.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"cn_ztz_88a",
	"cn_ztz_88b",
])

base.init({
	shellSpeed: 1455 * 3.6,  // m/s * 3.6
	assumedMoveSpeed: 40,    // km/h
	useHollowCenterDot: false
});
base.sightObj.printCode();
