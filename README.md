# wt-sight-generator

Provides a simple library to help generate War Thunder user sights from JavaScript code.

Created becasue I am tired of (1)maintaining multiple sights with similar components for different vehicles, and (2)copy-pasting lines repetitively for generating elements.

The project is still under development, meaning:
1. potential massive changes if it is felt necessary;
2. possibly will not be completely finished if it meets personal demands at some point.


## Files

- `_lib2/sight_*.js` are the main modules, which holds the classes designed for writing a .blk user sight in JS;
- `_lib2/predefined.js` stores some sight components I frequently use.


## Usage

(The project is developed with deno)

Created sights are under `sights2` directory. Run a `.js` file to get the `.blk` code for the sight.

`compile_sight.sh` is a sample script to compile and place a sight into the game's sight folder (`all_tanks` folder by default). Modify settings in the script before use.

If you are using vscode and cygwin like me, a task can be run from vscode directly to execute the script above.

