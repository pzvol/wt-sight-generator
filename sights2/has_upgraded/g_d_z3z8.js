import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Sight for 3X~8X optics
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getMidHighZoom(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([115, -0.015]),
	pd.basicBuild.detectAllyPos([115, -0.04]),
	// pd.basicBuild.gunDistanceValuePos([-0.18, 0.025]),
	pd.basicBuild.gunDistanceValuePos([-0.18, 0.027]),
	pd.basicBuild.shellDistanceTickVars(
		[0.01, 0.01],
		[0.005, 0.002],
		[0.2, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
	"ussr_t_10a",
	"ussr_t_10m",
]);


//// SHELL DISTANCES ////
sight.addShellDistance(pd.shellDists.getFullLoose());



//// SIGHT DESIGNS ////

// Gun center
sight.add(new Circle({diameter: 0.5, size: 1.25, move: true})).repeatLastAdd();
// Gun 0m
sight.add(new Line({from: [-0.202, 0], to: [-0.190, 0], move: true, thousandth: false})).repeatLastAdd();
sight.add(new TextSnippet({
	text: "0",
	align: "left",
	pos: [-0.205, -0.0008],
	size: 0.7,
	move: true,
	thousandth: false
}));

// Gun distance indication
let leftArrow = [
	new Line({
		from: [0, 0], to: [0.006, 0.002],
		thousandth: false,
	}).withMirrored("y"),
	new Line({
		from: [0, 0], to: [0.006, 0.0018],
		thousandth: false,
	}).withMirrored("y"),
	new Line({
		from: [0.006, 0.001], to: [0.006, 0.002],
		thousandth: false,
	}).withMirrored("y"),
];
for (let ele of leftArrow) {
	sight.add(ele.copy().move([-0.188, 0])).repeatLastAdd();
	sight.add(ele.copy().mirrorX().move([-0.220, 0])).repeatLastAdd();
}


let centerArrowDeg = 25;
let centerArrowYLen = 5.25;

// Sight center
let centerArrowDegTan = Math.tan(Toolbox.degToRad(centerArrowDeg));
for (let biasY of Toolbox.rangeIE(0, 0.24, 0.04)) {
	sight.add(new Line({
		from: [0, biasY],
		to: [
			(centerArrowYLen * centerArrowDegTan) - (biasY * centerArrowDegTan),
			centerArrowYLen
		]
	}).withMirrored("x").move([0, 0.03]));
}


// Cross lines
sight.add(new Line({from: [70-0.1, 0], to: [450, 0]}).withMirrored("x"));
for (let biasX of Toolbox.rangeIE(-0.04, 0.04, 0.04)) {
	sight.add(new Line({from: [biasX, 26], to: [biasX, 450]}));
	sight.add(new Line({from: [biasX, -60], to: [biasX, -450]}));
}
// bold
for (let l of [
	{biasY: 0.04, fromX: 70},
	{biasY: 0.08, fromX: 180},
	{biasY: 0.12, fromX: 180},
	{biasY: 0.16, fromX: 180},
	{biasY: 0.20, fromX: 180},
]) {
	sight.add(new Line({
		from: [l.fromX, l.biasY], to: [450, l.biasY]
	}).withMirrored("xy"));
}
for (let biasX of Toolbox.rangeIE(0.08, 0.20, 0.04)) {
	sight.add(new Line({
		from: [biasX, 85], to: [biasX, 450]
	}).withMirrored("xy"));
}



let assumedTargetWidth = 3.3;
let getMilHalf = (dist) => Toolbox.calcDistanceMil(assumedTargetWidth, dist) / 2;

// Rangefinder on the horizon
let smallTickLen = (d) => (1.6 / getMilHalf(400) * getMilHalf(d))
// 100 & 200
sight.add(new TextSnippet({
	text: "1", pos: [getMilHalf(100), -0.24], size: 0.7
}).withMirrored("x")).repeatLastAdd();
sight.add(new TextSnippet({
	text: "2", pos: [getMilHalf(200), -0.17], size: 0.6
}).withMirrored("x")).repeatLastAdd();
sight.add(new Line({
	from: [getMilHalf(100), 0], to: [getMilHalf(200), 0]
}).withMirrored("xy").
	addBreakAtX(getMilHalf(100), 1.4).
	addBreakAtX(getMilHalf(200), 1.2)
);
// 400
// Draw the text
sight.add(new TextSnippet({
	text: "4", pos: [getMilHalf(400), -0.1], size: 0.4
}).withMirrored("x")).repeatLastAdd();
// Or, use a tick
// sight.add(new Line({
// 	from: [getMilHalf(400), 0],
// 	to: [getMilHalf(400), smallTickLen(400)]
// }).withMirrored("x"));
// sight.add(new TextSnippet({
// 	text: "4", pos: [getMilHalf(400), 2.35], size: 0.45
// }).withMirrored("x"));
// 600
sight.add(new Line({
	from: [getMilHalf(600), 0],
	to: [getMilHalf(600), 0.1]
}).withMirrored("x"));
// 800
sight.add(new Line({
	from: [getMilHalf(800), 0],
	to: [getMilHalf(800), smallTickLen(800)]
}).withMirrored("x")).repeatLastAdd();
sight.add(new TextSnippet({
	text: "8", pos: [getMilHalf(800), 1.4], size: 0.33
}).withMirrored("x"));
// 1600
sight.add(new Line({
	from: [getMilHalf(1600), 0],
	to: [getMilHalf(1600), smallTickLen(1600)]
}).withMirrored("x"));



//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
