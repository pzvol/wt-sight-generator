import { BlkBlock, BlkVariable } from "../_lib2/sight_code_basis.js";
import { ShellDistancesBlock } from "../_lib2/sight_blocks.js";
import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";
import bino from "./sight_components/binocular_calibration.js"


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Sight for SturmPz.IV and other 150mm-gun-armed tanks
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basicBuild.scale({ font: 0.9, line: 1.2 }),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([170, -12]),
	pd.basicBuild.detectAllyPos([170, -0.06]),
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


//// SHELL DISTANCES ////
// Target width assumption
let assumedTgtWidth = 3.3;
let getMilHalf = (dist) => (Toolbox.calcDistanceMil(assumedTgtWidth, dist) / 2);
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
			{ d: 50, mil: 3.45 },
			{ d: 100, mil: 6.45 },
			{ d: 200, mil: 12.6 },
			{ d: 300, mil: 18.8 },
			{ d: 400, mil: 25.15 },
			{ d: 500, mil: 31.65 },
			{ d: 600, mil: 38.3 },
			{ d: 700, mil: 45.1 },
			{ d: 800, mil: 52.0 },
			{ d: 900, mil: 59.06 },
			{ d: 1000, mil: 66.25 },
		]
	}
};
let getHeDrop = (dist) => shell.he.dropMils.find((tick) => (tick.d == dist)).mil;
let getHeatDrop = (dist) => shell.heat.dropMils.find((tick) => (tick.d == dist)).mil;


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
			for (let dist of Toolbox.rangeIE(100, 4000, 100)) {
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



//// SIGHT DESIGNS ////
// Sight center dot
sight.add(new Circle({ diameter: 0.25, size: 3 }));


// Gun center
sight.add(new Line({ from: [-0.5, 0], to: [0.5, 0], move: true }));

// Gun 0m indication for HEAT
sight.add(new Line({ from: [0.124, 0], to: [0.131, 0], move: true, thousandth: false }));
sight.add(new TextSnippet({
	text: "0", pos: [0.1122, 0], size: 0.7, move: true, thousandth: false
}));

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
			pos: [-39.6, dInfo.mil],
			size: 0.7, move: true
		}));
	}
}
// Manually correction ended indication
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
sight.add(new Line({ from: [-37, 0], to: [37, 0] }).addBreakAtX(0, getMilHalf(400)*2));
sight.add(new Line({ from: [450, 0], to: [51, 0] }).withMirrored("xy"));  // y for bold
// Vertical line
// skips HE 200-2000m for clearer view
sight.add([
	new Line({ from: [0, 0], to: [0, getHeDrop(200)], move: true }),
	new Line({ from: [0, getHeDrop(2000)], to: [0, 450], move: true }),
]);


// HE shell targeting curve
// 50
sight.add([
	// on the horizon
	new Line({
		from: [getMilHalf(50) - 0.2, 0], to: [getMilHalf(50) + 0.2, 0], move: true
	}).withMirrored("x"),
	// vertical
	new Line({
		from: [getMilHalf(50), 0], to: [getMilHalf(50), getHeDrop(50)], move: true
	}).withMirrored("x"),
	// real height
	new Line({
		from: [getMilHalf(50), getHeDrop(50)],
		to: [getMilHalf(50) - 3, getHeDrop(50)], move: true
	}).withMirrored("x"),
	new TextSnippet({
		text: "50",
		pos: [-getMilHalf(50), getHeDrop(50) + 2],
		size: 0.5, move: true
	})
]);
// 100~2000m curve
(() => {
	let anchorInfo = shell.he.dropMils.filter(
		(ele) => (ele.d % 100 == 0 && ele.d != 0 && ele.d <= 1200)
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
	from: [getMilHalf(100), getHeDrop(100) - 0.2],
	to: [getMilHalf(100), getHeDrop(100) + 0.4],
	move: true
}).withMirrored("x"));
sight.add(new TextSnippet({
	text: "1",
	pos: [-getMilHalf(100) - 2, getHeDrop(100)],
	size: 0.7, move: true
}));
// 200m tick
sight.add(new Line({
	from: [getMilHalf(200), getHeDrop(200)],
	to: [getMilHalf(200) + 3, getHeDrop(200)],
	move: true
}).withMirrored("x"));
sight.add(new TextSnippet({
	text: "2",
	pos: [-getMilHalf(200) - 4.5, getHeDrop(200)],
	size: 0.7, move: true
}));
// 300m tick
sight.add(new Line({
	from: [getMilHalf(300), getHeDrop(300)],
	to: [getMilHalf(300) + 2, getHeDrop(300)],
	move: true
}).withMirrored("x"));
// 400m tick
sight.add(new Line({
	from: [getMilHalf(400), getHeDrop(400)],
	to: [getMilHalf(400) + 1, getHeDrop(400)],
	move: true
}).withMirrored("x"));
Toolbox.repeat(2, () => {
	sight.add(new TextSnippet({
		text: "4",
		pos: [-getMilHalf(400) - 2.75, getHeDrop(400)],
		size: 0.6, move: true
	}));
});
// 500~1100m ticks
for (let d of Toolbox.rangeIE(500, 1100, 200)) {
	Toolbox.repeat(2, () => {
		sight.add(new TextSnippet({
			text: ">",
			pos: [-getMilHalf(d) - 1.5, getHeDrop(d)],
			size: 0.5, move: true
		}));
	});
}
for (let d of Toolbox.rangeIE(600, 1000, 200)) {
	Toolbox.repeat(2, () => {
		sight.add(new TextSnippet({
			text: (d / 100).toFixed(), align: "left",
			pos: [-getMilHalf(d) - 1, getHeDrop(d)],
			size: 0.6, move: true
		}));
	});
}
// 1200m tick
Toolbox.repeat(2, () => {
	sight.add(new TextSnippet({
		text: "12", align: "left",
		pos: [-getMilHalf(1200) - 1, getHeDrop(1200)],
		size: 0.5, move: true
	}));
});
// 1300~2000m ticks
for (let d of Toolbox.rangeIE(1300, 1900, 200)) {
	sight.add(new Line({
		from: [0, getHeDrop(d)],
		to: [-1, getHeDrop(d)],
		move: true
	}));
	Toolbox.repeat(2, () => {
		sight.add(new TextSnippet({
			text: (d / 100).toFixed(), align: "left",
			pos: [-2.2, getHeDrop(d)],
			size: 0.5, move: true
		}));
	});
}
for (let d of Toolbox.rangeIE(1400, 2000, 200)) {
	sight.add(new Line({
		from: [0, getHeDrop(d)],
		to: [-1.8, getHeDrop(d)],
		move: true
	}));
	Toolbox.repeat(2, () => {
		sight.add(new TextSnippet({
			text: (d / 100).toFixed(), align: "left",
			pos: [-2.2, getHeDrop(d)],
			size: 0.5, move: true
		}));
	});
}

