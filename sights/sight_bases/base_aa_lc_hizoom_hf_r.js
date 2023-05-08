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
// DEFINED IN INIT

//// VEHICLE TYPES
// NOT DEFINED IN BASE


//// SHELL DISTANCES
shellDistances.addMulti([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 2000, shown: 20 },
	{ distance: 3600, shown: 36 },
]);


//// SIGHT DESIGNS
circles.addComment("Center dot");
circles.add(new comp.Circle({ diameter: 0.1, size: 4 }));

lines.addComment("Gun center");
lines.add(new comp.Line({ from: [-0.0012, 0], to: [0.0012, 0], move: true, thousandth: false }));
lines.add(new comp.Line({ from: [0, -0.0012], to: [0, 0.0012], move: true, thousandth: false }));


// COMPILED UNTIL THIS FUNCTION CALLED
/**
 * Speed values are in km/h
 */
export function compileSightDesign({
	showCenteralCircle = true,
	milType = "ussr",
	shellSpeed,
	assumeTgtSpeedMain,
	assumeTgtSpeedSubRange,
	rgfdNumPosX = 135,
	gunDistValuePosX = -0.22
} = {}) {
	// Basic
	sight.append(pd.concatAllBasics(
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
		pd.basic.getMiscCommonVars()
	));


	if (showCenteralCircle) {
		circles.addComment("Centeral circle (ground 400m)");
		circles.add(new comp.Circle({
			segment: [30, 160],
			diameter: 4.125,
			size: 3.5
		}).getCodeMulti({ mirrorSegmentX: true }));
	}

	// Calculate mils
	let getMil = (aspectAngle, tgtSpeed = assumeTgtSpeedMain) => comp.Toolbox.calcLeadingThousandth(
		shellSpeed, tgtSpeed,
		aspectAngle, milType
	);
	let fourQuadrantSetting = {mirrorSegmentX:true, mirrorSegmentY: true};
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

	texts.addComment("Shell speed prompt");
	texts.add(new comp.TextSnippet({
		text: `HE SPD - ${(shellSpeed/3.6).toFixed()}m/s`,
		align: "right",
		pos: [leadingInfo.main[0].mil + 30, 4.5],
		size: 1
	}));


	// Draw measuring lines
	// Circles
	circles.addComment(`Leading value circles - ${assumeTgtSpeedMain}km/h`);
	texts.addComment("Leading value circles - basic info");
	for (let info of leadingInfo.main) {
		circles.add(new comp.Circle({diameter: info.mil * 2, size: 2}));
		if (info.displayed) {
			texts.add(new comp.TextSnippet({
				text: `${assumeTgtSpeedMain} kph`,
				align: "right", pos: [1, -(info.mil+2.5)], size: 0.7
			}));
			texts.add(new comp.TextSnippet({
				text: info.displayed,
				align: "left", pos: [-1, -(info.mil+2.5)], size: 0.7
			}));
		}
	}
	for (let info of leadingInfo.sub) {
		circles.add(new comp.Circle({diameter: info.mil * 2, size: 1.0}));
		if (info.displayed) {
			texts.add(new comp.TextSnippet({
				text: info.displayed,
				align: "left", pos: [-1, -(info.mil+2.5)], size: 0.7
			}));
		}
	}


	// Range Lines
	circles.addComment(`Leading range line curves - ${assumeTgtSpeedMain}km/h`);
	for (let info of leadingInfo.main) {
		circles.add(new comp.Circle({
			segment: [0.3, 2],
			diameter: getMil(info.aa, assumeTgtSpeedSubRange[1]) * 2,
			size: 1.5,
		}).getCodeMulti(fourQuadrantSetting));
		circles.add(new comp.Circle({
			segment: [90.3, 92],
			diameter: getMil(info.aa, assumeTgtSpeedSubRange[1]) * 2,
			size: 1.5,
		}).getCodeMulti(fourQuadrantSetting));
		circles.add(new comp.Circle({
			segment: [0.3, 1],
			diameter: getMil(info.aa, assumeTgtSpeedSubRange[0]) * 2,
			size: 1.5,
		}).getCodeMulti(fourQuadrantSetting));
		circles.add(new comp.Circle({
			segment: [90.3, 91],
			diameter: getMil(info.aa, assumeTgtSpeedSubRange[0]) * 2,
			size: 1.5,
		}).getCodeMulti(fourQuadrantSetting));
	}

	let sqrt2 = Math.sqrt(2);

	lines.addComment(`Leading value range lines - ${assumeTgtSpeedMain}km/h`);
	for (let info of leadingInfo.main) {
		let fromMil = getMil(info.aa, assumeTgtSpeedSubRange[0])
		let toMil = getMil(info.aa, assumeTgtSpeedSubRange[1])
		lines.add(new comp.Line({
			from: [0, fromMil], to: [0, toMil]
		}).getCodeFragsMulti({ mirrorY: true }));
		lines.add(new comp.Line({
			from: [fromMil,0], to: [toMil,0]
		}).getCodeFragsMulti({ mirrorX: true }));

		// 45 deg
		lines.add(new comp.Line({
			from: [fromMil / sqrt2, fromMil / sqrt2],
			to: [toMil / sqrt2, toMil / sqrt2],
		}).getCodeFragsMulti({ mirrorX: true, mirrorY: true }));
	}


	texts.addComment("Leading value range lines - range prompt")
	for (let info of leadingInfo.main) {
		if (!info.displayed) { continue; }

		let fromMil = getMil(info.aa, assumeTgtSpeedSubRange[0])
		let toMil = getMil(info.aa, assumeTgtSpeedSubRange[1])
		texts.add(new comp.TextSnippet({
			text: `+${assumeTgtSpeedSubRange[1] - assumeTgtSpeedMain}`,
			align: "center", pos: [0, -(toMil+2)], size: 0.7
		}));
		texts.add(new comp.TextSnippet({
			text: `${assumeTgtSpeedSubRange[0] - assumeTgtSpeedMain}`,
			align: "center", pos: [0, -(fromMil-1.5)], size: 0.7
		}));
	}

	// texts.add(new comp.TextSnippet({
	// 	text: `+${assumeTgtSpeedSubRange[1] - assumeTgtSpeedMain}`,
	// 	align: "center", pos: [0, -(subMilRange[1]+2)], size: 0.7
	// }));
	// texts.add(new comp.TextSnippet({
	// 	text: `${assumeTgtSpeedSubRange[0] - assumeTgtSpeedMain}`,
	// 	align: "center", pos: [0, -(subMilRange[0]-1.5)],
	// 	size: 0.7
	// }));


	let milSmallest = [].
		concat(leadingInfo.main).concat(leadingInfo.sub).
		map((info) => info.mil).sort((a, b) => (a-b))[0];

	lines.addComment("Center cross");
	lines.add(new comp.Line({
		from: [0, milSmallest],
		to: [0, 4.125]
	}).getCodeFragsMulti({ mirrorY: true }));
	lines.add(new comp.Line({
		from: [milSmallest, 0],
		to: [4.125, 0]
	}).getCodeFragsMulti({ mirrorX: true }));

	lines.addComment("Center X");
	lines.add(new comp.Line({
		from: [8.25 / sqrt2, 8.25 / sqrt2],
		to: [16.5 / sqrt2, 16.5 / sqrt2]
	}).getCodeFragsMulti({ mirrorY: true, mirrorX: true }));

	// Draw measuring lines

	// // Sub leading circles on crossing
	// circles.addComment(`Leading value circles - Sub outer, ${subMilRange[1]}km/h`);
	// circles.add(new comp.Circle({ segment: [0.3, 2], diameter: subMilRange[1] * 2, size: 1.5, }).
	// 	getCodeMulti({mirrorSegmentX:true, mirrorSegmentY: true}));
	// circles.add(new comp.Circle({ segment: [90.3, 92], diameter: subMilRange[1] * 2, size: 1.5, }).
	// 	getCodeMulti({mirrorSegmentX:true, mirrorSegmentY: true}));
	// circles.addComment(`Leading value circles - Sub inner, ${subMilRange[0]}km/h`);
	// circles.add(new comp.Circle({ segment: [0.3, 1], diameter: subMilRange[0] * 2, size: 1.5, }).
	// 	getCodeMulti({mirrorSegmentX:true, mirrorSegmentY: true}));
	// circles.add(new comp.Circle({ segment: [90.3, 91], diameter: subMilRange[0] * 2, size: 1.5, }).
	// 	getCodeMulti({mirrorSegmentX:true, mirrorSegmentY: true}));
	// texts.addComment("Leading value circles - Sub")
	// texts.add(new comp.TextSnippet({
	// 	text: `+${assumeTgtSpeedSubRange[1] - assumeTgtSpeedMain}`,
	// 	align: "center", pos: [0, -(subMilRange[1]+2)], size: 0.7
	// }));
	// texts.add(new comp.TextSnippet({
	// 	text: `${assumeTgtSpeedSubRange[0] - assumeTgtSpeedMain}`,
	// 	align: "center", pos: [0, -(subMilRange[0]-1.5)],
	// 	size: 0.7
	// }));


	// lines.addComment(`Leading value - Subs, 45 deg`);
	// lines.add(new comp.Line({
	// 	from: [subMilRange[0] / Math.sqrt(2), subMilRange[0] / Math.sqrt(2)],
	// 	to: [subMilRange[1] / Math.sqrt(2), subMilRange[1] / Math.sqrt(2)],
	// }).getCodeFragsMulti({mirrorX:true, mirrorY: true}));
	// lines.addComment(`Leading value - Subs, 45 deg, fracted`);
	// lines.add(new comp.Line({
	// 	from: [subMilRangeFracted[0] / Math.sqrt(2), subMilRangeFracted[0] / Math.sqrt(2)],
	// 	to: [subMilRangeFracted[1] / Math.sqrt(2), subMilRangeFracted[1] / Math.sqrt(2)],
	// }).getCodeFragsMulti({mirrorX:true, mirrorY: true}));

	// lines.addComment("Vertical line");
	// lines.add(new comp.Line({ from: [0, subMilRangeFracted[0]], to: [0, subMilRangeFracted[1]] }).
	// 	getCodeFragsMulti({ mirrorY: true }));
	// lines.add(new comp.Line({ from: [0, subMilRange[0]], to: [0, subMilRange[1]] }).
	// 	getCodeFragsMulti({ mirrorY: true }));
	// lines.add(new comp.Line({ from: [0, subMilRange[1]+20], to: [0, 450] }).
	// 	getCodeFragsMulti({ mirrorY: true }));

	// lines.addComment("Horizontal line");
	// lines.add(new comp.Line({ from: [subMilRangeFracted[0], 0], to: [subMilRangeFracted[1], 0] }).
	// 	getCodeFragsMulti({ mirrorX: true }));
	// lines.add(new comp.Line({ from: [subMilRange[0], 0], to: [subMilRange[1], 0] }).
	// 	getCodeFragsMulti({ mirrorX: true }));
	// lines.add(new comp.Line({ from: [subMilRange[1]+20, 0], to: [450, 0] }).
	// 	getCodeFragsMulti({ mirrorX: true }));


}



//// EXPORT
export default code;
/** Usage info for devs */
export const ABOUT = {
	DESCRIPTION: "Sight base for SPAA common scale",
	DEFINED_INFO: {
		zoomLevel: "highZoom",
		fontLevel: "default",
		color: "red/green",
	},
	MUST_CALL_FIRST: "compileSightDesign",
	NEED_INFO: []
};

