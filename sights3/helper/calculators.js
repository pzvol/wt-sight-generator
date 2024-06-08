// SCRIPT_DO_NOT_DIRECTLY_COMPILE

/**
 * Classes for common calculations
 */

'use strict';

import Toolbox from "../../_lib2/sight_toolbox.js";


/**
 * Calculates multiplier for converting non-mil horizontal pos between display
 * ratios
 */
export class HoriRatioMultCalculator {
	/**
	 * @param {number} fromRatio - From ratio as a number, e.g., `16/9`
	 * @param {number} targetRatio - To ratio as a number, e.g., `16/10`
	 */
	constructor(fromRatio, targetRatio) {
		this.fromRatio = fromRatio;
		this.targetRatio = targetRatio;
	}

	/** Gets multiplier for specified ratios */
	getMult() {
		return (this.targetRatio / this.fromRatio);
	}
}


export class DistMilCalculator {
	constructor(assumedTargetSize) {
		this.targetSize = assumedTargetSize;
	}

	/** Gets mil for target at specified distance */
	for(dist) {
		return Toolbox.calcDistanceMil(this.targetSize, dist);
	}

	/** Gets halved mil value for target at specified distance */
	halfFor(dist) {
		return (this.for(dist)) / 2;
	}
}