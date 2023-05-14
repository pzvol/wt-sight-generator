// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";


let sight = new Sight();



/** Speed values are in km/h */
function build({
	showCenteralCircle = true,
	milType = "ussr",
	shellSpeed,
	assumeTgtSpeedMain,
	assumeTgtSpeedSubRange,
	rgfdNumPosX = 200,
	gunDistValuePosX = -0.28
} = {}) {

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
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
		pd.basic.miscVars.getCommon()
	));


	//// VEHICLE TYPES ////
	// NOT DEFINED IN BASE


	//// SHELL DISTANCES ////
	sight.addShellDistance([
		{ distance: 400 },
		{ distance: 800 },
		{ distance: 1200 },
		{ distance: 1600, shown: 16 },
		{ distance: 3600, shown: 36 },
	]);


	//// SIGHT DESIGNS ////
	sight.lines.addComment("Gun center cross");
	sight.add(new Line({ from: [-0.002, 0], to: [0.002, 0], move: true, thousandth: false }));
	sight.add(new Line({ from: [0, -0.0015], to: [0, 0.0015], move: true, thousandth: false }));

	sight.circles.addComment("Sight center dot");
	sight.add(new Circle({ diameter: 0.2, size: 4 }));

	let assumeGroundWidth = 3.3;
	let d100mGroundMilHalf = Toolbox.calcDistanceMil(assumeGroundWidth, 100) / 2;

	sight.lines.addComment("Sight center cross");
	sight.add(new Line({
		from: [0, d100mGroundMilHalf / 2],
		to: [0, d100mGroundMilHalf]
	}).withExtra(Line.extraVert));
	sight.add(new Line({
		from: [d100mGroundMilHalf / 2, 0],
		to: [d100mGroundMilHalf - 3, 0]
	}).withExtra(Line.extraHori));

	sight.texts.addComment("Ground 100m prompt");
	sight.add(new TextSnippet({
		text: "G1", pos: [d100mGroundMilHalf, -0.4], size: 0.6
	}).withExtra(TextSnippet.extraHori));

	sight.addComment("Air 400m prompt", ["circles", "texts"]);
	sight.add(new Circle({
		segment: [22.5, 67.5], diameter: 27.5, size: 1.2
	}).withExtra(Circle.extraSegFourQuad));
	sight.add(new TextSnippet({
		text: "4", pos: [12, 12], size: 0.65
	}));


	if (showCenteralCircle) {
		sight.circles.addComment("Centeral circle (air 1600m)");
		sight.add(new Circle({
			segment: [25, 65],
			diameter: 6.875,
			size: 4
		}).withExtra(Circle.extraSegFourQuad));
	}


	// Air target aiming components
	let getMil = (aspectAngle, tgtSpeed = assumeTgtSpeedMain) => Toolbox.calcLeadingMil(
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

	sight.texts.addComment("Shell speed prompt");
	sight.add(new TextSnippet({
		text: `HE SPD - ${(shellSpeed / 3.6).toFixed()}m/s`,
		align: "right",
		pos: [leadingSubRangeInfo.main.toMil + 30, 4.5],
		size: 1
	}));

	sight.circles.addComment(`Leading value circles - ${assumeTgtSpeedMain}km/h`);
	sight.add(new Circle({
		diameter: leadingInfo.main.mil * 2, size: 2.2,
	}));
	sight.add(new Circle({
		diameter: leadingInfo.sub.mil * 2, size: 1.6,
	}));

	sight.circles.addComment(`Leading value range curves`);
	sight.circles.addComment(`inner`);
	sight.add(new Circle({
		segment: [0.3, 1], size: 1.5,
		diameter: leadingSubRangeInfo.main.fromMil * 2
	}).withExtra(Circle.extraSegFourQuad));
	sight.add(new Circle({
		segment: [90.3, 91], size: 1.5,
		diameter: leadingSubRangeInfo.main.fromMil * 2
	}).withExtra(Circle.extraSegFourQuad));
	sight.circles.addComment(`outer`);
	sight.add(new Circle({
		segment: [0.3, 2], size: 1.5,
		diameter: leadingSubRangeInfo.main.toMil * 2
	}).withExtra(Circle.extraSegFourQuad));
	sight.add(new Circle({
		segment: [90.3, 92], size: 1.5,
		diameter: leadingSubRangeInfo.main.toMil * 2
	}).withExtra(Circle.extraSegFourQuad));


	sight.lines.addComment("Leading value range lines");
	let sqrt2 = Math.sqrt(2);
	for (let r of [leadingSubRangeInfo.main, leadingSubRangeInfo.sub]) { sight.add([
		new Line({from: [r.fromMil, 0], to: [r.toMil, 0]}).withExtra(Line.extraHori),
		new Line({from: [0, r.fromMil], to: [0, r.toMil]}).withExtra(Line.extraVert),
		// 45 deg
		new Line({
			from: [r.fromMil / sqrt2, r.fromMil / sqrt2],
			to: [r.toMil / sqrt2, r.toMil / sqrt2]
		}).withExtra(Line.extraFourQuad),
	]); }

	sight.lines.addComment("Outer cross");
	sight.add([
		new Line({
			from: [leadingSubRangeInfo.main.toMil + 20, 0], to: [450, 0]
		}).withExtra(Line.extraHori),
		new Line({
			from: [0, leadingSubRangeInfo.main.toMil + 20], to: [0, 450]
		}).withExtra(Line.extraVert),
	]);

	sight.texts.addComment("Leading value circle assumed speed");
	sight.add(new TextSnippet({
		text: `${assumeTgtSpeedMain} kph`,
		align: "right", size: 0.8,
		pos: [2, -(leadingInfo.main.mil + 3.5)]
	}));
	sight.texts.addComment("Leading value inner circle equivalent speed");
	sight.add(new TextSnippet({
		text: (assumeTgtSpeedMain / leadingInfo.main.aa * leadingInfo.sub.aa).toFixed(),
		align: "right", size: 0.8,
		pos: [2, -(leadingInfo.sub.mil + 3.5)]
	}));


	sight.texts.addComment("Leading value range diffs");
	sight.add(new TextSnippet({
		text: assumeTgtSpeedSubRange[1].toFixed(),
		align: "center", pos: [0, -(leadingSubRangeInfo.main.toMil + 3.5)],
		size: 0.8
	}));
	sight.add(new TextSnippet({
		text: assumeTgtSpeedSubRange[0].toFixed(),
		align: "center", pos: [0, -(leadingSubRangeInfo.main.fromMil - 3)],
		size: 0.8
	}));


	return sight;
}




//// OUTPUT ////
export default {
	sightObj: sight,
	requireInfoAbout: [
		"matchVehicle",
	],
	init: build,
};
