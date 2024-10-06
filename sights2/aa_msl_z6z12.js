import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Generic sight for missile SPAAs with 6X~12X optics
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basicBuild.scale({ font: 1.5, line: 1.5 }),
	pd.basic.colors.getRedLightGreen(),
	pd.basicBuild.rgfdPos([140, 0]),
	pd.basicBuild.detectAllyPos([140, -0.025]),
	pd.basicBuild.gunDistanceValuePos([-0.2, 0.015]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0070, 0.0025],
		[0.005, 0]
	),
	pd.basic.miscVars.getCommon()
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.spaas);


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 }, { distance: 800 }, { distance: 200 }, { distance: 3600 },
]);


//// SIGHT DESIGNS ////
// Sight center segments (tiny cross)
for (let direction of [90, 180, 270, 360]) {
	let curveHalfWidth = 15;
	sight.add(new Circle({
		segment: [direction - curveHalfWidth, direction + curveHalfWidth],
		diameter: 1.2,
		size: 1.4,
	}));
}

// Gun center
// sight.add(new Line({from: [0.5, 0], to: [0.6, 0], move: true}).withMirrored("x"));
sight.add(new Line({from: [16.8, 0], to: [16.9, 0], move: true}).withMirrored("x"));


// Sight cross
sight.add([
	new Line({from: [8.25, 0], to: [16.5, 0]}).withMirrored("x"),
	new Line({from: [0, 8.25], to: [0, 16.5]}).withMirrored("y"),
]);

// Vertical upper line
for (let paddingX of Toolbox.rangeIE(-0.05, 0.05, 0.05)) {
	sight.add(new Line({from: [paddingX, -32], to: [paddingX, -450]}));
}




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
