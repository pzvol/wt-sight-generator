// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Sight for 4X~9X optics with leading offsets for shooting while moving.
`.trim());


let init = ({
	assumedMoveSpeed = 45,
	shellSpeed = 1700 * 3.6,

	centerPromptCurveAA = 1,
	// cross at display borders for quickly finding the center of sight;
	// can be disabled for cleaner view on this low-magnification optics.
	drawPromptCross = true,
	// Use arrows for leading ticks
	leadingDivisionsUseArrowType = false,
} = {}) => {

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basicBuild.scale({font: 0.8, line: 1.5}),
		pd.basic.colors.getGreenRed(),
		pd.basicBuild.rgfdPos([90, -0.04375]),
		pd.basicBuild.detectAllyPos([90, -0.067]),
		pd.basicBuild.gunDistanceValuePos([-0.13, 0.06]),
		pd.basicBuild.shellDistanceTickVars(
			[-0.01, -0.01],
			[0, 0.0002],
			[0.15, 0]
		),
		pd.basic.miscVars.getCommon(),
	));


	//// VEHICLE TYPES ////
	// NOT DEFINED IN BASE


	//// SHELL DISTANCES ////
	sight.addShellDistance([
		{ distance: 400 },
		{ distance: 800 },
		{ distance: 2000, shown: 20, shownPos: [0.0035, 0.0065] },
		{ distance: 4000, shown: 40, shownPos: [0.0035, 0.0065] },
	]);


	//// SIGHT DESIGNS ////
	// Gun center
	sight.add(new Line({
		from: [0.002, 0], to: [0.004, 0], move: true, thousandth: false
	}).withMirrored("x")).repeatLastAdd();
	// sight.add(new Line({
	// 	from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
	// }));  // center dot

	// 0m correction on left
	sight.add(new Line({ from: [-0.16, 0.0], to: [-0.15, 0.0], move: true, thousandth: false }));

	// correction value indication
	let corrValLine = [
		new Line({ from: [0.0055, 0.00035], to: [0.016, 0.00035], thousandth: false }).withMirrored("y"),  // mirrored for bold
		new Line({ from: [-0.0055, 0.00035], to: [-0.016, 0.00035], thousandth: false }).withMirrored("y"),  // mirrored for bold
	];
	// move arrow to apporiate place
	corrValLine.forEach((l) => { l.move([-0.155, 0]); });
	sight.add(corrValLine);


	let centerArrowDeg = 40;
	let getLdn = (aa) => Toolbox.calcLeadingMil(shellSpeed, assumedMoveSpeed, aa);

	// Sight Center arrow line and bolds
	let arrowLineBasis = new Line({
		from: [0, 0],
		to: [Math.tan(Toolbox.degToRad(centerArrowDeg)) * 450, 450]
	}).withMirrored("x").move([0, 0.02]);
	// ^ Moving down a little bit to let the arrow vertex stays the center
	//   with being less effected by line widths
	for (let posYBias of Toolbox.rangeIE(0, 0.08, 0.02)) {
		sight.add(arrowLineBasis.copy().move([0, posYBias]));
	}

	// Lower vertical line
	sight.add(new Line({ from: [0, 450], to: [0, getLdn(centerPromptCurveAA)] }));
	sight.add(new Line({ from: [0.03, 450], to: [0.03, getLdn(1.5)] }).withMirrored("x"));
	// Center prompt curve
	sight.add(new Circle({
		segment: [-centerArrowDeg, centerArrowDeg],
		diameter: getLdn(centerPromptCurveAA) * 2,
		size: 1.2
	}));


	if (drawPromptCross) {
		// Horizontal center prompt
		for (let l of [
			{ toX: 137, biasY: 0 },
			{ toX: 137, biasY: 0.15 },
			{ toX: 137, biasY: 0.3 },
		]) {
			sight.add(new Line({
				from: [450, l.biasY], to: [l.toX, l.biasY]
			}).withMirrored(l.biasY == 0 ? "x" : "xy"));
		}
		// Vertical upper center prompt
		for (let l of [
			{ toY: -70, biasX: 0 },
			{ toY: -70, biasX: 0.125 },
			{ toY: -70, biasX: 0.25 },
		]) {
			sight.add(new Line({
				from: [l.biasX, -450], to: [l.biasX, l.toY]
			}).withMirrored(l.biasX == 0 ? null : "x"));
		}
	}


	// leading values for shooting while moving
	if (leadingDivisionsUseArrowType) {
		// Arrow type
		let arrowDegree = 60;
		let getArrowElements = (xPos, yLen) => {
			let xHalfWidth = Math.tan(Toolbox.degToRad(arrowDegree / 2)) * yLen;
			let halfElements = [
				new Line({ from: [0, 0], to: [xHalfWidth, yLen] }),
				new Line({ from: [xHalfWidth, yLen], to: [xHalfWidth/2, yLen] }),
			]
			let elements = [];
			halfElements.forEach((ele) => {
				elements.push(ele);
				elements.push(ele.copy().mirrorX());
			});
			elements.forEach((ele) => {
				ele.move([xPos, 0]).withMirrored("x");
			});
			return elements;
		}
		let getTickElements = (xPos, yLen, drawnXBiases = [0]) => {
			let elements = [];
			for (let biasX of drawnXBiases) {
				elements.push(new Line({
					from: [xPos + biasX, 0], to: [xPos + biasX, yLen]
				}).withMirrored("x"));
			}
			return elements;
		}

		// 4/4 AA
		sight.add(getArrowElements(getLdn(1), 0.5));
		sight.add(new TextSnippet({
			text: assumedMoveSpeed.toFixed(),
			pos: [getLdn(1), 1.3-0.1],
			size: 0.4
		}).withMirrored("x")).repeatLastAdd();
		// 3/4
		sight.add(getTickElements(
			getLdn(0.75), 0.2, [-0.04, 0.04]
		));
		// 2/4
		sight.add(getArrowElements(getLdn(0.5), 0.35));
		// 1/4
		sight.add(getTickElements(
			getLdn(0.25), 0.1, [-0.02, 0.02]
		));

	} else {
		// Line type
		let ldHoriLine = new Line({
			from: [getLdn(1), 0], to: [getLdn(0.5), 0]
		}).withMirrored("x");
		sight.add(ldHoriLine);
		// 4/4 AA
		Toolbox.repeat(2, () => {
			sight.add(new TextSnippet({
				text: assumedMoveSpeed.toFixed(), pos: [getLdn(1), -0.1], size: 0.5
			}).withMirrored("x"));
		});
		ldHoriLine.addBreakAtX(getLdn(1), 1.7)
		// 3/4 ~ 1/4
		for (let aa of [0.25, 0.5, 0.75]) {
			for (let biasY of Toolbox.rangeIE(-0.05, 0.05, 0.05)) {
				let Xradius = 0.05;
				sight.add(new Line({
					from: [getLdn(aa) - Xradius, biasY],
					to: [getLdn(aa) + Xradius, biasY],
				}).withMirrored("x"));
			}
		}
		ldHoriLine.addBreakAtX(getLdn(0.75), 0.7);
	}


	if (drawPromptCross) {
		sight.add(new TextSnippet({
			text: `ASM MOVE - ${assumedMoveSpeed.toFixed()} kph`,
			align: "right", pos: [139, -2.2], size: 1
		}));
		sight.add(new TextSnippet({
			text: `ASM SHELL - ${(shellSpeed / 3.6).toFixed()} m/s`,
			align: "right", pos: [139, 1.8], size: 1
		}));
	} else {
		let space = (normalSpaceNum, enSpaceNum) => {
			let out = "";
			Toolbox.repeat(normalSpaceNum, () => (out += " "));
			Toolbox.repeat(enSpaceNum, () => (out += " "));
			return out;
		}
		sight.add(new TextSnippet({
			text: `ASM MOVE${space(3, 3)}${assumedMoveSpeed.toFixed()} kph`,
			align: "right", pos: [0.925, -0.011], size: 1, thousandth: false
		}));
		sight.add(new TextSnippet({
			text: `ASM SHELL${space(2, 1)}${(shellSpeed / 3.6).toFixed()} m/s`,
			align: "right", pos: [0.925, 0.008], size: 1, thousandth: false
		}));
		// Alternatively, values only:
		// sight.add(new TextSnippet({
		// 	text: `${assumedMoveSpeed.toFixed()} kph`,
		// 	align: "left", pos: [1.0935, -0.011], size: 1, thousandth: false
		// }));
		// sight.add(new TextSnippet({
		// 	text: `${(shellSpeed / 3.6).toFixed()} m/s`,
		// 	align: "left", pos: [1.0935, 0.008], size: 1, thousandth: false
		// }));
	}
};




//// OUTPUT ////
export default {
	sightObj: sight,
	requireInfoAbout: ["matchVehicle"],
	init: init,
};
