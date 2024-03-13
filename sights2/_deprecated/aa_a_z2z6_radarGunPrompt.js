import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import base from "./aa_a_z2z6.js";
import * as rdr from "./sight_components/radar_prompt.js";


base.sightObj.addDescription(`
Radar prompt with regular AA gun range appended.
`.trim());


//// VEHICLE TYPES ////
base.sightObj.components.matchVehicleClasses.clear();
base.sightObj.matchVehicle(Sight.commonVehicleTypes.spaas).matchVehicle([
	"cn_pgz_04a",
	"ussr_zsu_23_4",
]);


//// ADDITIONAL ELEMENTS (IF ANY) ////
// Radar range prompt
base.sightObj.add(rdr.buildRadarPrompt({
	pos: [-75.5, -10],
	curveRadius: 17,
	pieDivisionCurveSizeMain: 1.5,
	pieDivisionCurveSizeSub: 1,
	textSizeLongRange: 0.32,
	textPosPaddingLongRange: [0, 1.2],
	textSizeShortRange: 0.3,
	textPosPaddingShortRange: [-0.7, -1.4],
	textSizeLegend: 0.25,
	textPosPaddingLegendLong: [0.7, -1.2],
	textPosPaddingLegendShort: [1.2, 0.5],
	weaponRanges: [
		{
			range: 3,
			curveDegreeOnLong: 18,
			curveDegreeOnShort: 15,
			curveSize: 0.8
		},
	]
}));



//// OUTPUT ////
export default { sightObj: base.sightObj };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { base.sightObj.printCode(); }
