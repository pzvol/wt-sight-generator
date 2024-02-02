/**
 * Fundamental elements of a user sight
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

import Circle from "./sight_element_definitions/circle.js";
import Line from "./sight_element_definitions/line.js";
import Quad from "./sight_element_definitions/quad.js";
import TextSnippet from "./sight_element_definitions/text_snippet.js";


export default {
	description: "Fundamental elements of a user sight"
};


export { Circle, Line, Quad, TextSnippet };