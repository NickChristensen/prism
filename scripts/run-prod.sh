#!/bin/zsh
set -euo pipefail
cd /Users/louie/code/prism
exec /opt/homebrew/bin/npm run start -- --hostname 0.0.0.0 --port 60001
