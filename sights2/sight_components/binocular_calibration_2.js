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
	getBinoCali({
		pos = [0, 0],

		mirrorX = false,
		mirrorY = false,
		drawTwoTicks = true,

		drawZeroLine = true,
		zeroLineExceeds = [-3, 0],

		milWidthScale = 2,
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
		if (showAssumedTgtWidth) {
			let posMil = drawTwoTicks ? 10 : 5;
			elements.push(new TextSnippet({
				text: `Width: ${assumedTgtWidth.toString()}m`, align: "right",
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


	getCommon({
		pos = [0, 0],

		mirrorX = false,
		mirrorY = false,
		drawTwoTicks = false,

		drawZeroLine = true,
		zeroLineExceeds = [-3, 0],

		milWidthScale = 2,
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
			milWidthScale, quadHeight, mainTickIntervalPer, subTickPer,
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
			milWidthScale, quadHeight, mainTickIntervalPer, subTickPer,
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
			milWidthScale, quadHeight, mainTickIntervalPer, subTickPer,
			showAssumedTgtWidth, assumedTgtWidth, upperTickShownDigit,
			upperTickShownAlwaysUseRound, upperTextSize, lowerTextSize,
			upperTextY, lowerTextY, drawnSubTickDists
		});
	},
}