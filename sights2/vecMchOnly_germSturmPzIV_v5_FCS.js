import { BlkBlock, BlkVariable } from "../_lib2/sight_code_basis.js";
import { ShellDistancesBlock } from "../_lib2/sight_blocks.js";
import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import bino from "./sight_components/binocular_calibration_2.js"
import tgtLgd from "./sight_components/target_legend.js"
import fcsRadialCfgs from "./sight_components/mousewheel_move_tick_cfg.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Sight for SturmPz.IV and other 150mm-gun-armed tanks

Virtual FCS system added, being inspired by Luch FCS
	(https://live.warthunder.com/post/1069134/en/)

Requires mouse wheel sensitivity to be set to 75%
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basicBuild.scale({ font: 0.9, line: 1.2 }),
	pd.basic.colors.getLightGreenRed(),
	pd.basicBuild.rgfdPos([160, -10]),  // [170, -10]
	pd.basicBuild.detectAllyPos([160, -0.055]),  // [170, -0.055]
	pd.basicBuild.gunDistanceValuePos([-0.22, 0.02]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0, 0],
		[0.017, 0]
	),
	[
		new BlkVariable("rangefinderTextScale", 0.8),
		new BlkVariable("rangefinderUseThousandth", true),
		new BlkVariable("rangefinderProgressBarColor1", [255, 255, 255, 216], "c"),
		new BlkVariable("rangefinderProgressBarColor2", [0, 0, 0, 216], "c"),

		new BlkVariable("detectAllyTextScale", 0.8),

		new BlkVariable("crosshairHorVertSize", [0, 0]),
		new BlkVariable("drawDistanceCorrection", true),
		new BlkVariable("drawCentralLineVert", false),
		new BlkVariable("drawCentralLineHorz", false),
		new BlkVariable("drawSightMask", true),
	],
));


//// VEHICLE TYPES ////
sight.matchVehicle([
	"germ_sturmpanzer_II",
	"germ_sturmpanzer_IV_brummbar",
]);



//// Settings
// Target size assumption
let assumedTgtWidth = 3.3;
let assumedTargetLength = 6.6;
let assumedTgtHeight = 2.4;  // Height of T-34

let binoCaliUpperTickUseRound = true;
/** Drop-down annoation type
 * @type {"degree"|"100mDropValue"|"travelDistPerXmDrop"} */
let dropDownAnnoationType = "degree";

let getWidthMilHalf = (dist) => (Toolbox.calcDistanceMil(assumedTgtWidth, dist) / 2);

// Shell info and falldown mils
let shell = {
	he: {
		spd: 240,  // m/s
		dropMils: [
			{ d: 0, mil: 0 },
			{ d: 50, mil: 4.65 },
			{ d: 100, mil: 8.70 },
			{ d: 200, mil: 17.50 },
			{ d: 300, mil: 26.30 },
			{ d: 400, mil: 35.35 },
			{ d: 500, mil: 44.40 },
			{ d: 600, mil: 53.60 },
			{ d: 700, mil: 63.00 },
			{ d: 800, mil: 72.50 },
			{ d: 900, mil: 82.30 },
			{ d: 1000, mil: 92.10 },
			{ d: 1100, mil: 102.15 },
			{ d: 1200, mil: 112.45 },
			{ d: 1300, mil: 122.95 },
			{ d: 1400, mil: 133.65 },
			{ d: 1500, mil: 144.65 },
			{ d: 1600, mil: 155.85 },
			{ d: 1700, mil: 167.30 },
			{ d: 1800, mil: 179.15 },
			{ d: 1900, mil: 191.30 },
			{ d: 2000, mil: 203.75 },
		],
	},
	heat: {
		spd: 280,  // m/s
		dropMils: [
			{ d: 0, mil: 0 },
			{ d: 50, mil: 3.7 },
			{ d: 100, mil: 7 },
			{ d: 200, mil: 13.4 },
			{ d: 300, mil: 19.95 },
			{ d: 400, mil: 26.75 },
			{ d: 500, mil: 33.65 },
			{ d: 600, mil: 40.7 },
			{ d: 700, mil: 48 },
			{ d: 800, mil: 55.3 },
			{ d: 900, mil: 62.75 },
			{ d: 1000, mil: 70.45 },
		]
	}
};
let getHeDrop = (dist) => shell.he.dropMils.find((tick) => (tick.d == dist)).mil;
let getHeatDrop = (dist) => shell.heat.dropMils.find((tick) => (tick.d == dist)).mil;
// Line width correction, added for avoiding the interference of line while
// measuing with some elements by moving one line side to the proper position
let lWCorr = 0.15;

