import * as comp from "./_lib/sight_lib.js";
import * as pd from "./_lib/sight_predefined_info.js";



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
sight.append(pd.concatAllBasics(
	pd.basic.scales.getHighZoom(),
	pd.basic.colors.getGreenRed(),
	pd.basicBuild.rgfdPos([90, -0.01625]),
	pd.basicBuild.detectAllyPos([90, 0.04]),
	pd.basicBuild.gunDistanceValuePos([-0.13, 0.03]),
	pd.basic.shellDistanceTicks.getHighZoomCentral()
));



//// VEHICLE TYPES
matchVehicleClasses.
	addInclude(comp.MatchVehicleClassBlock.vehicleTypeGroundDefaults).
	addInclude([
		"germ_kanonenjagdpanzer",
		"germ_leopard_I",
		"sw_pvkv_m43_1963",
	]);



//// SHELL DISTANCES
shellDistances.addMulti(pd.shellDistances.getFullLoose());



//// SIGHT DESIGNS
// Find rangefinder values
let rgfdThWidths = {
	full: pd.rgfdThousandths.getWidths(),
	half: pd.rgfdThousandths.getHalfWidths()
};


circles.addComment("Sight center dot");
circles.add(new comp.Circle({ pos: [0, 0], diameter: 0.25, size: 2 }));
circles.add(new comp.Circle({ pos: [0, 0], diameter: 0.125, size: 4 }));


lines.addComment("Gun center T");
lines.add(new comp.Line({ from: [-0.002, 0], to: [0.002, 0], move: true, thousandth: false }));
lines.add(new comp.Line({ from: [0, 0], to: [0, 0.002], move: true, thousandth: false }));


lines.addComment("Horizontal line");
lines.add((() => {
	let rightLine = new comp.Line({ from: [450, 0], to: [rgfdThWidths.half.d_400, 0] });
	return [rightLine, rightLine.copy().mirrorX()];
})());


lines.addComment("Vertical line");
lines.add(new comp.Line({ from: [0, -450], to: [0, -4.125] }));
lines.add(new comp.Line({ from: [0, 450], to: [0, 8.25] }));


lines.addComment("Vertical Rangefinder on the horizon");
texts.addComment("Vertical Rangefinder on the horizon");
(() => {
	let rgfdRightTicks = [
		{ d: 100, tickY: [0, -2.5], textPos: [17.5, -2.5], textSize: 1.2 },
		{ d: 200, tickY: [0, -1.25], textPos: [9, -1.25], textSize: 1 },
		{ d: 400, tickY: [-0.5, 0.5], textPos: [4.6, -0.55], textSize: 0.65 },
	];
	for (let t of rgfdRightTicks) {
		let tickRight = new comp.Line({
			from: [rgfdThWidths.half[`d_${t.d}`], t.tickY[0]],
			to: [rgfdThWidths.half[`d_${t.d}`], t.tickY[1]]
		});
		let textRight = new comp.TextSnippet({
			text: (t.d / 100).toFixed(0),
			pos: t.textPos, size: t.textSize
		});

		lines.addComment(`${t.d}m`);
		lines.add([tickRight, tickRight.copy().mirrorX()]);

		texts.addComment(`${t.d}m`);
		texts.add([textRight, textRight.copy().mirrorX()]);
	}
})();


lines.addComment("Vertical Rangefinder on side");
texts.addComment("Vertical Rangefinder on side");
(() => {
	let rgfd = pd.rgfd.getHighZoom([4.125, 2.25]);
	lines.add(rgfd.lines);
	texts.add(rgfd.texts);
})();



//// OUTPUT
code.compileSightBlocks();
code.printCode();