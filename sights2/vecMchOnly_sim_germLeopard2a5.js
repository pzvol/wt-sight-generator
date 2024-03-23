import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import base from "./g_l_z4z12_g120_slow.js";
let sight = base.sightObj;


//// VEHICLE TYPES ////
sight.components.matchVehicleClasses.clear();
sight.matchVehicle([
	"germ_leopard_2a5",
	"germ_leopard_2a5_pso",
	"germ_leopard_2a6",
]);



//// ADDITIONAL ELEMENTS (IF ANY) ////
// Move gun correction info further left side
sight.updateOrAddSettings(pd.basicBuild.gunDistanceValuePos([-0.36, 0.015]));


// Find line elements for aiming
let sightReticleLines = sight.lines.getAllElements().filter((ele) => (
	(ele instanceof Line) &&
	(ele.lineEnds.from[1] > 100 || ele.lineEnds.to[1] > 100)
));


let assumedTgtWidth = 3.3;
let getMil = (dist) => Toolbox.calcDistanceMil(assumedTgtWidth, dist);
let getHalfMil = (dist) => (getMil(dist) / 2);


// Sim Real Gun Aimed Pos prompt

// Aimed position for close-range shooting
let simAimedPos = [
	{ dist: -1, pos: [-450, 239] },  // for drawing line for gun only
	{ dist: 25, pos: [-31.35, 17.17] },
	{ dist: 50, pos: [-15.86, 8.73] },
	{ dist: 100, pos: [-7.15, 4.03] },
	{ dist: 200, pos: [-3.18, 2.12] },
];
let getSimAimedPos = (d) => simAimedPos.find((ele) => (ele.dist === d)).pos;
// Aimed pos after auto-correction from laser rgfd
let simAimedPosWithLaser = [
	{ dist: 25, pos: [-28.16, 15.42] },  // TODO
	{ dist: 50, pos: [-11.91, 6.59] },
	{ dist: 100, pos: [-3.98, 2.4] },
	{ dist: 200, pos: [0, 0.44] },
];
let getSimAimedPosWithLaser = (d) => simAimedPosWithLaser.find((ele) => (ele.dist === d)).pos;

// If uses movable scheme
let isMoved = false;
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
		addBreakAtX(getSimAimedPosWithLaser(100)[0], 0.25)
	);
}
sight.add(new TextSnippet({
	text: "1", pos: getSimAimedPos(100), size: 0.8, move: isMoved
}).move([0, 1.0]));
// 200m
sight.add(new Circle({
	pos: getSimAimedPos(200),
	diameter: 0.15, size: 2.5, move: isMoved
}));
if (isMoved) {
	sight.add(new Line({ from: getSimAimedPos(200), to: getSimAimedPosWithLaser(200), move: isMoved }).
		addBreakAtX(getSimAimedPos(200)[0], 0.15).
		addBreakAtX(
			getSimAimedPosWithLaser(200)[0],
			Toolbox.calcLineLength(getSimAimedPos(200), getSimAimedPosWithLaser(200)) * 1.5
		)
	);
}
sight.add(new TextSnippet({
	text: "2", pos: getSimAimedPos(200), size: 0.5, move: isMoved
}).move([0, 0.6]));


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
	// new TextSnippet({
	// 	text: "25m", align: "right",
	// 	pos: [-getHalfMil(25) + 1.5, 2],
	// 	size: 1.8, move: isMoved
	// }).move(getSimAimedPos(25)),
	...drawVertBoldLine(getSimAimedPos(25), getHalfMil(25), 6, Toolbox.rangeIE(-0.15, 0.15, 0.05)),
	...drawHoriBoldLine(getSimAimedPos(25), getHalfMil(25), 10, Toolbox.rangeIE(-0.03, 0.03, 0.03))
]);
// 50m
sight.add([
	// new TextSnippet({
	// 	text: "50", align: "right",
	// 	pos: [-getHalfMil(50) + 1.5, 2],
	// 	size: 1.4, move: isMoved
	// }).move(getSimAimedPos(50)),
	...drawVertBoldLine(getSimAimedPos(50), getHalfMil(50), 4, Toolbox.rangeIE(-0.10, 0.10, 0.05)),
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
		pos: [-getHalfMil(200) + 0.3, 0.75],
		size: 0.6, move: isMoved
	}).move(getSimAimedPos(200)),
	...drawVertBoldLine(getSimAimedPos(200), getHalfMil(200), 1.5, Toolbox.rangeIE(-0.04, 0.04, 0.04)),
	...drawHoriBoldLine(
		getSimAimedPos(200), getHalfMil(200),
		getMil(200) - 1,
		Toolbox.rangeIE(-0.02, 0.02, 0.02)
	)
]);


// Edit aiming arrow
sightReticleLines.forEach((ele) => {
	if (!(ele instanceof Line)) {return;}
	// if (ele.lineEnds.from[0] === ele.lineEnds.to[0]) {return;}
	let breakRange = [
		getSimAimedPos(25)[1] + 0.5,
		getSimAimedPos(25)[1] - (isMoved ? 4.5 : 1)
	];
	let breakWidth = breakRange[0] - breakRange[1];
	if (ele.lineEnds.from[0] !== ele.lineEnds.to[0]) {
		breakWidth /= Math.cos(Toolbox.degToRad(40))
	}
	ele.addBreakAtY(
		(breakRange[0] + breakRange[1]) / 2,
		breakWidth,
	);
})




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
