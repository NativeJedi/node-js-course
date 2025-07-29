#!/bin/bash

set -e

MODE=${1:-committed}         # committed | uncommitted

echo "🚀 Starting PostgreSQL via docker-compose..."
docker-compose up -d --wait

echo "⏳ Waiting for DB to be ready..."
sleep 3

echo "🧪 Running writer.js"
node ./src/writer.js &

WRITER_PID=$!
sleep 1

echo "🔍 Running reader.js in mode: $MODE"
node ./src/reader.js "$MODE"

wait $WRITER_PID

echo "✅ Demo complete."

echo "🧹 Stopping and cleaning up containers and volumes..."
docker-compose down -v
