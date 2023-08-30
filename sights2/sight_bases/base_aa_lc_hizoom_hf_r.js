// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Generic sight for SPAA with high zoom multiplier

TODO: Revision needed
`.trim());


let init = ({
	showCenteralCircle = true,
	shellSpeed,
	assumeTgtSpeedMain,
	assumeTgtSpeedSubRange,
	rgfdNumPosX = 135,
	gunDistValuePosX = -0.22
} = {}) => {
	//// BASIC SETTINGS ////
	sight.addSettings(pd.concatAllBasics(
		pd.basic.scales.getSPAAHighZoomLargeFont(),
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
		{ distance: 2000, shown: 20 },
		{ distance: 3600, shown: 36 },
	]);


	//// SIGHT DESIGNS ////
	sight.circles.addComment("Center dot");
	sight.add(new Circle({ diameter: 0.1, size: 4 }));

	sight.lines.addComment("Gun center");
	sight.add(new Line({ from: [-0.0012, 0], to: [0.0012, 0], move: true, thousandth: false }));
	sight.add(new Line({ from: [0, -0.0012], to: [0, 0.0012], move: true, thousandth: false }));


	if (showCenteralCircle) {
		sight.circles.addComment("Centeral circle (ground 400m)");
		sight.add(new Circle({
			segment: [30, 160],
			diameter: 4.125,
			size: 3.5
		}).withMirroredSeg("x"));
	}


	// Calculate mils
	let getMil = (aspectAngle, tgtSpeed = assumeTgtSpeedMain) => Toolbox.calcLeadingMil(
		shellSpeed, tgtSpeed, aspectAngle
	);
	let leadingInfo = { // aspect angles and corrsponding mils
		main: [
			{ aa: 1.0, mil: getMil(1.0), displayed: "" },
			{ aa: 0.5, mil: getMil(0.5), displayed: "2/4" },
		],
		sub: [
			{ aa: 0.75, mil: getMil(0.75), displayed: "3/4" },
			{ aa: 0.25, mil: getMil(0.25), displayed: "1/4" },
		],
	}

	sight.texts.addComment("Shell speed prompt");
	sight.add(new TextSnippet({
		text: `HE SPD - ${(shellSpeed/3.6).toFixed()}m/s`,
		align: "right",
		pos: [leadingInfo.main[0].mil + 30, 4.5],
		size: 1
	}));


	// Draw measuring lines
	// Circles
	sight.circles.addComment(`Leading value circles - ${assumeTgtSpeedMain}km/h`);
	sight.texts.addComment("Leading value circles - basic info");
	for (let info of leadingInfo.main) {
		sight.add(new Circle({diameter: info.mil * 2, size: 2}));
		if (info.displayed) {
			sight.add(new TextSnippet({
				text: `${assumeTgtSpeedMain} kph`,
				align: "right", pos: [1, -(info.mil+2.5)], size: 0.7
			}));
			sight.add(new TextSnippet({
				text: info.displayed,
				align: "left", pos: [-1, -(info.mil+2.5)], size: 0.7
			}));
		}
	}
	for (let info of leadingInfo.sub) {
		sight.add(new Circle({diameter: info.mil * 2, size: 1.0}));
		if (info.displayed) {
			sight.add(new TextSnippet({
				text: info.displayed,
				align: "left", pos: [-1, -(info.mil+2.5)], size: 0.7
			}));
		}
	}

	// Range Lines
	sight.circles.addComment(`Leading range line curves - ${assumeTgtSpeedMain}km/h`);
	for (let info of leadingInfo.main) {
		sight.add(new Circle({
			segment: [0.3, 2],
			diameter: getMil(info.aa, assumeTgtSpeedSubRange[1]) * 2,
			size: 1.5,
		}).withMirroredSeg("xy"));
		sight.add(new Circle({
			segment: [90.3, 92],
			diameter: getMil(info.aa, assumeTgtSpeedSubRange[1]) * 2,
			size: 1.5,
		}).withMirroredSeg("xy"));
		sight.add(new Circle({
			segment: [0.3, 1],
			diameter: getMil(info.aa, assumeTgtSpeedSubRange[0]) * 2,
			size: 1.5,
		}).withMirroredSeg("xy"));
		sight.add(new Circle({
			segment: [90.3, 91],
			diameter: getMil(info.aa, assumeTgtSpeedSubRange[0]) * 2,
			size: 1.5,
		}).withMirroredSeg("xy"));
	}

	let sqrt2 = Math.sqrt(2);

	sight.lines.addComment(`Leading value range lines - ${assumeTgtSpeedMain}km/h`);
	for (let info of leadingInfo.main) {
		let fromMil = getMil(info.aa, assumeTgtSpeedSubRange[0])
		let toMil = getMil(info.aa, assumeTgtSpeedSubRange[1])
		sight.add(new Line({ from: [0, fromMil], to: [0, toMil] }).withMirrored("y"));
		sight.add(new Line({ from: [fromMil,0], to: [toMil,0] }).withMirrored("x"));

		// 45 deg
		sight.add(new Line({
			from: [fromMil / sqrt2, fromMil / sqrt2],
			to: [toMil / sqrt2, toMil / sqrt2],
		}).withMirrored("xy"));
	}


	sight.texts.addComment("Leading value range lines - range prompt")
	for (let info of leadingInfo.main) {
		if (!info.displayed) { continue; }

		let fromMil = getMil(info.aa, assumeTgtSpeedSubRange[0])
		let toMil = getMil(info.aa, assumeTgtSpeedSubRange[1])
		sight.add(new TextSnippet({
			text: `+${assumeTgtSpeedSubRange[1] - assumeTgtSpeedMain}`,
			align: "center", pos: [0, -(toMil+2)], size: 0.7
		}));
		sight.add(new TextSnippet({
			text: `${assumeTgtSpeedSubRange[0] - assumeTgtSpeedMain}`,
			align: "center", pos: [0, -(fromMil-1.5)], size: 0.7
		}));
	}


	let milSmallest = [].
		concat(leadingInfo.main).concat(leadingInfo.sub).
		map((info) => info.mil).sort((a, b) => (a-b))[0];

	sight.lines.addComment("Center cross");
	sight.add(new Line({
		from: [0, milSmallest],
		to: [0, 4.125]
	}).withMirrored("y"));
	sight.add(new Line({
		from: [milSmallest, 0],
		to: [4.125, 0]
	}).withMirrored("x"));

	sight.lines.addComment("Center X");
	sight.add(new Line({
		from: [8.25 / sqrt2, 8.25 / sqrt2],
		to: [16.5 / sqrt2, 16.5 / sqrt2]
	}).withMirrored("xy"));

};




//// OUTPUT ////
export default {
	sightObj: sight,
	requireInfoAbout: ["matchVehicle"],
	init: init,
};
