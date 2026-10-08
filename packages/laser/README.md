# @alukach/slidev-addon-laser

A laser pointer for [Slidev](https://sli.dev): draw a red trail that fades out behind the pointer. Strokes drawn in the presenter view also appear in the audience view.

**[Demo](https://alukach.github.io/slidev-addons/laser/)**

## Install

```sh
pnpm add @alukach/slidev-addon-laser
```

```yaml
# slides.md headmatter
addons:
  - '@alukach/slidev-addon-laser'
```

## Use

- **Hold Shift and drag** to draw.
- Or click the scribble button in the nav bar to turn the laser on, then just move the pointer. Click it again to turn it off.

In presenter mode the trail follows Slidev's synced cursor, so turning the laser on also turns on the presenter cursor.

## Configure

In the headmatter:

```yaml
themeConfig:
  laserColor: '#ef4444'  # any CSS color
  laserWidth: 6          # px
  laserFade: 900         # ms until the trail disappears
  laserEnabled: false    # true to start with the laser on
```

## Compatibility

This addon imports a few Slidev client internals (shared state and the nav-bar `IconButton`), so it may break on a Slidev major upgrade. `engines.slidev` declares the tested range.

## Credits

Ported from [developmentseed/ds-slidev-template](https://github.com/developmentseed/ds-slidev-template).