// Additional width calib for 12, 16 and 20km
sight.add(new Line({
	from: [3, getHeDrop(1200)],
	to: [(3 + 2*getMilHalf(1200)), getHeDrop(1200)], move: true
}));
let addiLineYpadding = 4 + getHeDrop(1200);
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


// HEAT shell targeting
// 50m
// TODO: add pos mirroring for Circle
sight.add(new Circle({
	pos: [getMilHalf(50), getHeatDrop(50)], diameter: 1.2, size: 1, move: true
}));
sight.add(new Circle({
	pos: [-getMilHalf(50), getHeatDrop(50)], diameter: 1.2, size: 1, move: true
}));
sight.add(new TextSnippet({
	text: "50", pos: [getMilHalf(50) + 3, getHeatDrop(50)], size: 0.5, move: true
}));
// 100m
sight.add(new Circle({
	pos: [getMilHalf(100), getHeatDrop(100)], diameter: 1, size: 1, move: true
}));
sight.add(new Circle({
	pos: [-getMilHalf(100), getHeatDrop(100)], diameter: 1, size: 1, move: true
}));
// 200~400m
for (let d of [200, 300, 400]) {
	sight.add(new Circle({
		pos: [getMilHalf(d), getHeatDrop(d)], diameter: 1, size: 1, move: true
	}));
	sight.add(new Circle({
		pos: [-getMilHalf(d), getHeatDrop(d)], diameter: 0.5, size: 1, move: true
	}));
}
// 500~700m
for (let d of [500, 600, 700]) {
	sight.add(new Circle({
		pos: [getMilHalf(d), getHeatDrop(d)], diameter: 0.5, size: 1, move: true
	}));
	if (d % 200 == 0) {
		sight.add(new Circle({
			pos: [-getMilHalf(d), getHeatDrop(d)], diameter: 0.5, size: 1, move: true
		}));
	}
}
// 800~1000m
for (let d of [800, 900, 1000]) {
	sight.add(new Circle({
		pos: [getMilHalf(d), getHeatDrop(d)], diameter: 0.3, size: 1, move: true
	}));
	if (d % 200 == 0) {
		sight.add(new Circle({
			pos: [-getMilHalf(d), getHeatDrop(d)], diameter: 0.3, size: 1, move: true
		}));
	}
}
// HEAT prompt texts
for (let d of [100, 200]) {
	sight.add(new TextSnippet({
		text: (d/100).toFixed(),
		pos: [getMilHalf(d) + 10, getHeatDrop(d) - 0.2], size: 0.55, move: true
	}));
	sight.add(new Line({
		from: [getMilHalf(d) + 0.6, getHeatDrop(d)],
		to: [getMilHalf(d) + 10 - 1, getHeatDrop(d)],
		move: true
	}))
}
for (let d of [400, 600, 800, 1000]) {
	sight.add(new TextSnippet({
		text: (d/100).toFixed(),
		pos: [getMilHalf(d) + 8, getHeatDrop(d) - 0.2], size: 0.55, move: true
	}));
}


// Assumed width prompt
sight.add(new TextSnippet({
	text: `Width  ${assumedTgtWidth}m`,
	pos: [0.18, 0.0075], thousandth: false,
	size: 0.6
}));
// Shell type prompt for ticks
let shellPromptTextY = 55;
sight.add([
	new TextSnippet({
		text: "HE", pos: [-25, shellPromptTextY], size: 0.9
	}),
	new TextSnippet({
		text: "Corred", pos: [-25, shellPromptTextY + 4.5], size: 0.5
	}),
]);
sight.add([
	new TextSnippet({
		text: "HEAT", pos: [25, shellPromptTextY], size: 0.9
	}),
	new TextSnippet({
		text: "NotCorred", pos: [25, shellPromptTextY + 4.5], size: 0.5
	}),
]);


// Binocular Calibration
Toolbox.repeat(2, () => {
	sight.add(bino.getCommon2([54, 20]));
});





//// OUTPUT ////
export default { sightObj: sight, sightExtraBlocks: [extraBallisticsBlock] };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) {
	sight.printCode();
	console.log(extraBallisticsBlock.getCode());
}
