"""Align and grade the four bulk-density step photos so they read as one sequence.

usage: python grade.py <orig_dir> <out_dir>
"""
import sys, os
import cv2
import numpy as np

SRC, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)

STEPS = ['20260406_112412.jpg', '20260406_112454.jpg', '20260406_112547.jpg', '20260406_112650.jpg']
imgs = [cv2.imread(os.path.join(SRC, f)) for f in STEPS]
H, W = imgs[0].shape[:2]

# ── 1. Align on the blue screwdriver handle (it stays in the soil the whole time).
# Frame 4 is shot closest, so it is the reference and the others are scaled up to it.
HANDLE = []  # (centroid x, y, size)
for img in imgs:
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    m = cv2.inRange(hsv, (100, 150, 60), (130, 255, 255))
    n, lab, st, cen = cv2.connectedComponentsWithStats(m)
    i = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
    HANDLE.append((cen[i][0], cen[i][1], (st[i][2] / 118 + st[i][3] / 344) / 2))
rx, ry, rs = HANDLE[3]
aligned, masks = [], []
for img, (x, y, sz) in zip(imgs, HANDLE):
    k = rs / sz
    A = np.float32([[k, 0, rx - k * x], [0, k, ry - k * y]])
    print('scale', round(k, 3))
    aligned.append(cv2.warpAffine(img, A, (W, H), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REFLECT))

# ── 2. Unify exposure and white balance: match each frame's LAB mean/std to the set's average ──
labs = [cv2.cvtColor(a, cv2.COLOR_BGR2LAB).astype(np.float32) for a in aligned]
centre = (slice(int(H * .15), int(H * .95)), slice(int(W * .2), int(W * .8)))
stats = [(l[centre].reshape(-1, 3).mean(0), l[centre].reshape(-1, 3).std(0)) for l in labs]
mu = np.mean([s[0] for s in stats], 0)
sd = np.mean([s[1] for s in stats], 0)
for i, (m_, s_) in enumerate(stats):
    labs[i] = (labs[i] - m_) / s_ * sd + mu

# ── 3. The look: calmer greens, a touch warmer, crisper soil texture, gentle vignette ──
def grade(lab):
    L, a, b = cv2.split(lab)
    # local contrast on L (soil crumbs, cylinder rim)
    L8 = np.clip(L, 0, 255).astype(np.uint8)
    L = cv2.createCLAHE(clipLimit=1.4, tileGridSize=(8, 8)).apply(L8).astype(np.float32) * .6 + L * .4
    # soft S-curve, slightly lower highlights so the white cap does not glare
    x = L / 255
    x = x + .10 * np.sin(2 * np.pi * x) * -0.5 * (1 - x)  # lift shadows a little
    x = np.clip((x - .5) * 1.06 + .5, 0, 1)
    x = np.where(x > .82, .82 + (x - .82) * .7, x)
    L = x * 255
    # greens (a < 128) lose 22 % chroma, everything warms by +4 b
    a = np.where(a < 128, 128 + (a - 128) * .78, a)
    b = b + 4
    out = cv2.cvtColor(np.clip(cv2.merge([L, a, b]), 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR)
    # the blue handle: 40 % less saturated so it sits in the earth palette
    hsv = cv2.cvtColor(out, cv2.COLOR_BGR2HSV).astype(np.float32)
    blue = ((hsv[..., 0] > 95) & (hsv[..., 0] < 135)).astype(np.float32)
    blue = cv2.GaussianBlur(blue, (0, 0), 3)
    hsv[..., 1] *= 1 - .4 * blue
    out = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
    # unsharp mask
    blur = cv2.GaussianBlur(out, (0, 0), 2.2)
    out = cv2.addWeighted(out, 1.35, blur, -.35, 0)
    return out

graded = [grade(l) for l in labs]

def vignette(img, strength=.28):
    h, w = img.shape[:2]
    y, x = np.ogrid[:h, :w]
    r = np.sqrt(((x - w / 2) / (w / 2)) ** 2 + ((y - h / 2) / (h / 2)) ** 2) / np.sqrt(2)
    v = 1 - strength * np.clip((r - .35) / .65, 0, 1) ** 1.6
    return np.clip(img * v[..., None], 0, 255).astype(np.uint8)

# ── 4. Crops (same rectangle on every frame so the crossfade is steady) ──
# pit centre in frame 1, measured on the previews: x ~ 0.50, y ~ 0.62
cx, cy = 1950, 960  # frame-4 coordinates: handle above, hole in the lower third
def crop(img, w, h):
    x0 = min(max(cx - w // 2 + (0 if w > h else 210), 0), W - w)
    y0 = min(max(cy - h // 2 + (0 if w > h else 40), 0), H - h)
    return img[y0:y0 + h, x0:x0 + w]

CROPS = {
    'wide': (2460, 1640, 1800),   # 3:2, every screen size
}
names = ['1-asas', '2-beveres', '3-kiemeles', '4-lezaras']
for name, g, orig in zip(names, graded, aligned):
    for key, (cw, ch, outw) in CROPS.items():
        c = vignette(crop(g, cw, ch))
        c = cv2.resize(c, (outw, int(ch * outw / cw)), interpolation=cv2.INTER_AREA)
        cv2.imwrite(os.path.join(OUT, f'terfogattomeg-{name}-{key}.jpg'), c, [cv2.IMWRITE_JPEG_QUALITY, 84, cv2.IMWRITE_JPEG_PROGRESSIVE, 1])
        if key == 'wide':
            o = cv2.resize(crop(orig, cw, ch), (1200, 800), interpolation=cv2.INTER_AREA)
            cv2.imwrite(os.path.join(OUT, f'_before-{name}.jpg'), o)
print('done')
