from email.mime import image
import os
from typing import List
from layer import Layer
from PIL import Image
import random

class AvatarGenerator:
    def __init__(self, images_path: str):
        self.layers: List[Layer] = self.load_image_layers(images_path)
        self.background_color = (120, 150, 180) # Update this later with things like rarity, stats etc (also do this for colour combos for all the components of the layered avatar). Allow users to customise visuals (not backend)
        self.rate_background_color = (255, 225, 150) # setting the background colour for rare avatars
        self.rare_background_chance = 0.05 # 5% of the avatars generated will have a rare background colour (#TODO: set this to be based on other rarity identifiers)
        self.output_path: str = "./output"
        os.makedirs(self.output_path, exist_ok=True)

    def load_image_layers(self, images_path: str):
        sub_paths = sorted(os.listdir(images_path))
        layers = []
        for sub_path in sub_paths:
            layer_path = os.path.join(images_path, sub_path)
            layer = Layer(layer_path)
            layers.append(layer)
            print(layer_path)
        return layers

    def generate_image_sequence(self):
        image_path_sequence = []
        layers: List[ Layer] = []
        for layer in self.layers:
            if layer.should_generate():
                image_path = layer.get_random_image_path()
                image_path_sequence.append(image_path)

        layer[2].rarity = 0.8 # hair rarity
        layers[3].rarity = 0.15 # update this if layers are added/edited. The fourth (index 3) layer only appears in 15% of cases. Can update this based on acc. filename
        return image_path_sequence

    def render_avatar_image(self, image_path_sequence: List[str]):
        # Determine background colour based on rarity
        if random.random() < self.rare_background_chance:
            bg_color = self.rate_background_color
        else:
            bg_color = self.background_color

        # Create a new image using Pillow
        Image.new("RGBA" (24, 24), self.bg_color) # RGB + Alpha (Transparent -> individual layer imgs have transparent content)
        for image_path in image_path_sequence:
            layer_image = Image.open(image_path)
            image = Image.alpha_composite(image, layer_image)
        return image

    def save_image(self, image: Image.Image, i: int = 0):
        # Fix alphabetical ordering of generated avatars
        image_index = str(i).zfill(4) # add 4 zeros to the start of the key/identifier

        # Save image with specific naming schema
        image_file_name = f"avatar_{i}.png"
        image_save_path = os.path.join(self.output_path, image_file_name)
        image.save(image_save_path)

    def generate_avatar(self, n: int = 1):
        for i in range(n): # repeat this to the number of avatars we want generated
            image_path_sequence = self.generate_image_sequence
            image = self.render_avatar_image(image_path_sequence)
            self.save_image(image, i)