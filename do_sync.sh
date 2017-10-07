#!/bin/bash

cd /opt/recordara

aws s3 sync output s3://recordara --exclude "*.wav"
find /opt/recordara/output/* -mmin +180 -exec rm {} \;

exit 0

while read p; do

if [[ $p == *"/"* ]]; then
  f_path="$p.m4a"
  aws s3 cp $f_path s3://recordara
  f_path="$p.png"
  aws s3 cp $f_path s3://recordara
fi

done </opt/recordara/synclist

> /opt/recordara/synclist

find /opt/recordara/output/* -mmin +180 -exec rm {} \;
