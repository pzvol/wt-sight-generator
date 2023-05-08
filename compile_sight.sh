#!/bin/sh

## Settings ##
auto_overwrite=1
tgt_dir_top_level="/cygdrive/x/SteamGames/steamapps/common/War Thunder/UserSights"



tgt_dir_default="$tgt_dir_top_level/all_tanks"  # default dir
code_file="$1"
code_file_basename="`basename "$code_file"`"
tgt_file="$tgt_dir_default/${code_file_basename%.*}.blk"

echo "Compiling '$code_file' to '$tgt_file'..."

# Check if there is any supported instruction
first_line="`head -n1 "$code_file" | sed -E 's/ +$//'`"
case "$first_line" in
	"// SCRIPT_DO_NOT_DIRECTLY_COMPILE")
		echo "Error: do-not-directly-compile instruction detected, exit now"
		exit 1
		;;
	"// SCRIPT_COMPILE_TO="*)
		tgt_dir_instructed="`echo -n "$first_line" | sed -E 's/^.+\=//'`"
		if [ "$tgt_dir_instructed"x = ""x ]; then
			echo "Warning: Cannot capture instructed target dir, ignored"
		else

			tgt_dir_new="$tgt_dir_top_level/$tgt_dir_instructed"
			tgt_file="$tgt_dir_new/${code_file_basename%.*}.blk"

			echo "Instructed new output dir: '$tgt_dir_new'"

			if [ ! -e "$tgt_dir_new" ]; then
				mkdir "$tgt_dir_new"
				echo ""
			fi
		fi
		;;
esac


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
