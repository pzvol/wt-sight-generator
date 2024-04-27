// SCRIPT_DO_NOT_DIRECTLY_COMPILE

/**
 * Values for controlling some behaviors with environment (e.g., the ratio
 * of display) invloved
 */
export default {
	/**
	 * Multiplier for horizontally adjusting some elements and keeping them
	 * inside the screen.
	 * - For 16:9, the value is 1;
	 * - for 16:10, the value is considered to be 0.9, which equals to
	 *   (16/10) / (16/9)
	 */
	DISPLAY_RATIO_MULT_HORI: 0.9
};
