#!/usr/bin/env python3
from PIL import Image
import os

SRC = "public/logo_icon.png"
BASE = "android/app/src/main/res"
SIZES = {
    "drawable-mdpi": 24, "drawable-hdpi": 36, "drawable-xhdpi": 48,
    "drawable-xxhdpi": 72, "drawable-xxxhdpi": 96, "drawable": 96,
}
NOISE_FLOOR = 15
RAMP_END    = 90
FILL_RATIO  = 0.82

def dist_from_white(r, g, b):
    return max(255 - r, 255 - g, 255 - b)

def build_master_mask(src_path):
    img = Image.open(src_path).convert("RGB")
    w, h = img.size
    mask = Image.new("L", (w, h), 0)
    mpix = mask.load(); spix = img.load()
    for y in range(h):
        for x in range(w):
            r, g, b = spix[x, y]
            d = dist_from_white(r, g, b)
            a = 0 if d <= NOISE_FLOOR else min(255, int((d - NOISE_FLOOR) * 255 / (RAMP_END - NOISE_FLOOR)))
            mpix[x, y] = a
    bbox = mask.getbbox()
    if bbox is None:
        raise SystemExit("Aucun pixel non-blanc trouvé dans le logo source.")
    pad_x = int((bbox[2]-bbox[0]) * 0.06); pad_y = int((bbox[3]-bbox[1]) * 0.06)
    l = max(0, bbox[0]-pad_x); t = max(0, bbox[1]-pad_y)
    r = min(w, bbox[2]+pad_x); b = min(h, bbox[3]+pad_y)
    cropped = mask.crop((l, t, r, b))
    white = Image.new("RGBA", cropped.size, (255,255,255,0))
    white.putalpha(cropped)
    return white

def main():
    content = build_master_mask(SRC)
    cw, ch = content.size
    for folder, size in SIZES.items():
        out_dir = os.path.join(BASE, folder); os.makedirs(out_dir, exist_ok=True)
        out_path = os.path.join(out_dir, "ic_stat_notify.png")
        target_dim = int(size * FILL_RATIO)
        scale = target_dim / max(cw, ch)
        new_w, new_h = max(1, round(cw*scale)), max(1, round(ch*scale))
        resized_content = content.resize((new_w, new_h), Image.LANCZOS)
        canvas = Image.new("RGBA", (size, size), (255,255,255,0))
        off_x = (size-new_w)//2; off_y = (size-new_h)//2
        canvas.alpha_composite(resized_content, (off_x, off_y))
        alpha2 = canvas.getchannel("A").point(lambda a: 255 if a>100 else (0 if a<25 else a))
        final = Image.new("RGBA", (size, size), (255,255,255,0))
        final.putalpha(alpha2)
        final.save(out_path, "PNG")
        print(f"{out_path}: {size}x{size} OK")

if __name__ == "__main__":
    main()
