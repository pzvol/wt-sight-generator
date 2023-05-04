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
	pd.basicBuild.rgfdPos([55, -0.01675]),
	pd.basicBuild.detectAllyPos([55, -0.040]),
	pd.basicBuild.gunDistanceValuePos([-0.13, 0.03]),
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
]);

lines.addComment("Gun center T");
lines.add(new comp.Line({ from: [-0.002, 0], to: [0.002, 0], move: true, thousandth: false }));
lines.add(new comp.Line({ from: [0, 0], to: [0, 0.004], move: true, thousandth: false }));

lines.addComment("Vertical lines");
lines.add(new comp.Line({ from: [0, -450], to: [0, -16.5] }));
lines.add(new comp.Line({ from: [0, 450], to: [0, 8.25] }));

lines.addComment("Horizontal lines");
lines.add(new comp.Line({
	from: [450, 0],
	to: [comp.Toolbox.calcThousandth(rgfdAssumeWidth, 400) / 2, 0]
}
).getCodeFragsMulti({ mirrorX: true }));

circles.addComment("Vertical Rangefinder on the horizon");
texts.addComment("Vertical Rangefinder on the horizon");
(() => {
	let tickPoses = [
		{ segment: [90, 100], distance: 100, lineSize: 1.3, textPos: [18, -2], textSize: 1 },
		{ segment: [90, 100], distance: 200, lineSize: 1.3, textPos: [9.1, -1.5], textSize: 0.6 },
		{ segment: [70, 110], distance: 400, lineSize: 1.3, textPos: [4.8, 1], textSize: 0.6 },
		{ segment: [80, 100], distance: 800, lineSize: 1.7 },
	];
	for (let t of tickPoses) {
		circles.addComment(`${t.distance}m`);
		circles.add(new comp.Circle({
			segment: t.segment,
			pos: [0, 0],
			diameter: comp.Toolbox.calcThousandth(rgfdAssumeWidth, t.distance),
			size: t.lineSize,
		}).getCodeMulti({ mirrorSegmentX: true }));

		if (t.hasOwnProperty("textPos")) {
			texts.add(new comp.TextSnippet({
				text: (t.distance / 100).toFixed(0),
				pos: t.textPos,
				size: t.textSize
			}).getCodeMulti({ mirrorX: true }));
		}
	}
})();

circles.addComment("Vertical Rangefinder");
texts.addComment("Vertical Rangefinder");
(() => {
	let rgfd = pd.rgfd.getCircledMidHighZoom([4.125, -4], { mirrorY: true });
	circles.add(rgfd.circles);
	texts.add(rgfd.texts);
})();



//// OUTPUT
code.compileSightBlocks();
code.printCode();