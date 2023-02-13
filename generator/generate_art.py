from PIL import Image, ImageDraw, ImageChops # pillow library
import random
import colorsys

# For avatars
import os
#import random
from typing import List
# from PIL import Image
from layer import Layer

# Create a random colour that will be used for each line in the image
def random_color():
    h = random.random() # between 0 and 1
    s = 1
    v = 1

    # Convert hsv colour code to (255) and then to RGB
    float_rgb = colorsys.hsv_to_rgb(h, s, v)
    rgb = [int(x * 255) for x in float_rgb]

    return tuple(rgb)

# Function for the blend/fade visual effect
def interpolate(start_color, end_color, factor: float):
    # 0 = closer to start colour; 1 = closer to end colour - create a blend between the lines based on a number between 0,1
    recip = 1 - factor # always adds up to 1
    return(
        int(start_color[0] * recip + end_color[0] * factor),
        int(start_color[1] * recip + end_color[1] * factor),
        int(start_color[2] * recip + end_color[2] * factor)
    )

def generate_art(path: str):
    print("Generating art")
    target_size_px = 256
    scale_factor = 2
    image_size_px = target_size_px * scale_factor

    # Image colour setup
    image_bg_color = (0, 0, 0)
    # Create startng & ending colours so that a blend/fade can be applied, making the overall image more uniform
    start_color = random_color()
    end_color = random_color()

    # Generate image params
    image = Image.new(
        "RGB",
        size=(image_size_px, image_size_px),
        color=image_bg_color) # type, size/dimensions, colour

    # Create negative space
    padding_px = 16 * scale_factor

    # Draw lines for the images
    draw = ImageDraw.Draw(image)
    points = []

    # Generate the points
    for _ in range(10): # this is repeated 10 times -> 10 lines
        random_point = (
            random.randint(padding_px, image_size_px - padding_px),
            random.randint(padding_px, image_size_px - padding_px))
        points.append(random_point)

    # Draw bounding box - to center image
    min_x = min([p[0] for p in points]) # for every point in array
    max_x = max([p[0] for p in points])
    min_y = min([p[1] for p in points])
    max_y = max([p[1] for p in points])
    #draw.rectangle((min_x, min_y, max_x, max_y), outline=(230, 230, 230))

    # Center image/bounding box
    delta_x = min_x - (image_size_px - max_x)
    delta_y = min_y - (image_size_px - max_y)

    for i, point in enumerate(points):
        points[i] = (point[0] - delta_x // 2, point[1] - delta_y // 2)

    # Draw the points
    thickness = 0
    n_points = len(points) - 1
    for i, point in enumerate(points): #// Loop through point array
        # overlay canvas
        overlay_image = Image.new(
            "RGB",
            size=(image_size_px, image_size_px),
            color=image_bg_color)
        overlay_draw = ImageDraw.Draw(overlay_image)

        # Initial point params
        p1 = point

        # Check if at the end of list
        if i == len(points) - 1:
            p2 = points[0]
        else:
            p2 = points[i + 1]

        line_xy = (p1, p2)
        color_factor = i / n_points
        line_color = interpolate(start_color, end_color, color_factor)
        thickness += 1 * scale_factor
        overlay_draw.line(line_xy, fill=line_color, width=thickness)
        image = ImageChops.add(image, overlay_image)

    image = image.resize((target_size_px, target_size_px), resample=Image.ANTIALIAS)
    image.save(path)

if __name__ == "__main__":
    for i in range(10):
        generate_art(f"test_image_{i}.png")

"""
Avatar generating class
"""
class AvatarGenerator:
    def __init__(self, images_path: str):
        self.layers: List[Layer] = self.load_image_layers(images_path)
        self.background_color = (120, 150, 180)
        self.rare_background_color = (255, 225, 150)
        self.rare_background_chance = 0.05
        self.output_path: str = "./output"
        os.makedirs(self.output_path, exist_ok=True)

    def load_image_layers(self, images_path: str):
        sub_paths = sorted(os.listdir(images_path))
        layers: List[Layer] = []

"""
As of right now, we have abstract generative art. How do we turn this into abstract pixel art, abstract game art (as in a more realistic/high-def art style, like what we have in Unity 3D) for the drop?
Let's use this generative art as a placeholder, add some special effects (layers) like stars, etc
Generative art -> (as placeholder for) generate_avatar.py
Hook this into a minting/registration function
"""