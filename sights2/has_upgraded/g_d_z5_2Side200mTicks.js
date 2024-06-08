import Sight from "../_lib2/sight_main.js";
import Toolbox from "../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../_lib2/sight_elements.js";
import * as pd from "../_lib2/predefined.js";

import base from "./sight_bases/base_g_d_z5.js";


//// VEHICLE TYPES ////
base.sightObj.matchVehicle(Sight.commonVehicleTypes.grounds).matchVehicle([
]);


//// COMPILATION ////
base.init({
	useLooseShellDistTicks: false,
	useTwoSideShellDistTicks: true,
	useTwoTickBinocularRef: true,
	crossLineBold: 0.1,
});

let getMil = (dist) => Toolbox.calcDistanceMil(3.3, dist);

base.sightObj.lines.addComment("Additional 400m prompt on the horizon");
base.sightObj.add(new Line({
	from: [getMil(400) / 2, -3.25],
	to: [getMil(400) / 2, -1.75]
}).withMirrored("x"));




//// OUTPUT ////
base.sightObj.printCode();
