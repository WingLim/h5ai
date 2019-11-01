#!/bin/bash

subdir="/path/to/videos"

function sub(){
    for file in "$1"/*
    do
        if [[ -d "$file" && "${file:0-2}" != "_h5ai" && "${file:0-2}" != "__" ]]; then
            sub "$file"
        else
            if [[ "${file##*.}" == "ass" || "${file##*.}" == "srt" ]]; then
                filenotype="${file%.*}"
                if [[ ! -f "${filenotype}.vtt" ]]; then
                    ffmpeg -i "$file" "${filenotype}.vtt"
                fi
            fi
        fi
    done
}
sub "$subdir"

echo "convert sub to vtt finished"
