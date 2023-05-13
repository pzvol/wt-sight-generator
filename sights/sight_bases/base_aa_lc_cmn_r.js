// SCRIPT_DO_NOT_DIRECTLY_COMPILE

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


//// VEHICLE TYPES
// NOT DEFINED IN BASE


//// SHELL DISTANCES
shellDistances.addMulti([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 1200 },
	{ distance: 1600, shown: 16 },
	{ distance: 3600, shown: 36 },
]);


//// SIGHT DESIGNS
let curvesInFourQuadrantSetup = { mirrorSegmentX: true, mirrorSegmentY: true };

lines.addComment("Gun center");
lines.add(new comp.Line({ from: [-0.002, 0], to: [0.002, 0], move: true, thousandth: false }));
lines.add(new comp.Line({ from: [0, -0.0015], to: [0, 0.0015], move: true, thousandth: false }));

circles.addComment("Sight center dot");
circles.add(new comp.Circle({ diameter: 0.2, size: 4 }));

let assumeGroundWidth = 3.3;
let d100mGroundWidthHalf = comp.Toolbox.calcThousandth(assumeGroundWidth, 100) / 2;

lines.addComment("Sight center cross");
lines.add(new comp.Line({
	from: [0, d100mGroundWidthHalf / 2],
	to: [0, d100mGroundWidthHalf]
}).getCodeFragsMulti({ mirrorY: true }));
lines.add(new comp.Line({
	from: [d100mGroundWidthHalf / 2, 0],
	to: [d100mGroundWidthHalf - 3, 0]
}).getCodeFragsMulti({ mirrorX: true }));

texts.addComment("Ground 100m prompt text");
texts.add(new comp.TextSnippet({
	text: "G1", pos: [d100mGroundWidthHalf, -0.4], size: 0.6
}).getCodeMulti({ mirrorX: true }));

circles.addComment("Air 400m prompt");
circles.add(new comp.Circle({
	segment: [22.5, 67.5], diameter: 27.5, size: 1.2
}).getCodeMulti(curvesInFourQuadrantSetup));
texts.addComment("Air 400m prompt text");
texts.add(new comp.TextSnippet({ text: "4", pos: [12, 12], size: 0.65 }));


// FULL SIGHT COMPILED UNTIL THIS FUNCTION CALLED
/**
 * Speed values are in km/h
 */
