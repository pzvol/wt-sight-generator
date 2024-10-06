
import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";
import templateComp from "./sight_bases/template_components/all.js"

import ENV_SET from "./sight_bases/_env_settings.js";


let sight = new Sight();
sight.matchVehicle("it_vbc_pt2");


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoomSmall2Font(),
	pd.basic.colors.getLightGreenRed(),
	// pd.basicBuild.rgfdPos([110, -0.02225]),
	// pd.basicBuild.detectAllyPos([110, -0.050]),
	// pd.basicBuild.gunDistanceValuePos([-0.167, 0.035]),
	pd.basicBuild.rgfdPos([110, -0.03625]),
	pd.basicBuild.detectAllyPos([110, -0.064]),
	pd.basicBuild.gunDistanceValuePos([-0.167, 0.05]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.003, 0.0012],
		[0.002, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// SHELL DISTANCES ////
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 2000, shown: 20, shownPos: [10, 0] },  // wider the line w/o seeing the value
	{ distance: 4000, shown: 40 },
]);


//// SIGHT DESIGNS ////
let shells = {
	he: { name: "HE", spd: 1100 * 3.6 },
	apfsds: { name: "APFSDS", spd: 1385 * 3.6 },
};

let airTgting = {
	shell: shells.apfsds,
	tgtSpd: 500,  // kph
};
let gndTgting = {
	shell: shells.he,
	tgtSpd: 55,  // kph
};
let getAirLdn = (aa) => Toolbox.calcLeadingMil(
	airTgting.shell.spd, airTgting.tgtSpd, aa
);
let getGndLdn = (aa) => Toolbox.calcLeadingMil(
	gndTgting.shell.spd, gndTgting.tgtSpd, aa
);


// Sight center
for (let bias of Toolbox.rangeIE(-0.08, 0.08, 0.04)) {
	//sight.add(new Line({ from: [1, bias], to: [3, bias] }).withMirrored("x"));
	sight.add(new Line({
		from: [getGndLdn(0.25), bias], to: [getGndLdn(0.25) - 2, bias]
	}).withMirrored("x"));
}


// Gun center
Toolbox.repeat(2, () => {
	sight.add(new Line({ from: [0.25, 0], to: [-0.25, 0], move: true }));
	sight.add(new Line({ from: [0, 0.25], to: [0, -0.25], move: true }));
});


// Lower vertical line
sight.add([
	new Line({ from: [0, 8.25], to: [0, 450] }),
	new Line({ from: [0.04, 8.25], to: [0.04, 450] }).withMirrored("x"),
]);


// Air leading circles
// Curves
let segHalfLen = 15;
//   lower
sight.add(new Circle({
	segment: [1.2, segHalfLen], diameter: getAirLdn(1) * 2, size: 4.8
}).withMirroredSeg("x"));
sight.add(new Circle({
	segment: [2.4, segHalfLen], diameter: getAirLdn(0.5) * 2, size: 4
}).withMirroredSeg("x"));
//   others
for (let segCenter of [90, 180, 270]) {
	sight.add(new Circle({
		segment: [segCenter - segHalfLen, segCenter + segHalfLen],
		diameter: getAirLdn(1) * 2, size: 4.8
	}));
	sight.add(new Circle({
		segment: [segCenter - segHalfLen, segCenter + segHalfLen],
		diameter: getAirLdn(0.5) * 2, size: 4
	}));
}
// Texts
// 4/4
sight.add(new TextSnippet({
	text: `${airTgting.tgtSpd} kph  ${airTgting.shell.name}`,
	pos: [3, getAirLdn(1) + 3.5],
	align: "right", size: 2
}));
// 2/4
sight.add(new TextSnippet({
	text: (airTgting.tgtSpd * 0.5).toFixed(),
	pos: [3, getAirLdn(0.5) + 3.5],
	align: "right", size: 2
}));


// Ground moving offsets
sight.add(templateComp.leadingReticleArrowType({
	assumedMoveSpeed: gndTgting.tgtSpd,
	shellSpeed: gndTgting.shell.spd,

	textYPosDefault: 1.7 - 0.03,
	textSizeDefault: 0.5,
	lineTickXOffsetsDefault: [-0.02, 0.02],

	tickParams: [
		{
			type: "arrow", aa: 1, yLen: 0.8,
			text: "_tick_speed_", textRepeated: false
		},
		{
			type: "line", aa: 0.75, yLen: 0.4,
			text: "_tick_speed_", textSize: 0.45,
		},
		{
			type: "arrow", aa: 0.5, yLen: 0.7,
			text: "_tick_speed_", textSize: 0.45,
		},
		{
			type: "line", aa: 0.25, yLen: 0.4,
		},
	],
}));


//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
