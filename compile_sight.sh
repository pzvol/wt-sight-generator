#!/bin/sh

auto_overwrite=1

code_file="$1"
tgt_dir="/cygdrive/x/SteamGames/steamapps/common/War Thunder/UserSights/all_tanks"

code_file_basename="`basename "$code_file"`"
tgt_file="$tgt_dir/${code_file_basename%.*}.blk"

echo "Compiling '$code_file' to '$tgt_file'..."
if [ -e "$tgt_file" -a "$auto_overwrite"x == "0"x ]; then
	read -n1 -p "Target file exists - overwrite? (Y/n)" confirm
	echo ""
	case "$confirm" in
		y|Y|"")
			echo "Will overwrite the existing file"
			;;
		*)
			echo "Exited"
			exit 0
			;;
	esac
fi

deno run "$code_file" | tee "$tgt_file"

echo ""
echo "Done"
exit 0
