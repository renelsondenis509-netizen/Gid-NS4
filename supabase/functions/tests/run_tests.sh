#!/bin/bash
echo "🧪 Lancement des tests Edge Function..."
deno test \
  --allow-net \
  --env-file=../../../.env.test \
  edge.test.ts
