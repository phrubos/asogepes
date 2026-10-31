#!/usr/bin/env bash
# Stops whatever listens on the given port (default 3000). Windows / Git Bash.
port=${1:-3000}
for pid in $(netstat -ano | grep -E ":$port .*LISTENING" | awk '{print $5}' | sort -u); do
  taskkill //PID "$pid" //F //T > /dev/null && echo "stopped PID $pid on :$port"
done
