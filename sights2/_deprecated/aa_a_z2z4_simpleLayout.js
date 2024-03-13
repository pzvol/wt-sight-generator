import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Generic sight for SPAAs with 2X~4X.
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getCommon(),
	pd.basic.colors.getRedGreen(),
	pd.basicBuild.rgfdPos([110, -0.02]),
	pd.basicBuild.detectAllyPos([110, -0.045]),
	pd.basicBuild.gunDistanceValuePos([-0.18, 0.03]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0070, 0.0025],
		[0.005, 0]
	),
	pd.basic.miscVars.getCommon()
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.spaas).matchVehicle([
	"cn_wz_305",
]);


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 1200 },
	{ distance: 1600, shown: 16 },
]);


//// SIGHT DESIGNS ////

// Gun center
sight.add(new Line({ from: [-0.0015, 0], to: [0.0015, 0], move: true, thousandth: false }))
sight.add(new Line({ from: [0, -0.0015], to: [0, 0.0015], move: true, thousandth: false }))

// Center dot
sight.add(new Circle({ diameter: 0.2, size: 4 }));

// Center circle around the dot
sight.add(new Circle({ segment: [25, 65], diameter: 6.875, size: 4 }).withMirroredSeg("xy"));


let sin45 = Math.sin(Toolbox.degToRad(45));
let drawCross = (fromVal, toVal) => [new Line({ from: [0, fromVal], to: [0, toVal] }).withMirrored("y"), new Line({ from: [fromVal, 0], to: [toVal, 0] }).withMirrored("x")];
let drawX = (fromRadius, toRadius) => (new Line({ from: [fromRadius * sin45, fromRadius * sin45], to: [toRadius * sin45, toRadius * sin45] }).withMirrored("xy"));
let drawCurveCross = (radius, [segFrom, segTo], size) => [new Circle({ segment: [segFrom, segTo], diameter: radius * 2, size: size }).withMirroredSeg("x"), new Circle({ segment: [segFrom + 90, segTo + 90], diameter: radius * 2, size: size }).withMirroredSeg("y")];
// let drawCurveX = (radius, [segFrom, segTo], size) => (new Circle({ segment: [segFrom, segTo], diameter: radius * 2, size: size }).withMirroredSeg("xy"))

// Cross lines - clearer scheme
//   center segments
sight.add(drawCross(8.25, 32)).add(drawX(32 - 1, 32 + 1));
//   middle segments
sight.add(drawCross(64, 128)).add(drawX(64, 128));
//   outer segments
sight.add(drawCurveCross(192, [89.3, 90.7], 4));
sight.add(drawCross(192, 450));


// Rangefinder
let assumedTargetLength = 11;
let getTgtMil = (dist) => Toolbox.calcDistanceMil(assumedTargetLength, dist);
//   assumed size prompt
sight.add(new TextSnippet({
	text: `ASM TGT LEN - ${assumedTargetLength.toString()}m`,
	align: "left",
	pos: [300, 3.5], size: 1
}));
//   400m
sight.add(new Circle({
	segment: [22.5, 67.5], diameter: getTgtMil(400), size: 1.2
}).withMirroredSeg("xy"));
sight.add(new TextSnippet({ text: "4", pos: [11, 11], size: 0.65 }));
//   800m
sight.add(new Circle({ segment: [65, 115], diameter: getTgtMil(800), size: 1 }).
	withMirroredSeg("x"));
sight.add(new Circle({ segment: [155, 205], diameter: getTgtMil(800), size: 1 }));
sight.add(new Circle({ segment: [335, 345], diameter: getTgtMil(800), size: 1 }).
	withMirroredSeg("x"));
sight.add(new TextSnippet({ text: "8", pos: [5.5, 5.5], size: 0.5 }));




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== 'undefined' && require.main === module) ||
	(typeof import.meta.main !== 'undefined' && import.meta.main === true)
) { sight.printCode(); }
