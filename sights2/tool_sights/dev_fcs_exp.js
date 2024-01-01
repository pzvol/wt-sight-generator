import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`For testing mousewheel radial move tick positioning`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basic.scales.getHighZoom(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([110, -0.02125]),
	pd.basicBuild.detectAllyPos([110, -0.045]),
	pd.basicBuild.gunDistanceValuePos([-0.13, 0.035]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0.0070, 0.0025],
		[0.005, 0]
	),
	pd.basic.miscVars.getCommon(),
));


//// VEHICLE TYPES ////
sight.matchVehicle(Sight.commonVehicleTypes.grounds);


//// SHELL DISTANCES ////
sight.addShellDistance(pd.shellDists.getFullLoose());


//// SIGHT DESIGNS ////
let cfg = 	{
	mouseWheelMult: 75,
	radius: 10000,
	radialSpeed: 1000,
	tickAngle: 9.02408,
};
let drawToCount = 150;
let drawLastOnly = false;

// sight.add(new Line({from: [1, 0], to: [12, 0]}).withMirrored("x"));
// let mult = 20
// let thPerTick = 1.575
// sight.add(new Line({
// 	from: [-1, thPerTick * mult], to: [1, thPerTick * mult], move: true
// }));

let showMult = 2
sight.add(new Line({from: [10*showMult, 0], to: [12*showMult, 0]}).withMirrored("x"));
if (drawLastOnly) {
	sight.add(new Line({
		from: [-10*showMult, 0], to: [10*showMult, 0],
		moveRadial: true,
		radialCenter: [cfg.radius, 0],
		radialAngle: cfg.tickAngle * (drawToCount - 1),
		radialMoveSpeed: cfg.radialSpeed,
	}));
} else {
	for (let count = 0; count < drawToCount; count++) {
		if (count % 5 !== 0) {continue;}
		sight.add(new Line({
			from: [-10*showMult, 0], to: [10*showMult, 0],
			moveRadial: true,
			radialCenter: [cfg.radius, 0],
			radialAngle: cfg.tickAngle * count,
			radialMoveSpeed: cfg.radialSpeed,
		}));
		sight.add(new TextSnippet({
			text: count.toFixed(),
			pos: [0, 0],
			size: 1,
			moveRadial: true,
			radialCenter: [cfg.radius, 0],
			radialAngle: cfg.tickAngle * count,
			radialMoveSpeed: cfg.radialSpeed,
		}))
	}
}





//// OUTPUT ////
export default { sightObj: sight };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { sight.printCode(); }