// Virtual FCS settings
let mouseWheelMult = 75;
let mouseWheelTickLinearMil = fcsRadialCfgs.getLinearTickMil(mouseWheelMult);
let fcsConfig = fcsRadialCfgs.getConfigByUniqueName("mult 75, r 10000, spd 1000");
let fcsDrawnShell = shell.he;
let fcsRadialCenter = [fcsConfig.radius, 0];



//// SHELL DISTANCES ////
// Draw HE and HEAT details at the same time.
// Additional block printed manually in the end
// TODO: Add "ballistics" block support to sight object
let extraBallisticsBlock = new BlkBlock("ballistics", [
	new BlkBlock("bullet", [
		new BlkVariable("bulletType", "he_frag_tank"),
		new BlkVariable("speed", shell.he.spd),

		new BlkVariable("drawDistanceCorrection", false),
		new BlkVariable("distanceCorrectionPos", [-0.22, 0.02]),

		new BlkVariable("drawAdditionalLines", false),
		new BlkVariable("crosshairDistHorSizeAdditional", [0, 0]),

		new BlkVariable("crosshairDistHorSizeMain", [-0.007, -0.007]),
		new BlkVariable("crosshairHorVertSize", [1.5, 0.8]),
		new BlkVariable("distancePos", [0.124, 0]),

		new BlkVariable("textPos", [0.019, 0.0]),
		new BlkVariable("textShift", 0),
		new BlkVariable("textAlign", 1, "i"),

		new ShellDistancesBlock().add((() => {
			// 0-2000m was manually corrected and will be drawn by ourself
			let ticks = [];
			for (let dist of Toolbox.rangeIE(2200, 4000, 100)) {
				if (dist % 200 == 0) {
					ticks.push({ distance: dist, shown: (dist / 100) });
				} else {
					ticks.push({ distance: dist });
				}
			}
			return ticks;
		})()),
	]),

	new BlkBlock("bullet", [
		new BlkVariable("bulletType", "heat_tank"),
		new BlkVariable("speed", shell.heat.spd),

		new BlkVariable("drawDistanceCorrection", false),
		new BlkVariable("distanceCorrectionPos", [-0.22, 0.02]),

		new BlkVariable("drawAdditionalLines", false),
		new BlkVariable("crosshairDistHorSizeAdditional", [0, 0]),

		new BlkVariable("crosshairDistHorSizeMain", [0.007, 0.007]),
		new BlkVariable("crosshairHorVertSize", [1.5, 0.8]),
		new BlkVariable("distancePos", [-0.124, 0]),

		new BlkVariable("textPos", [-0.015, 0.0]),
		new BlkVariable("textShift", 0),
		new BlkVariable("textAlign", 2, "i"),

		new ShellDistancesBlock().add((() => {
			let ticks = [];
			for (let dist of Toolbox.rangeIE(1100, 4000, 100)) {
				if (dist % 200 == 0) {
					ticks.push({ distance: dist, shown: (dist / 100) });
				} else {
					ticks.push({ distance: dist });
				}
			}
			return ticks;
		})()),
	]),
]);
sight.addExtra(extraBallisticsBlock);



//// SIGHT DESIGNS ////
// Sight center dot
sight.add(new Circle({ diameter: 0.25, size: 3 }));


// Gun center
sight.add(new Line({ from: [-0.5, 0], to: [0.5, 0], move: true }));


