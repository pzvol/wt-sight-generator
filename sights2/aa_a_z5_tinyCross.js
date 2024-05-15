import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Generic sight for SPAAs with 5X.
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getCommonLargeFont({line: 1.6}),
	pd.basic.colors.getRedGreen(),
	pd.basicBuild.rgfdPos([100, -0.02]),
	pd.basicBuild.detectAllyPos([100, -0.045]),
	pd.basicBuild.gunDistanceValuePos([-0.22, 0.03]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0070, 0.0025],
		[0.005, 0]
	),
	pd.basic.miscVars.getCommon()
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.spaas).matchVehicle([
	"it_otobreda_sidam_25",
	"it_otobreda_sidam_25_mistral",
]);


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 2000 },
	{ distance: 3600, shown: 36 },
]);


//// SIGHT DESIGNS ////
let sin45 = Math.sin(Toolbox.degToRad(45));
let drawCross = (fromVal, toVal) => [new Line({ from: [0, fromVal], to: [0, toVal] }).withMirrored("y"), new Line({ from: [fromVal, 0], to: [toVal, 0] }).withMirrored("x")];
let drawX = (fromRadius, toRadius) => (new Line({ from: [fromRadius * sin45, fromRadius * sin45], to: [toRadius * sin45, toRadius * sin45] }).withMirrored("xy"));


// Gun center
// sight.add(new Line({ from: [-0.0012, 0], to: [0.0012, 0], move: true, thousandth: false }));
// sight.add(new Line({ from: [0, -0.0012], to: [0, 0.0012], move: true, thousandth: false }));
sight.add(new Line({ from: [-0.2, 0], to: [0.2, 0], move: true }));
sight.add(new Line({ from: [0, -0.2], to: [0, 0.2], move: true }));

// Center dot
sight.add(new Circle({ diameter: 0.1, size: 4 }));

// Center circle around the dot
sight.add(new Circle({ segment: [30, 160], diameter: 4.125, size: 3.5 }).withMirroredSeg("x"));

// Cross lines
//   center segments
sight.add(drawCross(4.125, 16)).add(drawX(16 * 0.75, 16));
//   outer segments
// sight.add(drawCross(32, 450));
// sight.add([
// 	new Circle({ segment: [88, 89.7], diameter: 64*2, size: 2 }).withMirroredSeg("xy"),
// 	new Circle({ segment: [178, 179.7], diameter: 64*2, size: 2 }).withMirroredSeg("xy"),
// ])


//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
