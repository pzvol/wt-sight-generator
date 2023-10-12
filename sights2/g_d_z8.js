import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";
import rgfd from "./sight_components/rangefinder.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Sight for tanks with 8X optics. Should also be usable on 6X ones.
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoomLargeFont({ font: 1.4 }),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([135, -0.01425]),
	pd.basicBuild.detectAllyPos([135, -0.036]),
	pd.basicBuild.gunDistanceValuePos([-0.195, 0.03]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0070, 0.0025],
		[0.005, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_mkpz_m47",
	"germ_mkpz_m48a2c",
	"it_m47_105",
	"jp_m47_patton_II",
	"us_m47_patton_II",
]);


//// SHELL DISTANCES ////
sight.addShellDistance(pd.shellDists.getFullLoose());


//// SIGHT DESIGNS ////
let assumedTgtWidth = 3.3;
let getMil = (dist) => Toolbox.calcDistanceMil(assumedTgtWidth, dist);
let getHalfMil = (dist) => (getMil(dist) / 2);

// Some components will be tagged for conveniently further modifications
let taggedComponents = {}


// Sight center
taggedComponents.sightCenter = [
	new Circle({ diameter: 0.225, size: 4 }),
	new Circle({ diameter: 0.225 * 2, size: 2 }),
];
sight.add(taggedComponents.sightCenter);


// Gun center
taggedComponents.gunCenter = [
	new Line({ from: [-0.0019, 0], to: [0.0019, 0], move: true, thousandth: false }),
	new Line({ from: [0, 0], to: [0, 0.0025], move: true, thousandth: false }),
]
sight.add(taggedComponents.gunCenter);


// Cross
let horiLine = new Line({ from: [getHalfMil(400), 0], to: [450, 0] }).withMirrored("x");
sight.add(horiLine);
sight.add(new Line({ from: [0, -17.5], to: [0, -450] }));
sight.add(new Line({ from: [0, 12.25], to: [0, 450] }));


// Cross bold on screen borders
for (let biasY of [0.1]) {
	sight.add(new Line({ from: [450, biasY], to: [70, biasY] }).withMirrored("xy"));
}
for (let biasX of [0.1]) {
	sight.add(new Line({ from: [biasX, -450], to: [biasX, -40] }).withMirrored("x"));
}


// Rangefinder on the horizon
// // Small texts for clearer view:
// // 100
// sight.add(new TextSnippet({
// 	text: "1", pos: [getHalfMil(100), -0.2], size: 0.8
// }).withMirrored("x"));
// horiLine.addBreakAtX(getHalfMil(100), 1.0);
// // 200
// sight.add(new TextSnippet({
// 	text: "2", pos: [getHalfMil(200), -0.12], size: 0.65
// }).withMirrored("x"));
// horiLine.addBreakAtX(getHalfMil(200), 1.1);
// 100
Toolbox.repeat(2, () => { sight.add(new TextSnippet({
	text: "1", pos: [getHalfMil(100), -0.2], size: 1.0
}).withMirrored("x")); });
horiLine.addBreakAtX(getHalfMil(100), 1.1);
// 200
Toolbox.repeat(2, () => { sight.add(new TextSnippet({
	text: "2", pos: [getHalfMil(200), -0.12], size: 0.75
}).withMirrored("x")); });
horiLine.addBreakAtX(getHalfMil(200), 1.1);
// 400
sight.add(new Circle({
	segment: [80, 100], diameter: getMil(400), size: 1.3,
}).withMirroredSeg("x"));
sight.add(new TextSnippet({
	text: "4", pos: [getHalfMil(400) + 0.675, 0.8], size: 0.6
}));
sight.add(new TextSnippet({
	text: "4", pos: [-(getHalfMil(400) + 0.675), 0.8], size: 0.5
}));
// 800
sight.add(new Line({
	from: [getHalfMil(800), -0.2], to: [getHalfMil(800), 0.2]
}).withMirrored("x"));


// Rangefinder
let rgfdElements = rgfd.getCommon([getMil(800), -8], {
	mirrorY: true, showMiddleLine: true,
	distances: [800, 1000, 1200, 1400, 1600, 2000],
	distancesDashed: [800],
	distancesLined: [],
	tickLength: 0.8,
	tickInterval: 0.8,
	tickDashWidth: 0.3,
	textSize: 0.6,
	textSpace: 0.475,
	textPosYAdjust: -0.14
});
sight.add(rgfdElements);
sight.add(rgfdElements.filter((ele) => (ele instanceof Line)));




//// OUTPUT ////
export default { sightObj: sight, taggedComponents: taggedComponents };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
