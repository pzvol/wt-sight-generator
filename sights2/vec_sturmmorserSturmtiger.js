// SCRIPT_COMPILE_TO=germ_sturmmorser_sturmtiger

import { BlkBlock, BlkVariable } from "../_lib2/sight_code_basis.js";
import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import bino from "./sight_components/binocular_calibration_2.js"
import tgtLgd from "./sight_components/target_legend.js"


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Sight for Sturmtiger
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basicBuild.scale({ font: 0.9, line: 1.2 }),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([170, -10]),
	pd.basicBuild.detectAllyPos([170, 0.015]),  // [170, -0.055]
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
// NOT NECESSARY HERE

//// SHELL DISTANCES ////
// NOT NECESSARY HERE


//// SIGHT DESIGNS ////
// Target size assumption
let assumedTgtWidth = 3.3;
let binoCaliUpperTickUseRound = false;
let assumedTargetLength = 6.6;
let getMilHalf = (dist) => (Toolbox.calcDistanceMil(assumedTgtWidth, dist) / 2);
// Shell info and falldown mils
let shell = {
	spd: 250,  // m/s
	dropMils: [
		// Data extracted from the official sight
		// Reference: https://github.com/gszabi99/War-Thunder-Datamine/blob/3a032f0d5d724d693c4798b44e390bed14c0c98f/aces.vromfs.bin_u/config/tanksights.blkx
		{ d: 0, mil: 0 },
		{ d: 50, mil: 35 },
		{ d: 100, mil: 47 },
		{ d: 150, mil: 53.5 },
		{ d: 200, mil: 59 },
		{ d: 250, mil: 63.7 },
		{ d: 300, mil: 67 },
		{ d: 350, mil: 71.3 },
		{ d: 400, mil: 76 },
		{ d: 450, mil: 80.7 },
		{ d: 500, mil: 84.8 },
		{ d: 550, mil: 88.9 },
		{ d: 600, mil: 93.8 },
		{ d: 650, mil: 98 },
		{ d: 700, mil: 102.2 },
		{ d: 750, mil: 106.5 },
		{ d: 800, mil: 110 },
		{ d: 850, mil: 114.3 },
		{ d: 900, mil: 118.5 },
		{ d: 950, mil: 123 },
		{ d: 1000, mil: 127.5 },
		{ d: 1050, mil: 131.5 },
		{ d: 1100, mil: 135.5 },
		{ d: 1150, mil: 139.5 },
		{ d: 1200, mil: 143.5 },
		{ d: 1250, mil: 148 },
		{ d: 1300, mil: 152.5 },
		{ d: 1350, mil: 157 },
		{ d: 1400, mil: 161 },
		{ d: 1450, mil: 165.3 },
		{ d: 1500, mil: 169.5 },
		{ d: 1550, mil: 173.8 },
		{ d: 1600, mil: 178 },
		{ d: 1650, mil: 182.3 },
		{ d: 1700, mil: 186.5 },
		{ d: 1800, mil: 195 },
		{ d: 1900, mil: 203.5 },
		{ d: 2000, mil: 212 },
		{ d: 2100, mil: 221.9 },
		{ d: 2200, mil: 231.8 },
		{ d: 2300, mil: 241.7 },
		{ d: 2400, mil: 251.6 },
		{ d: 2500, mil: 261.5 },
		{ d: 2600, mil: 271.4 },
		{ d: 2700, mil: 281.3 },
		{ d: 2800, mil: 291.2 },
		{ d: 2900, mil: 301.1 },
		{ d: 3000, mil: 311 }

		// Data from another user-made sight
		// { d: 0, mil: 0 },
		// { d: 50, mil: 35 },
		// { d: 100, mil: 45 },
		// { d: 150, mil: 53.25 },
		// { d: 200, mil: 57 },
		// { d: 250, mil: 63.75 },
		// { d: 300, mil: 68 },
		// { d: 350, mil: 71.25 },
		// { d: 400, mil: 76 },
		// { d: 450, mil: 80.25 },
		// { d: 500, mil: 84 },
		// { d: 550, mil: 89 },
		// { d: 600, mil: 92 },
		// { d: 650, mil: 98 },
		// { d: 700, mil: 102 },
		// { d: 750, mil: 106.25 },
		// { d: 800, mil: 110 },
		// { d: 850, mil: 114 },
		// { d: 900, mil: 118.5 },
		// { d: 950, mil: 123 },
		// { d: 1000, mil: 127.5 },
		// { d: 1050, mil: 131.25 },
		// { d: 1100, mil: 135.25 },
		// { d: 1150, mil: 138.25 },
		// { d: 1200, mil: 143.5 },
		// { d: 1250, mil: 147.75 },
		// { d: 1300, mil: 152.25 },
		// { d: 1350, mil: 156.75 },
		// { d: 1400, mil: 161 },
		// { d: 1450, mil: 165.5 },
		// { d: 1500, mil: 169.5 },
		// { d: 1550, mil: 173.5 },
		// { d: 1600, mil: 177.75 },
		// { d: 1650, mil: 181.75 },
		// { d: 1700, mil: 186.25 },
		// { d: 1800, mil: 195 },
		// { d: 1900, mil: 203.5 },
		// { d: 2000, mil: 212 },
		// { d: 2100, mil: 221.75 },
		// { d: 2200, mil: 231.5 },
		// { d: 2300, mil: 241.75 },
		// { d: 2400, mil: 251.5 },
		// { d: 2500, mil: 261.25 },
		// { d: 2600, mil: 271.25 },
		// { d: 2700, mil: 281.25 },
		// { d: 2800, mil: 291 },
		// { d: 2900, mil: 301 },
		// { d: 3000, mil: 311 },
	],
};
let getDrop = (dist) => shell.dropMils.find((tick) => (tick.d == dist)).mil;


