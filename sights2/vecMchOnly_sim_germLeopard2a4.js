import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import base from "./g_l_z4z12_g120_slow.js";
import { BlkVariable } from "../_lib2/sight_code_basis.js";
let sight = base.sightObj;


//// VEHICLE TYPES ////
sight.components.matchVehicleClasses.clear();
sight.matchVehicle([
	"germ_leopard_2a4",
	"germ_leopard_2pl",
]);



//// ADDITIONAL ELEMENTS (IF ANY) ////
// Move gun correction info further left side
sight.updateOrAddSettings(pd.basicBuild.gunDistanceValuePos([-0.36, 0.015]));


let assumedTgtWidth = 3.3;
let getMil = (dist) => Toolbox.calcDistanceMil(assumedTgtWidth, dist);
let getHalfMil = (dist) => (getMil(dist) / 2);


// Sim Real Gun Aimed Pos prompt

// Aimed position for close-range shooting
let simAimedPos = [
	{ dist: -1, pos: [-450, 112] },  // for drawing line for gun only
	{ dist: 25, pos: [-29.68, 7.5] },
	{ dist: 50, pos: [-14.8, 3.85] },
	{ dist: 100, pos: [-7.01, 2.03] },
	{ dist: 200, pos: [-3.9, 1.39] },
];
let getSimAimedPos = (d) => simAimedPos.find((ele) => (ele.dist === d)).pos;
// Aimed pos after auto-correction from laser rgfd
let simAimedPosWithLaser = [
	{ dist: 25, pos: [-26.5, 6.74] },
	{ dist: 50, pos: [-11.7, 3.08] },
	{ dist: 100, pos: [-3.89, 1.24] },
	{ dist: 200, pos: [0, 0.44] },
];
let getSimAimedPosWithLaser = (d) => simAimedPosWithLaser.find((ele) => (ele.dist === d)).pos;

let isMoved = true;
// Shell points of fall
// 0-25m
sight.add(new Line({
	from: getSimAimedPos(-1), to: getSimAimedPos(25), move: isMoved
}).addBreakAtX(getSimAimedPos(25)[0], 4));
// 25m
sight.add(new Circle({
	pos: getSimAimedPos(25),
	diameter: 1, size: 4, move: isMoved
}));
if (isMoved) {
	sight.add(new Circle({
		pos: getSimAimedPosWithLaser(25),
		diameter: 0.5, size: 4, move: isMoved
	}));
	sight.add(new Line({ from: getSimAimedPos(25), to: getSimAimedPosWithLaser(25), move: isMoved }).
		addBreakAtX(getSimAimedPos(25)[0], 1).
		addBreakAtX(getSimAimedPosWithLaser(25)[0], 0.5)
	);
}
sight.add(new TextSnippet({
	text: "25", pos: getSimAimedPos(25), size: 1.5, move: isMoved
}).move([0, 2.0]));
sight.add(new TextSnippet({
	text: "m", pos: getSimAimedPos(25), size: 0.9, move: isMoved
}).move([1.8, 2.0 + 0.5]));
// 50m
sight.add(new Circle({
	pos: getSimAimedPos(50),
	diameter: 0.75, size: 4, move: isMoved
}));
if (isMoved) {
	sight.add(new Circle({
		pos: getSimAimedPosWithLaser(50),
		diameter: 0.375, size: 4, move: isMoved
	}));
	sight.add(new Line({ from: getSimAimedPos(50), to: getSimAimedPosWithLaser(50), move: isMoved }).
		addBreakAtX(getSimAimedPos(50)[0], 0.75).
		addBreakAtX(getSimAimedPosWithLaser(50)[0], 0.375)
	);
}
sight.add(new TextSnippet({
	text: "50", pos: getSimAimedPos(50), size: 1.0, move: isMoved
}).move([0, 1.5]));
sight.add(new TextSnippet({
	text: "m", pos: getSimAimedPos(50), size: 0.6, move: isMoved
}).move([1.3, 1.5 + 0.3]));
// 100m
sight.add(new Circle({
	pos: getSimAimedPos(100),
	diameter: 0.4, size: 2.5, move: isMoved
}));
if (isMoved) {
	sight.add(new Circle({
		pos: getSimAimedPosWithLaser(100),
		diameter: 0.25, size: 2, move: isMoved
	}));
	sight.add(new Line({ from: getSimAimedPos(100), to: getSimAimedPosWithLaser(100), move: isMoved }).
		addBreakAtX(getSimAimedPos(100)[0], 0.4).
		addBreakAtX(getSimAimedPosWithLaser(100)[0], 0.25).
		addBreakAtX(
			(getSimAimedPos(100)[0] + getSimAimedPosWithLaser(100)[0]) / 2,
			Toolbox.calcLineLength(
				getSimAimedPos(100), getSimAimedPosWithLaser(100)
			) / 3
		)
	);
}
sight.add(new TextSnippet({
	text: "1", pos: getSimAimedPos(100), size: 0.8, move: isMoved
}).move([0, 1.0]));
// 200m
if (!isMoved) {
	sight.add(new Circle({
		pos: getSimAimedPos(200),
		diameter: 0.15, size: 2.5, move: isMoved
	}));
	sight.add(new TextSnippet({
		text: "2", pos: getSimAimedPos(200), size: 0.5, move: isMoved
	}).move([0, 0.6]));
}


