import Sight from "../../_lib2/sight_main.js";
import Toolbox from "../../_lib2/sight_toolbox.js";
import { Quad, Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";
import * as pd from "../../_lib2/predefined.js";


let sight = new Sight();


// Introduction comment
sight.addDescription(`
Grid lines for development
`.trim());


//// BASIC SETTINGS ////
sight.addSettings(pd.concatAllBasics(
	pd.basicBuild.scale({ font: 1, line: 1 }),
	pd.basic.colors.getRedGreen(),
	pd.basicBuild.rgfdPos([0, 0]),
	pd.basicBuild.detectAllyPos([0, 0]),
	pd.basicBuild.gunDistanceValuePos([0, 0]),
	pd.basicBuild.shellDistanceTickVars(
		[0, 0],
		[0, 0],
		[0, 0],
	),
	pd.basic.miscVars.getCommon()
));


//// VEHICLE TYPES ////
sight.
	matchVehicle(Sight.commonVehicleTypes.grounds).
	matchVehicle(Sight.commonVehicleTypes.spaas);


//// SHELL DISTANCES ////
sight.addShellDistance([]);


//// SIGHT DESIGNS ////
// Vertical lines
for (let x of Toolbox.range(0, 400, 20, {includeStart: false, includeEnd: true})) {
	sight.add(new Line({
		from: [x, -450], to: [x, 450]
	}).addBreakAtY(0, 10).withMirrored("x"))
	sight.add(new TextSnippet({
		text: x.toFixed(), pos: [x, 0], size: 1
	}).withMirrored("x"))
}
// Horizontal lines
for (let y of Toolbox.range(0, 300, 20, {includeStart: false, includeEnd: true})) {
	sight.add(new Line({
		from: [-450, y], to: [450, y]
	}).addBreakAtX(0, 10).withMirrored("y"))
	sight.add(new TextSnippet({
		text: y.toFixed(), pos: [0, y], size: 1
	}).withMirrored("y"))
}



// sight.add(new Line({ from: [-75.5, -15], to: [-58.5, -15] }))  //50
// sight.add(new TextSnippet({ text: (75.5 - 58.5).toFixed(), pos: [0, 0], size: 1 }))



//// OUTPUT ////
sight.printCode();
