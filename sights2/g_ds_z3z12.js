import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";
import { BlkVariable } from "../_lib2/sight_code_basis.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Generic sight for 3X~12X with simplified target distance ticks
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoomSmall2Font(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([110, -0.02225]),
	pd.basicBuild.detectAllyPos([110, -0.050]),
	pd.basicBuild.gunDistanceValuePos([-0.167, 0.035]),
	pd.basicBuild.shellDistanceTickVars(
		[-0.01, -0.01],
		[0, 0],
		[0.2, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"it_vbc_pt2",
	"sw_t_80u",
	"ussr_bmp_3",
	"ussr_t_80u",
	"ussr_t_80um2",
	"ussr_t_80uk",
]);


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 2000, shown: 20, shownPos: [0.0035, 0.0065] },
	{ distance: 4000, shown: 40, shownPos: [0.0035, 0.0065] },
]);


//// SIGHT DESIGNS ////
let assumedTgtWidth = 3.38;
let centerArrowDeg = 40;


let centerArrowDegTan = Math.tan(Toolbox.degToRad(centerArrowDeg));
// Method for getting mil values for rf
let getHalfWidthMil = (d) => Toolbox.calcDistanceMil(assumedTgtWidth, d) / 2;


sight.lines.addComment("0m correction line");
sight.add(new Line({ from: [-0.20, 0.0], to: [-0.21, 0.0], move: true, thousandth: false }));

sight.texts.addComment("Line for correction value check");
let corrValLine = [
	new Line({ from: [0.006, 0], to: [0.016, 0], thousandth: false }),
	new Line({ from: [-0.006, 0], to: [-0.016, 0], thousandth: false }),
	new Line({ from: [0.006, 0.0006], to: [0.016, 0.0006], thousandth: false }).withMirrored("y"),  // mirrored for bold
	new Line({ from: [-0.006, 0.0006], to: [-0.016, 0.0006], thousandth: false }).withMirrored("y"),  // mirrored for bold
];
// move arrow to apporiate place
corrValLine.forEach((l) => { l.move([-0.205, 0]); });
sight.add(corrValLine);


sight.lines.addComment("Gun center");
sight.add(new Line({
	from: [0.005, 0.0], to: [0.0085, 0.0], move: true, thousandth: false
}).withMirrored("xy"));  // y for bold
sight.add(new Line({
	from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
}));  // center dot


sight.lines.addComment("Sight center prompt bold at borders");
sight.lines.addComment("horizontal");
for (let l of [
	// {toX: 120, biasY: 0},
	// {toX: 120, biasY: 0.1},
	// {toX: 170, biasY: 0.2},
	// {toX: 190, biasY: 0.4},
	{ toX: 200, biasY: 0 },
	{ toX: 200, biasY: 0.2 },
	{ toX: 200, biasY: 0.4 },
]) {
	sight.add(new Line({
		from: [450, l.biasY], to: [l.toX, l.biasY]
	}).withMirrored(l.biasY == 0 ? "x" : "xy"));
}
sight.lines.addComment("vertical");
for (let l of [
	{ toY: -105, biasX: 0 },
	{ toY: -105, biasX: 0.2 },
	{ toY: -105, biasX: 0.3 },
]) {
	sight.add(new Line({
		from: [l.biasX, -450], to: [l.biasX, l.toY]
	}).withMirrored(l.biasY == 0 ? null : "x"));
}


// Center arrow line and bolds DEFINTION
let arrowLineBasis = new Line({
	from: [0, 0], to: [centerArrowDegTan * 450, 450]
}).withMirrored("x").move([0, 0.02]);
// ^ Moving down a little bit to let the arrow vertex stays the center
//   with being less effected by line widths
let drawArrow = () => {  // CALLED AT THE END TO DRAW AFTER DEFINING
	sight.lines.addComment("Center arrow line and bolds");
	for (let posYBias of Toolbox.rangeIE(0, 0.08, 0.02)) {
		sight.add(arrowLineBasis.copy().move([0, posYBias]));
	}
};


// Rangefinder ticks
let rfHoriLine = new Line({ from: [getHalfWidthMil(100), 0], to: [getHalfWidthMil(400), 0] }).withMirrored("xy");
rfHoriLine.addBreakAtX(getHalfWidthMil(200), 0.4)
sight.add(rfHoriLine);
for (let t of [
	{ dist: 100, tSize: 1.2, breakWidth: 2.0 },
	{ dist: 200, tSize: 0.8, breakWidth: 1.6 },
	{ dist: 400, tSize: 0.6, breakWidth: 1 },
]) {
	let pos = [getHalfWidthMil(t.dist), getHalfWidthMil(t.dist) / centerArrowDegTan];
	// Value text
	Toolbox.repeat(2, () => {
		sight.add(new TextSnippet({
			text: (t.dist / 100).toFixed(),
			pos: pos, size: t.tSize
		}).withMirrored("x"));
	});  // repeat for bold
	// Break on arrow lines
	arrowLineBasis.addBreakAtX(pos[0], t.breakWidth);
	// Tick on the horizon
	sight.add(new Circle({ segment:[90, 92], diameter: pos[0] * 2, size: 2.4 }).withMirroredSeg("x"));
}
// Rf line on the horizon
sight.add(new Line({ from: [getHalfWidthMil(100), 0], to: [getHalfWidthMil(400), 0] }).
	withMirrored("xy").addBreakAtX(getHalfWidthMil(200), 0.6)
);


sight.lines.addComment("Center position prompt vertical lower line");
sight.add(new Line({
	from: [0, 450], to: [0, getHalfWidthMil(400)]
}));
sight.lines.addComment("bold");
sight.add(new Line({
	from: [0.03, 450],
	to: [0.03, getHalfWidthMil(200) / centerArrowDegTan]
}).withMirrored("x"));

sight.circles.addComment("Center position prompt curve");
sight.add(new Circle({
	segment: [-centerArrowDeg, centerArrowDeg],
	diameter: getHalfWidthMil(400) * 2,
	size: 1.2
}));


// Draw the center arrow after all modifications
drawArrow();




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