export function compileSightDesign({
	showCenteralCircle = true,
	milType = "ussr",
	shellSpeed,
	assumeTgtSpeedMain,
	assumeTgtSpeedSubRange,
	mainFractedAngle = 0.5,
	rgfdNumPosX = 200,
	gunDistValuePosX = -0.28
} = {}) {
	// BASIC
	sight.append(pd.concatAllBasics(
		pd.basic.scales.getSPAACommon(),
		pd.basic.colors.getRedGreen(),
		pd.basicBuild.rgfdPos([rgfdNumPosX, -0.02]),
		pd.basicBuild.detectAllyPos([rgfdNumPosX, -0.045]),
		pd.basicBuild.gunDistanceValuePos([gunDistValuePosX, 0.03]),
		pd.basicBuild.shellDistanceTickVars(
			[0, 0],
			[0.0070, 0.0025],
			[0.005, 0]
		),
		pd.basic.getMiscCommonVars()
	));

	// Central circle
	if (showCenteralCircle) {
		circles.addComment("Centeral circle (air 1600m)");
		circles.add(new comp.Circle({
			segment: [25, 65],
			diameter: 6.875,
			size: 4
		}).getCodeMulti(curvesInFourQuadrantSetup));
	}

	let getMil = (aspectAngle, tgtSpeed = assumeTgtSpeedMain) => comp.Toolbox.calcLeadingThousandth(
		shellSpeed, tgtSpeed,
		aspectAngle, milType
	);
	let leadingInfo = { // aspect angles and corrsponding mils
		main: { aa: 1.0, mil: getMil(1) },
		sub: { aa: 0.5, mil: getMil(0.5) },
	};
	let leadingSubRangeInfo = {
		main: {
			fromMil: getMil(leadingInfo.main.aa, assumeTgtSpeedSubRange[0]),
			toMil: getMil(leadingInfo.main.aa, assumeTgtSpeedSubRange[1]),
		},
		sub: {
			fromMil: getMil(leadingInfo.sub.aa, assumeTgtSpeedSubRange[0]),
			toMil: getMil(leadingInfo.sub.aa, assumeTgtSpeedSubRange[1]),
		}
	};

	texts.addComment("Shell speed prompt");
	texts.add(new comp.TextSnippet({
		text: `HE SPD - ${(shellSpeed / 3.6).toFixed()}m/s`,
		align: "right",
		pos: [leadingSubRangeInfo.main.toMil + 30, 4.5],
		size: 1
	}));


	circles.addComment(`Leading value circles - ${assumeTgtSpeedMain}km/h`);
	circles.add(new comp.Circle({
		diameter: leadingInfo.main.mil * 2, size: 2.2,
	}));
	circles.add(new comp.Circle({
		diameter: leadingInfo.sub.mil * 2, size: 1.6,
	}));

	circles.addComment(`Leading value range curves`);
	circles.addComment(`inner`);
	circles.add(new comp.Circle({
		segment: [0.3, 1],
		diameter: leadingSubRangeInfo.main.fromMil * 2,
		size: 1.5,
	}).getCodeMulti(curvesInFourQuadrantSetup));
	circles.add(new comp.Circle({
		segment: [90.3, 91],
		diameter: leadingSubRangeInfo.main.fromMil * 2,
		size: 1.5,
	}).getCodeMulti(curvesInFourQuadrantSetup));
	circles.addComment(`outer`);
	circles.add(new comp.Circle({
		segment: [0.3, 2],
		diameter: leadingSubRangeInfo.main.toMil * 2,
		size: 1.5,
	}).getCodeMulti(curvesInFourQuadrantSetup));
	circles.add(new comp.Circle({
		segment: [90.3, 92],
		diameter: leadingSubRangeInfo.main.toMil * 2,
		size: 1.5,
	}).getCodeMulti(curvesInFourQuadrantSetup));


	lines.addComment(`Leading value range lines`);
	let sqrt2 = Math.sqrt(2);
	for (let r of [leadingSubRangeInfo.main, leadingSubRangeInfo.sub]) {
		lines.add(new comp.Line({
			from: [r.fromMil, 0],
			to: [r.toMil, 0]
		}).getCodeFragsMulti({ mirrorX: true }));
		lines.add(new comp.Line({
			from: [0, r.fromMil],
			to: [0, r.toMil]
		}).getCodeFragsMulti({ mirrorY: true }));
		// 45deg
		lines.add(new comp.Line({
			from: [r.fromMil / sqrt2, r.fromMil / sqrt2],
			to: [r.toMil / sqrt2, r.toMil / sqrt2]
		}).getCodeFragsMulti({ mirrorX: true, mirrorY: true }));
	}

	lines.addComment("Outer cross");
	lines.add(new comp.Line({
		from: [leadingSubRangeInfo.main.toMil + 20, 0],
		to: [450, 0]
	}).getCodeFragsMulti({ mirrorX: true }));
	lines.add(new comp.Line({
		from: [0, leadingSubRangeInfo.main.toMil + 20],
		to: [0, 450]
	}).getCodeFragsMulti({ mirrorY: true }));

	texts.addComment("Leading value circle assumed speed");
	texts.add(new comp.TextSnippet({
		text: `${assumeTgtSpeedMain} kph`,
		align: "right", size: 0.8,
		pos: [2, -(leadingInfo.main.mil + 3.5)]
	}));
	texts.addComment("Leading value inner circle equivalent speed");
	texts.add(new comp.TextSnippet({
		text: (assumeTgtSpeedMain / leadingInfo.main.aa * leadingInfo.sub.aa).toFixed(),
		align: "right", size: 0.8,
		pos: [2, -(leadingInfo.sub.mil + 3.5)]
	}));


	let getDiffDisplayed = (num) => (num >= 0 ? num.toFixed() : ("-" + num.toFixed()));

	texts.addComment("Leading value range diffs");
	texts.add(new comp.TextSnippet({
		// text: getDiffDisplayed(assumeTgtSpeedSubRange[1] - assumeTgtSpeedMain),
		text: assumeTgtSpeedSubRange[1].toFixed(),
		align: "center", pos: [0, -(leadingSubRangeInfo.main.toMil + 3.5)],
		size: 0.8
	}));
	texts.add(new comp.TextSnippet({
		// text: getDiffDisplayed(assumeTgtSpeedSubRange[0] - assumeTgtSpeedMain),
		text: assumeTgtSpeedSubRange[0].toFixed(),
		align: "center", pos: [0, -(leadingSubRangeInfo.main.fromMil - 3)],
		size: 0.8
	}));
}



//// EXPORT
export default code;
/** Usage info for devs */
export const ABOUT = {
	DESCRIPTION: "Sight base for SPAA common scale",
	DEFINED_INFO: {
		zoomLevel: "common",
		fontLevel: "default",
		color: "red/green",
	},
	MUST_CALL_FIRST: "compileSightDesign",
	NEED_INFO: []
};

