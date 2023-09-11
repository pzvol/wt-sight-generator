// SCRIPT_COMPILE_TO=it_vbc_pt2

import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";

import base from "./g_ds_z3z12.js";

// TODO: Make a new sight for the vehicle

//// VEHICLE TYPES ////
// Specified vehicle path used - clear the matchVehicle section
base.sightObj.components.matchVehicleClasses.clear();



//// ADDITIONAL ELEMENTS (IF ANY) ////
let shellInfo = {
	he: { name: "HE", spd: 1100 * 3.6 },
	apfsds: { name: "APFSDS", spd: 1385 * 3.6 },
}

let airShellMain = shellInfo.he;
let airShellSub = shellInfo.apfsds;
let airTgtSpdMain = 500;  // kph
let getAirLdnMil = (aa) => Toolbox.calcLeadingMil(airShellMain.spd, airTgtSpdMain, aa);
let getAirLdnMilSub = (aa) => Toolbox.calcLeadingMil(airShellSub.spd, airTgtSpdMain, aa);

let cos40 = Math.cos(Toolbox.degToRad(40));
let sin40 = Math.sin(Toolbox.degToRad(40));

// Air leading circles
// 4/4
for (let segment of [ [20, 39], [41, 90-20], [90+20, 180-20],]) {
	base.sightObj.add(new Circle({
		segment: segment, diameter: getAirLdnMil(1) * 2, size: 4.8
	}).withMirroredSeg("x"));
}
base.sightObj.add(new TextSnippet({
	text: `4/4 - ${airTgtSpdMain} kph  ${airShellMain.name}`, align: "right",
	pos: [getAirLdnMil(1) * sin40 + 4, getAirLdnMil(1) * cos40], size: 2
}));
base.sightObj.add(new Circle({
	segment: [38, 42], diameter: getAirLdnMilSub(1) * 2, size: 4.8
}));
base.sightObj.add(new TextSnippet({
	text: airShellSub.name, align: "right",
	pos: [getAirLdnMilSub(1) * sin40 + 3, getAirLdnMilSub(1) * cos40], size: 1.6
}));
// 2/4
for (let segment of [ [20, 38], [42, 90-20], [90+20, 180-20], ]) {
	base.sightObj.add(new Circle({
		segment: segment,
		diameter: getAirLdnMil(0.5) * 2,
		size: 3
	}).withMirroredSeg("x"));
}
base.sightObj.add(new TextSnippet({
	text: `2/4 - ${airTgtSpdMain} kph`, align: "right",
	pos: [getAirLdnMil(0.5) * sin40 + 4, getAirLdnMil(0.5) * cos40],
	size: 2
}));
base.sightObj.add(new Circle({
	segment: [36, 44], diameter: getAirLdnMilSub(0.5) * 2, size: 4.8
}));



//// OUTPUT ////
export default { sightObj: base.sightObj };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { base.sightObj.printCode(); }
