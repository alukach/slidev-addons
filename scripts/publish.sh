#!/usr/bin/env bash
# Publish every package whose current version isn't on npm yet.
# `pnpm pack` resolves catalog: ranges; `npm publish` handles trusted publishing
# (OIDC, no token) and adds provenance automatically when run from GitHub Actions.
set -euo pipefail
out=$(mktemp -d)
for dir in packages/*/; do
  name=$(node -p "require('./${dir}package.json').name")
  version=$(node -p "require('./${dir}package.json').version")
  if npm view "$name@$version" version >/dev/null 2>&1; then
    echo "skip $name@$version (already published)"
    continue
  fi
  tgz=$(cd "$dir" && pnpm pack --pack-destination "$out" | tail -1)
  npm publish "$tgz" --access public
  git tag "$name@$version"
  # changesets/action reads this line to create a GitHub release.
  echo "New tag: $name@$version"
done
