// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Toolbox from "../../_lib2/sight_toolbox.js";
import { Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";

export default {
	getAngleLegendGround: ({
		pos = [0, 0],

		assumedTargetWidth = 3.3,
		assumedTargetLength = 6.6,
		assumedTargetHeight = 2.8,

		widthOnSight = 5,
		textSize = 0.6,
		textPaddingY = -0.4,
		displayedAngles = [0, 15, 30, 45, 60, 90],

		textRowInterval = 2,
		textColumnWidth = 6,

		widthIndicationArrowHeight = 0.8,
	} = {}) => {
		let lines = [];
		let texts = [];
		let drawSquare = (leftX, topY, rightX, bottomY, hideLeftBoundary = false) => {
			if (!hideLeftBoundary) {
				lines.push(new Line({ from: [leftX, topY], to: [leftX, bottomY] }))
			}
			lines.push(
				new Line({ from: [leftX, topY], to: [rightX, topY] }),
				new Line({ from: [leftX, bottomY], to: [rightX, bottomY] }),
				new Line({ from: [rightX, topY], to: [rightX, bottomY] }),
			);
		}
		let drawArrow = (x, y) => {
			let arrowHeight = widthIndicationArrowHeight;
			lines.push(
				new Line({ from: [x, y], to: [x - arrowHeight/3, y + arrowHeight] }),
				new Line({ from: [x, y], to: [x + arrowHeight/3, y + arrowHeight] }),
				new Line({
					from: [x - arrowHeight/3, y + arrowHeight],
					to: [x + arrowHeight/3, y + arrowHeight]
				}),
			);
		}

		let lenMult = widthOnSight / assumedTargetWidth;

		let startY = 0
		for (let tgtAngle of displayedAngles) {
			let drawnTgtWidth = assumedTargetWidth * Math.cos(Toolbox.degToRad(tgtAngle)) * lenMult;
			let drawnTgtLength = assumedTargetLength * Math.sin(Toolbox.degToRad(tgtAngle)) * lenMult;
			let drawnTgtHeightHalf = assumedTargetHeight * lenMult / 2;

			let startX = 0;
			texts.push(new TextSnippet({
				text: `${tgtAngle.toString()}°`,
				pos: [startX, startY + textPaddingY], align: "right",
				size: textSize
			}));

			startX += textColumnWidth;
			if (tgtAngle == 0) {
				// front only
				drawSquare(
					startX, startY - drawnTgtHeightHalf,
					startX + drawnTgtWidth, startY + drawnTgtHeightHalf
				);
			} else if (tgtAngle == 90) {
				// side only
				drawSquare(
					startX, startY - drawnTgtHeightHalf,
					startX + drawnTgtLength, startY + drawnTgtHeightHalf
				);
			} else {
				// front + side
				drawSquare(
					startX, startY - drawnTgtHeightHalf,
					startX + drawnTgtWidth, startY + drawnTgtHeightHalf
				);
				drawSquare(
					startX + drawnTgtWidth, startY - drawnTgtHeightHalf,
					startX + drawnTgtWidth + drawnTgtLength, startY + drawnTgtHeightHalf,
					true
				);
			}
			// width value indication arrow
			drawArrow(startX + assumedTargetWidth * lenMult, startY + drawnTgtHeightHalf);

			startY += assumedTargetHeight * lenMult + textRowInterval;
		}

		// claim assumed target size
		texts.push(new TextSnippet({
			text: `W ${assumedTargetWidth.toFixed(1)}m   L ${assumedTargetLength.toFixed(1)}m`,
			pos: [0, startY + textPaddingY], align: "right",
			size: textSize
		}));

		// Move elements to desired pos
		for (let eleArr of [lines, texts]) {
			for (let ele of eleArr) { ele.move(pos); }
		}

		return [].concat(lines, texts);
	}
}
