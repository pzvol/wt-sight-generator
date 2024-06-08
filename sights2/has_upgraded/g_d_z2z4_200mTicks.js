import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import base from "./sight_bases/base_g_d_z2z4.js";


//// VEHICLE TYPES ////
base.sightObj.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"it_lancia3ro_100",
]);


//// COMPILATION ////
base.init({
	useLooseShellDistTicks: false,
	useTwoSideShellDistTicks: false,
	showCompleteRangefinder: true,
	showBinocularReference: true,
	showTargetAngleLegend: false,
	crossLineBold: 0.1,
});




//// OUTPUT ////
base.sightObj.printCode();
