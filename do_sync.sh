#!/bin/bash

cd /opt/recordara
aws s3 sync output s3://recordara --exclude "*.wav"
find /opt/recordara/output/* -mtime +7 -exec rm {} \;
