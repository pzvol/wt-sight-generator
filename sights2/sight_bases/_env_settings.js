// SCRIPT_DO_NOT_DIRECTLY_COMPILE

/**
 * Values for controlling some behaviors with environment (e.g., the ratio
 * of display) invloved
 */
export default {
	/**
	 * Ratio of display (width / height) as a number. Applied to sights with
	 * elements requiring horizontal adjustments.
	 *
	 * For Development:
	 * to have elements at the right border of a 16:9 display stay within
	 * a 16:10 display, a multplier (16/10) / (16/9) = 0.9 should be applied.
	 * In other words, the multplier should be
	 * `DISPLAY_RATIO_NUM / sightOriginalRatio`
	 */
	DISPLAY_RATIO_NUM: 16/10,
};
