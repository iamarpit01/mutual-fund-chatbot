import json
import re

# Read current tailwind config
with open('frontend/tailwind.config.js', 'r') as f:
    content = f.read()

# Extract colors object string
match = re.search(r'"colors":\s*(\{.*?\})', content, re.DOTALL)
colors_str = match.group(1)

# Parse it
colors_dict = json.loads(colors_str)

def hex_to_rgb(hex_code):
    hex_code = hex_code.lstrip('#')
    return "{} {} {}".format(int(hex_code[0:2], 16), int(hex_code[2:4], 16), int(hex_code[4:6], 16))

# Generate CSS variables for light theme
css_light = "  :root {\n"
for name, hex_val in colors_dict.items():
    rgb = hex_to_rgb(hex_val)
    css_light += f"    --{name}: {rgb};\n"
css_light += "  }\n"

# For dark theme, we'll try to invert lightness in HSL, or just do a simple inversion of RGB, 
# but it's better to provide a basic dark palette logic.
import colorsys

def invert_color_for_dark_mode(hex_code):
    hex_code = hex_code.lstrip('#')
    r, g, b = int(hex_code[0:2], 16)/255.0, int(hex_code[2:4], 16)/255.0, int(hex_code[4:6], 16)/255.0
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    
    # Invert lightness: if it's very light (>0.8), make it very dark (<0.2)
    # 0.95 -> 0.1, 0.1 -> 0.9
    new_l = 1.0 - l
    
    # Keep some contrast
    if new_l < 0.1: new_l = 0.1
    if new_l > 0.9: new_l = 0.9
    
    # M3 dark themes are often tinted slightly with primary (hue ~160)
    # Let's just use the inverted lightness
    nr, ng, nb = colorsys.hls_to_rgb(h, new_l, s)
    return "{} {} {}".format(int(nr*255), int(ng*255), int(nb*255))

css_dark = "  .dark {\n"
for name, hex_val in colors_dict.items():
    # Provide manual overrides for key background colors to match M3 dark
    if 'background' in name or 'surface' in name and not 'on-' in name:
        if 'lowest' in name:
            rgb = "9 13 15" # #090D0F
        elif 'low' in name:
            rgb = "16 20 22" # #101416
        elif 'high' in name:
            rgb = "40 44 46" # #282C2E
        elif 'highest' in name:
            rgb = "50 54 56"
        else:
            rgb = "16 20 22" # default surface
    elif name == 'primary':
         rgb = "68 237 183" # From old dark theme
    elif name == 'primary-container':
         rgb = "0 108 83" # Inverted primary container
    elif name == 'on-primary-container':
         rgb = "68 237 183"
    elif 'on-surface' in name or 'on-background' in name:
         if 'variant' in name:
             rgb = "186 202 193"
         else:
             rgb = "225 227 228"
    else:
        rgb = invert_color_for_dark_mode(hex_val)
    css_dark += f"    --{name}: {rgb};\n"
css_dark += "  }\n"

# Write to index.css
with open('frontend/src/index.css', 'r') as f:
    css_content = f.read()

# Replace body { ... } to top of file
new_css_content = css_content.replace("@layer base {", "@layer base {\n" + css_light + "\n" + css_dark)
with open('frontend/src/index.css', 'w') as f:
    f.write(new_css_content)

# Now rewrite tailwind.config.js to use rgb(var(--name) / <alpha-value>)
new_colors_dict = {}
for name in colors_dict.keys():
    new_colors_dict[name] = f"rgb(var(--{name}) / <alpha-value>)"

new_colors_str = json.dumps(new_colors_dict, indent=6)
new_content = content.replace(colors_str, new_colors_str)
with open('frontend/tailwind.config.js', 'w') as f:
    f.write(new_content)

print("Successfully converted colors to CSS variables!")
