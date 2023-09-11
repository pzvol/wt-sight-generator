// SCRIPT_COMPILE_TO=it_vcc_80_hitfist_60

import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Sight for VCC-80/60 shooting air targets
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoom(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([120, -0.02025]),
	pd.basicBuild.detectAllyPos([120, -0.041]),
	pd.basicBuild.gunDistanceValuePos([-0.185, 0.035]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0], [0.0070, 0.0025], [0.005, 0]
	),
	pd.basic.miscVars.getCommon()
));


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 2000 },
	{ distance: 4000, shown: 40 },
]);



//// SIGHT DESIGNS ////
let gndTgtWidth = 3.3;  // m
let gndShellSpd = 1620 * 3.6;  // m/s, APFSDS
let gndMoveSpd = 40;  // kph

let airShellSpd = 1000 * 3.6;  // m/s, HE-VT
let airTgtSpdMain = 500;  // kph

let getGndMil = (dist) => Toolbox.calcDistanceMil(gndTgtWidth, dist);
let getGndMilHalf = (dist) => getGndMil(dist) / 2;
let getGndLdnMil = (aa) => Toolbox.calcLeadingMil(gndShellSpd, gndMoveSpd, aa);
let getAirLdnMil = (aa) => Toolbox.calcLeadingMil(airShellSpd, airTgtSpdMain, aa);


sight.lines.addComment("Gun center");
Toolbox.repeat(2, () => {
	let crossRadius = 0.0015;
	sight.add(new Line({
		from: [-crossRadius, 0], to: [crossRadius, 0],
		move: true, thousandth: false
	}));
	sight.add(new Line({
		from: [0, -crossRadius], to: [0, crossRadius],
		move: true, thousandth: false
	}));
});
sight.add(new Line({
	from: [getGndMilHalf(1600), 0],
	to: [getGndMilHalf(1600) + 0.15, 0],
	move: true
}).withMirrored("x"))


sight.addComment("Sight center dot", "circles");
sight.add(new Circle({ diameter: 0.1, size: 4 }));
sight.add(new Circle({ diameter: 0.2, size: 2 }));


sight.addComment("Sight center circle", ["circles", "lines"]);
sight.add(new Circle({
	segment: [45, 160],
	diameter: getGndMil(1600),
	size: 2.4
}).withMirroredSeg("x"));
let innerHoriLine = new Line({
	from: [getGndMilHalf(1600), 0], to: [getGndLdnMil(0.25), 0]
}).withMirrored("xy");  // "y" for bold
sight.add(innerHoriLine);


sight.addComment("Sight center cross", ["lines"]);
let horiLine = new Line({ from: [getGndLdnMil(0.5), 0], to: [450, 0] }).withMirrored("x")
let vertLine = new Line({ from: [0, -1.5], to: [0, -450] });
sight.add(horiLine).add(vertLine);
sight.add(horiLine).add(vertLine);  // Repeat for bold


sight.addComment("Ground leading values while moving", ["texts", "circles"]);
// 4/4
sight.add(new TextSnippet({
	text: gndMoveSpd.toString(), pos: [getGndLdnMil(1), -0.08], size: 0.65
}).withMirrored("x"));
horiLine.addBreakAtX(getGndLdnMil(1), 1.2);
// 3/4
sight.add(new Circle({
	segment: [88, 92],
	diameter: getGndLdnMil(0.75) * 2, size: 2.4
}).withMirroredSeg("x"));
horiLine.addBreakAtX(getGndLdnMil(0.75), 0.4);
// 2/4
sight.add(new TextSnippet({
	text: "2", pos: [getGndLdnMil(0.5), -0.06], size: 0.6
}).withMirrored("x"));
horiLine.addBreakAtX(getGndLdnMil(0.5), 0.6);
// 1/4
sight.add(new Circle({
	segment: [87, 93],
	diameter: getGndLdnMil(0.25) * 2, size: 2.4
}).withMirroredSeg("x"));


sight.addComment("Air leading circles", ["texts", "circles"]);
// 1/4
sight.add(new Circle({
	segment: [1, 89],
	diameter: getAirLdnMil(0.25) * 2,
	size: 2.4
}).withMirroredSeg("xy"));
sight.add(new TextSnippet({
	text: `1/4 - ${airTgtSpdMain} kph`,
	pos: [getAirLdnMil(0.25) + 0.5, 1.2],
	align: "right", size: 1.2
}));
sight.add(new TextSnippet({
	text: `2/4 - ${airTgtSpdMain/2} kph`,
	pos: [getAirLdnMil(0.25) + 0.5, -1.5],
	align: "right", size: 0.75
}));
// 2/4
sight.add(new Circle({
	segment: [1, 89.5],
	diameter: getAirLdnMil(0.5) * 2,
	size: 2.4
}).withMirroredSeg("xy"));
sight.add(new TextSnippet({
	text: `2/4 - ${airTgtSpdMain} kph`,
	pos: [getAirLdnMil(0.5) - 0.5, 1.2],
	align: "left", size: 1.2
}));
sight.add(new TextSnippet({
	text: `4/4 - ${airTgtSpdMain/2} kph`,
	pos: [getAirLdnMil(0.5) - 0.5, -1.5],
	align: "left", size: 0.75
}));




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
