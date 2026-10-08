# Contributing

How to develop, add and release addons in this repo. For code conventions (package layout, what addons may and may not do, demo decks), see [AGENTS.md](AGENTS.md).

## Setup

- **Node 24** (see `.nvmrc`; `nvm use`).
- **pnpm via corepack 0.36 or later.** The repo pins pnpm 12 in `packageManager`. Older corepack, including the one bundled with Node 20, fails with `Cannot find module …/pnpm/12.x/bin/pnpm.cjs`.

  ```sh
  npm install -g corepack@latest && corepack enable
  ```

```sh
pnpm install
pnpm --filter @alukach/slidev-addon-<name> dev   # one addon's demo deck, http://localhost:3030
pnpm check                                        # repo conventions (scripts/check-packages.mjs)
pnpm build                                        # every demo, into site/dist/
```

There's no unit test suite. `pnpm check` and `pnpm build` must pass; CI runs both on every PR. For behavior changes, run the demo with `dev` and try it in a browser.

## Commits

Every commit that lands on `main` must be a [Conventional Commit](https://www.conventionalcommits.org). [release-please](https://github.com/googleapis/release-please) derives versions and changelogs from these commits.

`main` only accepts changes through PRs. A [ruleset](https://github.com/alukach/slidev-addons/rules) blocks direct pushes and requires the **build** and **PR title** checks to pass. PRs are squash-merged, and the PR title becomes the commit message. The **PR title** check rejects titles that aren't Conventional Commits. Commits inside a PR can be anything.

| Prefix | Release |
| --- | --- |
| `fix:` | patch |
| `feat:` | minor |
| `feat!:`, or a `BREAKING CHANGE:` footer | major (minor while the package is below 1.0) |
| `docs:` `chore:` `ci:` `refactor:` `test:` `build:` | none |

- Use the package directory as the scope: `feat(tierlist): …`. release-please assigns a commit to a package by the files it touches, not by the scope, so keep each commit to one package where you can.
- Don't use a no-release type for a change users would notice.
- The subject line becomes a CHANGELOG entry, so write it for addon users.

## Changing an addon

1. Make the change.
2. Update the package's `README.md` if props, frontmatter keys, `themeConfig` keys or behavior changed.
3. Update its `slides.md` so the demo shows the change.
4. `pnpm build`.
5. Commit as `fix(<name>): …` or `feat(<name>): …`. A breaking change to props, frontmatter, layouts or component names needs `!` or a `BREAKING CHANGE:` footer.

## Adding an addon

1. Copy an existing package, e.g. `packages/hotkeys`: `package.json`, `README.md`, `LICENSE`, `slides.md`, `vite.config.ts`. In `package.json`, update `name`, `description`, `files`, `homepage`, and the `build` script's `--base` and `--out` paths.
2. Set `"version": "0.0.0"` in its `package.json`.
3. Register it with release-please:
   - `release-please-config.json`: `"packages/<name>": { "component": "slidev-addon-<name>" }`
   - `.release-please-manifest.json`: `"packages/<name>": "0.0.0"`
4. Add it to the table in the root `README.md` and to `site/index.html`.
5. `pnpm install && pnpm check && pnpm build`. `pnpm check` reports any of the steps above you missed. Also check the tarball with `pnpm pack --dry-run` in the package directory.
6. Commit as `feat(<name>): …`.

Once that's on `main`, release-please opens a release PR for 0.1.0. A maintainer then has to [publish it for the first time](#first-release-of-a-new-package): CI can't publish a package that doesn't exist on npm yet.

## Releasing

Don't bump versions, edit CHANGELOGs, or create tags by hand.

1. Commits reach `main`.
2. The [Release workflow](.github/workflows/release.yml) opens or updates one release PR per package with releasable changes, titled e.g. `chore(main): release slidev-addon-tierlist 0.2.0`.
3. A maintainer merges it. The workflow then tags it (`slidev-addon-tierlist-v0.2.0`), creates the GitHub release, and runs `pnpm release` ([`scripts/publish.sh`](scripts/publish.sh)). That publishes every package whose version isn't on npm yet, using npm trusted publishing: no token, with provenance.

Release PRs are opened by a bot, so GitHub holds their checks (**action required**) until a maintainer approves the workflow runs. The checks are required, so approve them, wait for them to pass, then merge.

## CI

| Workflow | Runs on | Does |
| --- | --- | --- |
| [Demos](.github/workflows/demos.yml) | PRs, `main` | `pnpm check`, builds every demo; deploys them to GitHub Pages from `main` |
| [PR title](.github/workflows/pr-title.yml) | PRs | Requires a Conventional Commit PR title |
| [Release](.github/workflows/release.yml) | `main` | release-please PRs; tags, GitHub releases and npm publishing |

[Dependabot](.github/dependabot.yml) opens weekly grouped PRs for npm dependencies (`chore(deps): …`) and GitHub Actions (`ci: …`). Neither triggers a release on its own. If a dependency bump changes an addon's behavior, follow up with a `fix:` or `feat:` commit.

## Maintainers

### First release of a new package

npm only lets you add a trusted publisher to a package that already exists. So the first version of every new package is published by hand:

1. **Merge its first release PR** (0.1.0). The Release workflow's publish step fails for the new package with `ENEEDAUTH` or a 404. That's expected. Other packages in the same run still publish.
2. **Publish it from your machine**, from the repo root on an up-to-date `main` (needs the [setup](#setup) above, including the newer corepack):

   ```sh
   git pull
   npm login
   pnpm release   # skips everything already on npm, publishes the new package
   ```

3. **Add the trusted publisher** on npmjs.com → the package → **Settings** → **Trusted Publisher** → **GitHub Actions**:

   | Field | Value |
   | --- | --- |
   | Organization or user | `alukach` |
   | Repository | `slidev-addons` |
   | Workflow filename | `release.yml` |
   | Environment | *(leave empty)* |
   | Allow `npm publish` | ✅ checked. The workflow publishes directly, so without this every CI publish gets a 403. |
   | Allow `npm dist-tag` | ☐ unchecked. Nothing here manages dist-tags; `npm publish` sets `latest` itself. |

4. **Optionally**, under **Settings** → **Publishing access**, choose **Require two-factor authentication and disallow tokens**.
5. **Check the next release**: after the package's next CI release, its npm page should show a **Provenance** badge.

Changing any of the trusted-publisher fields later breaks publishing for that package. That includes renaming `release.yml` or adding an `environment:` to the release job. Update the setting on all packages when you do.

### Repository setup

Already done for `alukach/slidev-addons`; needed again for a fork or a new repo.

- **Settings → Pages → Source**: GitHub Actions.
- **Settings → Actions → General**: enable **Allow GitHub Actions to create and approve pull requests**, so release-please can open release PRs.
- **Settings → General → Pull Requests**: allow squash merging only, with the default commit message set to **Pull request title**, so the checked PR title is what lands on `main`. Enable **Automatically delete head branches**.
- **Settings → Rules → Rulesets**: a `main` ruleset targeting the default branch.
  - **Require a pull request before merging**: 0 approvals, squash merge only.
  - **Require status checks to pass**: `build` and `conventional-commit`, both from GitHub Actions.
  - **Block force pushes** and **Restrict deletions**.
  - **Bypass list**: Repository admin, "For pull requests only". That's an escape hatch for merging a PR whose checks are stuck; it never allows direct pushes.

### Troubleshooting

| Symptom | Cause |
| --- | --- |
| Release workflow: `ENEEDAUTH` or 404 for one package | The package has no trusted publisher yet. See [First release of a new package](#first-release-of-a-new-package). |
| Release workflow: 403 | The trusted-publisher settings don't match the workflow (owner, repo, filename, environment), or **Allow npm publish** is unchecked. |
| Release PR proposes 1.0.0 for a new package | `initial-version` is missing from `release-please-config.json`. |
| No release PR after a commit | The commit type doesn't release (`docs:`, `chore:`…), the message isn't a Conventional Commit, or the commit didn't touch the package's directory. |
| `Cannot find module …/pnpm/12.x/bin/pnpm.cjs` | corepack is too old. See [Setup](#setup). |
| Push to `main` rejected: `Changes must be made through a pull request` | Working as intended. Push a branch and open a PR. |
| Release PR can't be merged: checks never start | Approve the workflow runs on the PR (bot-opened PRs need approval), then merge once they pass. |
| `pnpm check` fails | The message names the file and the fix. Most often it's a new package missing from the release-please config, the README table or `site/index.html`. |
