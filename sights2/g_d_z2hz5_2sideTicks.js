import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import base from "./sight_bases/base_g_d_z2hz5.js";


//// VEHICLE TYPES ////
base.sightObj.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_pzkpfw_V_ausf_a_panther",
	"germ_pzkpfw_V_ausf_f_panther",
	"germ_pzkpfw_V_ausf_g_panther",
	"germ_pzkpfw_VI_ausf_b_tiger_IIh",
	"germ_pzkpfw_VI_ausf_b_tiger_IIh_kwk46",
	"germ_pzkpfw_VI_ausf_b_tiger_IIh_sla",
	"germ_pzkpfw_VI_ausf_e_tiger",
]);


//// COMPILATION ////
base.init({
	useLooseShellDistTicks: true,
	useTwoSideShellDistTicks: true,
	crossLineBold: 0.12,
});




//// OUTPUT ////
base.sightObj.printCode();
