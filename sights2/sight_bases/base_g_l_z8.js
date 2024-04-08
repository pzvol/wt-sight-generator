// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";
import binoCali from "../sight_components/binocular_calibration_2.js"


let sight = new Sight();


// Introduction comments
sight.addDescription(`
Generic sight for fixed 8X with leading values for shooting APFSDS while moving

Modified from "base_g_l_z8z16" and "g_nrnc_hizoom_hf_g_1Smp"
`.trim());


let init = ({
	assumedMoveSpeed = 55,
	shellSpeed = 1650 * 3.6,

	promptCurveAA = 0.5,
	// Cross at display borders for quickly finding the center of sight.
	drawPromptCross = true,
	// binocular estimation for 3.3m target
	drawBinoCali = false,
	// Use narrower gun center, and
	// for arrow type leading reticles, use smaller arrows and ticks
	useNarrowCentralElements = false,

	// Use arrows for leading ticks
	leadingDivisionsUseArrowType = false,
} = {}) => {

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basic.scales.getHighZoomLargeFont(),
		pd.basic.colors.getGreenRed(),
		pd.basicBuild.rgfdPos([135, -0.01425]),
		pd.basicBuild.detectAllyPos([135, -0.036]),
		pd.basicBuild.gunDistanceValuePos([-0.195, 0.03]),
		pd.basicBuild.shellDistanceTickVars(
			[0, 0],
			[0.0060, 0.001],
			[0.005, 0]
		),
		pd.basic.miscVars.getCommon(),
	));


	//// VEHICLE TYPES ////
	// NOT DEFINED IN BASE


	//// SHELL DISTANCES ////
	sight.addShellDistance([
		{ distance: 400 },
		{ distance: 2000, shown: 20, shownPos: [10, 0]},
		{ distance: 4000, shown: 40 },
	]);


	//// SIGHT DESIGNS ////
	let getLdn = (speed, aa) => Toolbox.calcLeadingMil(shellSpeed, speed, aa);


	sight.lines.addComment("Gun center");
	sight.add(new Line({
		from: [
			(useNarrowCentralElements ? 0.0025 : 0.0055),
			(useNarrowCentralElements ? 0.0001 : 0)
		],
		to: [
			(useNarrowCentralElements ? 0.004 : 0.0085),
			(useNarrowCentralElements ? 0.0001 : 0)
		],
		move: true, thousandth: false
	}).withMirrored("xy"));  // y for bold
	// sight.add(new Line({
	// 	from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
	// }));  // center dot


	let centerArrowDeg = 40;

	sight.lines.addComment("Center arrow line and bolds");
	let arrowLineBasis = new Line({
		from: [0, 0],
		to: [Math.tan(Toolbox.degToRad(centerArrowDeg)) * 450, 450]
	}).withMirrored("x").move([0, 0.02]);
	// ^ Moving down a little bit to let the arrow vertex stays the center
	//   with being less effected by line widths
	for (let posYBias of Toolbox.rangeIE(0, 0.12, 0.03)) {
		sight.add(arrowLineBasis.copy().move([0, posYBias]));
	}


	sight.lines.addComment("Center prompt crossline starting from screen sides");
	if (drawPromptCross) {
		sight.lines.addComment("horizontal");
		sight.add(new Line({ from: [450, 0], to: [66, 0] }).withMirrored("x"));
		sight.lines.addComment("horizontal bold");
		for (let posYBias of [0.1]) {
			sight.add(new Line({
				from: [450, posYBias], to: [66, posYBias]
			}).withMirrored("xy"));
		}
		sight.lines.addComment("vertical upper");
		sight.add(new Line({ from: [0, -450], to: [0, -24.75] }));
		sight.lines.addComment("vertical upper bold");
		for (let posXBias of [0.1]) {
			sight.add(new Line({
				from: [posXBias, -450], to: [posXBias, -40]
			}).withMirrored("x"));
		}
	}
	sight.lines.addComment("vertical lower");
	sight.add(new Line({ from: [0, 450], to: [0, getLdn(assumedMoveSpeed, promptCurveAA)] }));
	sight.lines.addComment("vertical lower bold");
	sight.add(new Line({ from: [0.03, 450], to: [0.03, getLdn(assumedMoveSpeed, promptCurveAA)] }).withMirrored("x"));


	sight.circles.addComment("Center arrow position prompt curve");
	sight.add(new Circle({
		segment: [-centerArrowDeg, centerArrowDeg],
		diameter: getLdn(assumedMoveSpeed, promptCurveAA) * 2,
		size: 1.2
	}));


	if (drawBinoCali) {
		sight.addComment("Binocular reference", ["lines", "texts"]);
		let binoCaliEles = binoCali.getBinoCaliSimplified({
			pos: [0, 23],
			drawCenterCross: false,
			horiLineType: "full",
			binoMainTickHeight: 1.2,
			binoSubTickPer: 1,
			binoHalfTickLength: 0.4,

			binoTextSizeMain: 0.6,
			binoTextYMain: 0.95,
			binoTextYSub: 0.7,
			distTextSize: 0.5,
			distTextY: -0.9,
		})
		sight.add(binoCaliEles);
		sight.add(binoCaliEles.filter((ele) => (ele instanceof Line)));
	}


	sight.addComment(`Leading values for shooting while moving - ${assumedMoveSpeed}kph`, ["texts", "lines"]);
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
		sight.add(getArrowElements(
			getLdn(assumedMoveSpeed, 1),
			useNarrowCentralElements ? 0.6 : 0.8
		));
		sight.add(new TextSnippet({
			text: assumedMoveSpeed.toFixed(),
			pos: [
				getLdn(assumedMoveSpeed, 1),
				(useNarrowCentralElements ? 1.4 : 1.7)-0.08
			],
			size: useNarrowCentralElements ? 0.41 : 0.5
		}).withMirrored("x")).repeatLastAdd();
		// 3/4
		sight.add(getTickElements(
			getLdn(assumedMoveSpeed, 0.75),
			useNarrowCentralElements ? 0.2 : 0.3,
			[-0.04, 0.04]
		));
		// 2/4
		sight.add(getArrowElements(
			getLdn(assumedMoveSpeed, 0.5),
			useNarrowCentralElements ? 0.5 : 0.7
		));
		// 1/4
		sight.add(getTickElements(
			getLdn(assumedMoveSpeed, 0.25),
			useNarrowCentralElements ? 0.15 : 0.25,
			[-0.035, 0.035]
		));

	} else {
		// Line type
		sight.add(
			new Line({ from: [getLdn(assumedMoveSpeed, 1), 0], to: [getLdn(assumedMoveSpeed, 0.5), 0] }).
				addBreakAtX(getLdn(assumedMoveSpeed, 1), 1.6).
				addBreakAtX(getLdn(assumedMoveSpeed, 0.75), 0.6).
				addBreakAtX(getLdn(assumedMoveSpeed, 0.5), 0.6).
				withMirrored("xy")  // y for bold
		);
		Toolbox.repeat(2, () => {
			sight.texts.add(new TextSnippet({ text: assumedMoveSpeed.toFixed(), pos: [getLdn(assumedMoveSpeed, 1), -0.08], size: 0.5 }).withMirrored("x"));
		})
		sight.circles.addComment(`Horizontal general leading for APFSDS - 1/4~3/4 AA`);
		sight.add(new Circle({ segment: [88, 92], diameter: getLdn(assumedMoveSpeed, 0.25) * 2, size: 2.4 }).withMirroredSeg("x"));
		sight.add(new Circle({ segment: [87, 93], diameter: getLdn(assumedMoveSpeed, 0.5) * 2, size: 1.8 }).withMirroredSeg("x"));
		sight.add(new Circle({ segment: [88, 92], diameter: getLdn(assumedMoveSpeed, 0.75) * 2, size: 2.4 }).withMirroredSeg("x"));
	}

	if (drawPromptCross) {
		sight.add(new TextSnippet({
			text: `ASM MOVE - ${assumedMoveSpeed.toFixed()} kph`,
			align: "right", pos: [67, -1.1], size: 0.5
		}));
		sight.add(new TextSnippet({
			text: `ASM SHELL - ${(shellSpeed / 3.6).toFixed()} m/s`,
			align: "right", pos: [67, 0.9], size: 0.5
		}));
	} else {
		// let space = (normalSpaceNum, enSpaceNum) => {
		// 	let out = "";
		// 	Toolbox.repeat(normalSpaceNum, () => (out += " "));
		// 	Toolbox.repeat(enSpaceNum, () => (out += " "));
		// 	return out;
		// }
		// sight.add(new TextSnippet({
		// 	text: `ASM MOVE${space(2, 4)}${assumedMoveSpeed.toFixed()} kph`,
		// 	align: "right", pos: [66, -0.9], size: 0.5
		// }));
		// sight.add(new TextSnippet({
		// 	text: `ASM SHELL${space(3, 1)}${(shellSpeed / 3.6).toFixed()} m/s`,
		// 	align: "right", pos: [66, 0.7], size: 0.5
		// }));
		//
		// Positions w/o thousandths (not ideal for zoomed in positions):
		// [0.439, -0.0059]
		// [0.439, 0.005]

		// Alternatively, values only:
		sight.add(new TextSnippet({
			text: `${assumedMoveSpeed.toFixed()} kph`,
			align: "left", pos: [0.584, -0.0059], size: 0.5, thousandth: false
		}));
		sight.add(new TextSnippet({
			text: `${(shellSpeed / 3.6).toFixed()} m/s`,
			align: "left", pos: [0.584, 0.005], size: 0.5, thousandth: false
		}));
	}

};




//// OUTPUT ////
export default {
	sightObj: sight,
	requireInfoAbout: [
		"matchVehicle",
	],
	init: init,
};