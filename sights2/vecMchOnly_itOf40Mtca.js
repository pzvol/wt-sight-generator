import base from "./g_l_z8z16_g105_slow.js";
import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";

import turretAngleLegend from "../sights3/extra_modules/turret_angle_legend.js";

let sight = base.sightObj;

sight.components.matchVehicleClasses.clear();
sight.matchVehicle([
	"it_of_40_mk_2a",
	"it_of_40_mtca",
])

sight.remove(sight.collections["turretAngleLegends"]);
sight.collections["turretAngleLegends"].length = 0;

let zoomMult = Toolbox.calcMultForZooms(16, 14) - 0.002;
sight.add(turretAngleLegend.getTurretAngleLegend({
	pos: [18.94 * 0.753 * zoomMult, 14.2 * 0.753 * zoomMult],
	turretCircleDiameter: 2.15 * 0.753 * zoomMult,
	textSizeMain: 0.55 * 0.753 * zoomMult,
	textSizeSub: 0.4 * 0.753 * zoomMult,
	circleSize: 2.2 * 0.753 * zoomMult,
	showSideIndicator: false,
}));
sight.collections["turretAngleLegends"].push(...sight.lastAddedElements);

zoomMult = Toolbox.calcMultForZooms(8, 7);
sight.add(turretAngleLegend.getTurretAngleLegend({
	pos: [57.14 * 0.496 * zoomMult, 42.76 * 0.496 * zoomMult],
	turretCircleDiameter: 6.45 * 0.496 * zoomMult,
	textSizeMain: 1.65 * 0.496 * zoomMult,
	textSizeSub: 1.2 * 0.496 * zoomMult,
	circleSize: 6.05 * 0.496 * zoomMult,
	showSideIndicator: false,
}));
sight.collections["turretAngleLegends"].push(...sight.lastAddedElements);


export default { sightObj: base.sightObj };
if (  // NodeJS/Deno main module check
	(typeof require !== "undefined" && require.main === module) ||
	(typeof import.meta.main !== "undefined" && import.meta.main === true)
) { base.sightObj.printCode(); }