// Corrected HE Shell distances
for (let dInfo of shell.he.dropMils) {
	if (dInfo.d % 100 !== 0) { continue; }
	sight.add(new Line({
		from: [-44.75, dInfo.mil], to: [-47.75, dInfo.mil], move: true
	}));
	if (dInfo.d % 200 === 0) {
		sight.add(new TextSnippet({
			text: (dInfo.d / 100).toFixed(),
			align: "left",
			pos: [-39.6, dInfo.mil - 0.3],
			size: 0.7, move: true
		}));
	}
}
// Manual correction ended indication
(() => {
	let posY = getHeDrop(2000);
	sight.add(new TextSnippet({
		text: "NOT Corred Below",
		pos: [-75, posY], size: 0.7, move: true
	}));
	// Arrow on both sides
	let arrowDown = [
		new Line({ from: [-2, 0], to: [2, 0], move: true }).move([-75, posY]),
		new Line({ from: [-2, 0], to: [0, 2], move: true }).move([-75, posY]),
		new Line({ from: [2, 0], to: [0, 2], move: true }).move([-75, posY]),
	];
	for (let frag of arrowDown) {
		sight.add(frag.copy().move([-21, 0]));
		sight.add(frag.copy().move([21, 0]));
	}
})();

// // Gun 0m indication for HEAT - Commented since included in the following section
// sight.add(new Line({ from: [0.124, 0], to: [0.131, 0], move: true, thousandth: false }));
// sight.add(new TextSnippet({
// 	text: "0", pos: [0.1122, 0 - 0.3], size: 0.7, move: true, thousandth: false
// }));
// Corrected HEAT Shell distances
for (let dInfo of shell.heat.dropMils) {
	if (dInfo.d % 100 !== 0) { continue; }
	sight.add(new Line({
		from: [44.75, dInfo.mil], to: [47.75, dInfo.mil], move: true
	}));
	if (dInfo.d % 200 === 0) {
		sight.add(new TextSnippet({
			text: (dInfo.d / 100).toFixed(),
			align: "right",
			pos: [39.6, dInfo.mil - 0.3],
			size: 0.7, move: true
		}));
	}
}


// Draw arrows for reading shell correction values
let arrowRight = [
	new Line({ from: [0, 0], to: [-2, -1] }),
	new Line({ from: [0, 0], to: [-2, 1] }),
	new Line({ from: [-2, -1], to: [-2, -0.5] }),
	new Line({ from: [-2, 1], to: [-2, 0.5] }),
];
let arrowLeft = (() => {
	let result = [];
	for (let frag of arrowRight) {
		result.push(frag.copy().mirrorX());
	}
	return result;
})();
arrowRight.forEach((ele) => ele.move([-49, 0]).withMirrored("x"));
arrowLeft.forEach((ele) => ele.move([-39, 0]).withMirrored("x"));
sight.add(arrowRight).add(arrowLeft);
sight.add(arrowRight).add(arrowLeft);  // repeat for bold

// Horizontal line
sight.add(new Line({ from: [-37, 0], to: [37, 0] }).addBreakAtX(0, getWidthMilHalf(50)*2));
sight.add(new Line({ from: [450, 0], to: [51, 0] }).withMirrored("xy"));  // y for bold
// Vertical line
// skips HE 200-2000m for clearer view
sight.add([
	new Line({ from: [0, 0], to: [0, getHeDrop(200)], move: true })
		.addBreakAtY(getHeDrop(50), 2.5),  // break for 50m
	new Line({ from: [0, getHeDrop(2000)], to: [0, 450], move: true }),
]);


