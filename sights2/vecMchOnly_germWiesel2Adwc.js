import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import * as rdr from "./sight_components/radar_prompt.js";


let sight = new Sight();
sight.matchVehicle("germ_wiesel_2_adwc");


// Introduction comment
sight.addDescription(`
Sight for Ozelot (germ_wiesel_2_adwc) SPAA (carrying FIM-92K)
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basicBuild.scale({ font: 0.9, line: 1.5 }),
	pd.basic.colors.getRedLightGreen(),
	pd.basicBuild.rgfdPos([105, -0.02]),
	pd.basicBuild.detectAllyPos([105, -0.045]),
	pd.basicBuild.gunDistanceValuePos([-0.18, 0.03]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0070, 0.0025],
		[0.005, 0]
	),
	pd.basic.miscVars.getCommon()
));



//// SIGHT DESIGNS ////
// Gun center
sight.add(new Line({ from: [1, 0], to: [1.2, 0], move: true }).withMirrored("x"));

// Sight center
sight.add([
	new Circle({ segment: [70, 110], diameter: 1.6, size: 1 }).withMirroredSeg("x"),
	new Circle({ segment: [160, 200], diameter: 1.6, size: 1 }).withMirroredSeg("y"),
]);

// Sight center cross
sight.add([
	new Line({ from: [33, 0], to: [16.5, 0] }).withMirrored("x"),
	new Line({ from: [0, 33], to: [0, 16.5] }).withMirrored("y"),
])
for (let padding of [-0.1, 0, 0.1]) {
	sight.add(new Line({ from: [padding, -80], to: [padding, -450] }));
}


// // Radar range prompt
// sight.add(rdr.buildRadarPrompt({
// 	radarLongRange: 15,
// 	radarShortRange: 8,

// 	pos: [-75.5, -10],
// 	curveRadius: 17,
// 	pieDivisionCurveSizeMain: 1.5,
// 	pieDivisionCurveSizeSub: 1,
// 	textSizeLongRange: 0.3,
// 	textPosPaddingLongRange: [0, 1.2],
// 	textSizeShortRange: 0.32,
// 	textPosPaddingShortRange: [-0.7, -1.4],
// 	textSizeLegend: 0.25,
// 	textPosPaddingLegendLong: [0.7, -1.2],
// 	textPosPaddingLegendShort: [1.2, 0.5],
// 	weaponRanges: [
// 		{
// 			range: 5.87,
// 			curveDegreeOnLong: 13,
// 			curveDegreeOnShort: 10,
// 			curveSize: 1.2
// 		},
// 		{
// 			range: 3,
// 			curveDegreeOnLong: 12,
// 			curveDegreeOnShort: 8,
// 			curveSize: 0.6
// 		},
// 	]
// }));




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }







