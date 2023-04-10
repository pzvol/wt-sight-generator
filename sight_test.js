import {
	Sight,
	General as G,
	MatchVehicleClass,
	Circle,
	Line,
} from "./sight_lib.js";


// Prepare sight file with sight name
let sf = new Sight("testgen_ussrT64B1984_ussrT80B")

// Basic settings
sf.append([
	G.variable("fontSizeMult", 0.8),
	G.variable("lineSizeMult", 1.5),

	G.variable("rangefinderTextScale", 0.8),
	G.variable("rangefinderUseThousandth", false),
	G.variable("rangefinderProgressBarColor1", [255, 255, 255, 216], "c"),
	G.variable("rangefinderProgressBarColor2", [0, 0, 0, 216], "c"),
	G.variable("rangefinderHorizontalOffset", 90),
	G.variable("rangefinderVerticalOffset", -0.04375),

	G.variable("detectAllyTextScale", 0.8),
	G.variable("detectAllyOffset", [90, -0.08]),

	G.variable("drawDistanceCorrection", true),
	G.variable("distanceCorrectionPos", [-0.13, 0.06]),

	G.variable("crosshairDistHorSizeMain", [-0.01, -0.01]),
	G.variable("crosshairDistHorSizeAdditional", [0.003, 0.0012]),
	G.variable("distancePos", [0.15, 0]),

	G.variable("crosshairHorVertSize", [0.5, 0.3]),

	G.variable("drawCentralLineVert", false),
	G.variable("drawCentralLineHorz", false),
	G.variable("drawSightMask", true),

	"\n// Color of sight",
	G.variable("crosshairColor", [0, 200, 40, 255], "c"),
	G.variable("crosshairLightColor", [180, 0, 0, 255], "c"),
])

// Vehicle match
sf.append(MatchVehicleClass.buildBlock([
	"ussr_t_64_b_1984",
	"ussr_t_80b"
]))



sf.append(
	G.block(Sight.blockTitle.crosshairHorRanges, [], "", "")
)



let circleTextLines = [];

// Vertical Rangefinder
// 100, 200, 400, 800m
let vrCurveSegments = [[90, 100], [90, 100], [82, 98], [85, 95]]
let vrCurveDiameters = (() => {
	let ds = [];
	let dNum = 33;
	for (let c=0; c<4; c++) {
		ds.push(dNum);
		dNum /= 2;
	}
	return ds;
})();
let vrDetails = (() => {
	let rs = [];
	for (let i=0; i < vrCurveDiameters.length; i++) {
		rs.push({
			segment: vrCurveSegments[i],
			pos: [0, 0],
			diameter: vrCurveDiameters[i],
			size: 1.6,
			move: false,
			thousandth: true
		})
	}
	return rs;
})();
let vrs = (() => {
	let rs = [];
	for (let d of vrDetails) {
		rs.push((new Circle(d)).getCode())
		rs.push((new Circle(d)).mirrorSegmentY().getCode())
	}
	return rs;
})();
sf.append(G.block(Sight.blockTitle.circles, vrs))


let hLineXs = [[450, 17.25], [15.75, 9], [7.5, 4.825]]
let ld = []
for (let x of hLineXs) {
	Line.templateSimpleDetails()
	ld.push({
		line: [x[0], 0, x[1], 0],
		move: false,
		thousandth: true
	})
}
let ls = (() => {
	let rs = [];
	for (let d of ld) {
		rs.push((new Line(d)).getCode())
		rs.push((new Line(d)).mirrorY().getCode())
	}
	return rs;
})();
sf.append(G.block(Sight.blockTitle.lines, vrs))


console.log(sf.getCurrentText());