import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";

import ENV_SET from "./helper/env_settings.js";
import * as pd from "./helper/predefined.js";
import * as calc from "./helper/calculators.js";
import comp from "./components/all.js";

import rgfd from "./extra_modules/rangefinder.js"
import binoCali from "./extra_modules/binocular_calibration_2.js"
import tgtLegend from "./extra_modules/target_legend.js"


let sight = new Sight();
// let horiRatioMult = new calc.HoriRatioMultCalculator(
// 	16 / 9, ENV_SET.DISPLAY_RATIO_NUM
// ).getMult();
let assumedTargetWidth = ENV_SET.DEFAULT_ASSUMED_TARGET_WIDTH;
let assumedTargetLength = assumedTargetWidth * 2;
let distMil = new calc.DistMilCalculator(assumedTargetWidth);


// Introduction comment
sight.addDescription(`
Sight for Churchill AVRE. Assumes enemies to be ${assumedTargetWidth}m wide and
${assumedTargetLength}m long.
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatSettings(
	pd.sScale.build({ font: 0.9, line: 1.2 }),
	pd.sColor.getLightGreenRed(),
	pd.sRgfd.build([300, -5], {
		useThousandthPos: true,
	}),
	pd.sDetectAlly.build([300, 0.015]),
	pd.sGunDistValue.build([-0.22, 0.02]),
	pd.sShellDistTick.build(
		[0, 0],
		[0, 0],
		[0.017, 0]
	),
));


//// VEHICLE TYPES ////
sight.matchVehicle("uk_churchill_avre");


//// SHELL DISTANCES ////


//// SIGHT DESIGNS ////
let gunMaxDist = 125;  // How far the gun can shoot horizontally
let shellParams = {
	spd: 50,  // m/s
	dropMils: [
		{ d: 0, mil: 0 },
		{ d: 10, mil: 26.1153 },
		{ d: 20, mil: 45.1 },
		{ d: 30, mil: 64.1916 },
		{ d: 40, mil: 83.2368 },
		{ d: 50, mil: 102.364 },
		{ d: 60, mil: 121.682 },
		{ d: 70, mil: 141.335 },
		{ d: 80, mil: 161.435 },
		{ d: 90, mil: 182.139 },
		{ d: 100, mil: 203.599 },
		{ d: 110, mil: 225.971 },
		{ d: 120, mil: 249.438 },
		{ d: 130, mil: 274.195 },
		{ d: 140, mil: 300.491 },
		{ d: 150, mil: 329.119 },
		{ d: 160, mil: 359.746 },
		{ d: 170, mil: 393.3 },
		{ d: 180, mil: 430.699 },
		{ d: 190, mil: 474.413 },
		{ d: 200, mil: 526.467 },
	]
}
let getDropMil = (d) => shellParams.dropMils.find((tick) => (tick.d === d)).mil;
// Line width correction, added for avoiding the interference of line while
// measuing with some elements by moving one line side to the proper position
let lWCorr = 0.15;


// Sight center dot
sight.add(new Circle({ diameter: 0.5, size: 6 }));
sight.add(new Circle({ diameter: 1, size: 3 }));
sight.add(new Circle({ diameter: 1.5, size: 1.5 }));


// Gun center
sight.add(new Line({ from: [-1.5, 0], to: [1.5, 0], move: true }));
//  vertical line
sight.add([
	new Line({ from: [0, 0], to: [0, getDropMil(20)], move: true }),
	new Line({ from: [0, getDropMil(200)], to: [0, 1000], move: true }),
]);
//   max range indication
sight.add(new Circle({
	segment: [90 - 20, 90 + 20],
	size: 2.4,
	diameter: distMil.for(gunMaxDist)
}).withMirroredSeg("x"));


// Horizontal line
sight.add(new Line({
	from: [distMil.halfFor(20), 0], to: [0, 0]
}).withMirrored("x").addBreakAtX(0, distMil.for(gunMaxDist))).repeatLastAdd();
//   bold
sight.add(new Line({
	from: [1000, 0], to: [distMil.halfFor(10), 0]
}).withMirrored("x")).repeatLastAdd();


// Vertical line for 0-10m
// sight.add(new Line({
// 	from: [distMil.halfFor(10) + lWCorr, 0],
// 	to: [distMil.halfFor(10) + lWCorr, getDropMil(10)],
// 	move: true
// }).withMirrored("x").addBreakAtY(getDropMil(10), 5));
// sight.add(new Line({
// 	from: [distMil.halfFor(10) - 1 + lWCorr, 0],
// 	to: [distMil.halfFor(10) + 1 + lWCorr, 0],
// 	move: true,
// }).withMirrored("x"));


// Funnel line
let funnelLineFrags = [];
for (
	let thisTickIndex = 1;
	thisTickIndex <= shellParams.dropMils.length - 2;
	thisTickIndex++
) {
	let thisTick = shellParams.dropMils[thisTickIndex];
	let nextTick = shellParams.dropMils[thisTickIndex + 1];

	if (thisTick.d == 0) { continue; }

	let lineFrag = new Line({
		from: [distMil.halfFor(thisTick.d) + lWCorr, thisTick.mil],
		to: [distMil.halfFor(nextTick.d) + lWCorr, nextTick.mil],
		move: true
	}).withMirrored("x");
	funnelLineFrags.push({
		start: thisTick.d,
		end: nextTick.d,
		line: lineFrag,
	});
	sight.add(lineFrag).repeatLastAdd();
}


// Funnel line labels
// 10m
for (let tick of shellParams.dropMils) {
	if (tick.d == 0) { continue; }
	if (tick.d < 100) {
		sight.add(new TextSnippet({
			text: tick.d.toFixed(),
			pos: [distMil.halfFor(tick.d) + lWCorr, tick.mil - 0.4],
			size: 1, move: true
		}).withMirrored("x"));
		for (let lineFrag of [
			funnelLineFrags.find((f) => f.start == tick.d),
			funnelLineFrags.find((f) => f.end == tick.d),
		]) {
			if (!lineFrag) { continue; }
			if (lineFrag.end <= 30) {
				lineFrag.line.addBreakAtX(distMil.halfFor(tick.d), 7);
			} else {
				lineFrag.line.addBreakAtY(tick.mil, 6);
			}
		}

	} else {
		sight.add(new TextSnippet({
			text: `${tick.d.toFixed()}  >`,
			align: "left",
			pos: [-distMil.halfFor(tick.d) - 1.5 + lWCorr, tick.mil - 0.4],
			size: 0.8, move: true
		}));
		sight.add(new TextSnippet({
			text: `<`,
			align: "left",
			pos: [-distMil.halfFor(tick.d) - 1.5 + lWCorr, tick.mil - 0.4],
			size: 0.8, move: true
		}).mirrorX());
	}
}

(() => {
	let anchorAngles = [];
	// OR, Use average of prev and next
	for (let i = 1; i < (shellParams.dropMils.length - 1); i++) {
		let prevAnchor = shellParams.dropMils[i - 1];
		let currAnchor = shellParams.dropMils[i];
		let nextAnchor = shellParams.dropMils[i + 1];
		let distDiff = nextAnchor.d - prevAnchor.d;
		let heightDiff = Toolbox.calcSizeFromMil(nextAnchor.mil, nextAnchor.d) - Toolbox.calcSizeFromMil(prevAnchor.mil, prevAnchor.d);
		let angleTan = heightDiff / distDiff;
		let angle = Toolbox.radToDeg(Math.atan(angleTan));
		anchorAngles.push({
			d: currAnchor.d, mil: currAnchor.mil,
			angle: angle, tan: angleTan
		});
	}
	// Draw wanted ticks
	let drawn = anchorAngles
	for (let a of drawn) {
		sight.add(new TextSnippet({
			text: `${a.angle.toFixed()}°`, align: "center",
			pos:
				a.d <= 90 ? [-distMil.halfFor(a.d) - 3, a.mil + 4] :
				[-distMil.halfFor(a.d) - 10 - 3, a.mil + 4],
			size: 0.5, move: true
		}));
	}
})();

// Assumed width prompt
// sight.add(new TextSnippet({
// 	text: `Width  ${assumedTargetWidth}m`, align: "right",
// 	pos: [distMil.halfFor(10) + 15, 4], thousandth: true,
// 	size: 1.2
// }));

// Target angle estimation
let tgtAngleLegend = tgtLegend.getAngleLegendGround({
	pos: [distMil.halfFor(20), 80],
	assumedTargetWidth: assumedTargetWidth,
	widthOnSight: assumedTargetWidth * 4,
	assumedTargetLength: assumedTargetLength,
	assumedTargetHeight: 0.6,
	textRowInterval: 5,
	widthIndicationArrowHeight: 0.5,

	textColumnWidth: 10,
	textSize: 0.9,
	textPaddingY: -0.6,

	widthIndicationArrowHeight: 1.5
});
sight.add([
	...tgtAngleLegend,
	...tgtAngleLegend.filter((ele) => (ele instanceof Line)),
]);



//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
