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
	pd.basicBuild.rgfdPos([95, -0.02]),
	pd.basicBuild.detectAllyPos([95, -0.045]),
	pd.basicBuild.gunDistanceValuePos([-0.155, 0.03]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0070, 0.0025],
		[0.005, 0]
	),
	pd.basic.miscVars.getCommon()
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.spaas).matchVehicle([
	"germ_flakpanzer_38t_Gepard",
	"germ_flakpanzer_I_ausf_A",
	"germ_flakpanzer_IV_Kugelblitz",
	"germ_flakpanzer_IV_Ostwind",
	"germ_flakpanzer_IV_Ostwind_2",
	"germ_flakpanzer_IV_Wirbelwind",
	"germ_sdkfz_222",
	"germ_sdkfz_6_2_flak36",
	"germ_sdkfz_251_21",
	"it_oto_r3_t20_fa",
	"ussr_btr_152a",
	"ussr_btr_zd",
	"ussr_zsu_57_2",
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
// sight.add(new Line({ from: [-0.0015, 0], to: [0.0015, 0], move: true, thousandth: false }));
// sight.add(new Line({ from: [0, -0.0015], to: [0, 0.0015], move: true, thousandth: false }));
sight.add(new Line({ from: [-0.35, 0], to: [0.35, 0], move: true }));
sight.add(new Line({ from: [0, -0.35], to: [0, 0.35], move: true }));

// Center dot
sight.add(new Circle({ diameter: 0.2, size: 4 }));

// Center circle around the dot
sight.add(new Circle({ segment: [25, 65], diameter: 6.875, size: 4 }).withMirroredSeg("xy"));


let sin45 = Math.sin(Toolbox.degToRad(45));
let drawCross = (fromVal, toVal) => [new Line({ from: [0, fromVal], to: [0, toVal] }).withMirrored("y"), new Line({ from: [fromVal, 0], to: [toVal, 0] }).withMirrored("x")];
let drawX = (fromRadius, toRadius) => (new Line({ from: [fromRadius * sin45, fromRadius * sin45], to: [toRadius * sin45, toRadius * sin45] }).withMirrored("xy"));
let drawCurvesWithMiddleBreak = (directionType, radius, curveSegWidth, curveMidBreakSegWidth, size) => {
	let curveSegWidthHalf = curveSegWidth / 2;
	let curveMidBreakSegWidthHalf = curveMidBreakSegWidth / 2;

	let drawnAngles =
		(directionType === "cross") ? Toolbox.range(0, 360, 90, {includeStart: false, includeEnd: true}) :
		(directionType === "x") ? Toolbox.range(45, 315, 90, {includeStart: true, includeEnd: true}) :
		(directionType === "8dir") ? Toolbox.range(0, 360, 45, {includeStart: false, includeEnd: true}) :
		null;

	let elements = [];
	for (let directionBias of drawnAngles) {
		elements.push(
			new Circle({
				segment: [
					directionBias - curveSegWidthHalf,
					directionBias - curveMidBreakSegWidthHalf,
				],
				diameter: radius * 2, size: size
			}),
			new Circle({
				segment: [
					directionBias + curveMidBreakSegWidthHalf,
					directionBias + curveSegWidthHalf,
				],
				diameter: radius * 2, size: size
			}),
		);
	}
	return elements;
}


// Cross lines
//   cross and X
sight.add(drawCross(8.25, 450));
sight.add(drawX(32, 128));
//   tick curves
// sight.add(drawCurvesWithMiddleBreak("cross", 32, 2, 0.3, 2));
sight.add(drawCurvesWithMiddleBreak("8dir", 64, 6, 0.6, 2));
sight.add(drawCurvesWithMiddleBreak("cross", 128, 6, 0.6, 1.6));


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
