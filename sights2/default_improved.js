import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import BlkParser from "../_lib2/blk_parser.js"
import { BlkVariable } from "../_lib2/sight_code_basis.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Default game sight with improved vision
`.trim());


//// BASIC SETTINGS ////
sight.addSettings([].concat(
	pd.basicBuild.scale({font: 1, line: 1}),
	pd.basicBuild.color({ main: [0, 0, 0, 0], sub: [0, 0, 0, 0] }),
	// pd.basic.colors.getLightGreenRed(),
	pd.basicBuild.rgfdPos([5, 0.1]),
	pd.basicBuild.detectAllyPos([4, 0.05]),
	pd.basicBuild.gunDistanceValuePos([-0.26, -0.05]),
	[
		new BlkVariable("crosshairDistHorSizeMain", [
			0.02, 0.01
		]),
		new BlkVariable("crosshairDistHorSizeAdditional", [
			0.005, 0.002
		]),

		new BlkVariable("rangefinderTextScale", 0.7),
		new BlkVariable("rangefinderUseThousandth", false),
		new BlkVariable("rangefinderProgressBarColor1", [0, 255, 0, 64], "c"),
		new BlkVariable("rangefinderProgressBarColor2", [255, 255, 255, 64], "c"),
		// new BlkVariable("rangefinderProgressBarColor1", [255, 255, 255, 216], "c"),
		// new BlkVariable("rangefinderProgressBarColor2", [0, 0, 0, 216], "c"),

		new BlkVariable("detectAllyTextScale", 0.7),

		new BlkVariable("crosshairHorVertSize", [3, 2]),
		new BlkVariable("drawDistanceCorrection", true),
		new BlkVariable("drawCentralLineVert", false),
		new BlkVariable("drawCentralLineHorz", false),
		new BlkVariable("drawSightMask", true),
		new BlkVariable("useSmoothEdge", true),
	]
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds);
sight.matchVehicle(Sight.commonVehicleTypes.spaas);


//// SHELL DISTANCES ////
let shellDists = [];
for (let d of Toolbox.range(0, 6000, 400, {includeStart: false, includeEnd: true})) {
	let evenMainTickTextX = 0.047;  // two-side ticks
	// let evenMainTickTextX = 0;
	let mainTickExtension = 0.005;
	shellDists.push({
		distance: d,
		shown: (d % 800 == 0 ? d/100 : 0),
		shownPos: [
			(
				d % 1600 == 0 ?
				evenMainTickTextX - mainTickExtension :
				0 - mainTickExtension
			),
			-0.0009
		],
		tickExtension: (d % 800 == 0 ? mainTickExtension : 0)
	})
}
sight.addShellDistance(shellDists);


//// SIGHT DESIGNS ////
// Cross
// sight.add(new Line({from: [-450, 0], to: [450, 0]}));
// sight.add(new Line({from: [0, -450], to: [0, 450]}));
// Or, a different pattern
sight.add(new Line({
	from: [-450, 0], to: [450, 0]
}).addBreakAtX(0, 4));
sight.add(new Line({
	from: [0, -450], to: [0, 450]
}).addBreakAtY(-1, 2));
sight.add(new Circle({
	diameter: 0, size: 3, thousandth: false
}));


// Gun center
sight.add(new Line({
	from: [-0.005, 0], to: [0.005, 0],
	move: true, thousandth: false
}).addBreakAtX(0, 0.005))



// Hori ticks
for (let mil of Toolbox.range(0, 32, 4, {includeStart: false, includeEnd: true})) {
	let toY = -(mil % 8 == 0 ? 3 : 2);
	sight.add(new Line({
		from: [mil, 0], to: [mil, toY]
	}).withMirrored("x"));

	if (mil % 8 == 0) {
		sight.add(new TextSnippet({
			text: mil.toFixed(),
			pos: [mil, toY - 1.25],  // 1.25
			size: 0.6
		}).withMirrored("x"));
	}
}


//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
