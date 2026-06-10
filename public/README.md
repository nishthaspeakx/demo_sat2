# Assets for SiaTajScreen

Drop two files in this /public folder with these exact names:

1. taj.jpg  — the Taj Mahal gate image (used as-is, full-screen background)
2. sia.png  — Sia, with her dark/black background REMOVED (transparent PNG)

## Cutting Sia out (one-time)
The component layers Sia over the bright Taj sky, so a black box behind her
would be visible. Export her as a transparent PNG first:

  - Quick: https://www.remove.bg  (upload the portrait, download PNG), or
  - Photoshop / Figma "remove background", or
  - macOS Preview: tap the subject → copy → paste into a transparent canvas.

Save the result as public/sia.png.

The component also feathers her edges (radial mask) + adds a soft glow, so a
slightly imperfect cutout still blends naturally.
