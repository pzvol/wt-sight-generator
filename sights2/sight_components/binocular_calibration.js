// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Toolbox from "../../_lib2/sight_toolbox.js";
import { Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";

/** Multiplier for converting binocular's USSR mil to sight's real mil */
const MUL_U2R = Toolbox.MIL.ussr.value / Toolbox.MIL.real.value;


export default {
	getCommon: ([posX, posY], {
		mirrorX = false,
		drawMiddleLine = true,
		showTargetWidth = false,

		quadHeight = 3,
		tickMainHalfLen = 1,
		tickSub1Len = 1,
		tickSub2Len = 0.5,

		textSizeMain = 0.55,
		textSizeSub = 0.45,

		text6PosY = -1.6,
		text8PosY = 4.4,
		text12PosY = -1.4,
		text16PosY = 4.2,
		text16UseTighterPosX = false,  // move "16" to the center of 12 width for tighter space
	} = {}) => {
		let assumedTgtWidth = 3.3;
		let getDistMil = (dist) => Toolbox.calcDistanceMil(assumedTgtWidth, dist);

		let elements = [];

		if (drawMiddleLine) {
			elements.push(new Line({ from: [0, -quadHeight], to: [0, quadHeight] }));
		}

		if (showTargetWidth) {
			elements.push(new TextSnippet({
				text: `Width: ${assumedTgtWidth.toString()}m`, align: "right",
				pos: [5 * MUL_U2R + 1, quadHeight/2], size: textSizeSub
			}));
		}

		let tickSub1FromY = (quadHeight - tickSub1Len) / 2;
		let tickSub1ToY = (quadHeight + tickSub1Len) / 2;
		let tickSub2FromY = (quadHeight - tickSub2Len) / 2;
		let tickSub2ToY = (quadHeight + tickSub2Len) / 2;

		elements.push(
			// 1 binocular tick (= 5 USSR mil) / around 600m / the whole quad
			new Line({ from: [5 * MUL_U2R, quadHeight], to: [5 * MUL_U2R, 0] }),
			new Line({ from: [5 * MUL_U2R, quadHeight], to: [0, quadHeight] }),
			new Line({ from: [5 * MUL_U2R, 0], to: [0, 0] }),
			// 800m size
			new Line({ from: [getDistMil(800), tickSub1FromY], to: [getDistMil(800), tickSub1ToY] }),
			// 1200m size / about 0.5 tick
			new Line({ from: [getDistMil(1200), quadHeight], to: [getDistMil(1200), quadHeight - tickMainHalfLen] }),
			new Line({ from: [getDistMil(1200), tickMainHalfLen], to: [getDistMil(1200), 0] }),
			// 1600m size
			new Line({ from: [getDistMil(1600), tickSub2FromY], to: [getDistMil(1600), tickSub2ToY] }),

			new TextSnippet({ text: "6", pos: [5 * MUL_U2R, text6PosY], size: textSizeMain }),  // Actually around 630m
			new TextSnippet({ text: "8", pos: [getDistMil(800), text8PosY], size: textSizeMain }),
			new TextSnippet({ text: "12", pos: [getDistMil(1200), text12PosY], size: textSizeSub }),
			new TextSnippet({ text: "16", pos: [
				text16UseTighterPosX ? (getDistMil(1200) / 2) : (getDistMil(1600) / 2),
				text16PosY
			], size: textSizeSub }),
		);
		// Move to position
		for (let ele of elements) {
			ele.move([posX, posY]);
			if (mirrorX) { ele.mirrorX() }
		}

		return elements;
	},

	getHighZoom: ([posX, posY], {
		mirrorX = false,
		drawMiddleLine = true,
		showTargetWidth = false,

		quadHeight = 1,
		tickMainHalfLen = 0.3,
		tickSubLen = 0.4,

		textSizeMain = 0.6,
		textSizeSub = 0.5,

		textPosYMain = -0.6,
		textPosYSub = 1.4,
	} = {}) => {
		let assumedTgtWidth = 3.3;
		let getDistMil = (dist) => Toolbox.calcDistanceMil(assumedTgtWidth, dist);

		let elements = [];

		if (drawMiddleLine) {
			elements.push(new Line({ from: [0, -1], to: [0, quadHeight] }));
		}

		if (showTargetWidth) {
			elements.push(new TextSnippet({
				text: `Width: ${assumedTgtWidth.toString()}m`, align: "right",
				pos: [5 * MUL_U2R + 0.2, quadHeight/2], size: textSizeSub
			}));
		}

		let tickSubFromY = (quadHeight - tickSubLen) / 2;
		let tickSubToY = (quadHeight + tickSubLen) / 2;

		elements.push(
			// 1 binocular tick (= 5 USSR mil) / around 600m / the whole quad
			new Line({ from: [5 * MUL_U2R, quadHeight], to: [5 * MUL_U2R, 0] }),
			new Line({ from: [5 * MUL_U2R, quadHeight], to: [0, quadHeight] }),
			new Line({ from: [5 * MUL_U2R, 0], to: [0, 0] }),
			// 800m size
			new Line({ from: [getDistMil(800), tickSubFromY], to: [getDistMil(800), tickSubToY] }),
			// 1200m size / about 0.5 tick
			new Line({ from: [getDistMil(1200), quadHeight], to: [getDistMil(1200), quadHeight - tickMainHalfLen] }),
			new Line({ from: [getDistMil(1200), tickMainHalfLen], to: [getDistMil(1200), 0] }),
			// 1600m size
			new Line({ from: [getDistMil(1600), tickSubFromY], to: [getDistMil(1600), tickSubToY] }),

			new TextSnippet({ text: "6", pos: [5 * MUL_U2R, textPosYMain], size: textSizeMain }),  // Actually around 630m
			new TextSnippet({ text: "8", pos: [getDistMil(800), textPosYSub], size: textSizeSub }),
			new TextSnippet({ text: "12", pos: [getDistMil(1200), textPosYMain], size: textSizeMain }),
			new TextSnippet({ text: "16", pos: [getDistMil(1600), textPosYSub], size: textSizeSub }),
		);
		// Move to position
		for (let ele of elements) {
			ele.move([posX, posY]);
			if (mirrorX) { ele.mirrorX() }
		}

		return elements;
	}
}
