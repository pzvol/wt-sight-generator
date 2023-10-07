import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import base from "./g_d_z8.js";
let sight = base.sightObj;
let taggedComponents = base.taggedComponents;


//// VEHICLE TYPES ////
sight.components.matchVehicleClasses.clear();
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"ussr_bmp_2",
]);


//// ADDITIONAL ELEMENTS (IF ANY) ////
// Remove original sight and gun center
for (let compCollection of [taggedComponents.gunCenter, taggedComponents.sightCenter]) {
	for (let element of compCollection) {
		for (let tgtArr of [sight.lines.blockLines, sight.circles.blockLines]) {
			let eIndex = tgtArr.findIndex((ele) => (ele == element))
			if (eIndex > -1) { tgtArr.splice(eIndex, 1); }
		}
	}
}

// New sight center (Hollow dot)
taggedComponents.sightCenter = [
	new Circle({diameter: 0.6, size: 2})
]
sight.add(taggedComponents.sightCenter);

// New gun center
taggedComponents.gunCenter = [
	new Line({ from: [-0.5, 0], to: [-0.3, 0], move: true }).withMirrored("x"),
	new Line({ from: [0, -0.5], to: [0, -0.3], move: true }),
]
sight.add(taggedComponents.gunCenter);



//// OUTPUT ////
export default { sightObj: sight, taggedComponents: taggedComponents };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
