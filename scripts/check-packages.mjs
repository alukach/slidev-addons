// Checks every packages/<dir> against the repo conventions in AGENTS.md and
// CONTRIBUTING.md (naming, files, release-please registration, docs, demo).
// Run with `pnpm check`; CI runs it on every PR.
import { existsSync, readdirSync, readFileSync } from 'node:fs'

const read = p => readFileSync(p, 'utf8')
const json = p => JSON.parse(read(p))
const config = json('release-please-config.json')
const manifest = json('.release-please-manifest.json')
const readme = read('README.md')
const site = read('site/index.html')

const errors = []
const dirs = readdirSync('packages', { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)

for (const dir of dirs) {
  const root = `packages/${dir}`
  const fail = msg => errors.push(`${root}: ${msg}`)
  const pkg = json(`${root}/package.json`)
  const name = `@alukach/slidev-addon-${dir}`

  if (pkg.name !== name) fail(`package.json name should be "${name}", got "${pkg.name}"`)
  for (const k of ['slidev-addon', 'slidev'])
    if (!pkg.keywords?.includes(k)) fail(`package.json keywords must include "${k}"`)
  if (!pkg.engines?.slidev) fail('package.json needs engines.slidev')
  if (pkg.publishConfig?.access !== 'public') fail('package.json needs publishConfig.access "public"')
  if (pkg.license !== 'MIT') fail('package.json license should be "MIT"')
  if (pkg.repository?.directory !== root) fail(`package.json repository.directory should be "${root}"`)

  const build = pkg.scripts?.build ?? ''
  if (!build.includes(`--base \${BASE:-/}${dir}/`) || !build.includes(`--out ../../site/dist/${dir}`))
    fail(`package.json "build" script must use --base \${BASE:-/}${dir}/ and --out ../../site/dist/${dir}`)

  // "files" is a whitelist of runtime paths; the demo must never ship.
  if (!Array.isArray(pkg.files) || !pkg.files.length) fail('package.json needs a "files" whitelist')
  for (const f of pkg.files ?? []) {
    if (!existsSync(`${root}/${f}`)) fail(`"files" lists "${f}", which doesn't exist`)
    if (f === 'slides.md' || f === 'public' || f.startsWith('public/')) fail(`"files" must not include the demo ("${f}")`)
  }

  for (const f of ['README.md', 'LICENSE', 'slides.md'])
    if (!existsSync(`${root}/${f}`)) fail(`missing ${f}`)
  if (existsSync(`${root}/slides.md`) && !/^routerMode: hash$/m.test(read(`${root}/slides.md`)))
    fail('slides.md must set "routerMode: hash" (GitHub Pages has no SPA fallback)')

  const component = config.packages?.[root]?.component
  if (component !== `slidev-addon-${dir}`)
    fail(`release-please-config.json needs "${root}": { "component": "slidev-addon-${dir}" }`)
  if (!(root in manifest)) fail(`.release-please-manifest.json needs "${root}"`)
  else if (manifest[root] !== pkg.version)
    fail(`version ${pkg.version} doesn't match .release-please-manifest.json (${manifest[root]})`)

  if (!readme.includes(`(packages/${dir})`)) fail('not listed in the root README.md table')
  if (!site.includes(`href="${dir}/"`)) fail('not linked from site/index.html')
}

for (const path of Object.keys(config.packages ?? {}))
  if (!existsSync(path)) errors.push(`release-please-config.json lists "${path}", which doesn't exist`)

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n${errors.map(e => `  - ${e}`).join('\n')}`)
  process.exit(1)
}
console.log(`✓ ${dirs.length} packages follow the repo conventions`)
