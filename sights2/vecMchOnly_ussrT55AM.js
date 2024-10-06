import base from "./sight_bases/base_g_l_z8_line.js";
import Sight from "../_lib2/sight_main.js";
import { BlkVariable } from "../_lib2/sight_code_basis.js";
import { Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import ENV_SET from "./sight_bases/_env_settings.js"

let sight = base.sightObj;
let displayRatioHoriMult = ENV_SET.DISPLAY_RATIO_NUM / (16/9);

sight.matchVehicle([
	"ussr_t_55_am",
	"ussr_t_55_amd_1",
])

base.init({
	shellSpeed: 1430 * 3.6,  // m/s * 3.6
	assumedMoveSpeed: 35,    // km/h
	useHollowCenterDot: true,
	useShortHorizontalLine: true,
});


// Re-configure shell corrections
sight.updateOrAddSettings(pd.basicBuild.shellDistanceTickVars(
	[-0.005 / displayRatioHoriMult, -0.005 / displayRatioHoriMult],
	[0.005 * displayRatioHoriMult, 0],
	[0.08 * displayRatioHoriMult - 0.005 * (1-displayRatioHoriMult), 0]
));
sight.components.shellDistances.clear();
sight.addShellDistance([
	{ distance: 400 },
	{ distance: 800 },
	{ distance: 2000, shown: 20, shownPos: [0.017, -0.001] },
	{ distance: 4000, shown: 40, shownPos: [0.017, -0.001] },
]);

sight.addComment("0m line", "lines");
sight.add(new Line({
	from: [-0.085, 0],
	to: [-0.08 + (0.001 * displayRatioHoriMult), 0], thousandth: false, move: true
}).move([(1 - displayRatioHoriMult) * 0.08, 0]));
sight.addComment("Correction indicator", "lines");
sight.add(new Line({
	from: [0, 0], to: [-0.005, 0.002], thousandth: false
}).withMirrored("y").move([
	-0.086 * displayRatioHoriMult - 0.005 * (1 - displayRatioHoriMult), 0]));
sight.add(new Line({
	from: [-0.005, 0.0009], to: [-0.005, 0.002], thousandth: false
}).withMirrored("y").move([
	-0.086 * displayRatioHoriMult - 0.005 * (1 - displayRatioHoriMult), 0]));


sight.addComment("Missile drop indication", ["circles", "texts"]);
// 100m
sight.add(new Circle({pos: [0, 2.5], size: 1, diameter: 1})).repeatLastAdd();
sight.add(new TextSnippet({
	text: "100",
	align: "center",
	pos: [4.0, 2.5 - 0.1], size: 0.5
}));
// 200m
sight.add(new Circle({pos: [0, 1.1], size: 1, diameter: 0.5})).repeatLastAdd();
sight.add(new TextSnippet({
	text: "200",
	align: "center",
	pos: [4.5, 1.1 - 0.1], size: 0.45
}));

export default { sightObj: base.sightObj };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { base.sightObj.printCode(); }
