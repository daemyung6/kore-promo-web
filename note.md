## resize image
```
for i in *.jpg; ffmpeg -i "$i" -vf "scale=iw/2:ih/2,format=yuvj420p" -q:v 3 -frames:v 1 "./resize/${i%.*}.jpg";
```