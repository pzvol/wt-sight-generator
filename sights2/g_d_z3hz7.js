import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";
import rgfd from "./sight_components/rangefinder.js"

let sight = new Sight();


// Introduction comment
sight.addDescription(`
Sight for tanks with 3.5X~7X optics
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getMidHighZoom(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([120, -0.02175]),
	pd.basicBuild.detectAllyPos([120, -0.045]),
	pd.basicBuild.gunDistanceValuePos([-0.18, 0.035]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0070, 0.0025],
		[0.005, 0]
	),
	pd.basic.miscVars.getCommon()
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"ussr_is_4m",
	"ussr_object_120",
	"ussr_object_906",
	"ussr_su_122_54",
	"ussr_t_54_1947",
	"ussr_t_54_1949",
	"ussr_t_54_1951",
	"ussr_t_55a",
	"ussr_t_62",
]);


//// SHELL DISTANCES ////
sight.addShellDistance(
	pd.shellDists.getFullLoose(0.0295)
);


//// SIGHT DESIGNS ////
let assumedTgtWidth = 3.3;
let getMil = (dist) => Toolbox.calcDistanceMil(assumedTgtWidth, dist);
let getHalfMil = (dist) => (getMil(dist) / 2);


// Sight center
sight.add([
	new Circle({ diameter: 0.2, size: 4 }),
	new Circle({ diameter: 0.4, size: 2 }),
	new Circle({ diameter: 0.6, size: 1.5 }),
]);


// Gun center
sight.add(new Line({ from: [-0.002, 0], to: [0.002, 0], move: true, thousandth: false }));
sight.add(new Line({ from: [0, 0], to: [0, 0.005], move: true, thousandth: false }));


// Cross
// horizontal
let horiLine = new Line({
	from: [450, 0], to: [getHalfMil(400), 0]
}).withMirrored("x");
Toolbox.repeat(2, () => { sight.add(horiLine); });
// vertical
Toolbox.repeat(2, () => {
	sight.add(new Line({ from: [0, 450], to: [0, 16.5] }).withMirrored("y"));
});
// horizontal extra bold
for (let biasY of Toolbox.rangeIE(0.08, 0.14, 0.02)) {
	sight.add(new Line({ from: [450, biasY], to: [60, biasY] }).withMirrored("xy"));
}
for (let biasY of Toolbox.rangeIE(0.16, 0.38, 0.02)) {
	sight.add(new Line({ from: [450, biasY], to: [130, biasY] }).withMirrored("xy"));
}
// vertical extra bold
for (let biasX of Toolbox.rangeIE(0.08, 0.14, 0.02)) {
	sight.add(new Line({ from: [biasX, 450], to: [biasX, 40] }).withMirrored("xy"));
}
for (let biasX of Toolbox.rangeIE(0.16, 0.38, 0.02)) {
	sight.add(new Line({ from: [biasX, 450], to: [biasX, 70] }).withMirrored("xy"));
}


// Rangefinder on the horizon
// 100
sight.add(new TextSnippet({
	text: "1", pos: [getHalfMil(100), -0.3], size: 1
}).withMirrored("x"));
horiLine.addBreakAtX(getHalfMil(100), 2);
// 200
sight.add(new TextSnippet({
	text: "2", pos: [getHalfMil(200), -0.15], size: 0.7
}).withMirrored("x"));
horiLine.addBreakAtX(getHalfMil(200), 1.4);
// 400
sight.add(new Circle({
	segment: [70, 110], diameter: getMil(400), size: 1.7,
}).withMirroredSeg("x"));
sight.add(new TextSnippet({
	text: "4", pos: [getHalfMil(400) + 1, -0.13], size: 0.65
}).withMirrored("x"));
horiLine.addBreakAtX(getHalfMil(400) + 1, 1.2);
// 800
sight.add(new Circle({
	segment: [80, 100], diameter: getMil(800), size: 1.7,
}).withMirroredSeg("x"));


// Rangefinder
sight.add(rgfd.getCircledMidHighZoom([4.125, -4], { mirrorY: true }));




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
