import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import base from "./sight_bases/base_g_d_z2z4.js";


//// VEHICLE TYPES ////
base.sightObj.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_pzkpfw_V_ausf_d_panther",
	"germ_vk_3002m",

	"germ_pzkpfw_VI_ausf_h1_tiger",
	"germ_pzkpfw_VI_ausf_h1_tiger_animal_version",
	"germ_pzkpfw_VI_tiger_P",
	"germ_panzerbefelhswagen_VI_P",

	"germ_pzkpfw_VI_ausf_b_tiger_IIp",
]);


//// COMPILATION ////
base.init({
	useLooseShellDistTicks: true,
	useTwoSideShellDistTicks: true,
	showCompleteRangefinder: true,
	showBinocularReference: true,
	showTargetAngleLegend: false,
	crossLineBold: 0.1,
});




//// OUTPUT ////
base.sightObj.printCode();
