#!/bin/sh

code_file="$1"
tgt_dir="/cygdrive/x/SteamGames/steamapps/common/War Thunder/UserSights/all_tanks"

tgt_file="$tgt_dir/${code_file%.*}.blk"

echo "Compiling '$code_file' to '$tgt_file'..."
if [ -e "$tgt_file" ]; then
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
