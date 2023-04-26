import sight_lib, {
	Sight,
	General as G,
	Toolbox as T,
	MatchVehicleClassBlock,
	HorizontalThousandthsBlock,
	ShellDistancesBlock,
	CirclesBlock,
	Circle,
	LinesBlock,
	Line,
} from "./sight_lib.js";

// Prepare sight file with sight name
let s = new Sight()

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
//   empty line
// circles.addComment("", "");
s.append(circles.getCode());


// Lines
let lines = new LinesBlock();
lines.addComment("Test line");
let frags = new Line({from: [1, 1], to: [11, 11]}, [{x: 5, y: 5, r: Math.sqrt(2)}]);
lines.add(frags.getAllFragCodes())
lines.add(frags.copy().mirrorX().getAllFragCodes())
lines.add(frags.copy().mirrorY().getAllFragCodes())
lines.add(frags.copy().mirrorX().mirrorY().getAllFragCodes())

s.append(lines.getCode());




console.log(s.getCurrentText());