import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";
import rangefinder from "./sight_components/rangefinder.js";


let sight = new Sight();


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoomSmallFont(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([100, -0.02225]),
	pd.basicBuild.detectAllyPos([100, -0.050]),
	pd.basicBuild.gunDistanceValuePos([-0.17, 0.035]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0070, 0.0025],
		[0.005, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// VEHICLE TYPES ////
sight.
	matchVehicle(Sight.commonVehicleTypes.grounds).
	matchVehicle("germ_erprobungstrager_3_achs_turm");


//// SHELL DISTANCES ////
for (let d of Toolbox.rangeIE(400, 4000, 800)) {
	sight.addShellDistance({ distance: d });  // sub ticks
}
for (let d of Toolbox.rangeIE(800, 4000, 800)) {
	sight.addShellDistance({ distance: d, shown: d / 100 });  // main ticks
}


//// SIGHT DESIGNS ////
let assumedTgtWidth = 3.3;

sight.circles.addComment("Sight center dot");
sight.add(new Circle({ diameter: 0.18, size: 4 }));
sight.add(new Circle({ diameter: 0.36, size: 2 }));

sight.lines.addComment("Gun center T");
sight.add(new Line({ from: [-0.002, 0], to: [0.002, 0], move: true, thousandth: false }));
sight.add(new Line({ from: [0, 0], to: [0, 0.006], move: true, thousandth: false }));


sight.lines.addComment("Sight cross");
sight.lines.addComment("vertical");
sight.add(new Line({ from: [0, -4.125], to: [0, -450], move: true }));
sight.add(new Line({ from: [0, 4.125], to: [0, 450] }));
sight.lines.addComment("horizontal");
let horiLine = new Line({
	from: [(Toolbox.calcDistanceMil(assumedTgtWidth, 800) / 2), 0],
	to: [450, 0]
}).withExtra(Line.extraHori);
sight.add(horiLine);


// Rangefinder
sight.addComment("Vertical rangefinder on the horizon", ["texts", "circles"]);
for (let dist of [100, 200, 400]) {
	let milHalf = Toolbox.calcDistanceMil(assumedTgtWidth, dist) / 2;
	let textSetting = ({
		d100: { size: 1.2, posY: -0.2 },
		d200: { size: 0.9, posY: -0.15 },
		d400: { size: 0.7, posY: -0.075 }
	})["d" + dist];

	sight.texts.addComment(`${dist}m`);
	sight.add(new TextSnippet({
		text: (dist / 100).toFixed(),
		size: textSetting.size,
		pos: [milHalf, textSetting.posY]
	}).withExtra(TextSnippet.extraHori));
	if (dist !== 400) {
		horiLine.addBreakAtX(milHalf, textSetting.size + 0.5);
	} else {
		horiLine.addBreakAtX(milHalf, textSetting.size + 0.2);
	}
}
// sight.circles.addComment(`800m`);
// sight.add(new Circle({
// 	diameter: Toolbox.calcDistanceMil(assumedTgtWidth, 800),
// 	segment: [85, 95],
// 	size: 1.6
// }).withExtra(Circle.extraSegHori));


sight.addComment("Vertical rangefinder", ["lines", "texts"]);
sight.add(rangefinder.getHighZoom([4.125, 4.125]))


sight.addComment("Binocular calibration reference", ["lines", "texts"]);
let binocularRefElements = [
	// 1 tick
	new Line({from: [0, 0], to: [5.25, 0]}),
	new Line({from: [0, 1], to: [5.25, 1]}),
	new Line({from: [5.25, 0], to: [5.25, 1]}),
	// 800m size
	new Line({from: [4.125, 0.25], to: [4.125, 0.75]}),
	new TextSnippet({text: "8", pos: [4.125, 1.65], size: 0.6}),
	// 1200m size / approximate 0.5 tick
	new Line({from: [2.75, 0], to: [2.75, 0.25]}),
	new Line({from: [2.75, 0.75], to: [2.75, 1]}),
	new TextSnippet({text: "12", pos: [2.75, -0.5], size: 0.5}),
	// 1600m size
	new Line({from: [2.0625, 0.25], to: [2.0625, 0.75]}),
	new TextSnippet({text: "16", pos: [2.0625, 1.65], size: 0.5}),
]
binocularRefElements.forEach((element) => element.mirrorY().move([0, 15]));
sight.add(binocularRefElements);


sight.lines.addComment("Sight cross bold");
sight.lines.addComment("vertical");
sight.add(new Line({ from: [0.01, -16.5], to: [0.01, -450], move: true }).withExtra(Line.extraHori));
sight.add(new Line({ from: [0.01, 4.125], to: [0.01, 450] }).withExtra(Line.extraHori));
sight.add(new Line({ from: [0.2, 66], to: [0.2, 450] }).withExtra(Line.extraFourQuad));
sight.lines.addComment("horizontal");
sight.add();
sight.add([
	//horiLine.copy().move([0, 0.02]).withExtra(Line.extraFourQuad),
	new Line({ from: [17.5, 0.02], to: [450, 0.02] }).withExtra(Line.extraFourQuad),
	new Line({ from: [90, 0.1], to: [450, 0.1] }).withExtra(Line.extraFourQuad),
	new Line({ from: [120, 0.2], to: [450, 0.2] }).withExtra(Line.extraFourQuad),
	new Line({ from: [121, 0.3], to: [450, 0.3] }).withExtra(Line.extraFourQuad),
])



//// OUTPUT ////
sight.printCode();
