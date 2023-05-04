import * as comp from "../_lib/sight_lib.js";
import * as pd from "../_lib/sight_predefined_info.js";


let code = new comp.SightComponentCollection();
let {
	sight,
	matchVehicleClasses,
	horizontalThousandths,
	shellDistances,
	circles,
	lines,
	texts
} = code.getComponents();


//// BASIC
sight.append(pd.concatAllBasics(
	pd.basic.scales.getMidHighZoom(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([120, -0.02175]),
	pd.basicBuild.detectAllyPos([120, -0.045]),
	pd.basicBuild.gunDistanceValuePos([-0.18, 0.035]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0070, 0.0025],
		[0.005, 0]
	),
	pd.basic.getMiscCommonVars()
));


//// VEHICLE TYPES
matchVehicleClasses.
	addInclude(comp.MatchVehicleClassBlock.vehicleTypeGroundDefaults).
	addInclude([
		"cn_type_59",
		"ussr_is_4m",
		"ussr_object_120",
		"ussr_object_906",
		"ussr_t_10a",
		"ussr_t_54_1947",
		"ussr_t_54_1949",
		"ussr_t_55a",
		"ussr_t_62",
	]);


//// SHELL DISTANCES
shellDistances.addMulti(
	pd.shellDistances.getFullLooseTwoSides({ rightOffset: 0.0295 })
);


//// SIGHT DESIGNS
let rgfdAssumeWidth = 3.3;

circles.addComment("Center dot");
circles.add([
	new comp.Circle({ pos: [0, 0], diameter: 0.2, size: 4 }),
	new comp.Circle({ pos: [0, 0], diameter: 0.4, size: 2 }),
	new comp.Circle({ pos: [0, 0], diameter: 0.6, size: 1.5 }),
]);


lines.addComment("Gun center T");
lines.add(new comp.Line({ from: [-0.002, 0], to: [0.002, 0], move: true, thousandth: false }));
lines.add(new comp.Line({ from: [0, 0], to: [0, 0.005], move: true, thousandth: false }));


circles.addComment("Vertical Rangefinder");
texts.addComment("Vertical Rangefinder");
(() => {
	let rgfd = pd.rgfd.getCircledMidHighZoom([4.125, -4], { mirrorY: true });
	circles.add(rgfd.circles);
	texts.add(rgfd.texts);
})();


// Vertical Rangefinder on the horizon - numbers and horizontal line
let horiLine = new comp.Line({
	from: [450, 0],
	to: [comp.Toolbox.calcThousandth(rgfdAssumeWidth, 400) / 2, 0]
});
texts.addComment("Vertical rangefinder on the horizon");
for (let t of [
	{ distance: 100, textPosMove: [0, -0.3], textSize: 1 },
	{ distance: 200, textPosMove: [0, -0.15], textSize: 0.6 },
	{ distance: 400, textPosMove: [1, -0.15], textSize: 0.6 },
]) {
	let thHalfWidth = comp.Toolbox.calcThousandth(rgfdAssumeWidth, t.distance) / 2;
	let textPos = [(thHalfWidth + t.textPosMove[0]), (0 + t.textPosMove[1])];
	texts.add(new comp.TextSnippet({
		text: (t.distance / 100).toFixed(),
		pos: textPos,
		size: t.textSize
	}).getCodeMulti({ mirrorX: true }));

	// Add break to horizontal line
	horiLine.addBreakAtX(textPos[0], t.textSize * 2);
}
// Append horizontal line code
lines.addComment("Horizontal lines with breaks for vertical rangefinder");
lines.add(horiLine.getCodeFragsMulti({ mirrorX: true }));

// On-the-horizon circles
circles.addComment("Vertical rangefinder on the horizon");
for (let t of [
	{ segment: [70, 110], distance: 400, lineSize: 1.7 },
	{ segment: [80, 100], distance: 800, lineSize: 1.7 }
]) {
	circles.addComment(`${t.distance}m`);
	circles.add(new comp.Circle({
		segment: t.segment,
		pos: [0, 0],
		diameter: comp.Toolbox.calcThousandth(rgfdAssumeWidth, t.distance),
		size: t.lineSize,
	}).getCodeMulti({ mirrorSegmentX: true }));
}


lines.addComment("Vertical lines");
let vertLineUpper = new comp.Line({ from: [0, -450], to: [0, -16.5] });
let vertLineLower = new comp.Line({ from: [0, 450], to: [0, 16.5] });
lines.add(vertLineUpper).add(vertLineLower);


lines.addComment("Horizontal lines bold");
lines.add(horiLine.copy().move([0, 0.02]).getCodeFragsMulti({ mirrorX: true, mirrorY: true }));
for (let diff of comp.Toolbox.rangeIE(0.08, 0.14, 0.02)) {
	lines.add(new comp.Line({ from: [450, 0], to: [60, 0] }
		).move([0, diff]).getCodeFragsMulti({ mirrorX: true, mirrorY: true }));
}
for (let diff of comp.Toolbox.rangeIE(0.16, 0.38, 0.02)) {
	lines.add(new comp.Line({ from: [450, 0], to: [130, 0] }
		).move([0, diff]).getCodeFragsMulti({ mirrorX: true, mirrorY: true }));
}

lines.addComment("Vertical lines bold");
// lines.add(vertLineUpper.copy().move([0.02, 0]).getCodeFragsMulti({ mirrorX: true }));
lines.add(vertLineLower.copy().move([0.02, 0]).getCodeFragsMulti({ mirrorX: true }));
for (let diff of comp.Toolbox.rangeIE(0.08, 0.14, 0.02)) {
	lines.add(new comp.Line({ from: [0, 450], to: [0, 40] }
		).move([0, diff]).getCodeFragsMulti({ mirrorX: true, mirrorY: true }));
}
for (let diff of comp.Toolbox.rangeIE(0.16, 0.38, 0.02)) {
	lines.add(new comp.Line({ from: [0, 450], to: [0, 70] }
		).move([diff, 0]).getCodeFragsMulti({ mirrorX: true, mirrorY: true }));
}


//// OUTPUT
code.compileSightBlocks();
code.printCode();