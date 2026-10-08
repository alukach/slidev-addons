// Published with the addon: Slidev merges it into every deck that uses it.
export default {
  // Vite doesn't pre-bundle an installed addon's own dependencies, and
  // qr-code-styling is CommonJS, so without this `slidev` dev can't import it.
  optimizeDeps: { include: ['@alukach/slidev-addon-qrcode > qr-code-styling'] },
  // This repo's demo build only (SLIDEV_ADDONS_DEMO is set by the "build" script):
  // Slidev 53's bundled CSS trips lightningcss minification; esbuild handles it.
  ...(process.env.SLIDEV_ADDONS_DEMO && { build: { cssMinify: 'esbuild' } }),
}
