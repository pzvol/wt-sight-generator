// SCRIPT_COMPILE_TO=it_vbc_pt2

import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoomSmall2Font(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([110, -0.02225]),
	pd.basicBuild.detectAllyPos([110, -0.050]),
	pd.basicBuild.gunDistanceValuePos([-0.167, 0.035]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.003, 0.0012],
		[0.002, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 2000, shown: 20, shownPos: [10, 0] },  // wider the line w/o seeing the value
	{ distance: 4000, shown: 40 },
]);


//// SIGHT DESIGNS ////
let shellInfo = {
	he: { name: "HE", spd: 1100 * 3.6 },
	apfsds: { name: "APFSDS", spd: 1385 * 3.6 },
};

let airTgting = {
	shell: {
		main: shellInfo.apfsds,
		sub: shellInfo.he,
	},
	tgtSpd: 500,  // kph
};
let getAirLdn = (aa) => Toolbox.calcLeadingMil(
	airTgting.shell.main.spd, airTgting.tgtSpd, aa
);
let getAirLdnSubShell = (aa) => Toolbox.calcLeadingMil(
	airTgting.shell.sub.spd, airTgting.tgtSpd, aa
);

let getGndWidthMilHalf = (dist) => Toolbox.calcDistanceMil(3.3, dist) / 2;



// Sight center and bold
// let arrowLowerEnd = [2.15, 5.25];
// let arrowMoveDown = 0.02;  // moving down for keeping the vertex at the center
// let arrowTan = 2.15 / 5.25;
// for (let startYBias of Toolbox.rangeIE(0, 0.3, 0.1)) {
// 	// arrow lower ends will all have the same Y while keeping paralleled
// 	let endXBias = startYBias * arrowTan;
// 	sight.add(new Line({
// 		from: [0, startYBias],
// 		to: [arrowLowerEnd[0] - endXBias, arrowLowerEnd[1]]
// 	}).move([0, arrowMoveDown]).withMirrored("x"));
// }
for (let bias of Toolbox.rangeIE(-0.1, 0.1, 0.05)) {
	sight.add(new Line({ from: [1, bias], to: [3, bias] }).withMirrored("x"));
	//sight.add(new Line({ from: [bias, 1], to: [bias, 3] }));
}


// Gun center
Toolbox.repeat(2, () => {
	sight.add(new Line({ from: [0.25, 0], to: [-0.25, 0], move: true }));
	sight.add(new Line({ from: [0, 0.25], to: [0, -0.25], move: true }));
});


// Lower vertical line
sight.add([
	new Line({ from: [0, 8.25], to: [0, 450] }),
	new Line({ from: [0.04, 8.25], to: [0.04, 450] }).withMirrored("x"),
]);


// Sight center prompt bold at borders
// horizontal
for (let l of [
	{ toX: 200, biasY: 0 },
	{ toX: 200, biasY: 0.2 },
	{ toX: 200, biasY: 0.4 },
]) {
	sight.add(new Line({
		from: [450, l.biasY], to: [l.toX, l.biasY]
	}).withMirrored(l.biasY == 0 ? "x" : "xy"));
}
// vertical
for (let l of [
	{ toY: -115, biasX: 0 },
	{ toY: -115, biasX: 0.2 },
	{ toY: -115, biasX: 0.3 },
]) {
	sight.add(new Line({
		from: [l.biasX, -450], to: [l.biasX, l.toY]
	}).withMirrored(l.biasY == 0 ? null : "x"));
}


// Air leading circles
let textPosDeg = {
	cos: Math.cos(Toolbox.degToRad(40)),
	sin: Math.sin(Toolbox.degToRad(40)),
};
let curveSeg = [45 - 20, 45 + 20];
// 4/4
sight.add(new Circle({
	segment: curveSeg, diameter: getAirLdn(1) * 2, size: 4.8
}).withMirroredSeg("xy"));
sight.add(new TextSnippet({
	text: `4/4 - ${airTgting.tgtSpd} kph  ${airTgting.shell.main.name}`,
	pos: [
		getAirLdn(1) * textPosDeg.sin + 4,
		getAirLdn(1) * textPosDeg.cos
	],
	align: "right", size: 2
}));
//   sub shell prompt
// sight.add(new Circle({
// 	segment: [40, 50], diameter: getAirLdnSubShell(1) * 2, size: 4.8
// }));
// sight.add(new TextSnippet({
// 	text: airTgting.shell.sub.name,
// 	pos: [
// 		getAirLdnSubShell(1) * textPosDeg.sin + 3,
// 		getAirLdnSubShell(1) * textPosDeg.cos
// 	],
// 	align: "right", size: 1.7
// }));
// 2/4
sight.add(new Circle({
	segment: curveSeg, diameter: getAirLdn(0.5) * 2, size: 3
}).withMirroredSeg("xy"));
sight.add(new TextSnippet({
	text: `2/4 - ${airTgting.tgtSpd} kph`,
	pos: [
		getAirLdn(0.5) * textPosDeg.sin + 4,
		getAirLdn(0.5) * textPosDeg.cos
	],
	align: "right", size: 2
}));
//   sub shell prompt
// sight.add(new Circle({
// 	segment: [42, 48], diameter: getAirLdnSubShell(0.5) * 2, size: 3
// }));




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
