// Demo deck only (not in "files"): Slidev 53's bundled CSS trips lightningcss
// minification; esbuild handles it. Plain object, since vite isn't a direct dependency.
export default {
  build: { cssMinify: 'esbuild' },
}
