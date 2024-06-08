import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import base from "./sight_bases/base_g_d_z8z16.js";


//// VEHICLE TYPES ////
base.sightObj.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"sw_pvkv_II",
	"sw_pvkv_m43_1946",
	"sw_pvkv_m43_1963",
]);


//// COMPILATION ////
base.init({
	useLooseShellDistTicks: false,
	useTwoSideShellDistTicks: false
});




//// OUTPUT ////
base.sightObj.printCode();
