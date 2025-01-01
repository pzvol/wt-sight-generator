// SCRIPT_DO_NOT_DIRECTLY_COMPILE

import Toolbox from "../../_lib2/sight_toolbox.js";
import { Circle, Line, TextSnippet } from "../../_lib2/sight_elements.js";

export default {
	getTurretAngleLegend: ({
		pos = [0, 0],

		turretCircleDiameter = 2.3,
		textSizeMain = 0.55,
		textSizeSub = 0.4,

		circleSize = 1.5,

		showSideIndicator = true,

		withRgfdPrompt = true,
		shellSpeedShown = 0,

		turretLimitAngles = [],
	} = {}) => {
		let elements = [];

		let createRadElements = (
			center = [0, 0], angle = 0,
			startRadius = 1, length = 1,
			text = "+", textRadiusOffset = 1, textSize = 1
		) => {
			return [
				new Line({
					from: [
						Math.cos(Toolbox.degToRad(angle - 90)) * startRadius,
						-Math.sin(Toolbox.degToRad(angle - 90)) * startRadius,
					],
					to: [
						Math.cos(Toolbox.degToRad(angle - 90)) * (startRadius + length),
						-Math.sin(Toolbox.degToRad(angle - 90)) * (startRadius + length),
					]
				}).move(center),
				new TextSnippet({
					text: text,
					pos: [
						Math.cos(Toolbox.degToRad(angle - 90)) * (
							startRadius + length + textRadiusOffset
						),
						-Math.sin(Toolbox.degToRad(angle - 90)) * (
							startRadius + length + textRadiusOffset
						),
					],
					size: textSize
				}).move(center),
			];
		};

		// Positions was based on d2.3 turret ring, multiplier is for adjusting
		// for different zooms
		let zoomMult = turretCircleDiameter / 2.3;

		// Turret position circle
		elements.push(
			new Circle({pos: [0, 0], diameter: turretCircleDiameter, size: circleSize}),
			// new Circle({pos: [0, 0], diameter: 1.8, size: 2}),
		);
		// Outer indication ring
		elements.push(
			new Circle({pos: [0, 0], diameter: 7.8 * zoomMult, size: circleSize}),
		);


		if (showSideIndicator) {
			let aimSideIndicator = [];
			aimSideIndicator.push(
				new Line({from: [0, 0.75 * zoomMult], to: [0, 0]}).move([0, -0.05 * zoomMult]),
				new Line({from: [0, 0.75 * zoomMult], to: [0, 0]}).move([0, -0.05 * zoomMult]),
				// new Line({from: [0, 0], to: [0.3 * zoomMult, 0]}).move([0, -0.05 * zoomMult]),
				// new Line({from: [0.9 * zoomMult, 0], to: [1.0 * zoomMult, 0]}).move([0, -0.05 * zoomMult]),

				new Line({from: [-0.2 * zoomMult, 0.4 * zoomMult], to: [0, 0]}).move([0.6 * zoomMult, 0]),
				new Line({from: [0.2 * zoomMult, 0.4 * zoomMult], to: [0, 0]}).move([0.6 * zoomMult, 0]),
				new Line({from: [0.2 * zoomMult, 0.4 * zoomMult], to: [0.1 * zoomMult, 0.3 * zoomMult]}).move([0.6 * zoomMult, 0]),
				new Line({from: [-0.2 * zoomMult, 0.4 * zoomMult], to: [-0.1 * zoomMult, 0.3 * zoomMult]}).move([0.6 * zoomMult, 0]),
			);
			for (let ele of aimSideIndicator) {
				elements.push(
					ele.copy().move([-5 * zoomMult, -4.7 * zoomMult]),
					ele.mirrorX().move([5 * zoomMult, -4.7 * zoomMult]),
				)
			}
		}


		let drawnAngles = [
			{ angle: 0, isMain: true, text: "0" },
			{ angle: Toolbox.radToDeg(Math.asin(1/4)), isMain: false, text: "1" },
			{ angle: Toolbox.radToDeg(Math.asin(2/4)), isMain: true, text: "2" },
			{ angle: Toolbox.radToDeg(Math.asin(3/4)), isMain: false, text: "3" },
			{ angle: 90, isMain: true, text: "4" },
		];

		let mirroredDrawnAngles = [];
		for (let drawInfo of drawnAngles) {
			if (drawInfo.angle !== 0) {
				let mirrored = Object.assign({}, drawInfo);
				mirrored.angle = -(mirrored.angle);
				mirroredDrawnAngles.push(mirrored);
			}
		}
		drawnAngles.push(...mirroredDrawnAngles);

		for (let drawInfo of drawnAngles) {
			let textSize = drawInfo.isMain ? textSizeMain : textSizeSub;
			elements.push(...createRadElements(
				[0, 0],
				180 - drawInfo.angle,
				7.8/2 * zoomMult,
				(drawInfo.isMain ? 0.6 : 0.2) * zoomMult,
				drawInfo.text,
				(drawInfo.isMain ? 0.6 : 0.55) * zoomMult,
				textSize
			));
		}

		if (withRgfdPrompt) {
			elements.push(new TextSnippet({
				text: "DIST",
				pos: [0, -8.76 * zoomMult],
				size: textSizeSub
			}));
		}

		if (shellSpeedShown !== 0){
			elements.push(new TextSnippet({
				text: `SHL  -  ${shellSpeedShown.toFixed()} m/s`,
				pos: [0, 4.8 * zoomMult],
				size: textSizeSub
			}));
		}

		for (let angle of turretLimitAngles) {
			for (let offset of Toolbox.rangeIE(-0.75, 0.75, 0.25))
			elements.push(...createRadElements(
				[0, 0],
				180 - (angle + offset),
				7.8/2 * zoomMult,
				-0.15 * zoomMult,
				(Math.abs(offset) <= 0 ? "X" : ""),
				(0.15 + 0.55) * zoomMult,
				textSizeSub
			));
		}

		elements.forEach((ele) => (ele.move(pos)));

		return elements;
	}
}
