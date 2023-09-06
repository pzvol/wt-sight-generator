import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Generic sight for SPAAs with 2X~6X.
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basicBuild.scale({ font: 0.9, line: 1.5 }),
	pd.basic.colors.getRedGreen(),
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


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.spaas).matchVehicle([
	"germ_wiesel_1_mk20",
]);


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 2000 },
	{ distance: 3600, shown: 36 },
]);


//// SIGHT DESIGNS ////

// Gun center
sight.add(new Line({ from: [-0.00125, 0], to: [0.00125, 0], move: true, thousandth: false }))
sight.add(new Line({ from: [0, -0.00125], to: [0, 0.00125], move: true, thousandth: false }))

// Center dot
sight.add(new Circle({ diameter: 0.1, size: 4 }));

// Center circle around the dot
sight.add(new Circle({ segment: [30, 160], diameter: 8.25, size: 4 }).withMirroredSeg("x"));


let sin45 = Math.sin(Toolbox.degToRad(45));

// Cross lines
let drawCross = (fromVal, toVal) => [new Line({ from: [0, fromVal], to: [0, toVal] }).withMirrored("y"), new Line({ from: [fromVal, 0], to: [toVal, 0] }).withMirrored("x")];
let drawX = (fromRadius, toRadius) => (new Line({ from: [fromRadius * sin45, fromRadius * sin45], to: [toRadius * sin45, toRadius * sin45] }).withMirrored("xy"));
let drawCurveCross = (radius, [segFrom, segTo], size) => [new Circle({ segment: [segFrom, segTo], diameter: radius * 2, size: size }).withMirroredSeg("x"), new Circle({ segment: [segFrom + 90, segTo + 90], diameter: radius * 2, size: size }).withMirroredSeg("y")];
let drawCurveX = (radius, [segFrom, segTo], size) => (new Circle({ segment: [segFrom, segTo], diameter: radius * 2, size: size }).withMirroredSeg("xy"))
//   center segments
sight.add(drawCross(4.125, 16));
//   middle segments
sight.add(drawCross(32, 64)).add(drawX(32, 64));
sight.add(drawCross(96, 128)).add(drawX(96, 128));
sight.add(drawCurveCross(128, [87, 93], 4));
//   outer segments
sight.add(drawCurveCross(192, [89.3, 90.7], 4));
sight.add(drawCross(192, 450));



//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== 'undefined' && require.main === module) ||
	(typeof import.meta.main !== 'undefined' && import.meta.main === true)
) { sight.printCode(); }
