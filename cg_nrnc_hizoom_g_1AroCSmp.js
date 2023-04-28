import * as comp from "./_lib/sight_lib.js";
import * as pd from "./_lib/sight_predefined_info.js";




let sight = new comp.SightFile();
sight.append(comp.General.comment("CODE GENERATED SIGHT")).append("");


const LINE_WIDTH = 1.6;
const SHELL_DIST_POS_X = 0.193;
const SHELL_DIST_MAIN_WIDTH = 0.0100;




//// Basic Settings ////
sight.append(pd.basic.sizeScales.getHighZoom({ line: LINE_WIDTH })).append("");
sight.append(pd.basic.colors.getGreenRed()).append("");

sight.append(pd.basicBuild.distanceValuePos([-0.175, 0.035]));
sight.append(pd.basicBuild.rgfdPos([110, -0.02425]));
sight.append(pd.basicBuild.detectAllyPos([110, -0.045]));
sight.append(pd.basicBuild.shellDistanceTickVars(
	[-SHELL_DIST_MAIN_WIDTH, -SHELL_DIST_MAIN_WIDTH],  // main ticks size - minus for left
	[0, 0],                                            // sub  ticks size
	[SHELL_DIST_POS_X, 0]                              // main ticks pos
)).append("");

sight.append(comp.General.comment("Misc settings"));
sight.append(pd.basic.getMiscCommonVars()).append("");




//// Match Vehicles ////
sight.append((new comp.MatchVehicleClassBlock()).
	addInclude(comp.MatchVehicleClassBlock.vehicleTypeGroundDefaults).
	addInclude([
		"cn_ztz_96a",
		"cn_ztz_96a_prot",
		"cn_ztz_99",
		"cn_ztz_99_w",
		"sw_strv_103_0",
	]).
	getCode()
).append("");




//// Horizontal Thousandths ////
sight.append((new comp.HorizontalThousandthsBlock()).getCode()).append("");




//// Shell Distance Lines ////
sight.append((new comp.ShellDistancesBlock()).
	addOne(400).addOne(800).
	addOne(2000, 20, [0.0035, 0.007]).
	addOne(4000, 40, [0.0035, 0.007]).
	addMax().getCode()
).append("");




//// Circles & Lines ////
let circles = new comp.CirclesBlock();
let lines = new comp.LinesBlock();

let rgfdTgtWidth = 3.3;

// Shell 0m prompts
lines.addComment("0m shell correction on left");
lines.add((new comp.Line({
	from: [-SHELL_DIST_POS_X - SHELL_DIST_MAIN_WIDTH, 0],
	to: [-SHELL_DIST_POS_X, 0],
	move: true, thousandth: false
})));

lines.addComment("0m gun center prompt");
(() => {
	let l = new comp.Line({
		from: [0.0035, 0], to: [0.0055, 0],
		move: true, thousandth: false
	});
	lines.add(l);
	lines.add(l.copy().mirrorX());
})();
lines.add("");

lines.addComment("Central Arrow");
(() => {
	let params = [
		{ from: [0, 0], to: [0.6, 1.5] },
		// Enhance
		{ from: [0, 0.04], to: [0.6, 1.54] },
		{ from: [0, 0.08], to: [0.6, 1.58] },
		{ from: [0, 0.12], to: [0.6, 1.58] },
	];
	let moveY = 0.02;
	for (let p of params) {
		let l = new comp.Line({
			from: p.from, to: p.to,
			move: false, thousandth: true
		}).move(0, moveY);
		lines.
			add(l).
			add(l.mirrorX());
	}
})();
lines.add("");

// Cross
circles.addComment("Rangefinder Curves");
for (let p of [
	{ range: 400, segment: [82, 98] },
	{ range: 800, segment: [85, 95] },
]) {
	let c = new comp.Circle({
		segment: p.segment,
		diameter: comp.Toolbox.calcThousandth(rgfdTgtWidth, p.range),
		pos: [0, 0],
		size: LINE_WIDTH, move: false, thousandth: true
	});
	circles.addComment(`${p.range}m`);
	circles.add([c, c.copy().mirrorSegmentY()]);
}

