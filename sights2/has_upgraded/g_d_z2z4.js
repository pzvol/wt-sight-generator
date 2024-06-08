import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import base from "./sight_bases/base_g_d_z2z4.js";


//// VEHICLE TYPES ////
base.sightObj.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_sdkfz_234_2",
	"germ_sdkfz_234_2_td",
	"germ_pzkpfw_38t_Marder_III",
	"germ_pzkpfw_38t_Marder_III_ausf_H",
	"germ_pzkpfw_IV_ausf_F2",
	"germ_pzkpfw_IV_ausf_G",
	"germ_pzkpfw_IV_ausf_H",
	"germ_pzkpfw_IV_ausf_J",
	"germ_panzerbefelhswagen_IV_ausf_J",
]);


//// COMPILATION ////
base.init({
	useLooseShellDistTicks: true,
	useTwoSideShellDistTicks: false,
	showCompleteRangefinder: true,
	showBinocularReference: true,
	showTargetAngleLegend: false,
	crossLineBold: 0.1,
});




//// OUTPUT ////
base.sightObj.printCode();