// Virtual FCS for HE shell
let fcsDrawUntilShellMil = fcsDrawnShell.dropMils[fcsDrawnShell.dropMils.length - 1].mil;
let getFcsQuadCornerPos = (dist) => [
	Toolbox.calcDistanceMil(assumedTgtWidth, dist) / 2,
	Toolbox.calcDistanceMil(assumedTgtHeight, dist) / 2,
];
let getAdjustedRadialSpeed = (lineFrom, lineTo) => {
	let lineCenter = [
		(lineFrom[0] + lineTo[0]) / 2,
		(lineFrom[1] + lineTo[1]) / 2,
	];
	let realRadius = Math.sqrt(
		(fcsRadialCenter[0] + lineCenter[0])**2 +
		(fcsRadialCenter[1] + lineCenter[1])**2
	);
	return (fcsConfig.radialSpeed / (realRadius / fcsConfig.radius));
}
// Draw FCS quads
for (let count = 0; true; count++) {
	if (count === 0) { continue; }  // Skip gun center
	let currDropMil = count*mouseWheelTickLinearMil;
	if (currDropMil > fcsDrawUntilShellMil) { break; }  // termination condition

	// We check dropMils table and find the distance for currDropMil based on the curve
	// Due to this method, values between 0-50m and max+ will not be drawn
	//
	// Find first anchor index larger than currDropMil
	let largerAnchorIndex = fcsDrawnShell.dropMils.findIndex((a) => a.mil >= currDropMil);
	if (largerAnchorIndex <= 1) { continue; }
	let largerAnchor = fcsDrawnShell.dropMils[largerAnchorIndex];
	let smallerAnchor = fcsDrawnShell.dropMils[largerAnchorIndex - 1];
	// Find distance for currDropMil
	let currDist = (() => {
		let passSmallerPercentage =
			(currDropMil - smallerAnchor.mil) / (largerAnchor.mil - smallerAnchor.mil);
		return (
			smallerAnchor.d +
			(largerAnchor.d - smallerAnchor.d) * passSmallerPercentage
		);
	})();
	// Draw quad
	//sight.lines.addComment("Dist " + currDist);
	let currQuadCornerPos = getFcsQuadCornerPos(currDist);
	currQuadCornerPos[0] += lWCorr;
	currQuadCornerPos[1] += lWCorr;
	Toolbox.repeat(2, () => {
		// Upper height line
		let upperHoriFrom = [
			currQuadCornerPos[0]*0.5, -currQuadCornerPos[1]
		];
		let upperHoriTo = [
			-currQuadCornerPos[0]*0.5, -currQuadCornerPos[1]
		];
		sight.add(new Line({
			from: upperHoriFrom, to: upperHoriTo,
			moveRadial: true,
			radialCenter: fcsRadialCenter,
			radialAngle: fcsConfig.tickAngle * count,
			radialMoveSpeed: getAdjustedRadialSpeed(upperHoriFrom, upperHoriTo)
		}));
		// Lower height line
		for (let mirroring of [ {x: 1, y: 1}, {x: -1, y: 1}]) {
			let mirroredFrom = [
				currQuadCornerPos[0] * mirroring.x,
				currQuadCornerPos[1] * mirroring.y
			];
			let mirroredTo = [
				currQuadCornerPos[0] * mirroring.x * 0.5,
				currQuadCornerPos[1] * mirroring.y
			];
			sight.add(new Line({
				from: mirroredFrom, to: mirroredTo,
				moveRadial: true,
				radialCenter: fcsRadialCenter,
				radialAngle: fcsConfig.tickAngle * count,
				radialMoveSpeed: getAdjustedRadialSpeed(mirroredFrom, mirroredTo)
			}));
		}
		// Vertical lines
		for (let mirroring of [ {x: 1, y: 1}, {x: -1, y: 1}]) {
			let mirroredFrom = [
				currQuadCornerPos[0] * mirroring.x,
				currQuadCornerPos[1] * mirroring.y + 5
			];
			let mirroredTo = [
				currQuadCornerPos[0] * mirroring.x,
				currQuadCornerPos[1] * mirroring.y * 0
			];
			sight.add(new Line({
				from: mirroredFrom, to: mirroredTo,
				moveRadial: true,
				radialCenter: fcsRadialCenter,
				radialAngle: fcsConfig.tickAngle * count,
				radialMoveSpeed: getAdjustedRadialSpeed(mirroredFrom, mirroredTo)
			}));
		}
	});
	// OR, A full quad
	// for (let mirroring of [ {x: 1, y: 1}, {x: -1, y: -1}, {x: -1, y: 1}, {x: 1, y: -1}]) {
	// 	for (let toPos of [
	// 		[currQuadCornerPos[0], currQuadCornerPos[1] * 0.67],
	// 		[currQuadCornerPos[0] * 0.67, currQuadCornerPos[1]]
	// 	]) {
	// 		let mirroredFrom = [
	// 			currQuadCornerPos[0] * mirroring.x,
	// 			currQuadCornerPos[1] * mirroring.y,
	// 		];
	// 		let mirroredTo = [toPos[0] * mirroring.x, toPos[1] * mirroring.y];
	// 		sight.add(new Line({
	// 			from: mirroredFrom, to: mirroredTo,
	// 			moveRadial: true,
	// 			radialCenter: fcsRadialCenter,
	// 			radialAngle: fcsConfig.tickAngle * count,
	// 			radialMoveSpeed: getAdjustedRadialSpeed(mirroredFrom, mirroredTo)
	// 		}));
	// 	}
	// }
}