lines.addComment("Horizontal Line");
(() => {
	let l = new comp.Line({ from: [450, 0], to: [5.125, 0], move: false, thousandth: true }).
		addBreakAtX(comp.Toolbox.calcThousandth(rgfdTgtWidth, 100) / 2, 1.6).
		addBreakAtX(comp.Toolbox.calcThousandth(rgfdTgtWidth, 200) / 2, 1.6);
	lines.add([l, l.copy().mirrorX()]);
})();

lines.addComment("Horizontal Line Enhance");
(() => {
	let params = [
		{ toX: 17.3, y: 0.02 },
		{ toX: 40, y: 0.04 },
		{ toX: 60, y: 0.08 },
		{ toX: 80, y: 0.12 },
	];
	for (let p of params) {
		let l = new comp.Line({
			from: [450, p.y], to: [p.toX, p.y],
			move: false, thousandth: true
		});
		lines.
			add(l).
			add(l.copy().mirrorX()).
			add(l.copy().mirrorY()).
			add(l.copy().mirrorX().mirrorY());
	}
})();

lines.addComment("Vertical Line");
lines.add(new comp.Line({ from: [0, -450], to: [0, -8.25], move: false, thousandth: true }));
lines.add(new comp.Line({ from: [0, 450], to: [0, 3], move: false, thousandth: true }));

lines.addComment("Vertical Line Enhance");
(() => {
	let params = [
		{ fromY: -450, toY: -25, x: 0.04 },
		{ fromY: -450, toY: -40, x: 0.08 },
		{ fromY: -450, toY: -40, x: 0.12 },
		{ fromY: 450, toY: 8.25, x: 0.03 },
		{ fromY: 450, toY: 40, x: 0.08 },
		{ fromY: 450, toY: 40, x: 0.12 },
	];
	for (let p of params) {
		let l = new comp.Line({
			from: [p.x, p.fromY], to: [p.x, p.toY],
			move: false, thousandth: true
		});
		lines.
			add(l).
			add(l.copy().mirrorX());
	}
})();




// Append circles and lines
sight.append([circles.getCode(), lines.getCode()]);


let texts = new comp.TextsBlock()
texts.add(new comp.TextSnippet({
	text: "1",
	align: "center",
	pos: [16.5, 0.25],
	size: 1.2,
	move: false,
	thousandth: true,
	highlight: true
}))



sight.append(texts.getCode());

let a = `drawTexts{
	// Vertical Rangefinder Numbers
	text {
	text:t = "1"
	align:i = 0
	pos:p2 = 16.5, -0.25
	move:b = no
	thousandth:b = yes
	size:r = 1.2
	highlight:b=yes
	}
	text {
	text:t = "1"
	align:i = 0
	pos:p2 = -16.5, -0.25
	move:b = no
	thousandth:b = yes
	size:r = 1.2
	highlight:b=yes
	}

	text {
	text:t = "2"
	align:i = 0
	pos:p2 = 8.25, -0.15
	move:b = no
	thousandth:b = yes
	size:r = 1
	highlight:b=yes
	}
	text {
	text:t = "2"
	align:i = 0
	pos:p2 = -8.25, -0.15
	move:b = no
	thousandth:b = yes
	size:r = 1
	highlight:b=yes
	}

	text {
	text:t = "4"
	align:i = 0
	pos:p2 = 4.6, -0.1
	move:b = no
	thousandth:b = yes
	size:r = 0.6
	highlight:b=yes
	}
	text {
	text:t = "4"
	align:i = 0
	pos:p2 = -4.6, -0.1
	move:b = no
	thousandth:b = yes
	size:r = 0.6
	highlight:b=yes
	}
}`

//// Print Result ////
console.log(sight.getCurrentText());