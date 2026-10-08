#!/usr/bin/env bash
# Publish every package whose current version isn't on npm yet.
# `pnpm pack` resolves catalog: ranges; `npm publish` handles trusted publishing
# (OIDC, no token) and adds provenance automatically when run from GitHub Actions.
set -euo pipefail
out=$(mktemp -d)
failed=()
for dir in packages/*/; do
  name=$(node -p "require('./${dir}package.json').name")
  version=$(node -p "require('./${dir}package.json').version")
  if npm view "$name@$version" version >/dev/null 2>&1; then
    echo "skip $name@$version (already published)"
    continue
  fi
  tgz=$(cd "$dir" && pnpm pack --pack-destination "$out" | tail -1)
  # Keep going if one package fails (e.g. a new package with no trusted publisher yet).
  npm publish "$tgz" --access public || failed+=("$name@$version")
done
if [ ${#failed[@]} -gt 0 ]; then
  echo "Failed to publish: ${failed[*]}" >&2
  exit 1
fi
