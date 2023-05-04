import * as comp from "../../_lib/sight_lib.js";
import * as pd from "../../_lib/sight_predefined_info.js";


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
	pd.basic.scales.getCommon(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([90, -0.0145]),
	pd.basicBuild.detectAllyPos([90, -0.04]),
	pd.basicBuild.gunDistanceValuePos([-0.15, 0.03]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.005, 0.0015],
		[0.005, 0]
	)
));


//// VEHICLE TYPES
matchVehicleClasses.
	addInclude(comp.MatchVehicleClassBlock.vehicleTypeGroundDefaults);


//// SHELL DISTANCES
// NOT DEFINED IN SIGHT BASE


//// SIGHT DESIGNS
circles.addComment("Center dot");
circles.add(new comp.Circle({ pos: [0, 0], diameter: 0.3, size: 4 }));
circles.add(new comp.Circle({ pos: [0, 0], diameter: 0.6, size: 2 }));

lines.addComment("Gun center");
lines.add(new comp.Line({ from: [-0.5, 0], to: [0.5, 0], move: true }));
lines.add(new comp.Line({ from: [0, -0.5], to: [0, 0.5], move: true }));

lines.addComment("Vertical line");
lines.add(new comp.Line({ from: [0, -450], to: [0, -33] }));
lines.add(new comp.Line({ from: [0, 450], to: [0, 16.5] }));

lines.addComment("Horizontal line");
lines.add(new comp.Line({ from: [450, 0], to: [8.25, 0.0] })
	.getCodeFragsMulti({ mirrorX: true }));


lines.addComment("Vertical rangefinder on the horizon");
let rgfdAssumeWidth = 3.3;
for (let t of [
	{ distance: 100, lineY: [0, -3] },
	{ distance: 200, lineY: [0, 2.5] },
	{ distance: 400, lineY: [0, -0.75] },
]) {
	let thHalfWidth = comp.Toolbox.calcThousandth(rgfdAssumeWidth, t.distance) / 2;
	lines.add(new comp.Line({
		from: [thHalfWidth, t.lineY[0]],
		to: [thHalfWidth, t.lineY[1]],
	}).getCodeFragsMulti({ mirrorX: true }));
}
texts.addComment("Vertical rangefinder on the horizon");
texts.add(new comp.TextSnippet({
	text: "1",
	align: "center",
	pos: [19, -2.5],
	size: 0.6
}).getCodeMulti({ mirrorX: true }));
texts.add(new comp.TextSnippet({
	text: "2",
	align: "right",
	pos: [9, 2],
	size: 0.6
}));


lines.addComment("Vertical rangefinder");
texts.addComment("Vertical rangefinder");
(() => {
	let rgfd = pd.rgfd.getCommon([8.25, -6.25], {
		showMiddleLine: true,
		mirrorY: true,
		assumeWidth: rgfdAssumeWidth,
	});
	lines.add(rgfd.lines);
	texts.add(rgfd.texts);
})();


lines.addComment("Binocular Calibration Reference");
texts.addComment("Binocular Calibration Reference");
lines.addComment("- 1 tick");
lines.add(new comp.Line({ from: [-5.25, -48], to: [0, -48] }));
lines.add(new comp.Line({ from: [-5.25, -45], to: [0, -45] }));
lines.add(new comp.Line({ from: [-5.25, -45], to: [-5.25, -48] }));
lines.addComment("- 800m size");
lines.add(new comp.Line({ from: [-4.125, -46], to: [-4.125, -47] }));
texts.add(new comp.TextSnippet({ text: "8", pos: [-4.125, -50], size: 0.55 }));
lines.addComment("- 1200m size / approximate 0.5 tick");
lines.add(new comp.Line({ from: [-2.75, -45], to: [-2.75, -46] }));
lines.add(new comp.Line({ from: [-2.75, -47], to: [-2.75, -48] }));
lines.addComment("- 1600m size");
lines.add(new comp.Line({ from: [-2.0625, -46.25], to: [-2.0625, -46.75] }));




//// EXPORT
export default code;

/** Usage info for devs */
export const ABOUT = {
	DESCRIPTION: "Sight base for common type 2",
	DEFINED_INFO: {
		zoomLevel: "common",
		fontLevel: "default",
		color: "green/black",
	},
	MUST_CALL_FIRST: "selectAdditionalParts",
	NEED_INFO: [
		"shellDistances",
	]
};

export function selectAdditionalParts({
	binocularCalibrationTickIntervalPrompt = false,
	boldCrossingBias = 0
} = {}) {
	if (binocularCalibrationTickIntervalPrompt) {
		texts.addComment("Binocular Calibration Reference - tick interval prompt");
		texts.add(new comp.TextSnippet({
			text: "4/ tk >",
			align: "left",
			pos: [-3.5, -52.5],
			size: 0.45
		}));
	}

	if (boldCrossingBias !== 0) {
		lines.addComment("Vertical line bottom bold")
		lines.add(new comp.Line({from: [0, 450], to: [0, 33]}
			).move([boldCrossingBias, 0]).getCodeFragsMulti({mirrorX: true}));
		lines.addComment("Horizontal line bold")
		lines.add(new comp.Line({from: [450, 0], to: [25, 0]}
			).move([0, boldCrossingBias]).getCodeFragsMulti({mirrorX: true, mirrorY: true}));
	}

	return code;
}