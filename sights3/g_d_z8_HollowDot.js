import Sight from "../_lib2/sight_main.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";

import base from "./g_d_z8.js";
let sight = base.sightObj;


//// VEHICLE TYPES ////
sight.components.matchVehicleClasses.clear();
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"ussr_bmp_2",
]);


//// ADDITIONAL ELEMENTS (IF ANY) ////
sight.remove(sight.collections["sightCenter"]);
sight.remove(sight.collections["gunCenter"]);

sight.add(new Circle({diameter: 0.6, size: 2}), "sightCenter");
sight.add([
	new Line({ from: [-0.5, 0], to: [-0.3, 0], move: true }).withMirrored("x"),
	new Line({ from: [0, -0.5], to: [0, -0.3], move: true }),
], "gunCenter");




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
