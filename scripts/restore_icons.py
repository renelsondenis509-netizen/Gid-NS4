from PIL import Image
import os
img = Image.open("public/logo_icon.png").convert("RGBA")
sizes = {"mipmap-mdpi":48,"mipmap-hdpi":72,"mipmap-xhdpi":96,"mipmap-xxhdpi":144,"mipmap-xxxhdpi":192}
base = "android/app/src/main/res"
for f, s in sizes.items():
    for name in ["ic_launcher.png","ic_launcher_round.png","ic_launcher_foreground.png"]:
        out = f"{base}/{f}/{name}"
        if os.path.exists(out):
            img.resize((s,s),Image.LANCZOS).save(out,"PNG")
print("Icons restored")
