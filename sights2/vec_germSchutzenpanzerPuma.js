// SCRIPT_COMPILE_TO=germ_schutzenpanzer_puma

import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";


let sight = new Sight();


//// SETTINGS ////
let assumedMoveSpd = 50;  // kph
let shellSpd = 1405 * 3.6;  // m/s
let centerArrowDeg = 40;
let drawPromptCross = false;

let centerArrowDegTan = Math.tan(Toolbox.degToRad(centerArrowDeg));
let getLeadingMil = (aa) => Toolbox.calcLeadingMil(
	shellSpd, assumedMoveSpd, aa
);

let leadingDivisionsUseArrowType = true;
// leading divisions use apporiximate speed instead of denominators
let leadingDivisionsDrawSpeed = true;


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basicBuild.scale({ font: 0.24, line: 1.2 }),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([
		135,
		leadingDivisionsUseArrowType ? -0.02425 : -0.01725
	]),
	pd.basicBuild.detectAllyPos([
		135,
		leadingDivisionsUseArrowType ? -0.052 : -0.045
	]),
	pd.basicBuild.gunDistanceValuePos([
		leadingDivisionsUseArrowType ? -0.187 : -0.177,
		leadingDivisionsUseArrowType ? 0.04 : 0.03
	]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0035, 0.002],
		[0.002, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 2000, shown: 20 },
	{ distance: 4000, shown: 40 },
]);


//// SIGHT DESIGNS ////
// Gun center
sight.add(new Line({
	from: [0.003, 0], to: [0.007, 0], move: true, thousandth: false
}).withMirrored("x"));
// bold
sight.add(new Line({
	from: [0.003, 0.0004], to: [0.007, 0.0004], move: true, thousandth: false
}).withMirrored("xy"));
sight.add(new Line({
	from: [0.0001, 0], to: [-0.0001, 0], move: true, thousandth: false
}));  // center dot


// Sight center prompt bold at borders
if (drawPromptCross) {
	for (let bias of Toolbox.rangeIE(-0.4, 0.4, 0.1)) {
		// hori
		sight.add(new Line({
			from: [450, bias], to: [270, bias]
		}).withMirrored("x"));
		// vert upper
		sight.add(new Line({
			from: [bias, -450], to: [bias, -140]
		}));
	}
}


// Center arrow lines
let arrowLineBasis = new Line({
	from: [0, 0], to: [centerArrowDegTan * 450, 450]
}).withMirrored("x").move([0, 0.02]);
for (let posYBias of Toolbox.rangeIE(0, 0.10, 0.02)) {
	sight.add(arrowLineBasis.copy().move([0, posYBias]));
}
// Center position prompt curve
sight.add(new Circle({
	segment: [-centerArrowDeg, centerArrowDeg],
	diameter: getLeadingMil(0.25) * 2,
	size: 1.2
}));
// Center position prompt vertical lower line
sight.add(new Line({
	from: [0, 450], to: [0, getLeadingMil(0.25)]
}));
for (let bias of Toolbox.range(0, 0.06, 0.03, {includeStart: false, includeEnd: true})) {
	sight.add(new Line({
		from: [bias, 450],
		to: [bias, getLeadingMil(0.75) / centerArrowDegTan]
	}).withMirrored("x"));
}


