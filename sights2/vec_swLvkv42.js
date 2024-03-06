// SCRIPT_COMPILE_TO=sw_lvkv_42

import base from "./sight_bases/base_aa_lc_hizoom_hf_r.js";


//// COMPILATION ////
base.init({
	showCenteralCircle: true,
	shellSpeed: 850 * 3.6,  // m/s * 3.6
	assumeTgtSpeedMain: 350, // km/h
	assumeTgtSpeedSubRange: [300, 400]
});




//// OUTPUT ////
base.sightObj.printCode();
