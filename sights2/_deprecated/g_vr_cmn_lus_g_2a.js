import Sight from "../_lib2/sight_main.js";
import * as pd from "../_lib2/predefined.js";

import base from "./sight_bases/base_g_vr_cmn_g_2.js";


//// VEHICLE TYPES ////
base.sightObj.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_pzkpfw_VI_ausf_b_tiger_IIp",
	"germ_pzkpfw_VI_ausf_b_tiger_IIh"
]);


//// COMPILATION ////
base.init({
	binocularCalibrationTickIntervalPrompt: false,
	boldCrossingBias: 0.05
});


//// ADDITIONAL ELEMENTS (IF ANY) ////
base.sightObj.addShellDistance(pd.shellDists.getFullLoose([0.03, 0]));




//// OUTPUT ////
base.sightObj.printCode();
