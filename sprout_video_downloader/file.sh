#!/bin/sh

echo "Download video from m3u8 address using ffmpeg\n"

if [[ -z $1 ]]; then
	echo "usage: m3u8-download M3U8_ADDRESS {OUTPUT_FILENAME}\n";
	exit;
fi

m3u8_filename=$(basename "$1")

if [[ -z $2 ]]; then
	output_filename="${m3u8_filename%.*}"
else
	output_filename="$2"
fi

echo "Downloading $(tput bold)$m3u8_filename$(tput sgr0) as $(tput bold)$output_filename.mp4$(tput sgr0)\n"

if [ -e "$output_filename.mp4" ]; then
	read -p "Overwrite $(tput bold)$output_filename.mp4$(tput sgr0)? [y/N] " input

	[[ ! $input =~ [yY] ]] && exit;
fi


counter=0

# Parsing ffmpeg stderr and stdout for cleaner terminal output
ffmpeg -y -hide_banner -loglevel info -i $1 -acodec copy -bsf:a aac_adtstoasc -vcodec copy "$output_filename.mp4" 2>&1 \
	| while read -r OUTPUT || [ -n "$OUTPUT" ]; do

	if [ $counter = 4 ]; then
		while [[ $counter -gt 0 ]]; do
			tput cuu1;
			tput el;
			let counter=counter-1;
		done
	fi

	echo "${OUTPUT:0:$(tput cols)}"
	let counter=counter+1
done

echo "Done\n"