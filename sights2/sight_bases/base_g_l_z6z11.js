// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";


let sight = new Sight();


// Introduction comments
sight.addDescription(`
Universal sight for 6X~11X ZTZ96/99 series
with leading values for shooting APFSDS while moving

Modified from "g_nrnc_hizoom_g_1AroCSmp2" but with less text information,
making it easier to snapshoot.
`.trim());


let init = ({
	shellSpeed = 1730 * 3.6,
	assumedMoveSpeed = 40,
	drawPromptCross = true,

	// Can be one of the following types:
	//   "line"
	//   "arrow"
	//   "values_only"
	leadingDivisionsType = "line",

	// Meaningful for line type only:
	useLongerLeadLine = false,
	useWiderLeadLineBreak = false,

	// leading divisions use apporiximate speed instead of denominators;
	// for arrow type ticks, denominators will be hidden instead
	leadingDivisionsDrawSpeed = false,

} = {}) => {
	let getLdn = (aa) => Toolbox.calcLeadingMil(shellSpeed, assumedMoveSpeed, aa);

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basic.scales.getHighZoom({ line: 1.6 }),
		pd.basic.colors.getLightGreenRed(),
		pd.basicBuild.rgfdPos([
			110, (leadingDivisionsType === "arrow") ? -0.02225 : -0.01725
		]),
		pd.basicBuild.detectAllyPos([
			110, (leadingDivisionsType === "arrow") ? -0.043 : -0.038
		]),
		pd.basicBuild.gunDistanceValuePos([
			(leadingDivisionsType === "arrow") ? -0.168 : -0.165,
			(leadingDivisionsType === "arrow") ? 0.037 : 0.030
		]),
		pd.basicBuild.shellDistanceTickVars(
			[-0.0100, -0.0100],
			[0, 0.00015],
			[0.193, 0]
		),
		pd.basic.miscVars.getCommon(),
	));


	//// VEHICLE TYPES ////
	// NOT DEFINED IN BASE


	//// SHELL DISTANCES ////
	sight.addShellDistance([
		{ distance: 400 },
		{ distance: 800 },
		{ distance: 2000, shown: 20, shownPos: [0.0035, 0.007] },
		{ distance: 4000, shown: 40, shownPos: [0.0035, 0.007] },
	]);


	//// SIGHT DESIGNS ////
	sight.lines.addComment("Gun center");
	sight.add(new Line({
		from: [0.0035, 0], to: [0.0055, 0], move: true, thousandth: false
	}).withMirrored("x"));
	sight.add(new Line({
		from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
	}));  // center dot

	sight.lines.addComment("0m correction line");
	sight.add(new Line({ from: [-0.203, 0.0], to: [-0.193, 0.0], move: true, thousandth: false }));


	sight.lines.addComment("Gun correction value indicator");
	let corrValLine = [
		new Line({ from: [0.006, 0.00045], to: [0.0175, 0.00045], thousandth: false }).withMirrored("y"),  // mirrored for bold
		new Line({ from: [-0.006, 0.00045], to: [-0.0175, 0.00045], thousandth: false }).withMirrored("y"),  // mirrored for bold
	];
	// move arrow to apporiate place
	corrValLine.forEach((l) => { l.move([-0.198, 0]); });  //
	sight.add(corrValLine);


	sight.lines.addComment("Sight center arrow and bold");
	for (let CenterBoldPadY of Toolbox.rangeIE(0, 0.16, 0.04)) {
		sight.add(new Line({
			from: [0, CenterBoldPadY], to: [0.9, 2.25]
		}).move([0, 0.02]).withMirrored("x"));
		// ^ Moving down a little bit to let the arrow vertex stays the center
		//   with being less effected by line widths
	}
	// for (let CenterBoldPadY of Toolbox.rangeIE(0, 0.28, 0.04)) {
	// 	sight.add(new Line({
	// 		from: [0, CenterBoldPadY], to: [0.6, 1.5]
	// 	}).move([0, 0.02]).withMirrored("x"));
	// 	// ^ Moving down a little bit to let the arrow vertex stays the center
	// 	//   with being less effected by line widths
	// }


	if (drawPromptCross) {
		sight.lines.addComment("Horizontal lines near sight borders and bold");
		for (let posDef of [
			{startingX: 75, lnShifts: Toolbox.rangeIE(0, 0.02, 0.02)},
			{startingX: 88, lnShifts: Toolbox.rangeIE(0.04, 0.12, 0.04)},
		]) {
			for (let lnShift of posDef.lnShifts) {
				sight.add(new Line({
					from: [posDef.startingX, lnShift], to: [450, lnShift]
				}).withMirrored(lnShift == 0 ? "x" : "xy"));
			}
		}
		sight.lines.addComment("Vertical upper and bold");
		for (let posDef of [
			{startingY: -40, lnShifts: Toolbox.rangeIE(0, 0.04, 0.04)},
			{startingY: -45, lnShifts: Toolbox.rangeIE(0.08, 0.12, 0.04)},
		]) {
			for (let lnShift of posDef.lnShifts) {
				sight.add(new Line({
					from: [lnShift, posDef.startingY], to: [lnShift, -450]
				}).withMirrored(lnShift == 0 ? null : "x"));
			}
		}
	}
	sight.lines.addComment("Vertical lower and bold");
	for (let posDef of [
		{
			startingY:  // old: 2
				leadingDivisionsType === "arrow" ? 2.5 :
				leadingDivisionsType === "line" ? 4 :
				leadingDivisionsType === "values_only" ? 3.5 :
				0,
			lnShifts: [0]
		},
		{startingY: 23, lnShifts: [0.03]},
		{startingY: 42, lnShifts: Toolbox.rangeIE(0.08, 0.12, 0.04)},
	]) {
		for (let lnShift of posDef.lnShifts) {
			sight.add(new Line({
				from: [lnShift, posDef.startingY], to: [lnShift, 450]
			}).withMirrored(lnShift == 0 ? null : "x"));
		}
	}


	sight.addComment("Horizontal leading for APFSDS", ["texts", "circles", "lines"]);
	if (leadingDivisionsType === "arrow") {
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
			pos: [getLdn(1), 1.1-0.05],
			size: 0.47
		}).withMirrored("x")).repeatLastAdd();
		// 3/4
		sight.add(getTickElements(
			getLdn(0.75), 0.15, [-0.04, 0.04]
		));
		// 2/4
		sight.add(getArrowElements(getLdn(0.5), 0.45));
		// 1/4
		sight.add(getTickElements(
			getLdn(0.25), 0.1, [-0.02, 0.02]
		));
		// Draw speed numbers if required
		if (leadingDivisionsDrawSpeed) {
			sight.texts.add(new TextSnippet({
				text: Toolbox.roundToHalf(0.75*assumedMoveSpeed, -1).toString(),
				pos: [getLdn(0.75), 1.1-0.05], size: 0.4
			}).withMirrored("x"));
			sight.texts.add(new TextSnippet({
				text: Toolbox.roundToHalf(0.5*assumedMoveSpeed, -1).toString(),
				pos: [getLdn(0.5), 1.1-0.05], size: 0.4
			}).withMirrored("x"));
		}

	} else if (
		leadingDivisionsType === "line" ||
		leadingDivisionsType === "values_only"
	) {
		// Line type / Numbers only
		// Line elements
		if (leadingDivisionsType === "line") {
			// line between 4/4 and 3/4
			let horiLineTickBreakMain = useWiderLeadLineBreak ? 1.4 : 1.2;
			let horiLineTickBreakSub = useWiderLeadLineBreak ? 0.7 : 0.6;
			if(leadingDivisionsDrawSpeed) {
				horiLineTickBreakSub += 0.45;
			}
			sight.add(new Line({
				from: [getLdn(useLongerLeadLine ? 0.5 : 0.75), 0],
				to: [getLdn(1), 0]
			}).withMirrored("x")
				.addBreakAtX(getLdn(1), horiLineTickBreakMain)
				.addBreakAtX(getLdn(0.75), horiLineTickBreakSub)
				.addBreakAtX(getLdn(0.5), horiLineTickBreakSub));
		}
		// Number elements
		// 4/4
		sight.add(new TextSnippet({
			text: assumedMoveSpeed.toFixed(), pos: [getLdn(1), -0.05], size: 0.5
		}).withMirrored("x"));
		// 3/4
		sight.add(new TextSnippet({
			text: leadingDivisionsDrawSpeed ?
				Toolbox.roundToHalf(0.75*assumedMoveSpeed, -1).toString() :
				"3",
			pos: [getLdn(0.75), -0.05], size: 0.42
		}).withMirrored("x"));
		// 2/4
		sight.add(new TextSnippet({
			text: leadingDivisionsDrawSpeed ?
				Toolbox.roundToHalf(0.5*assumedMoveSpeed, -1).toString() :
				"2",
			pos: [getLdn(0.5), -0.05], size: 0.42
		}).withMirrored("x"));
		// 1/4
		sight.add(new Circle({
			segment: [87, 93], diameter: getLdn(0.25) * 2, size: 2
		}).withMirroredSeg("x"));
	}


	// Sight tick info
	if (drawPromptCross) {
		sight.add(new TextSnippet({
			text: `ASM MOVE - ${assumedMoveSpeed} kph`,
			align: "right", pos: [90, -1.4], size: 0.9
		}));
		sight.add(new TextSnippet({
			text: `ASM SHELL - ${(shellSpeed / 3.6).toFixed()} m/s`,
			align: "right", pos: [90, 1], size: 0.9
		}));
	} else {
		sight.add(new TextSnippet({
			text: `${assumedMoveSpeed} kph`,
			align: "left", pos: [105.5, -1.2], size: 0.8
		}));
		sight.add(new TextSnippet({
			text: `${(shellSpeed / 3.6).toFixed()} m/s`,
			align: "left", pos: [105.5, 0.8], size: 0.8
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
