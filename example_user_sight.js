// An example based on the default sight (auto created `sight_1.blk` when
// "add a grid sight" is clicked in the game menu), demonstrating how the library
// can be used. A copy of `sight_1.blk` is appended at the end of this file.


// Import necessary modules
import Sight from "./_lib2/sight_main.js";
import Toolbox from "./_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "./_lib2/sight_elements.js";
import { BlkBlock, BlkVariable, BlkComment } from "./_lib2/sight_code_basis.js";

let sight = new Sight();

// Introduction comment
sight.addDescription(`
Introduction comment as a part of generated sight code
`.trim());


// Settings variable at the start of the sight //
// Defines
let sightSettings = [
	// a varType == null will make `BlkVariable` automatically decide
	// its data type while outputting .blk code
	//
	// For type "i"(align for sight texts) and "c"(color), you may have to
	// manually declare them, since their differences with "r" and "p4"
	// cannot be identified based on JavaScript's data types

	{ varName: "crosshairHorVertSize", varValue: [3, 2], varType: null },
	{ varName: "rangefinderProgressBarColor1", varValue: [0, 255, 0, 64], varType: "c" },
	{ varName: "rangefinderProgressBarColor2", varValue: [255, 255, 255, 64], varType: "c" },
	{ varName: "rangefinderTextScale", varValue: 0.7, varType: null },
	{ varName: "rangefinderUseThousandth", varValue: false, varType: null },
	{ varName: "rangefinderVerticalOffset", varValue: 0.1, varType: null },
	{ varName: "rangefinderHorizontalOffset", varValue: 5, varType: null },
	{ varName: "detectAllyTextScale", varValue: 0.7, varType: null },
	{ varName: "detectAllyOffset", varValue: [4, 0.05], varType: null },
	{ varName: "fontSizeMult", varValue: 1, varType: null },
	{ varName: "lineSizeMult", varValue: 1, varType: null },
	{ varName: "drawCentralLineVert", varValue: true, varType: null },
	{ varName: "drawCentralLineHorz", varValue: true, varType: null },
	{ varName: "drawSightMask", varValue: true, varType: null },
	{ varName: "useSmoothEdge", varValue: true, varType: null },
	{ varName: "crosshairColor", varValue: [0, 0, 0, 0], varType: "c" },
	{ varName: "crosshairLightColor", varValue: [0, 0, 0, 0], varType: "c" },
	{ varName: "crosshairDistHorSizeMain", varValue: [0.03, 0.02], varType: null },
	{ varName: "crosshairDistHorSizeAdditional", varValue: [0.005, 0.003], varType: null },
	{ varName: "distanceCorrectionPos", varValue: [-0.26, -0.05], varType: null },
	{ varName: "drawDistanceCorrection", varValue: true, varType: null },
];
// Add lines
// - The `addSettings` method also receives raw .blk code if using BlkVariable is
//   not desired;
// - Alternatively, the method accepts an array
//   instead of a single string/BlkVariable for adding multiple lines at a time.
for (let v of sightSettings) {
	sight.addSettings(
		new BlkVariable(v.varName, v.varValue, v.varType)
	);
}


// Let the sight match specific vehicle or vehicle types and avoid being shown on
// some others
// - This part is necessary if you are putting the sight to "all_tanks";
// - Similarly, the two methods each receives either a string or an array.
sight.matchVehicle(["germ_pzkpfw_II_ausf_C", "germ_pzkpfw_II_ausf_C_DAK"]);
sight.noMatchVehicle("germ_pzkpfw_35t");
// For generic classes (tanks+TDs / SPAAs), shorthands are available
sight.matchVehicle(Sight.commonVehicleTypes.grounds);
sight.matchVehicle(Sight.commonVehicleTypes.spaas);


// Shell drop-down ticks (block is named as "crosshair_distances"
// in the original file)
//
// Here we use a `range` method to generate all ticks, which is much more
// convenient than repeating lines on our own
for (let distance of Toolbox.rangeIE(200, 6000, 200)) {
	let numberIsShown = (distance % 400 == 0);
	let displayedNumber = numberIsShown ? (distance / 100) : 0;

	// Be noted that `addShellDistance` can also receive an array if needed
	sight.addShellDistance({
		distance: distance,
		// `shown == 0` (or omit the property) will hide the thousandth value
		// from being shown and make the tick to be a "secondary-level" one
		shown: displayedNumber,
		shownPos: [0, 0]  // optional, if you want to move the shown number
	});
}
// By default, a tick at 20000m will be added to make the "Distance: xxx"
// show an accurate number even after the very last tick we add.
//
// Use the following line to disable the auto addition and
// restore the original ">xxx m" text
sight.components.shellDistances.settings.autoAddMax = false;


// Horizontal thousandth ticks (block is named as "crosshair_hor_ranges"
// in the original file)
//
// Here we use a `range` method to generate all ticks, which is much more
// convenient than repeating lines on our own
for (let thousandthValue of Toolbox.rangeIE(-32, 32, 4)) {
	if (thousandthValue == 0) { continue; } // skip the center
	let numberIsShown = (thousandthValue % 8 == 0);
	let displayedNumber = numberIsShown ? Math.abs(thousandthValue) : 0;

	// Be noted that `addHoriThousandths` can also receive an array if desired
	sight.addHoriThousandths({
		thousandth: thousandthValue,
		// `shown == 0` (or omit the property) will hide the thousandth value
		// from being shown and make the tick to be a "secondary-level" one
		shown: displayedNumber
	});
}


// Texts, circles, lines and quadrilaterals can be added by ourselves
//
// Here are some examples below (Preview with 2~4x optics recommended)
//
// For `Quad`, reading through the comment for its constructor in the original
// code (around line 670 of `sight_elements.js`) is highly recommended. In there
// 15+ flexible methods for locating and defining a quad is described.

