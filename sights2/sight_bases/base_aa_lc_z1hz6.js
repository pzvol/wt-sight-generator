// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Sight for SPAAs with 2X~4X optics
`.trim());


let init = ({
	showCenteralCircle = true,

	shellSpeed,
	assumeTgtSpeedMain,
	assumeTgtSpeedSubRange,

	rgfdNumPosX = 105,
	gunDistValuePosX = -0.18
} = {}) => {

	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basicBuild.scale({ font: 0.5, line: 1.4 }),
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

	// Gun center
	sight.add(new Line({ from: [-0.00125, 0], to: [0.00125, 0], move: true, thousandth: false }))
	sight.add(new Line({ from: [0, -0.00125], to: [0, 0.00125], move: true, thousandth: false }))

	// Center dot
	sight.add(new Circle({ diameter: 0.1, size: 4 }));

	// Center circle around the dot
	if (showCenteralCircle) {
		sight.add(new Circle({ segment: [30, 160], diameter: 8.25, size: 5.2 }).withMirroredSeg("x"));
	}


	let sin45 = Math.sin(Toolbox.degToRad(45));
	let drawCross = (fromVal, toVal) => [new Line({ from: [0, fromVal], to: [0, toVal] }).withMirrored("y"), new Line({ from: [fromVal, 0], to: [toVal, 0] }).withMirrored("x")];
	let drawX = (fromRadius, toRadius) => (new Line({ from: [fromRadius * sin45, fromRadius * sin45], to: [toRadius * sin45, toRadius * sin45] }).withMirrored("xy"));
	let drawCurveCross = (radius, [segFrom, segTo], size) => [new Circle({ segment: [segFrom, segTo], diameter: radius * 2, size: size }).withMirroredSeg("x"), new Circle({ segment: [segFrom + 90, segTo + 90], diameter: radius * 2, size: size }).withMirroredSeg("y")];
	let drawCurveX = (radius, [segFrom, segTo], size) => (new Circle({ segment: [segFrom, segTo], diameter: radius * 2, size: size }).withMirroredSeg("xy"))

	// Cross lines
	//   center cross
	sight.add(drawCross(4.125, 22.5));


	let getLdn = (aspectAngle, tgtSpeed = assumeTgtSpeedMain) => Toolbox.calcLeadingMil(
		shellSpeed, tgtSpeed, aspectAngle
	);

	// Air target aiming components
	let ldnInfo = {
		main: {
			aa: 1.0,
			mil: getLdn(1),
			rangeMil: {
				from: getLdn(1, assumeTgtSpeedSubRange[0]),
				to: getLdn(1, assumeTgtSpeedSubRange[1]),
			}
		},
		sub: {
			aa: 0.5,
			mil: getLdn(0.5),
			rangeMil: {
				from: getLdn(0.5, assumeTgtSpeedSubRange[0]),
				to: getLdn(0.5, assumeTgtSpeedSubRange[1]),
			}
		},
	};

	sight.texts.addComment("Shell speed prompt");
	sight.add(new TextSnippet({
		text: `HE SPD - ${(shellSpeed / 3.6).toFixed()}m/s`,
		align: "right",
		pos: [ldnInfo.main.rangeMil.to + 45, 4.5],
		size: 1.6
	}));

	sight.circles.addComment(`Leading value circles - ${assumeTgtSpeedMain}km/h`);
	sight.add(new Circle({ diameter: ldnInfo.main.mil * 2, size: 2.5 }));
	sight.add(new Circle({ diameter: ldnInfo.sub.mil * 2, size: 2 }));

	sight.circles.addComment(`Leading value range curves as range prompt`);
	sight.circles.addComment(`inner`);
	for (let seg of [[0.3, 1], [90.3, 91]]) {
		sight.add(new Circle({
			segment: seg, size: 3.5,
			diameter: ldnInfo.main.rangeMil.from * 2,
		}).withMirroredSeg("xy"));
	}
	sight.circles.addComment(`outer`);
	for (let seg of [[0.3, 2], [90.3, 92]]) {
		sight.add(new Circle({
			segment: seg, size: 3.5,
			diameter: ldnInfo.main.rangeMil.to * 2,
		}).withMirroredSeg("xy"));
	}

	sight.lines.addComment("Leading value range lines");
	for (let ldnRange of [ldnInfo.main.rangeMil, ldnInfo.sub.rangeMil]) {
		sight.add(drawCross(ldnRange.from, ldnRange.to));
		sight.add(drawX(ldnRange.from, ldnRange.to));
	}

	sight.lines.addComment("Outer cross from screen borders");
	sight.add(drawCross(ldnInfo.main.rangeMil.to + 35, 450));


	sight.texts.addComment("Leading value circle - assumed speed");
	sight.add(new TextSnippet({
		text: `${assumeTgtSpeedMain} kph`,
		align: "right", size: 1.4,
		pos: [1.5, -(ldnInfo.main.mil + 4.5)]
	}));
	sight.texts.addComment("Leading value inner circle equivalent speed");
	sight.add(new TextSnippet({
		text: (assumeTgtSpeedMain / ldnInfo.main.aa * ldnInfo.sub.aa).toFixed(),
		align: "right", size: 1.3,
		pos: [1.5, -(ldnInfo.sub.mil + 4.5)]
	}));


	sight.texts.addComment("Leading range line ending values");
	sight.add(new TextSnippet({
		text: assumeTgtSpeedSubRange[1].toFixed(),
		align: "center", pos: [0, -(ldnInfo.main.rangeMil.to + 3.5)],
		size: 1.2
	}));
	sight.add(new TextSnippet({
		text: assumeTgtSpeedSubRange[0].toFixed(),
		align: "center", pos: [0, -(ldnInfo.main.rangeMil.from - 3)],
		size: 1.2
	}));

};



//// OUTPUT ////
export default {
	sightObj: sight,
	requireInfoAbout: ["matchVehicle"],
	init: init,
};
