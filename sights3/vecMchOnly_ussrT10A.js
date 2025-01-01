import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";

import base from "./g_d_z3z8.js";
let sight = base.sightObj;


//// VEHICLE TYPES ////
sight.components.matchVehicleClasses.clear();
sight.matchVehicle([
	"ussr_t_10a",
	"ussr_is_4m",
]);


//// ADDITIONAL ELEMENTS (IF ANY) ////
// 12.7mm MG correction ticks
let mgDropMils = [
	// { d: 0, mil: 0 },
	// { d: 200, mil: 1.67 },
	{ d: 400, mil: 3.45 },
	{ d: 600, mil: 5.65 },
	{ d: 800, mil: 8.35 },
	{ d: 1000, mil: 11.7 },
	{ d: 1200, mil: 15.8 },
	{ d: 1400, mil: 20.86 },
	{ d: 1600, mil: 27.15 },
];
let mgDropPosX = 5.5;
// additional small tick on 0
sight.add(new Line({ from: [mgDropPosX, 0], to: [mgDropPosX + 0.25, 0], move: true })).repeatLastAdd();
// draw all ticks
Toolbox.repeat(2, () => {
	for (let t of mgDropMils) {
		sight.add(new Line({ from: [mgDropPosX, t.mil], to: [mgDropPosX + 0.5, t.mil - 0.2], move: true }));
		sight.add(new Line({ from: [mgDropPosX, t.mil], to: [mgDropPosX + 0.5, t.mil + 0.2], move: true }));
		if (t.d % 200 == 0) {
			sight.add(new TextSnippet({
				text: (t.d / 100).toFixed(), align: "right",
				pos: [mgDropPosX + 0.65, t.mil - 0.13], move: true,
				size: 0.35
			}));
		}
	}
});
sight.add(new TextSnippet({
	text: "12.7mm DShK", align: "right",
	pos: [
		mgDropPosX + 3,
		mgDropMils.find((el) => (el.d == 1600)).mil
	],
	size: 0.65, move: true
}));




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
