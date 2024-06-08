// SCRIPT_DO_NOT_DIRECTLY_COMPILE

/**
 * Configs for keeping elements showing at a stable position of screen while
 * radial moving using mouse wheel
 */


/**
 * @typedef {object} MouseWheelRadialMoveCfg
 * @property {string=} uniqueName - unique name for identifying the config
 * @property {number} mouseWheelMult - Mouse wheel multipiler set in user's
 *                                     control settings
 * @property {number} radius - radius of radial movement
 * @property {number} radialSpeed - radial move speed
 * @property {number} tickAngle - angle interval between ticks
 */

/** @type {MouseWheelRadialMoveCfg[]} */
let tickConfigs = [
	{
		uniqueName: "mult 75, r 100, spd 10",
		mouseWheelMult: 75,
		radius: 100,
		radialSpeed: 10,
		tickAngle: 9.02408,  // 9.0241
	},
	{
		mouseWheelMult: 75,
		radius: 2000,
		radialSpeed: 200,
		tickAngle: 9.02408,
	},
	{
		uniqueName: "mult 75, r 10000, spd 1000",
		mouseWheelMult: 75,
		radius: 10000,
		radialSpeed: 1000,
		tickAngle: 9.02408,
	},
];


/**
 * up/down movement thousandth for each tick
 * as a reference for sight development
 */
let verticalLinearTickMil = [
	{ mouseWheelMult: 50, tickMil: 0.7 },
	{ mouseWheelMult: 75, tickMil: 1.575 },
]


export default {
	allConfigs: tickConfigs,

	/**
	 * @param {string} name
	 */
	getConfigByUniqueName: (name) => tickConfigs.find(
		(c) => c.hasOwnProperty("uniqueName") && c.uniqueName === name
	),

	/**
	 * @param {object} params
	 * @param {number} params.mouseWheelMult
	 * @param {number} params.radius
	 * @param {number} params.radialSpeed
	 */
	getConfigByParams: ({mouseWheelMult, radius, radialSpeed}) => tickConfigs.find((c) => (
		c.mouseWheelMult === mouseWheelMult &&
		c.radius === radius &&
		c.radialSpeed === radialSpeed
	)),

	/**
	 * @param {object} params
	 * @param {number=} params.mouseWheelMult
	 * @param {number=} params.radius
	 * @param {number=} params.radialSpeed
	 */
	getConfigsByPartialParams: (params) => tickConfigs.filter((c) => {
		for (let p in params) {
			if (!c.hasOwnProperty(p) || c[p] !== params[p]) { return false; }
		}
		return true;
	}),


	/**
	 * @param {number} mouseWheelMult
	 */
	getLinearTickMil: (mouseWheelMult) => verticalLinearTickMil.find((ele) =>(
		ele.mouseWheelMult === mouseWheelMult
	)).tickMil || undefined,
}