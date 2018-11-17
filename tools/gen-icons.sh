# requires ImageMagick (convert)

convert="convert"
density=1536
source="res/dev-icon.svg"
prefix="${source%.*}"
targets=(favicon.16,16x16,rename 192,192x192 512,512x512)

for target in "${targets[@]}"; do
  IFS="," read suffix size rename <<< "${target}"
  if [[ ! -z ${rename} ]]; then
    dir=$(dirname "${source}")
    out="${dir}/${suffix}.png"
  else
    out="${prefix}.${suffix}.png"
  fi
  ${convert} \
    -density ${density} \
    -background none \
    "${source}" \
    -verbose \
    -resize "${size}" \
    "${out}"
done