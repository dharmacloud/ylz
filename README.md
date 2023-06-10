# swipegallery

## create mp4

ffmpeg -r 1 -i %2d.jpg -vf pad="width=ceil(iw/2)*2:height=ceil(ih/2)*2" vcpp.webm

ffmpeg -r 1 -i %2d.jpg -profile:v baseline -vcodec libx264 -crf 45 -vf pad="width=ceil(iw/2)*2:height=ceil(ih/2)*2" vcpp.mp4

dharmacloud/jinglu

node crop 0010a-001羽08.zip  ==> vcpp (kumarajiva)
node crop 0012-001翔03.zip   ==> vcpp_gupta
node crop 0011b-001翔02.zip  ==> vcpp_yijing
node crop 0011a-001翔01.zip  ==> vcpp_xuanzhan
node crop 0010c-001羽10.zip  ==> vcpp_paramartha
node crop 0010b-001羽09.zip  ==> vcpp_bodhiruci

