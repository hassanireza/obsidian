#!/usr/bin/env python3
"""
Regenerates every derived image asset in the repo from the brand mark and the
original cover art. Run it after changing the logo or adding a new cover:

    pip install pillow
    python3 scripts/generate-assets.py

Outputs
  public/covers/<slug>-480.webp, -800.webp   responsive cover sizes
  public/icons/*.png                         PWA + iOS home screen icons
  public/splash/*.png                        iOS launch images
  public/favicon-16.png, favicon-32.png, favicon.ico
  src/assets/grain.png                       film grain tile

It also prints the <link rel="apple-touch-startup-image"> tags for index.html.
"""
from __future__ import annotations

import random
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

BG = (10, 10, 12)
BONE = (232, 228, 218)

# --------------------------------------------------------------------------
# Brand mark (mirrors src/components/Logo.tsx, 26 x 26 unit grid)
# --------------------------------------------------------------------------


def draw_mark(canvas: Image.Image, scale: float, stroke_units: float = 1.2) -> None:
    """Draw the Obsidian mark centred on `canvas`, occupying `scale` of its width."""
    size = canvas.width
    ss = 4  # supersample for crisp edges
    layer = Image.new("RGBA", (size * ss, size * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    m = size * ss * scale  # mark box in px
    ox = (size * ss - m) / 2
    oy = (size * ss - m) / 2
    u = m / 26.0
    w = max(1, round(u * stroke_units))

    def pt(x: float, y: float) -> tuple[float, float]:
        return (ox + x * u, oy + y * u)

    # Outer frame
    d.rectangle([pt(1, 1), pt(25, 25)], outline=BONE + (255,), width=w)
    # Diamond
    diamond = [pt(13, 4), pt(20, 13), pt(13, 22), pt(6, 13)]
    d.polygon(diamond, outline=BONE + (255,), width=w)
    # Centre dot
    cx, cy = pt(13, 13)
    r = 1.9 * u
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=BONE + (255,))

    layer = layer.resize((size, size), Image.LANCZOS)
    canvas.alpha_composite(layer)


def background(size: int, glow: bool) -> Image.Image:
    img = Image.new("RGBA", (size, size), BG + (255,))
    if glow:
        # A faint pool of light behind the mark
        radial = Image.radial_gradient("L").resize((size, size), Image.BICUBIC)
        mask = radial.point(lambda v: int(max(0, 255 - v * 1.25) * 0.07))
        light = Image.new("RGBA", (size, size), BONE + (255,))
        img = Image.composite(light, img, mask)
    return img


def make_icon(size: int, scale: float, stroke: float = 1.2, glow: bool = True) -> Image.Image:
    img = background(size, glow)
    draw_mark(img, scale, stroke)
    return img.convert("RGB")  # iOS rejects transparency on touch icons


# --------------------------------------------------------------------------
# Generators
# --------------------------------------------------------------------------


def icons() -> None:
    out = PUBLIC / "icons"
    out.mkdir(parents=True, exist_ok=True)

    master = 1024
    any_icon = make_icon(master, 0.58)
    maskable = make_icon(master, 0.44)  # inside the 80% safe zone

    for px in (120, 152, 167, 192, 512):
        any_icon.resize((px, px), Image.LANCZOS).save(out / f"icon-{px}.png", optimize=True)
    maskable.resize((512, 512), Image.LANCZOS).save(out / "icon-maskable-512.png", optimize=True)
    any_icon.resize((180, 180), Image.LANCZOS).save(out / "apple-touch-icon.png", optimize=True)

    # Tiny sizes need a bolder stroke and a larger mark to stay legible
    for px in (16, 32, 48):
        make_icon(px * 8, 0.78, stroke=2.6, glow=False).resize(
            (px, px), Image.LANCZOS
        ).save(PUBLIC / f"favicon-{px}.png", optimize=True)

    ico = [Image.open(PUBLIC / f"favicon-{px}.png").convert("RGBA") for px in (16, 32, 48)]
    ico[-1].save(PUBLIC / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    # 48 is only needed inside the .ico
    (PUBLIC / "favicon-48.png").unlink(missing_ok=True)


# (css width, css height, device pixel ratio)
SPLASH_DEVICES = [
    (440, 956, 3),  # iPhone 16 Pro Max
    (402, 874, 3),  # iPhone 16 Pro
    (430, 932, 3),  # iPhone 14 Pro Max / 15 / 15 Plus / 16 Plus
    (393, 852, 3),  # iPhone 14 Pro / 15 / 15 Pro / 16
    (428, 926, 3),  # iPhone 12/13 Pro Max, 14 Plus
    (390, 844, 3),  # iPhone 12 / 13 / 14
    (375, 812, 3),  # iPhone X / XS / 11 Pro / 12 mini / 13 mini
    (414, 896, 3),  # iPhone XS Max / 11 Pro Max
    (414, 896, 2),  # iPhone XR / 11
    (414, 736, 3),  # iPhone 8 Plus
    (375, 667, 2),  # iPhone SE / 8
    (1024, 1366, 2),  # iPad Pro 12.9
    (834, 1194, 2),  # iPad Pro 11
    (820, 1180, 2),  # iPad Air
    (834, 1112, 2),  # iPad Pro 10.5
    (810, 1080, 2),  # iPad 10.2
    (744, 1133, 2),  # iPad mini 6
    (768, 1024, 2),  # iPad 9.7
]


def splash() -> list[str]:
    out = PUBLIC / "splash"
    out.mkdir(parents=True, exist_ok=True)
    tags: list[str] = []

    # Draw the mark once at high resolution, then paste a scaled copy
    mark_src = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    draw_mark(mark_src, 0.96, 1.1)

    for w, h, dpr in SPLASH_DEVICES:
        pw, ph = w * dpr, h * dpr
        img = Image.new("RGB", (pw, ph), BG)
        mark_px = round(min(pw, ph) * 0.26)
        mark = mark_src.resize((mark_px, mark_px), Image.LANCZOS)
        img.paste(mark, ((pw - mark_px) // 2, (ph - mark_px) // 2), mark)
        name = f"splash-{pw}x{ph}.png"
        img.save(out / name, optimize=True)
        media = (
            f"(device-width: {w}px) and (device-height: {h}px) and "
            f"(-webkit-device-pixel-ratio: {dpr}) and (orientation: portrait)"
        )
        tags.append(
            f'    <link rel="apple-touch-startup-image" '
            f'href="%BASE_URL%splash/{name}" media="{media}" />'
        )
    return tags


def covers() -> None:
    folder = PUBLIC / "covers"
    for src in sorted(folder.glob("*.webp")):
        if src.stem.endswith(("-480", "-800")):
            continue
        with Image.open(src) as im:
            for width in (480, 800):
                height = round(im.height * width / im.width)
                im.resize((width, height), Image.LANCZOS).save(
                    folder / f"{src.stem}-{width}.webp", "WEBP", quality=82, method=6
                )


def grain() -> None:
    rng = random.Random(7)  # deterministic: same tile every run
    size = 128
    img = Image.new("LA", (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            v = rng.randint(0, 255)
            tone = 255 if v > 127 else 0
            alpha = int(abs(v - 127) / 127 * 34)
            px[x, y] = (tone, alpha)
    dest = ROOT / "src" / "assets" / "grain.png"
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, optimize=True)


if __name__ == "__main__":
    grain()
    covers()
    icons()
    links = splash()
    print("Generated icons, splash screens, favicons, cover sizes and grain.\n")
    print("Splash <link> tags for index.html:\n")
    print("\n".join(links))