// Leading offset
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

		Toolbox.repeat(2, () => {
			// 4/4 AA
			sight.add(getArrowElements(getLeadingMil(1), 0.4));
			sight.add(new TextSnippet({
				text: assumedMoveSpd.toFixed(),
				pos: [getLeadingMil(1), 0.9-0.03],
				size: 0.5
			}).withMirrored("x"));
			// 3/4
			sight.add(getTickElements(
				getLeadingMil(0.75), 0.2, [-0.02, 0.02]
			));
			// 2/4
			sight.add(getArrowElements(getLeadingMil(0.5), 0.4));
			// 1/4
			sight.add(getTickElements(
				getLeadingMil(0.25), 0.2, [-0.02, 0.02]
			));
			// Draw speed numbers if required
			if (leadingDivisionsDrawSpeed) {
				sight.texts.add(new TextSnippet({
					text: Toolbox.roundToHalf(0.75*assumedMoveSpd, -1).toString(),
					pos: [getLeadingMil(0.75), 0.9-0.03], size: 0.45
				}).withMirrored("x"));
				sight.texts.add(new TextSnippet({
					text: Toolbox.roundToHalf(0.5*assumedMoveSpd, -1).toString(),
					pos: [getLeadingMil(0.5), 0.9-0.03], size: 0.45
				}).withMirrored("x"));
			}
		});

} else {
	// Line type
	Toolbox.repeat(2, () => {
		sight.texts.add(new TextSnippet({
			text: assumedMoveSpd.toFixed(),
			pos: [getLeadingMil(1), -0.03], size: 0.55
		}).withMirrored("x"));
		sight.texts.add(new TextSnippet({
			text: leadingDivisionsDrawSpeed ? Toolbox.roundToHalf(0.75*assumedMoveSpd, -1).toString() : "3",
			pos: [getLeadingMil(0.75), -0.03], size: 0.4
		}).withMirrored("x"));
		sight.texts.add(new TextSnippet({
			text: leadingDivisionsDrawSpeed ? Toolbox.roundToHalf(0.5*assumedMoveSpd, -1).toString() : "2",
			pos: [getLeadingMil(0.5), -0.03], size: 0.4
		}).withMirrored("x"));
	});
	sight.add(
		new Line({
			from: [getLeadingMil(1), 0],
			to: [getLeadingMil(0.5), 0]
		}).
			addBreakAtX(getLeadingMil(1), 1.1).
			addBreakAtX(getLeadingMil(0.75), leadingDivisionsDrawSpeed ? 0.85 : 0.55).
			addBreakAtX(getLeadingMil(0.5), leadingDivisionsDrawSpeed ? 0.9 : 0.6).
			withMirrored("xy")  // y for bold
	);
	// 1/4 AA
	for (let biasY of Toolbox.rangeIE(-0.075, 0.075, 0.075)) {
		let Xradius = 0.05;
		sight.add(new Line({
			from: [getLeadingMil(0.25) - Xradius, biasY],
			to: [getLeadingMil(0.25) + Xradius, biasY],
		}).withMirrored("x"))
	}
}


if (drawPromptCross) {
	sight.add(new TextSnippet({
		text: `ASM MOVE - ${assumedMoveSpd.toFixed()} kph`,
		align: "right",
		pos: [272, -3.9],
		size: 3.5
	}));
	sight.add(new TextSnippet({
		text: `ASM SHELL - ${(shellSpd / 3.6).toFixed()} m/s`,
		align: "right",
		pos: [272, 3.1],
		size: 3.5
	}));
} else {
	// let space = (normalSpaceNum, enSpaceNum) => {
	// 	let out = "";
	// 	Toolbox.repeat(normalSpaceNum, () => (out += " "));
	// 	Toolbox.repeat(enSpaceNum, () => (out += " "));
	// 	return out;
	// }
	// sight.add(new TextSnippet({
	// 	text: `ASM MOVE${space(2, 3)}${assumedMoveSpd.toFixed()} kph`,
	// 	align: "right", pos: [282, -3.0], size: 2.8
	// }));
	// sight.add(new TextSnippet({
	// 	text: `ASM SHELL${space(1, 1)}${(shellSpd / 3.6).toFixed()} m/s`,
	// 	align: "right", pos: [282, 2.2], size: 2.8
	// }));

	// Alternatively, values only:
	sight.add(new TextSnippet({
		text: `${assumedMoveSpd.toFixed()} kph`,
		align: "left", pos: [323, -3.0], size: 2.8
	}));
	sight.add(new TextSnippet({
		text: `${(shellSpd / 3.6).toFixed()} m/s`,
		align: "left", pos: [323, 2.2], size: 2.8
	}));
}





//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
