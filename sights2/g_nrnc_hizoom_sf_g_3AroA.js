import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoomSmallFont(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([135, -0.01725]),
	pd.basicBuild.detectAllyPos([135, -0.045]),
	pd.basicBuild.gunDistanceValuePos([-0.177, 0.035]),
	pd.basicBuild.shellDistanceTickVars(
		[-0.008, -0.008],
		[0, 0.0008],
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
sight.lines.addComment("0m correction line");
sight.add(new Line({ from: [-0.228, 0.0], to: [-0.22, 0.0], move: true, thousandth: false }));

sight.lines.addComment("Gun center");
sight.add(new Line({
	from: [0.005, 0], to: [0.0075, 0], move: true, thousandth: false
}).withExtra({ mirrorX: true }));


let centerArrowDeg = 40;

sight.lines.addComment("Center arrow line and bolds");
let arrowLineBasis = new Line({
	from: [0, 0],
	to: [Math.tan(Toolbox.degToRad(centerArrowDeg)) * 450, 450]
}).withExtra({ mirrorX: true }).move([0, 0.02]);

for (let posYBias of Toolbox.rangeIE(0, 0.06, 0.03)) {
	sight.add(arrowLineBasis.copy().move([0, posYBias]));
}

sight.lines.addComment("Center prompt cross starting from screen sides");
sight.lines.addComment("horizontal");
sight.add(new Line({ from: [450, 0], to: [100, 0] }).withExtra({ mirrorX: true }));
sight.lines.addComment("horizontal bold");
for (let posYBias of [0.1, 0.2]) {
	sight.add(new Line({
		from: [450, posYBias], to: [132, posYBias]
	}).withExtra({ mirrorX: true, mirrorY: true }));
}
sight.lines.addComment("vertical upper");
sight.add(new Line({ from: [0, -450], to: [0, -45] }));
sight.lines.addComment("vertical upper bold");
for (let posXBias of [0.1, 0.2]) {
	sight.add(new Line({
		from: [posXBias, -450], to: [posXBias, -77.5]
	}).withExtra({ mirrorX: true }));
}
sight.lines.addComment("vertical lower");
sight.add(new Line({ from: [0, 450], to: [0, 4.125] }));
sight.lines.addComment("vertical lower bold");
sight.add(new Line({ from: [0.03, 450], to: [0.03, 8.25] }).withExtra({ mirrorX: true }));


sight.circles.addComment("Center arrow position prompt curve");
sight.add(new Circle({
	segment: [-centerArrowDeg, centerArrowDeg],
	diameter: 8.25,
	size: 1.2
}));


sight.addComment("Horizontal rangefinder line", ["lines", "texts"]);
sight.add(new Line({ from: [22, 0], to: [17, 0] }).withExtra({ mirrorX: true }));
sight.add(new Line({ from: [7.75, 0], to: [4.475, 0] }));
sight.add(new Line({ from: [-7.75, 0], to: [-4.575, 0] }));
sight.add(new TextSnippet({ text: "1", pos: [16.5, -0.25], size: 1.2 }).withExtra({ mirrorX: true }));
sight.add(new TextSnippet({ text: "2", pos: [8.25, -0.2], size: 0.9 }).withExtra({ mirrorX: true }));
sight.add(new TextSnippet({ text: "4", pos: [4.075, -0.1], size: 0.6 }));
sight.add(new TextSnippet({ text: "4", pos: [-4.175, -0.1], size: 0.6 }));

sight.circles.addComment("Horizontal rangefinder - 800m tick");
sight.add(new Circle({ segment: [85, 95], diameter: 4.125, size: 1.6 }).withExtra({ mirrorSegmentX: true }));


//// OUTPUT ////
sight.printCode();
