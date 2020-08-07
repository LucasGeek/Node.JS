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

[[ -d ./remove ]] && echo "Directory already exists" || mkdir ./remove

counter=0
while IFS="" read -r line || [ -n "$line" ]
do
	if [[ "$line" == *".ts?"* ]]; then
		curl "$line" --output ./remove/"$counter".ts -H 'authority: hls2.videos.sproutvideo.com' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36' -H 'sec-fetch-dest: empty' -H 'accept: */*' -H 'origin: https://videos.sproutvideo.com' -H 'sec-fetch-site: same-site' -H 'sec-fetch-mode: cors' -H 'referer: https://videos.sproutvideo.com/embed/a09adebb131ce2c628/786614fc706f9c05?signature=y36syaNqUa%2ByONim8TkvgnwZ8E4%3D&expires=1587057302&type=hd' -H 'accept-language: en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7' --compressed
		let counter=counter+1
	fi
done < $1

for i in `ls ./remove/*.ts | sort -V`; do echo "$i|"; done >> list.txt
ffmpeg -i list.txt -c copy -bsf:a aac_adtstoasc "$m3u8_filename".mp4

#rm -f file.txt
#rm -f all.ts