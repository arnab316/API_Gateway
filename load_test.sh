#!/bin/bash
# Number of requests to send
REQUESTS=100

# Endpoint URLs
CPU_INTENSIVE_URL="http://localhost:2003/cpu-intensive"
SIMULATE_IO_URL="http://localhost:2003/simulate-io"

echo "Sending $REQUESTS requests to $CPU_INTENSIVE_URL and $SIMULATE_IO_URL..."

# Loop for CPU-intensive endpoint
for ((i=1;i<=REQUESTS;i++)); do
  curl -s $CPU_INTENSIVE_URL > /dev/null &
done

# Loop for Simulated I/O endpoint
for ((i=1;i<=REQUESTS;i++)); do
  curl -s $SIMULATE_IO_URL > /dev/null &
done

wait
echo "Done."