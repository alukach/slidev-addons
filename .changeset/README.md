# Changesets

Run `pnpm changeset` to record a change. Pick the packages it affects and a bump type (patch, minor, major), then write a one-line summary. Commit the generated file with your change.

On merge to `main`, the release workflow opens a "Version Packages" PR that applies pending changesets. Merging that PR publishes the bumped packages to npm.
