import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import base from "./g_l_z4z12_g120.js";
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
sight.components.sightSettings.removeVariableByName("distanceCorrectionPos");
sight.addSettings(pd.basicBuild.gunDistanceValuePos([-0.36, 0.015]));


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
];
let getSimAimedPos = (d) => simAimedPos.find((ele) => (ele.dist === d)).pos;
// Aimed pos after auto-correction from laser rgfd
let simAimedPosWithLaser = [
	{ dist: 25, pos: [-28.16, 15.42] },  // TODO
	{ dist: 50, pos: [-11.91, 6.59] },
	{ dist: 100, pos: [-3.98, 2.4] },
];
let getSimAimedPosWithLaser = (d) => simAimedPosWithLaser.find((ele) => (ele.dist === d)).pos;

let isMoved = true;
// 0-25m
sight.add(new Line({
	from: getSimAimedPos(-1), to: getSimAimedPos(25), move: isMoved
}).addBreakAtX(getSimAimedPos(25)[0], 4));
// 25m
sight.add(new Circle({
	pos: getSimAimedPos(25),
	diameter: 1, size: 4, move: isMoved
}));
sight.add(new Circle({
	pos: getSimAimedPosWithLaser(25),
	diameter: 0.5, size: 4, move: isMoved
}));
sight.add(new Line({ from: getSimAimedPos(25), to: getSimAimedPosWithLaser(25), move: isMoved }).
	addBreakAtX(getSimAimedPos(25)[0], 1).
	addBreakAtX(getSimAimedPosWithLaser(25)[0], 0.5)
);
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
sight.add(new Circle({
	pos: getSimAimedPosWithLaser(50),
	diameter: 0.375, size: 4, move: isMoved
}));
sight.add(new Line({ from: getSimAimedPos(50), to: getSimAimedPosWithLaser(50), move: isMoved }).
	addBreakAtX(getSimAimedPos(50)[0], 0.75).
	addBreakAtX(getSimAimedPosWithLaser(50)[0], 0.375)
);
sight.add(new TextSnippet({
	text: "50", pos: getSimAimedPos(50), size: 1.0, move: isMoved
}).move([0, 1.5]));
sight.add(new TextSnippet({
	text: "m", pos: getSimAimedPos(50), size: 0.6, move: isMoved
}).move([1.3, 1.5 + 0.3]));
// 100m
sight.add(new Circle({
	pos: getSimAimedPos(100),
	diameter: 0.3, size: 2, move: isMoved
}));
sight.add(new Circle({
	pos: getSimAimedPosWithLaser(100),
	diameter: 0.15, size: 2, move: isMoved
}));
sight.add(new Line({ from: getSimAimedPos(100), to: getSimAimedPosWithLaser(100), move: isMoved }).
	addBreakAtX(getSimAimedPos(100)[0], 0.3).
	addBreakAtX(getSimAimedPosWithLaser(100)[0], 0.15)
);
sight.add(new TextSnippet({
	text: "1", pos: getSimAimedPos(100), size: 0.9, move: isMoved
}).move([0, 1.0]));


// Width prompt for 25m
let wPLineTplt25 = new Line({
	from: [50, 0], to: [getHalfMil(25), 0], move: isMoved
});
sight.add([
	wPLineTplt25.copy().move(getSimAimedPos(25)),
	wPLineTplt25.copy().mirrorX().move(getSimAimedPos(25)),
	new TextSnippet({
		text: "25m width", align: "right",
		pos: [-getHalfMil(25) + 1.5, 1.5],
		size: 1.5, move: isMoved
	}).move(getSimAimedPos(25)),
	new Circle({
		segment: [88, 90], diameter: getMil(25), size: 8, move: isMoved
	}).move(getSimAimedPos(25)),
	new Circle({
		segment: [88, 90], diameter: getMil(25), size: 8, move: isMoved
	}).mirrorSegmentX().move(getSimAimedPos(25)),
]);
// Width prompt for 50m
let wPLineTplt50 = new Line({
	from: [getHalfMil(50) - 6, 0], to: [getHalfMil(50), 0], move: isMoved
});
sight.add([
	wPLineTplt50.copy().move(getSimAimedPos(50)),
	wPLineTplt50.copy().mirrorX().move(getSimAimedPos(50)),
	new TextSnippet({
		text: "50", align: "right",
		pos: [-getHalfMil(50) + 1, 1],
		size: 1.2, move: isMoved
	}).move(getSimAimedPos(50)),
	new Circle({
		segment: [87, 90], diameter: getMil(50), size: 6, move: isMoved
	}).move(getSimAimedPos(50)),
	new Circle({
		segment: [87, 90], diameter: getMil(50), size: 6, move: isMoved
	}).mirrorSegmentX().move(getSimAimedPos(50)),
]);
// Width prompt for 100m
let wPLineTplt100 = new Line({
	from: [getHalfMil(100) - 1, 0], to: [getHalfMil(100), 0], move: isMoved
});
sight.add([
	wPLineTplt100.copy().move(getSimAimedPos(100)),
	wPLineTplt100.copy().mirrorX().move(getSimAimedPos(100)),
	new TextSnippet({
		text: "1", align: "right",
		pos: [-getHalfMil(100) + 0.4, 0.6],
		size: 0.6, move: isMoved
	}).move(getSimAimedPos(100)),
	new Circle({
		segment: [86, 90], diameter: getMil(100), size: 4, move: isMoved
	}).move(getSimAimedPos(100)),
	new Circle({
		segment: [86, 90], diameter: getMil(100), size: 4, move: isMoved
	}).mirrorSegmentX().move(getSimAimedPos(100)),
]);




//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
