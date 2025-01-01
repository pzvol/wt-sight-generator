import base from "./sight_bases/base_g_l_z8_line.js";
import Sight from "../_lib2/sight_main.js";

base.sightObj.matchVehicle([
	"ussr_t_62m1",
])

base.init({
	shellSpeed: 1600 * 3.6,  // m/s * 3.6
	assumedMoveSpeed: 35,    // km/h
	useHollowCenterDot: true,
	useShortHorizontalLine: true,
});
base.sightObj.printCode();
