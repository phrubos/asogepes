import os
from PIL import Image

def get_dims(path):
    try:
        with Image.open(path) as img:
            return img.size
    except Exception as e:
        return str(e)

original = r"c:\Projects\asogepes_webapp_2\public\images\hero_original.png"
modified = r"c:\Projects\asogepes_webapp_2\public\images\hero_modified.png"

print(f"Original: {get_dims(original)}")
print(f"Modified: {get_dims(modified)}")
