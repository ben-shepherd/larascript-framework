#!/bin/bash
echo "[generate-keyfile.sh] Starting keyfile generation..."
echo "[generate-keyfile.sh] Current directory: $(pwd)"
echo "[generate-keyfile.sh] Listing /data directory before:"
ls -la /data

openssl rand -base64 756 > /data/mongodb-keyfile
echo "[generate-keyfile.sh] Created keyfile"

chmod 400 /data/mongodb-keyfile
echo "[generate-keyfile.sh] Changed permissions to 400"

chown mongodb:mongodb /data/mongodb-keyfile
echo "[generate-keyfile.sh] Changed ownership to mongodb:mongodb"

echo "[generate-keyfile.sh] Listing /data directory after:"
ls -la /data
echo "[generate-keyfile.sh] Completed"