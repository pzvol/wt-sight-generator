import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import base from "./aa_a_z1hz6.js";
import * as rdr from "./sight_components/radar_prompt.js";


base.sightObj.addDescription(`
Radar prompt with regular AA gun range appended.
`.trim());


//// VEHICLE TYPES ////
base.sightObj.components.matchVehicleClasses.clear();  // Clear original classes
base.sightObj.matchVehicle(Sight.commonVehicleTypes.spaas).matchVehicle([
	"cn_pgz_09",
	"germ_flakpz_1a2_Gepard",
	"germ_flakpz_I_Gepard",
]);


//// ADDITIONAL ELEMENTS (IF ANY) ////
// Radar range prompt
base.sightObj.add(rdr.buildRadarPrompt({
	pos: [-75.5, -12],
	curveRadius: 17,
	pieDivisionCurveSizeMain: 2,
	pieDivisionCurveSizeSub: 1.5,
	textSizeLongRange: 0.41,
	textPosPaddingLongRange: [0, 1.2],
	textSizeShortRange: 0.38,
	textPosPaddingShortRange: [-0.7, -1.4],
	textSizeLegend: 0.29,
	textPosPaddingLegendLong: [0.7, -1.2],
	textPosPaddingLegendShort: [1.2, 0.5],
	weaponRanges: [
		{
			range: 3,
			curveDegreeOnLong: 18,
			curveDegreeOnShort: 15,
			curveSize: 1
		},
	]
}));



//// OUTPUT ////
export default { sightObj: base.sightObj };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { base.sightObj.printCode(); }
