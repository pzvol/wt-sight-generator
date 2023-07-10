import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


// Introduction comments
sight.addDescription(`
An experimental design as the universal sight for 4X~12X
with leading values for shooting APFSDS while moving

Modified from "g_nrnc_hizoom_sf_g_3AroA" but with less text information,
making it easier to snapshoot.
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoomSmallFont({ line: 1.6 }),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([135, -0.01725]),
	pd.basicBuild.detectAllyPos([135, -0.045]),
	pd.basicBuild.gunDistanceValuePos([-0.177, 0.035]),
	pd.basicBuild.shellDistanceTickVars(
		[-0.008, -0.008],
		[0, 0],
		[0.22, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"germ_leopard_2av",
	"germ_leopard_2a4",
	"germ_leopard_2a5",
	"germ_leopard_2a6",
	"germ_leopard_2pl",
	"germ_mkpz_super_m48",
]);


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 2000, shown: 20, shownPos: [0.0045, 0.0065] },
	{ distance: 4000, shown: 40, shownPos: [0.0045, 0.0065] },
]);


//// SIGHT DESIGNS ////
let getLdn = (speed, aa) => Toolbox.calcLeadingMil(1650 * 3.6, speed, aa);
// ^ assumes shell speed to be 1650m/s
let spd = 55;
// ^ assumed general moving speed in kph


sight.lines.addComment("0m correction line");
sight.add(new Line({ from: [-0.228, 0.0], to: [-0.22, 0.0], move: true, thousandth: false }));

sight.texts.addComment("Arrow for correction value check");
let corrValLine = [
	new Line({ from: [0.0045, 0.00035], to: [0.016, 0.00035], thousandth: false }).withMirrored("y"),  // mirrored for bold
	new Line({ from: [-0.0045, 0.00035], to: [-0.016, 0.00035], thousandth: false }).withMirrored("y"),  // mirrored for bold
];
// move arrow to apporiate place
corrValLine.forEach((l) => { l.move([-0.224, 0]); });  //
sight.add(corrValLine);


sight.lines.addComment("Gun center");
sight.add(new Line({
	from: [0.005, 0], to: [0.0075, 0], move: true, thousandth: false
}).withMirrored("x"));
sight.lines.addComment("bold");
sight.add(new Line({
	from: [0.005, 0], to: [0.0075, 0], move: true, thousandth: false
}).withMirrored("xy"));


let centerArrowDeg = 40;

sight.lines.addComment("Center arrow line and bolds");
let arrowLineBasis = new Line({
	from: [0, 0],
	to: [Math.tan(Toolbox.degToRad(centerArrowDeg)) * 450, 450]
}).withMirrored("x").move([0, 0.02]);
// ^ Moving down a little bit to let the arrow vertex stays the center
//   with being less effected by line widths
for (let posYBias of Toolbox.rangeIE(0, 0.08, 0.02)) {
	sight.add(arrowLineBasis.copy().move([0, posYBias]));
}


sight.lines.addComment("Center prompt crossline starting from screen sides");
sight.lines.addComment("horizontal");
sight.add(new Line({ from: [450, 0], to: [100, 0] }).withMirrored("x"));
sight.lines.addComment("horizontal bold");
for (let posYBias of [0.1, 0.2]) {
	sight.add(new Line({
		from: [450, posYBias], to: [132, posYBias]
	}).withMirrored("xy"));
}
sight.lines.addComment("vertical upper");
sight.add(new Line({ from: [0, -450], to: [0, -45] }));
sight.lines.addComment("vertical upper bold");
for (let posXBias of [0.1, 0.2]) {
	sight.add(new Line({
		from: [posXBias, -450], to: [posXBias, -77.5]
	}).withMirrored("x"));
}
sight.lines.addComment("vertical lower");
sight.add(new Line({ from: [0, 450], to: [0, getLdn(spd, 0.5)] }));
sight.lines.addComment("vertical lower bold");
sight.add(new Line({ from: [0.03, 450], to: [0.03, getLdn(spd, 0.75)] }).withMirrored("x"));


sight.circles.addComment("Center arrow position prompt curve");
sight.add(new Circle({
	segment: [-centerArrowDeg, centerArrowDeg],
	diameter: getLdn(spd, 0.5) * 2,
	size: 1.2
}));


// leading values for shooting while moving
sight.addComment(`Horizontal line with general leading for APFSDS - ${spd}kph`, ["texts", "lines"]);
sight.add(
	new Line({ from: [getLdn(spd, 1), 0], to: [getLdn(spd, 0.5), 0] }).
		addBreakAtX(getLdn(spd, 1), 0.8).
		addBreakAtX(getLdn(spd, 0.75), 0.8).
		addBreakAtX(getLdn(spd, 0.5), 0.8).
		withMirrored("x")
);
sight.texts.add(new TextSnippet({ text: spd.toFixed(), pos: [getLdn(spd, 1), -0.03], size: 0.4 }).withMirrored("x"));
sight.texts.add(new TextSnippet({ text: "3", pos: [getLdn(spd, 0.75), -0.03], size: 0.4 }).withMirrored("x"));
sight.texts.add(new TextSnippet({ text: "2", pos: [getLdn(spd, 0.5), -0.03], size: 0.4 }).withMirrored("x"));
sight.circles.addComment(`Horizontal general leading for APFSDS - 1/4 AA`);
sight.add(new Circle({ segment: [88, 92], diameter: getLdn(spd, 0.25) * 2, size: 2 }).withMirroredSeg("x"));


//// OUTPUT ////
sight.printCode();
