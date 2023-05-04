# wt-sight-generator

Provides a simple library to help generate War Thunder user sights from JavaScript code.

Developed becasue I am tired of (1)maintaining multiple sights with similar components for different vehicles, and (2)copy-pasting lines repetitively for generating elements.

The project is still under development - possibly will not be completely finished if it meets personal demands at some point.


## Files

- `_lib/sight_lib.js` is the main module, which holds the classes designed for writing a sight in JS;
- `_lib/sight_predefined_info.js` stores some sight components I frequently use.


## Usage

(The project is developed with deno)

Created sights are under `sights` directory. Run a `.js` file to get the `.blk` code for the sight.

`compile_sight.sh` is a sample script to compile and place a sight into the game's `all_tanks` folder. Modify settings in the script before use.

If you are using vscode and cygwin like me, a task can be run from vscode directly to execute the script above.

