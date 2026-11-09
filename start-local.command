#!/bin/zsh
set -e
cd "$(dirname "$0")"
if [ -x ../../work/runtime/bin/node ]; then
  TASK_NODE_BIN="$(cd ../../work/runtime/bin && pwd)"
  export PATH="$TASK_NODE_BIN:$PATH"
elif ! command -v node >/dev/null 2>&1; then
  print 'Node.js bulunamadı. Node.js LTS kurduktan sonra yeniden çalıştırın.'
  exit 1
fi
npm run dev
