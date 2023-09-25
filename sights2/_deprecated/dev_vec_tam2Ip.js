// SCRIPT_COMPILE_TO=germ_thyssen_henschel_tam_2ip

import { BlkBlock, BlkVariable } from "../_lib2/sight_code_basis.js";
import { ShellDistancesBlock } from "../_lib2/sight_blocks.js";
import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import base from "./g_l_z8_g105.js";
let sight = base.sightObj;


// Not ideal... auto gened gun distance ticks are not precise when intervals are high :(


sight.components.shellDistances.clear();
sight.components.matchVehicleClasses.clear();


//// ADDITIONAL ELEMENTS (IF ANY) ////
// Experimental radial corrections
let ballistics = new BlkBlock("ballistics", []);
sight.addExtra(ballistics);
Toolbox.repeat(2, ()=> {
	sight.add(new TextSnippet({text: "APFSDS", align: "right", pos: [0.002, -0.1705], size: 0.65, thousandth: false}))

	ballistics.push(new BlkBlock("bullet", [
		new BlkVariable("bulletType", "apds_fs_long_tank"),
		new BlkVariable("speed", 1455),

		new BlkVariable("drawDistanceCorrection", true),
		new BlkVariable("distanceCorrectionPos", [0.05, -0.155]),

		new BlkVariable("drawAdditionalLines", false),
		new BlkVariable("crosshairDistHorSizeAdditional", [0, 0]),

		new BlkVariable("crosshairDistHorSizeMain", [0.014, 0]),
		new BlkVariable("crosshairHorVertSize", [0, 0]),
		new BlkVariable("distancePos", [0, 1]),

		new BlkVariable("textPos", [0.01, 0]),
		new BlkVariable("textShift", 0),
		new BlkVariable("textAlign", 0, "i"),

		new BlkVariable("drawUpward", false),
		new BlkVariable("radial", true),
		new BlkVariable("circleMode", false),
		new BlkVariable("radialRadius", [120, 1]),  // 1 for using thousandth
		new BlkVariable("radialAngle", -0.1),
		new BlkVariable("radialStretch", 6),

		new ShellDistancesBlock().add((() => {
			let ticks = [{ distance: 10 }];
			for (let dist of Toolbox.rangeIE(200, 4000, 200)) {
				if (dist % 400 == 0) {
					ticks.push({ distance: dist, shown: (dist / 100) });
				} else {
					ticks.push({ distance: dist });
				}
			}
			return ticks;
		})()),
	]));
});



//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
