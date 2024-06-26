import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import base from "./sight_bases/base_g_d_z5.js";


//// VEHICLE TYPES ////
base.sightObj.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"ussr_t_54_1947",
	"ussr_t_54_1949",
]);


//// COMPILATION ////
base.init({
	useLooseShellDistTicks: true,
	useTwoSideShellDistTicks: false,
	useTwoTickBinocularRef: true,
	crossLineBold: 0.1,
});




//// OUTPUT ////
base.sightObj.printCode();
