/**
 * Blocks of a user sight
 *
 * V2 - overhauled version for cleaner files and simpler code writing
 */

// WT Sight Generator: a simple library for generating War Thunder user sights
// from JavaScript
//
// Copyright (C) 2023  pzvol
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

'use strict';

import BasicSettings from "./sight_block_definitions/basic_settings.js";
import MatchVehicleClassBlock from "./sight_block_definitions/match_vehicle_class_block.js";
import HoriThousandthsBlock from "./sight_block_definitions/hori_thousandths_block.js";
import ShellDistancesBlock from "./sight_block_definitions/shell_distances_block.js";
import {
	CirclesBlock,
	LinesBlock,
	TextsBlock,
	QuadsBlock
} from "./sight_block_definitions/element_blocks.js"


export default {
	description: "Blocks of a user sight"
};


export {
	BasicSettings,
	MatchVehicleClassBlock,
	HoriThousandthsBlock,
	ShellDistancesBlock,
	CirclesBlock,
	LinesBlock,
	TextsBlock,
	QuadsBlock,
};
