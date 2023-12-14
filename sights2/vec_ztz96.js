// SCRIPT_COMPILE_TO=cn_ztz_96

import base from "./sight_bases/base_g_l_z8_line.js";
import Sight from "../_lib2/sight_main.js";


base.init({
	shellSpeed: 1730 * 3.6,  // m/s * 3.6
	assumedMoveSpeed: 40,    // km/h
});

export default { sightObj: base.sightObj };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { base.sightObj.printCode(); }
