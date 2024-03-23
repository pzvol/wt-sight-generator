// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Toolbox from "../../_lib2/sight_toolbox.js";
import { Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";

/** Multiplier for converting binocular's USSR mil to sight's real mil */
const MUL_U2R = Toolbox.MIL.ussr.value / Toolbox.MIL.real.value;

/** Mil calculation shorthands */
class MilCalculator {
	constructor(tgtWidth = 3.3, milType = "real") {
		this.tgtWidth = tgtWidth;
		this.milType = milType;
	}

	getDistMil(dist) {
		return Toolbox.calcDistanceMil(this.tgtWidth, dist, this.milType);
	}

	getDistMilHalf(dist) {
		return this.getDistMil(dist) / 2;
	}

	getDistOfMil(mil) {
		return Toolbox.calcDistanceOfMil(this.tgtWidth, mil, this.milType);
	}
}


export default {
	/** Generic calibration scale bar */
	getBinoCali({
		pos = [0, 0],

		mirrorX = false,
		mirrorY = false,
		drawTwoTicks = true,

		drawZeroLine = true,
		zeroLineExceeds = [-3, 0],

		milWidthScale = 2,
		showNon1MilWidthScale = true,
		quadHeight = 3,
		mainTickIntervalPer = 0.47,
		subTickPer = 0.33,

		showAssumedTgtWidth = false,
		assumedTgtWidth = 3.3,

		upperTickShownDigit = 0,
		upperTickShownAlwaysUseRound = false,
		// ^ `true` makes round (instead of floor) also applied when showing integers

		upperTextSize = 0.5,
		lowerTextSize = 0.45,
		upperTextY = -2,
		lowerTextY = 1.6,

		drawnSubTickDists = [400, 500, 800, 1600],
	} ={}) {
		let mc = new MilCalculator(assumedTgtWidth);
		// Upper tick value editor for showing
		// `floor` is used to avoid confusion brought by distance ticks like:
		//   6.3(showing 6) * 2 = 12.6(showing 13)
		let utShown = (n) => (
			upperTickShownDigit == 0 && !upperTickShownAlwaysUseRound ?
				Math.floor(n).toString() : n.toFixed(upperTickShownDigit)
		);

		let elements = [];

		// Draw full quad (and binocular ticks)
		if (drawZeroLine) {
			elements.push(new Line({
				from: [0, zeroLineExceeds[0]],
				to: [0, quadHeight + zeroLineExceeds[1]]
			}));
		}
		if (drawTwoTicks) {
			elements.push(
				// 2 binocular ticks and the whole quad (= 10 USSR mil)
				new Line({ from: [10 * MUL_U2R * milWidthScale, quadHeight], to: [0, quadHeight] }),
				new Line({ from: [10 * MUL_U2R * milWidthScale, 0], to: [0, 0] }),
				new Line({ from: [10 * MUL_U2R * milWidthScale, quadHeight], to: [10 * MUL_U2R * milWidthScale, 0] }),
				new TextSnippet({
					text: utShown(mc.getDistOfMil(10 * MUL_U2R) / 100),
					pos: [10 * MUL_U2R * milWidthScale, upperTextY],
					size: upperTextSize
				}),
				// 1 binocular tick (= 5 USSR mil)
				new Line({ from: [5 * MUL_U2R * milWidthScale, quadHeight], to: [5 * MUL_U2R * milWidthScale, 0] }),
				new TextSnippet({
					text: utShown(mc.getDistOfMil(5 * MUL_U2R) / 100),
					pos: [5 * MUL_U2R * milWidthScale, upperTextY],
					size: upperTextSize
				}),
			);
		} else {
			elements.push(
				// 1 binocular tick and the whole quad (= 5 USSR mil)
				new Line({ from: [5 * MUL_U2R * milWidthScale, quadHeight], to: [0, quadHeight] }),
				new Line({ from: [5 * MUL_U2R * milWidthScale, 0], to: [0, 0] }),
				new Line({ from: [5 * MUL_U2R * milWidthScale, quadHeight], to: [5 * MUL_U2R * milWidthScale, 0] }),
				new TextSnippet({
					text: utShown(mc.getDistOfMil(5 * MUL_U2R) / 100),
					pos: [5 * MUL_U2R * milWidthScale, upperTextY],
					size: upperTextSize
				}),
			)
		}

		// Draw main ticks
		let halfTickMils = drawTwoTicks ? [2.5, 7.5] : [2.5];
		// 0.5 bino tick = 2.5 USSR mil; 1.5 bino tick = 7.5 USSR mil
		let mainTickhalfLength = (1.0 - mainTickIntervalPer) / 2 * quadHeight;
		for (let binoMil of halfTickMils) {
			elements.push(
				new Line({
					from: [binoMil * MUL_U2R * milWidthScale, quadHeight],
					to: [binoMil * MUL_U2R * milWidthScale, quadHeight - mainTickhalfLength]
				}),
				new Line({
					from: [binoMil * MUL_U2R * milWidthScale, mainTickhalfLength],
					to: [binoMil * MUL_U2R * milWidthScale, 0]
				}),
				new TextSnippet({
					text: utShown(mc.getDistOfMil(binoMil * MUL_U2R) / 100),
					pos: [binoMil * MUL_U2R * milWidthScale, upperTextY],
					size: upperTextSize
				}),
			)
		}

		// Draw sub ticks (distances)
		let subTickLength = subTickPer * quadHeight;
		for (let dist of drawnSubTickDists) {
			let mil = mc.getDistMil(dist);
			if (!drawTwoTicks && mil> 5 * MUL_U2R) { continue; }
			elements.push(
				new Line({
					from: [mil * milWidthScale, (quadHeight - subTickLength) / 2],
					to: [mil * milWidthScale, (quadHeight + subTickLength) / 2]
				}),
				new TextSnippet({
					text: (dist / 100).toFixed(),
					pos: [mil * milWidthScale, quadHeight + lowerTextY],
					size: lowerTextSize
				}),
			);
		}

		// Width prompt
		let promptTexts = [];
		if (showAssumedTgtWidth) {
			promptTexts.push(`Width: ${assumedTgtWidth.toString()}m`);
		}
		if (showNon1MilWidthScale && milWidthScale != 1) {
			promptTexts.push(`Scale ${Toolbox.round(milWidthScale, 2)}:1`);
		}
		if (promptTexts.length > 0) {
			let posMil = drawTwoTicks ? 10 : 5;
			elements.push(new TextSnippet({
				text: promptTexts.join(",  "), align: "right",
				pos: [posMil * MUL_U2R * milWidthScale + 0.8, quadHeight/2], size: lowerTextSize
			}));
		}

		// Move to position
		for (let ele of elements) {
			if (mirrorX) { ele.mirrorX(); }
			if (mirrorY) { ele.mirrorY(); }
			ele.move(pos);
		}
		return elements;
	},


	getBinoCaliSimplified({
		pos = [0, 0],

		mirrorX = false,
		mirrorY = false,
		drawTwoTicks = true,

		drawCenterCross = true,
		drawHoriLine = false,
		centerCrossRadius = 0.5,

		milWidthScale = 1,
		showNon1MilWidthScale = true,
		binoMainTickHeight = 2,
		binoSubTickPer = 0.6,
		binoHalfTickLength = 0.5,

		showAssumedTgtWidth = false,
		assumedTgtWidth = 3.3,

		binoTickShownDigit = 0,
		binoTickShownAlwaysUseRound = false,
		// ^ `true` makes round (instead of floor) also applied when showing integers

		binoTextSizeMain = 0.65,
		binoTextYMain = 0.7,
		binoTextSizeSub = 0.45,
		binoTextYSub = 0.45,

		distTextSize = 0.55,
		distTextY = -0.7,

		drawnSubTickDists = [400, 500, 800, 1600],
	} ={}) {
		let mc = new MilCalculator(assumedTgtWidth);
		// Upper tick value editor for showing
		// `floor` is used to avoid confusion brought by distance ticks like:
		//   6.3(showing 6) * 2 = 12.6(showing 13)
		let utShown = (n) => (
			binoTickShownDigit == 0 && !binoTickShownAlwaysUseRound ?
				Math.floor(n).toString() : n.toFixed(binoTickShownDigit)
		);

		let elements = [];

		// Draw binocular elements
		if (drawCenterCross) {
			elements.push(new Line({
				from: [0, -centerCrossRadius],
				to: [0, centerCrossRadius]
			}).move([0, binoMainTickHeight]));
			elements.push(new Line({
				from: [-centerCrossRadius, 0],
				to: [centerCrossRadius, 0]
			}).move([0, binoMainTickHeight]));
		}
		if (drawHoriLine) {
			elements.push(new Line({
				from: [
					(drawCenterCross ? centerCrossRadius : 0),
					binoMainTickHeight
				],
				to: [
					(drawTwoTicks ? 10 : 5) * MUL_U2R * milWidthScale,
					binoMainTickHeight
				]
			}));
		}
		if (drawTwoTicks) {
			elements.push(
				// 2 binocular tick (= 10 USSR mil)
				new Line({
					from: [10 * MUL_U2R * milWidthScale, binoMainTickHeight],
					to: [10 * MUL_U2R * milWidthScale, 0]
				}),
				new TextSnippet({
					text: utShown(mc.getDistOfMil(10 * MUL_U2R) / 100),
					pos: [
						10 * MUL_U2R * milWidthScale,
						binoMainTickHeight + binoTextYMain
					],
					size: binoTextSizeMain
				}),
				// 1 binocular tick (= 5 USSR mil)
				new Line({
					from: [5 * MUL_U2R * milWidthScale, binoMainTickHeight],
					to: [
						5 * MUL_U2R * milWidthScale,
						(binoMainTickHeight * (1 - binoSubTickPer))
					]
				}),
				new TextSnippet({
					text: utShown(mc.getDistOfMil(5 * MUL_U2R) / 100),
					pos: [
						5 * MUL_U2R * milWidthScale,
						binoMainTickHeight + binoTextYMain
					],
					size: binoTextSizeMain
				}),
			);
		} else {
			elements.push(
				// 1 binocular tick (= 5 USSR mil)
				new Line({
					from: [5 * MUL_U2R * milWidthScale, binoMainTickHeight],
					to: [5 * MUL_U2R * milWidthScale, 0]
				}),
				new TextSnippet({
					text: utShown(mc.getDistOfMil(5 * MUL_U2R) / 100),
					pos: [
						5 * MUL_U2R * milWidthScale,
						binoMainTickHeight + binoTextYMain
					],
					size: binoTextSizeMain
				}),
			)
		}

		// Draw half ticks
		let halfTickMils = drawTwoTicks ? [2.5, 7.5] : [2.5];
		// 0.5 bino tick = 2.5 USSR mil; 1.5 bino tick = 7.5 USSR mil
		for (let binoMil of halfTickMils) {
			elements.push(
				new Line({
					from: [binoMil * MUL_U2R * milWidthScale, binoMainTickHeight],
					to: [
						binoMil * MUL_U2R * milWidthScale,
						binoMainTickHeight + binoHalfTickLength
						//binoMainTickHeight - (binoHalfTickPer * binoMainTickHeight)
					]
				}),
				new TextSnippet({
					text: utShown(mc.getDistOfMil(binoMil * MUL_U2R) / 100),
					pos: [
						binoMil * MUL_U2R * milWidthScale,
						binoMainTickHeight + binoHalfTickLength + binoTextYSub
					],
					size: binoTextSizeSub
				}),
			)
		}

		// Draw distance texts (distances)
		for (let dist of drawnSubTickDists) {
			let mil = mc.getDistMil(dist);
			if (!drawTwoTicks && mil> 5 * MUL_U2R) { continue; }
			elements.push(
				new TextSnippet({
					text: (dist / 100).toFixed(),
					pos: [
						mil * milWidthScale,
						binoMainTickHeight + distTextY
					],
					size: distTextSize
				}),
			);
		}

		// Width prompt
		let promptTexts = [];
		if (showAssumedTgtWidth) {
			promptTexts.push(`Width: ${assumedTgtWidth.toString()}m`);
		}
		if (showNon1MilWidthScale && milWidthScale != 1) {
			promptTexts.push(`Scale ${Toolbox.round(milWidthScale, 2)}:1`);
		}
		if (promptTexts.length > 0) {
			let posMil = drawTwoTicks ? 10 : 5;
			elements.push(new TextSnippet({
				text: promptTexts.join(",  "), align: "right",
				pos: [
					posMil * MUL_U2R * milWidthScale + 0.8, binoMainTickHeight/2
				],
				size: binoTextSizeMain
			}));
		}

		// Move to position
		for (let ele of elements) {
			if (mirrorX) { ele.mirrorX(); }
			if (mirrorY) { ele.mirrorY(); }
			ele.move(pos);
		}
		return elements;
	},


	getCommon({
		pos = [0, 0],

		mirrorX = false,
		mirrorY = false,
		drawTwoTicks = false,

		drawZeroLine = true,
		zeroLineExceeds = [-3, 0],

		milWidthScale = 2,
		showNon1MilWidthScale = true,
		quadHeight = 3,
		mainTickIntervalPer = 0.47,
		subTickPer = 0.33,

		showAssumedTgtWidth = false,
		assumedTgtWidth = 3.3,

		upperTickShownDigit = 0,
		upperTickShownAlwaysUseRound = false,
		// ^ `true` makes round (instead of floor) also applied when showing integers

		upperTextSize = 0.5,
		lowerTextSize = 0.5,
		upperTextY = -2,
		lowerTextY = 1.6,

		drawnSubTickDists = [400, 500, 800, 1600],
	} = {}) {
		return this.getBinoCali({
			pos, mirrorX, mirrorY, drawTwoTicks, drawZeroLine, zeroLineExceeds,
			milWidthScale, showNon1MilWidthScale, quadHeight, mainTickIntervalPer, subTickPer,
			showAssumedTgtWidth, assumedTgtWidth, upperTickShownDigit,
			upperTickShownAlwaysUseRound, upperTextSize, lowerTextSize,
			upperTextY, lowerTextY, drawnSubTickDists
		});
	},


	getCommonTwoTicks({
		pos = [0, 0],

		mirrorX = false,
		mirrorY = false,
		drawTwoTicks = true,

		drawZeroLine = true,
		zeroLineExceeds = [-3, 0],

		milWidthScale = 2,
		showNon1MilWidthScale = true,
		quadHeight = 3,
		mainTickIntervalPer = 0.47,
		subTickPer = 0.33,

		showAssumedTgtWidth = false,
		assumedTgtWidth = 3.3,

		upperTickShownDigit = 0,
		upperTickShownAlwaysUseRound = false,
		// ^ `true` makes round (instead of floor) also applied when showing integers

		upperTextSize = 0.5,
		lowerTextSize = 0.45,
		upperTextY = -2,
		lowerTextY = 1.6,

		drawnSubTickDists = [400, 500, 800, 1600],
	} = {}) {
		return this.getBinoCali({
			pos, mirrorX, mirrorY, drawTwoTicks, drawZeroLine, zeroLineExceeds,
			milWidthScale, showNon1MilWidthScale, quadHeight, mainTickIntervalPer, subTickPer,
			showAssumedTgtWidth, assumedTgtWidth, upperTickShownDigit,
			upperTickShownAlwaysUseRound, upperTextSize, lowerTextSize,
			upperTextY, lowerTextY, drawnSubTickDists
		});
	},


	getHighZoom({
		pos = [0, 0],

		mirrorX = false,
		mirrorY = false,
		drawTwoTicks = false,

		drawZeroLine = true,
		zeroLineExceeds = [-1, 0],

		milWidthScale = 1,
		showNon1MilWidthScale = true,
		quadHeight = 1,
		mainTickIntervalPer = 0.4,
		subTickPer = 0.4,

		showAssumedTgtWidth = false,
		assumedTgtWidth = 3.3,

		upperTickShownDigit = 0,
		upperTickShownAlwaysUseRound = false,
		// ^ `true` makes round (instead of floor) also applied when showing integers

		upperTextSize = 0.6,
		lowerTextSize = 0.5,
		upperTextY = -0.6,
		lowerTextY = 0.4,

		drawnSubTickDists = [400, 500, 800, 1600],
	} = {}) {
		return this.getBinoCali({
			pos, mirrorX, mirrorY, drawTwoTicks, drawZeroLine, zeroLineExceeds,
			milWidthScale, showNon1MilWidthScale, quadHeight, mainTickIntervalPer, subTickPer,
			showAssumedTgtWidth, assumedTgtWidth, upperTickShownDigit,
			upperTickShownAlwaysUseRound, upperTextSize, lowerTextSize,
			upperTextY, lowerTextY, drawnSubTickDists
		});
	},


	/** A narrow scale with 1:1 thousandth */
	getCommonRealMil({
		pos = [0, 0],

		mirrorX = false,
		mirrorY = false,
		drawTwoTicks = false,

		drawZeroLine = true,
		zeroLineExceeds = [-3, 0],

		quadHeight = 3,
		mainTickIntervalPer = 0.47,
		subTickPer = 0.33,

		assumedTgtWidth = 3.3,

		textSizeLarge = 0.55,
		textSizeSmall = 0.4,

		upperLargeTextY = -2,
		upperSmallTextY = -1.8,
		lowerLargeTextY = 1.6,
		lowerSmallTextY = 1.4,
	} = {}) {
		let mc = new MilCalculator(assumedTgtWidth);

		let elements = [];

		// Draw line elements
		elements = elements.concat(this.getBinoCali({
			drawTwoTicks,
			drawZeroLine,
			zeroLineExceeds,
			milWidthScale: 1,
			quadHeight,
			mainTickIntervalPer,
			subTickPer,
			assumedTgtWidth,
			drawnSubTickDists: [500, 800, 1600]
		}).filter((ele) => (ele instanceof Line)));

		// Draw texts
		let toShown = (n) => Math.floor(n).toString();
		// Upper
		if (drawTwoTicks) {
			elements.push(new TextSnippet({
				text: toShown(mc.getDistOfMil(10 * MUL_U2R) / 100),
				pos: [10 * MUL_U2R, upperLargeTextY], size: textSizeLarge
			}));
			elements.push(new TextSnippet({
				text: toShown(mc.getDistOfMil(7.5 * MUL_U2R) / 100),
				pos: [7.5 * MUL_U2R, upperSmallTextY], size: textSizeSmall
			}));

		}
		elements.push(new TextSnippet({
			text: toShown(mc.getDistOfMil(5 * MUL_U2R) / 100),
			pos: [5 * MUL_U2R, upperLargeTextY], size: textSizeLarge
		}));
		elements.push(new TextSnippet({
			text: toShown(mc.getDistOfMil(2.5 * MUL_U2R) / 100),
			pos: [2.5 * MUL_U2R, upperSmallTextY], size: textSizeSmall
		}));
		// Lower
		if (drawTwoTicks) {
			elements.push(new TextSnippet({
				text: toShown(500 / 100),
				pos: [mc.getDistMil(500), quadHeight + lowerSmallTextY], size: textSizeSmall
			}));
		}
		elements.push(new TextSnippet({
			text: toShown(800 / 100),
			pos: [mc.getDistMil(800), quadHeight + lowerLargeTextY], size: textSizeLarge
		}));
		elements.push(new TextSnippet({
			text: toShown(1600 / 100),
			pos: [mc.getDistMil(1600) / 2, quadHeight + lowerSmallTextY], size: textSizeSmall
			// ^ Moved left for visibility
		}));

		// Move to position
		for (let ele of elements) {
			if (mirrorX) { ele.mirrorX(); }
			if (mirrorY) { ele.mirrorY(); }
			ele.move(pos);
		}
		return elements;
	},

}