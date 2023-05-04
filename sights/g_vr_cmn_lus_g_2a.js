import * as comp from "../_lib/sight_lib.js";
import * as pd from "../_lib/sight_predefined_info.js";


// Read sight base
import code, * as sightBase from "./sight_bases/base_vr_cmn_g_2.js"
let {
	sight,
	matchVehicleClasses,
	horizontalThousandths,
	shellDistances,
	circles,
	lines,
	texts
} = code.getComponents();

// Run required initialization
sightBase.selectAdditionalParts({
	binocularCalibrationTickIntervalPrompt: true,
	boldCrossingBias: 0.05
});


//// VEHICLE TYPES
// Add specific vehicle matches
matchVehicleClasses.addInclude([
	"germ_pzkpfw_VI_ausf_b_tiger_IIp",
	"germ_pzkpfw_VI_ausf_b_tiger_IIh"
]);


//// SHELL DISTANCES
shellDistances.addMulti(pd.shellDistances.getFullLooseTwoSides({ rightOffset: 0.03 }));


//// SIGHT DESIGN ADDED


// OUTPUT
code.compileSightBlocks();
code.printCode();
