# swipegallery

## create mp4

ffmpeg -r 1 -i %2d.jpg -vf pad="width=ceil(iw/2)*2:height=ceil(ih/2)*2" vcpp.webm

ffmpeg -r 1 -i %2d.jpg -profile:v baseline -vcodec libx264 -crf 45 -vf pad="width=ceil(iw/2)*2:height=ceil(ih/2)*2" vcpp.mp4

