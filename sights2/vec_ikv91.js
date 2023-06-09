// SCRIPT_COMPILE_TO=sw_ikv_91

import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoomLargeFont(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([145, -0.01725]),
	pd.basicBuild.detectAllyPos([145, -0.045]),
	pd.basicBuild.gunDistanceValuePos([-0.205, 0.032]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0070, 0.0025],
		[0.005, 0]
	),
	pd.basic.miscVars.getCommon()
));


//// SHELL DISTANCES ////
sight.addShellDistance(pd.shellDists.getFull());


//// SIGHT DESIGNS ////
let shellSpd = 825 * 3.6;  // to kph
let getLdMil = (tgtSpd, aa = 1) => Toolbox.calcLeadingMil(
	shellSpd, tgtSpd, aa, "ussr"
);


sight.circles.addComment("Sight center dot");
sight.add(new Circle({ diameter: 0.225, size: 4 }));
sight.add(new Circle({ diameter: 0.45, size: 2 }));

sight.lines.addComment("Gun center T");
sight.add(new Line({ from: [-0.002, 0], to: [0.002, 0], move: true, thousandth: false }));
sight.add(new Line({ from: [0, 0], to: [0, 0.004], move: true, thousandth: false }));


sight.addComment("Vertical line", ["circles", "lines"]);
sight.add(new Line({ from: [0, -8.25], to: [0, -450] }));
sight.add(new Circle({ pos: [0, -7.75], diameter: 0.1 }));
sight.add(new Circle({ pos: [0, -7.25], diameter: 0.1 }));
sight.lines.addComment("bold");
sight.add(new Line({ from: [0.05, -20], to: [0.05, -450] }).withExtra(Line.extraHori));
sight.add(new Line({ from: [0.1, -30], to: [0.1, -450] }).withExtra(Line.extraHori));
sight.add(new Line({ from: [0.15, -30], to: [0.15, -450] }).withExtra(Line.extraHori));

sight.addComment("Horizontal line", ["circles", "lines"]);
sight.add(new Circle({ diameter: getLdMil(40, 0.25) * 2, size: 1.3, segment: [81, 99] }).withExtra(Circle.extraSegHori));
let horiLine = new Line({ from: [getLdMil(40, 0.25), 0], to: [450, 0] }).withExtra(Line.extraHori);
sight.add(horiLine);
sight.lines.addComment("bold");
sight.add(new Line({ from: [33, 0.05], to: [450, 0.05] }).withExtra(Line.extraFourQuad));
sight.add(new Line({ from: [45, 0.1], to: [450, 0.1] }).withExtra(Line.extraFourQuad));
sight.add(new Line({ from: [45, 0.15], to: [450, 0.15] }).withExtra(Line.extraFourQuad));


sight.addComment("Leading values", ["texts"]);
sight.add(new TextSnippet({
	text: "40", pos: [getLdMil(40, 1), -0.1], size: 0.75
}).withExtra(TextSnippet.extraHori));
horiLine.addBreakAtX(getLdMil(40, 1), 2);

sight.add(new TextSnippet({
	text: "3", pos: [getLdMil(40, 0.75), -0.07], size: 0.7
}).withExtra(TextSnippet.extraHori));
horiLine.addBreakAtX(getLdMil(40, 0.75), 1);

sight.add(new TextSnippet({
	text: "2", pos: [getLdMil(40, 0.5), -0.07], size: 0.65
}).withExtra(TextSnippet.extraHori));
horiLine.addBreakAtX(getLdMil(40, 0.5), 1);

sight.add(new TextSnippet({
	text: "1", pos: [getLdMil(40, 0.25) + 0.25, 0.9], size: 0.6
}).withExtra(TextSnippet.extraHori));


sight.texts.addComment("Leading value desc table");
let desc = [
	["40", "90° 40 kph"],
	["3", "45° 40 kph", "90° 30 kph"],
	["2", "30° 40 kph", "45° 30 kph", "90° 20 kph"],
	["1", "15° 40 kph", "15° 30 kph", "45° 20 kph"],
];
(() => {
	let posXDiffs = [3, 8, 8];
	let currPosX;
	let posYDiff = 1.6;
	let currPosY = 10;
	for (let line of desc) {
		currPosX = 12;
		for (let i = 0; i < line.length; i++) {
			let row = line[i];
			let posXDiff = posXDiffs[i] || 0;
			sight.add(new TextSnippet({
				text: row, pos: [currPosX, currPosY], size: 0.65, align: "right"
			}));
			currPosX += posXDiff;
		}
		currPosY += posYDiff;
	}
})();


// Extra bolded hori line
sight.add(horiLine.copy());




//// OUTPUT ////
sight.printCode();