// Sight center dot
sight.add(new Circle({ diameter: 0.25, size: 3 }));

// Gun center
Toolbox.repeat(2, () => {
	sight.add(new Line({ from: [-2, 0], to: [2, 0], move: true }));
});


// Corrected shell distances
for (let dInfo of shell.dropMils) {
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

// Arrows for reading shell correction values
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
arrowRight.forEach((ele) => ele.move([-49, 0]));
arrowLeft.forEach((ele) => ele.move([-39, 0]));
sight.add(arrowRight).add(arrowLeft);
sight.add(arrowRight).add(arrowLeft);  // repeat for bold


// Horizontal line
sight.add(new Line({ from: [-37, 0], to: [51, 0] }).addBreakAtX(0, getMilHalf(400)*2));
sight.add(new Line({ from: [450, 0], to: [51, 0] }).withMirrored("xy"));  // y for bold
// Vertical line
// skips 100-3000m for clearer view
sight.add([
	new Line({ from: [0, 0], to: [0, getDrop(100)], move: true }),
	new Line({ from: [0, getDrop(3000)], to: [0, 450], move: true }),
]);


// Targeting curve
// 50
sight.add([
	// on the horizon
	new Line({
		from: [getMilHalf(50) - 0.2, 0], to: [getMilHalf(50) + 0.2, 0], move: true
	}).withMirrored("x"),
	// vertical
	new Line({
		from: [getMilHalf(50), 0], to: [getMilHalf(50), getDrop(50)], move: true
	}).withMirrored("x"),
	// text
	new TextSnippet({
		text: "50",
		pos: [-getMilHalf(50), getDrop(50) + 2.5],
		size: 0.5, move: true
	})
]);
// 50-100m curve
(() => {
	let basis = new Line({
		from: [getMilHalf(50), getDrop(50)],
		to: [getMilHalf(100), getDrop(100)], move: true
	});
	// right
	sight.add(basis.copy());
	// left
	sight.add(basis.copy().mirrorX().addBreakAtX(-getMilHalf(100) - 2, 2));  // breaking for HE 100m text
})();
// 100~1200m curve
(() => {
	let anchorInfo = shell.dropMils.filter(
		(ele) => (ele.d >= 100 && ele.d <= 1200)
	);
	for (let i = 0; i < anchorInfo.length - 1; i++) {
		let currAnchor = [getMilHalf(anchorInfo[i].d), anchorInfo[i].mil];
		let nextAnchor = [getMilHalf(anchorInfo[i + 1].d), anchorInfo[i + 1].mil];
		sight.add(new Line({
			from: currAnchor, to: nextAnchor, move: true
		}).withMirrored("x"));
	}
})();
// 100m tick
sight.add(new Line({
	from: [getMilHalf(100), getDrop(100) - 0.2],
	to: [getMilHalf(100), getDrop(100) + 0.4],
	move: true
}).withMirrored("x"));
sight.add(new TextSnippet({
	text: "1",
	pos: [-getMilHalf(100) - 2, getDrop(100) - 0.4],
	size: 0.7, move: true
}));
// 200m tick
sight.add(new Line({
	from: [getMilHalf(200), getDrop(200)],
	to: [getMilHalf(200) + 3, getDrop(200)],
	move: true
}).withMirrored("x"));
sight.add(new TextSnippet({
	text: "2",
	pos: [-getMilHalf(200) - 4.5, getDrop(200) - 0.4],
	size: 0.7, move: true
}));
// 300m tick
sight.add(new Line({
	from: [getMilHalf(300), getDrop(300)],
	to: [getMilHalf(300) + 2, getDrop(300)],
	move: true
}).withMirrored("x"));
// 400m tick
sight.add(new Line({
	from: [getMilHalf(400), getDrop(400)],
	to: [getMilHalf(400) + 1, getDrop(400)],
	move: true
}).withMirrored("x"));
Toolbox.repeat(2, () => {
	sight.add(new TextSnippet({
		text: "4",
		pos: [-getMilHalf(400) - 2.75, getDrop(400) - 0.4],
		size: 0.6, move: true
	}));
});
// 500~1100m ticks
for (let d of Toolbox.rangeIE(500, 1100, 200)) {
	Toolbox.repeat(2, () => {
		sight.add(new TextSnippet({
			text: ">",
			pos: [-getMilHalf(d) - 1.5, getDrop(d) - 0.3],
			size: 0.5, move: true
		}));
	});
}
for (let d of Toolbox.rangeIE(600, 1000, 200)) {
	Toolbox.repeat(2, () => {
		sight.add(new TextSnippet({
			text: (d / 100).toFixed(), align: "left",
			pos: [-getMilHalf(d) - 1, getDrop(d) - 0.4],
			size: 0.6, move: true
		}));
	});
}
// 1200m tick
Toolbox.repeat(2, () => {
	sight.add(new TextSnippet({
		text: "12", align: "left",
		pos: [-getMilHalf(1200) - 1, getDrop(1200) - 0.3],
		size: 0.5, move: true
	}));
});
// 1300~3000m ticks
for (let d of Toolbox.rangeIE(1300, 3000, 100)) {
	let tickHalfLen = (d % 200 == 0) ? 1.8 : 1;
	sight.add(new Line({
		from: [tickHalfLen, getDrop(d)],
		to: [-tickHalfLen, getDrop(d)],
		move: true
	}));
	Toolbox.repeat(2, () => {
		sight.add(new TextSnippet({
			text: (d / 100).toFixed(), align: "left",
			pos: [-2.2, getDrop(d) - 0.25],
			size: 0.5, move: true
		}));
	});
}
// center for 150~1200m & x50m ticks after 1200m
(() => {
	let ticks = shell.dropMils.filter(
		(ele) => (
			(ele.d >= 150 && ele.d <= 1200) ||
			(ele.d % 50 == 0 && ele.d % 100 != 0 && ele.d > 1200)
		)
	);
	for (let t of ticks) {
		sight.add(new Line({
			from: [-0.1, t.mil],
			to: [0.1, t.mil],
			move: true
		}));
	}
})();


// Additional width calib for 12, 16 and 20km
sight.add(new Line({
	from: [3, getDrop(1200)],
	to: [(3 + 2*getMilHalf(1200)), getDrop(1200)], move: true
}));
let addiLineYpadding = 4 + getDrop(1200);
for (let d of [1600, 2000]) {
	sight.add(new Line({
		from: [3, addiLineYpadding], to: [(3 + 2*getMilHalf(d)), addiLineYpadding],
		move: true
	}));
	sight.add(new Line({
		from: [3, addiLineYpadding], to: [3, addiLineYpadding - 1.5],
		move: true
	}));
	sight.add(new Line({
		from: [(3 + 2*getMilHalf(d)), addiLineYpadding],
		to: [(3 + 2*getMilHalf(d)), addiLineYpadding - 1.5],
		move: true
	}));
	sight.add(new TextSnippet({
		text: (d/100).toFixed(), align: "right",
		pos: [(3 + 2*getMilHalf(d) + 1.5), addiLineYpadding - 1], size: 0.5,
		move: true
	}))

	addiLineYpadding += 4;
}

// Assumed width prompt
sight.add(new TextSnippet({
	text: `Width  ${assumedTgtWidth}m`,
	pos: [0.18, 0.0075], thousandth: false,
	size: 0.6
}));


// Binocular Calibration
Toolbox.repeat(2, () => {
	sight.add(bino.getCommonTwoTicks({
		pos: [54, 20], assumedTgtWidth: assumedTgtWidth,
		upperTickShownAlwaysUseRound: binoCaliUpperTickUseRound
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