// 1 - Texts
sight.add([
	new TextSnippet({text: "LEFT TEXT", align: "left", pos: [0, -85], size: 0.6}),
	new TextSnippet({text: "RIGHT TEXT", align: "right", pos: [0, -80], size: 0.6}),
	new TextSnippet({
		text: "< CENTERED TEXT with non-thousandth pos and moves with 'distance' changes >",
		pos: [0, -0.18], size: 0.6, thousandth: false, move: true
	})
])
// 2 - Lines
sight.add([
	new Line({from: [0, -60], to: [50, -60]}),
	new TextSnippet({
		text: "A line with thousandth-based position",
		pos: [0, -60], size: 0.5, align: "left"
	}),
]);
sight.add([
	new Line({from: [0, -0.16], to: [0.2, -0.16], thousandth: false}),
	new TextSnippet({
		text: "A line with non-thousandth position",
		pos: [0, -0.16], size: 0.5, align: "left", thousandth: false
	}),
]);
sight.add([
	new Line({from: [0, -55], to: [50, -55], move: true}),
	new TextSnippet({
		text: "A line moves with 'distance' changes",
		pos: [0, -55], size: 0.5, align: "left", move: true
	}),
]);
// 3 - Circles
sight.add(new Circle({
	pos: [30, 30], segment: [0, 270], diameter: 20, size: 1
}));
sight.add(new Circle({
	pos: [0, 0], diameter: 0.1, size: 4, thousandth: false
}));
sight.add(new Circle({
	pos: [-30, 30], segment: [0, 180], diameter: 20, size: 2, move: true
}));

// 4 - a part of useful methods
// a. draw a X
sight.add(new Line({
	from: [5, 5], to: [20, 20]
}).withMirrored("xy"));

// b. draw a broken circle with two curves
sight.add(new Circle({
	segment: [40, 170], pos: [20, 60], diameter: 20, size: 2
}).withMirroredSeg("x"));

// c. draw a line with a 10-mil interval at the middle
sight.add([
	new Line({from: [0, -50], to: [50, -50]}).addBreakAtX(25, 10),
	new TextSnippet({
		text: "A line with a 10-mil break",
		pos: [0, -50], size: 0.5, align: "left"
	}),
]);

// d. line and text mirroring, which is also available for circles
// (see `sight_elements.js` for detailed definitions)
sight.add([
	new Line({from: [0, -45], to: [50, -45]}).mirrorX(),
	new TextSnippet({
		text: "Line defined on right and text defined on left, but mirrored horizontally",
		pos: [0, -45], size: 0.5, align: "left"
	}).mirrorX(),
]);


// Finally, you can print the .blk code for this sight to the console
let compiledCode = sight.getCode();
console.log(compiledCode);
// Or there is a method to do the same thing:
//   sight.printCode();


// ---- End of example ---- //


/* A copy of "sight_1.blk" which can be created by the game automatically

crosshairHorVertSize:p2=3, 2
rangefinderProgressBarColor1:c=0, 255, 0, 64
rangefinderProgressBarColor2:c=255, 255, 255, 64
rangefinderTextScale:r=0.7
rangefinderUseThousandth:b=no
rangefinderVerticalOffset:r=0.1
rangefinderHorizontalOffset:r=5
detectAllyTextScale:r=0.7
detectAllyOffset:p2=4, 0.05
fontSizeMult:r=1
lineSizeMult:r=1
drawCentralLineVert:b=yes
drawCentralLineHorz:b=yes
drawSightMask:b=yes
useSmoothEdge:b=yes
crosshairColor:c=0, 0, 0, 0
crosshairLightColor:c=0, 0, 0, 0
crosshairDistHorSizeMain:p2=0.03, 0.02
crosshairDistHorSizeAdditional:p2=0.005, 0.003
distanceCorrectionPos:p2=-0.26, -0.05
drawDistanceCorrection:b=yes

crosshair_distances{
  distance:p3=200, 0, 0
  distance:p3=400, 4, 0
  distance:p3=600, 0, 0
  distance:p3=800, 8, 0
  distance:p3=1000, 0, 0
  distance:p3=1200, 12, 0
  distance:p3=1400, 0, 0
  distance:p3=1600, 16, 0
  distance:p3=1800, 0, 0
  distance:p3=2000, 20, 0
  distance:p3=2200, 0, 0
  distance:p3=2400, 24, 0
  distance:p3=2600, 0, 0
  distance:p3=2800, 28, 0
  distance:p3=3000, 0, 0
  distance:p3=3200, 32, 0
  distance:p3=3400, 0, 0
  distance:p3=3600, 36, 0
  distance:p3=3800, 0, 0
  distance:p3=4000, 40, 0
  distance:p3=4200, 0, 0
  distance:p3=4400, 44, 0
  distance:p3=4600, 0, 0
  distance:p3=4800, 48, 0
  distance:p3=5000, 0, 0
  distance:p3=5200, 52, 0
  distance:p3=5400, 0, 0
  distance:p3=5600, 56, 0
  distance:p3=5800, 0, 0
  distance:p3=6000, 60, 0
}

crosshair_hor_ranges{
  range:p2=-32, 32
  range:p2=-28, 0
  range:p2=-24, 24
  range:p2=-20, 0
  range:p2=-16, 16
  range:p2=-12, 0
  range:p2=-8, 8
  range:p2=-4, 0
  range:p2=4, 0
  range:p2=8, 8
  range:p2=12, 0
  range:p2=16, 16
  range:p2=20, 0
  range:p2=24, 24
  range:p2=28, 0
  range:p2=32, 32
}

drawLines{
  line{
    line:p4=0, 0, 0, 0
    move:b=no
  }
}

*/