// Width prompts for points of fall

// Shorthand for drawing vertical mirrored bold line
let drawVertBoldLine = (centerPos, xOffset, yLen, drawnXBiases = [0]) => {
	let elements = [];
	for (let biasX of drawnXBiases) {
		elements.push(new Line({
			from: [xOffset + biasX, 0], to: [xOffset + biasX, yLen],
			move: isMoved
		}).move(centerPos));
		elements.push(new Line({
			from: [-xOffset + biasX, 0], to: [-xOffset + biasX, yLen],
			move: isMoved
		}).move(centerPos));
	}
	return elements;
}
// Shorthand for drawing horizontal bold line
let drawHoriBoldLine = (centerPos, xLenHalf, middleBreakWidth, drawnYBiases = [0]) => {
	let elements = [];
	for (let biasY of drawnYBiases) {
		elements.push(new Line({
			from: [-xLenHalf, biasY], to: [xLenHalf, biasY],
			move: isMoved
		}).move(centerPos).addBreakAtX(centerPos[0], middleBreakWidth));
	}
	return elements;
}


// 25m
sight.add([
	new TextSnippet({
		text: "25m", align: "right",
		pos: [-getHalfMil(25) + 1.8, 3],
		size: 1.8, move: isMoved
	}).move(getSimAimedPos(25)),
	...drawVertBoldLine(getSimAimedPos(25), getHalfMil(25), 6, Toolbox.rangeIE(-0.15, 0.15, 0.05)),
	...drawHoriBoldLine(
		getSimAimedPos(25),
		getHalfMil(25),
		(
			getHalfMil(100) - 1 -
			Math.abs(getSimAimedPos(100)[0]) +
			Math.abs(getSimAimedPos(25)[0])
		) * 2,
		Toolbox.rangeIE(-0.03, 0.03, 0.03))
]);
// 50m
sight.add([
	new TextSnippet({
		text: "50", align: "right",
		pos: [-getHalfMil(50) + 1, 1.5],
		size: 1.4, move: isMoved
	}).move(getSimAimedPos(50)),
	...drawVertBoldLine(getSimAimedPos(50), getHalfMil(50), 3, Toolbox.rangeIE(-0.10, 0.10, 0.05)),
	...drawHoriBoldLine(
		getSimAimedPos(50), getHalfMil(50),
		(getHalfMil(50) - 6) * 2,
		Toolbox.rangeIE(-0.02, 0.02, 0.02)
	)
]);
// 100m
sight.add([
	new TextSnippet({
		text: "1", align: "right",
		pos: [-getHalfMil(100) + 0.4, 0.9],
		size: 0.8, move: isMoved
	}).move(getSimAimedPos(100)),
	...drawVertBoldLine(getSimAimedPos(100), getHalfMil(100), 2, Toolbox.rangeIE(-0.06, 0.06, 0.06)),
	...drawHoriBoldLine(
		getSimAimedPos(100), getHalfMil(100),
		getMil(100) - 2,
		Toolbox.rangeIE(-0.02, 0.02, 0.02)
	)
]);
// 200m
sight.add([
	new TextSnippet({
		text: "2", align: "right",
		pos: [-getHalfMil(200) + 0.3, 0.5],
		size: 0.5, move: isMoved
	}).move(getSimAimedPos(200)),
	...drawVertBoldLine(getSimAimedPos(200), getHalfMil(200), 1, Toolbox.rangeIE(-0.05, 0.05, 0.05)),
	...drawHoriBoldLine(
		getSimAimedPos(200), getHalfMil(200),
		getMil(200) - 0.5,
		Toolbox.rangeIE(-0.02, 0.02, 0.02)
	)
]);


// Move detect-ally text if 100m width is shown
let detectAllyVar = sight.components.sightSettings.settingLines.find((v) => (
	v instanceof BlkVariable && v.getName() === "detectAllyOffset"
));
let detectAllyVarValue = detectAllyVar.getValue();
detectAllyVarValue[1] += 0.055;
detectAllyVar.setValue(detectAllyVarValue);




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
