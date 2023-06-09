// SCRIPT_COMPILE_TO=it_vcc_80_hitfist_60

import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoom(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([120, -0.02025]),
	pd.basicBuild.detectAllyPos([120, -0.041]),
	pd.basicBuild.gunDistanceValuePos([-0.185, 0.035]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0], [0.0070, 0.0025], [0.005, 0]
	),
	pd.basic.miscVars.getCommon()
));


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 2000 },
	{ distance: 4000, shown: 40 },
]);


//// SIGHT DESIGNS ////
sight.lines.addComment("Gun center");
sight.add(new Line({
	from: [-0.002, 0], to: [0.002, 0], move: true, thousandth: false
}).withExtra(Line.extraHori));
sight.add(new Line({ from: [0, 0], to: [0, 0.002], move: true, thousandth: false }));


sight.circles.addComment("Sight center dot");
sight.add(new Circle({ diameter: 0.1, size: 4 }));
sight.add(new Circle({ diameter: 0.2, size: 2 }));

sight.addComment("Center circle", ["circles", "lines"]);
sight.add(new Circle({
	segment: [45, 160], diameter: 2.0625, size: 2.4
}).withExtra(Circle.extraSegHori));
sight.add(new Line({ from: [1.03125, 0], to: [2.0625, 0] }).withExtra(Line.extraHori));


let rgfdAssumeTgtWidth = 3.3;
let rgfdHalfMils = {
	d100: Toolbox.calcDistanceMil(rgfdAssumeTgtWidth, 100) / 2,
	d200: Toolbox.calcDistanceMil(rgfdAssumeTgtWidth, 200) / 2,
	d400: Toolbox.calcDistanceMil(rgfdAssumeTgtWidth, 400) / 2,
};

sight.addComment("Rangefinder on the horizon", ["texts", "circles"]);
// 100m
sight.add(new TextSnippet({
	text: "1", pos: [rgfdHalfMils.d100, -0.25], size: 1.2
}).withExtra(TextSnippet.extraHori));
// 200m
sight.add(new TextSnippet({
	text: "2", pos: [rgfdHalfMils.d200, -0.15], size: 1
}).withExtra(TextSnippet.extraHori));
// 400m
sight.add(new Circle({
	segment: [80, 100], diameter: rgfdHalfMils.d400 * 2, size: 1.6
}).withExtra(Circle.extraSegHori));
sight.add(new TextSnippet({
	text: "4", pos: [rgfdHalfMils.d400 + 0.475, -0.5], size: 0.6
}).withExtra(TextSnippet.extraHori));


sight.lines.addComment("Sight cross").addComment("vertical");
sight.add(new Line({ from: [0, -1.5], to: [0, -450] }));
sight.lines.addComment("horizontal");
sight.add(new Line({ from: [rgfdHalfMils.d400, 0], to: [450, 0] }).
	withExtra(Line.extraHori).
	addBreakAtX(rgfdHalfMils.d100, 1).
	addBreakAtX(rgfdHalfMils.d200, 1)
);


sight.addComment("Air leading circles for heli", ["circles", "texts"]);
let airShellSpd = 1000 * 3.6;  // mps
let airTgtSpdMain = 200;  // kph
let getLdMil = (aspectAngle, tgtSpd = airTgtSpdMain) => Toolbox.calcLeadingMil(
	airShellSpd, tgtSpd, aspectAngle, "ussr"
);
let ld = {
	main: [
		{ aa: 0.75, mil: getLdMil(0.75), shown: "3/4" },
	],
	sub: [
		{ aa: 1.0, mil: getLdMil(1.0), shown: "4/4"},
		{ aa: 0.5, mil: getLdMil(0.5), shown: "2/4" },
	]
};

sight.circles.addComment("main");
for (let info of ld.main) {
	sight.add([
		new Circle({
			diameter: info.mil * 2, size: 2.4, segment: [-89, 89]
		}),
		new Circle({ diameter: info.mil * 2, size: 2.4, segment: [91, 179] }).withExtra(Circle.extraSegHori),
	]);
	if (info.shown) {
		sight.add([
			new TextSnippet({
				text: `${info.shown}  ${airTgtSpdMain}kph`,
				align: "right", pos: [info.mil + 0.5, 1], size: 1.0
			})
		]);
	}
}
for (let info of ld.sub) {
	sight.add([
		new Circle({
			diameter: info.mil * 2, size: 1.2, segment: [20, 70]
		}).withExtra(Circle.extraSegFourQuad),
		new Circle({
			diameter: info.mil * 2, size: 2.4, segment: [89, 91]
		}).withExtra(Circle.extraSegHori),
	]);
	if (info.shown) {
		sight.add([
			new TextSnippet({
				text: `${info.shown}`,
				align: "right", pos: [info.mil + 0.5, 1], size: 1.0
			})
		]);
	}
}


//// OUTPUT ////
sight.printCode();