// HE shell tick lines
// 50m
Toolbox.repeat(2, () => {
	sight.add(new TextSnippet({
		text: "50", align: "center",
		pos: [0, getHeDrop(50) - 0.15],
		size: 0.4, move: true
	}));
});
// 100~2000m ticks
for (let d of Toolbox.rangeIE(100, 2000, 100)) {
	if (d == 100) {
		sight.add(new Line({
			from: [0, getHeDrop(d)], to: [-1, getHeDrop(d)], move: true
		}));
	} else if (d == 200) {
		sight.add(new Line({
			from: [0, getHeDrop(d)], to: [-1.8, getHeDrop(d)], move: true
		}));
	} else {
		if (d % 200 == 0) {
			sight.add(new Line({
				from: [0.2, getHeDrop(d)], to: [-0.2, getHeDrop(d)], move: true
			}));
		}
	}
	Toolbox.repeat(2, () => {
		let textPosX = -2.2;
		if (d >= 400) {
			let adjustedPosX = -getWidthMilHalf(d) - 1;  // note it's a minus-zero value
			if (adjustedPosX < textPosX) { textPosX = adjustedPosX; }
		}
		sight.add(new TextSnippet({
			text: (d % 200 == 0) ? (d / 100).toFixed() : ">", align: "left",
			pos: [textPosX, getHeDrop(d) - ((d % 200 == 0) ? 0.3 : 0.25)],
			size: 0.5, move: true
		}));
	});
}



// Assumed width prompt
sight.add(new TextSnippet({
	text: `W ${assumedTgtWidth}m,  L ${assumedTargetLength}m,  H ${assumedTgtHeight}m`,
	align: "right",
	pos: [0.148, 0.0075], thousandth: false,
	size: 0.6
}));
// Shell type prompt for ticks
let shellPromptTextY = 55;
sight.add([
	new TextSnippet({
		text: "HE", pos: [-25, shellPromptTextY], size: 0.9
	}),
	new TextSnippet({
		text: `Corred ${
			Math.min(...shell.he.dropMils.map((ele) => (ele.d))) / 100
		}-${
			Math.max(...shell.he.dropMils.map((ele) => (ele.d))) / 100
		}`,
		pos: [-25, shellPromptTextY + 4.5], size: 0.5
	}),
]);
sight.add([
	new TextSnippet({
		text: "HEAT", pos: [25, shellPromptTextY], size: 0.9
	}),
	new TextSnippet({
		text: `Corred ${
			Math.min(...shell.heat.dropMils.map((ele) => (ele.d))) / 100
		}-${
			Math.max(...shell.heat.dropMils.map((ele) => (ele.d))) / 100
		}`,
		pos: [25, shellPromptTextY + 4.5], size: 0.5
	}),
]);


// Binocular Calibration
Toolbox.repeat(2, () => {
	sight.add(bino.getCommonTwoTicks({
		pos: [54, 20], assumedTgtWidth: assumedTgtWidth,
		showAssumedTgtWidth: true,
		upperTickShownAlwaysUseRound: binoCaliUpperTickUseRound,
	}));
});


// Target angle legend
Toolbox.repeat(2, () => {
	sight.add(tgtLgd.getAngleLegendGround({
		pos: [54, 32],
		assumedTargetWidth: assumedTgtWidth,
		assumedTargetLength: assumedTargetLength,
		assumedTargetHeight: 0.7,
		textSize: 0.45,
		displayedAngles: [0, 15, 30, 45, 60, 75, 90],
		widthIndicationArrowHeight: 0.5,
		showAssumedTargetSize: false,
	}));
});





//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
