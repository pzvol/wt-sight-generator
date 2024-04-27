import { Quad, Circle, Line, TextSnippet } from "../../../_lib2/sight_elements.js";
import Toolbox from "../../../_lib2/sight_toolbox.js";


/**
 * Prompt cross starting from sight edges.
 * By default the line(s) lower edge will not be drawn.
 *
 * @param {object} params
 * @param {{value: number, pos: [number, number]}=} params.assumedMoveSpeedParams - Speed uses km/h unit
 * @param {{value: number, pos: [number, number]}=} params.shellSpeedParams - Speed uses m/s unit
 * @param {boolean=} params.useThousandth - If use thousandth position values
 * @param {"full_with_space"|"full_with_dash"|"values_only"=} params.formatType
 * @param {"center"|"left"|"right"|0|1|2=} params.textAlign - (Default `"right"`)
 * @param {number=} params.textSize
 * @param {number=} params.extraNormalSpaceNum -  Number of extra space added
 *                  between displayed types and values to make
 *                  the interval wider. *(for `"full_with_space"` type only)*
 *
 */
export default ({
	assumedMoveSpeedParams = { value: 0, pos: [0, -1] },
	shellSpeedParams = { value: 0, pos: [0, 1] },
	useThousandth = true,

	formatType = "full_with_space",
	textAlign = "right",
	textSize = 1,

	extraNormalSpaceNum = 0,

} = {}) => {

	let elements = [];

	elements.push(new TextSnippet({
		text:
			formatType === "full_with_dash" ? `ASM MOVE - ${assumedMoveSpeedParams.value.toFixed()} kph` :
			formatType === "full_with_space" ? `ASM MOVE${
				getSpaces(2 + extraNormalSpaceNum, 3)}${assumedMoveSpeedParams.value.toFixed()} kph` :
			formatType === "values_only" ? `${assumedMoveSpeedParams.value.toFixed()} kph` :
			`Invalid prompt text type`,
		align: textAlign, pos: assumedMoveSpeedParams.pos, size: textSize,
		thousandth: useThousandth,
	}));
	elements.push(new TextSnippet({
		text:
			formatType === "full_with_dash" ? `ASM SHELL - ${(shellSpeedParams.value / 3.6).toFixed()} m/s` :
			formatType === "full_with_space" ? `ASM SHELL${
				getSpaces(1 + extraNormalSpaceNum, 1)}${(shellSpeedParams.value / 3.6).toFixed()} m/s` :
			formatType === "values_only" ? `${(shellSpeedParams.value / 3.6).toFixed()} m/s` :
			`Invalid prompt text type`,
		align: textAlign, pos: shellSpeedParams.pos, size: textSize,
		thousandth: useThousandth,
	}));

	return elements;
}



function getSpaces(normalSpaceNum, enSpaceNum) {
	let out = "";
	Toolbox.repeat(normalSpaceNum, () => (out += " "));
	Toolbox.repeat(enSpaceNum, () => (out += " "));
	return out;
}