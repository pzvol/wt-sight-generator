import {
	Sight,
	General as G,
	Toolbox as T,
	MatchVehicleClassBlock,
	HorizontalThousandthsBlock,
	ShellDistancesBlock,
	CirclesBlock,
	Circle,
	Line,
} from "./sight_lib.js";


// Prepare sight file with sight name
let s = new Sight("testgen_g_vr_hizoom_lus_sf_g_3AroA")

// Basic settings
s.append([
	G.variable("fontSizeMult", 0.5),
	G.variable("lineSizeMult", 1.6),

	G.variable("rangefinderTextScale", 0.8),
	G.variable("rangefinderUseThousandth", false),
	G.variable("rangefinderProgressBarColor1", [255, 255, 255, 216], "c"),
	G.variable("rangefinderProgressBarColor2", [0, 0, 0, 216], "c"),
	G.variable("rangefinderHorizontalOffset", 125),
	G.variable("rangefinderVerticalOffset", -0.01725),

	G.variable("detectAllyTextScale", 0.8),
	G.variable("detectAllyOffset", [125, -0.045]),

	G.variable("drawDistanceCorrection", true),
	G.variable("distanceCorrectionPos", [-0.17, 0.035]),

	G.variable("crosshairDistHorSizeMain", [0, 0]),
	G.variable("crosshairDistHorSizeAdditional", [0.0070, 0.0030]),
	G.variable("distancePos", [0.005, 0]),

	G.variable("crosshairHorVertSize", [0.5, 0.3]),

	G.variable("drawCentralLineVert", false),
	G.variable("drawCentralLineHorz", false),
	G.variable("drawSightMask", true),

	"",
	"// Color of sight",
	G.variable("crosshairColor", [0, 200, 40, 255], "c"),
	G.variable("crosshairLightColor", [180, 0, 0, 255], "c"),
	""
])

// Vehicle match
s.append(MatchVehicleClassBlock.buildBlock([
	"exp_tank",
	"germ_erprobungstrager_3_achs_turm"
]))

// Horizontal thousandths
let horiThous = new HorizontalThousandthsBlock()
for (let t of T.rangeIE(-32, 32, 8)) { horiThous.add(t, Math.abs(t)); }
for (let t of T.rangeIE(-28, 28, 8)) { horiThous.add(t); }
s.append(horiThous.getCode())

// Distance lines
let shellDistances = new ShellDistancesBlock();
//   Short ticks
for (let r of T.rangeIE(400, 4000, 800)) { shellDistances.add(r); }
//   Long ticks - left text
for (let r of T.rangeIE(800, 4000, 1600)) { shellDistances.add(r, r/100); }
//   Long ticks - left text
for (let r of T.rangeIE(1600, 4000, 1600)) { shellDistances.add(r, r/100, [0.0295, 0]); }
s.append(shellDistances.getCode())


// Circles
let circles = new CirclesBlock()
//   Vertical Rangefinder circles
let rfAssumeWidth = 3.3
let vertRfParams = [
	{range: 100, segment: [90, 100]},
	{range: 200, segment: [90, 100]},
	{range: 400, segment: [82, 98]},
	{range: 800, segment: [85, 95]},
]
circles.addComment("Vertical Rangefinder")
for (let p of vertRfParams) {
	let c = new Circle({
		segment: p.segment,
		pos: [0, 0],
		diameter: T.calcThousandth(rfAssumeWidth, p.range),
		size: 1.6,
		move: false,
		thousandth: true,
	})
	circles.addComment(p.range + "m");
	circles.add(c);
	circles.add(c.copy().mirrorSegmentY());
}
circles.addComment("", "");

s.append(circles.getCode());




// let circleTextLines = [];

// // Vertical Rangefinder
// // 100, 200, 400, 800m
// let vrCurveSegments = [[90, 100], [90, 100], [82, 98], [85, 95]]
// let vrCurveDiameters = (() => {
// 	let ds = [];
// 	let dNum = 33;
// 	for (let c=0; c<4; c++) {
// 		ds.push(dNum);
// 		dNum /= 2;
// 	}
// 	return ds;
// })();
// let vrDetails = (() => {
// 	let rs = [];
// 	for (let i=0; i < vrCurveDiameters.length; i++) {
// 		rs.push({
// 			segment: vrCurveSegments[i],
// 			pos: [0, 0],
// 			diameter: vrCurveDiameters[i],
// 			size: 1.6,
// 			move: false,
// 			thousandth: true
// 		})
// 	}
// 	return rs;
// })();
// let vrs = (() => {
// 	let rs = [];
// 	for (let d of vrDetails) {
// 		rs.push((new Circle(d)).getCode())
// 		rs.push((new Circle(d)).mirrorSegmentY().getCode())
// 	}
// 	return rs;
// })();
// s.append(G.block(Sight.blockName.circles, vrs))


// let hLineXs = [[450, 17.25], [15.75, 9], [7.5, 4.825]]
// let ld = []
// for (let x of hLineXs) {
// 	Line.templateSimpleDetails()
// 	ld.push({
// 		line: [x[0], 0, x[1], 0],
// 		move: false,
// 		thousandth: true
// 	})
// }
// let ls = (() => {
// 	let rs = [];
// 	for (let d of ld) {
// 		rs.push((new Line(d)).getCode())
// 		rs.push((new Line(d)).mirrorY().getCode())
// 	}
// 	return rs;
// })();
// s.append(G.block(Sight.blockName.lines, vrs))


console.log(s.getCurrentText());