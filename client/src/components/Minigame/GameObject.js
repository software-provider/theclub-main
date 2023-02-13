import Sprite from "./Sprite";

class GameObject {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down"; // default to down (string)
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || '/images/characters/people/hero.png', // If the object doesn't have a set image, provide a default
        }); 
    }

    update() {

    }
}

export default GameObject;

/* Original character/gameObject params:


        // Character Creation
        const x = 5; // x position for character/object
        const y = 6; // y
        const character = new Image();
        character.onload = () => {
            this.ctx.drawImage(character,
                0, // Params for cropping the sprite pack -> left cut
                0, // top cut
                32, // Size of cut in pixels -> 32x32 (width)
                32, // height of cut
                x * 16 -8, // x pos of cut image
                y * 16 -18, // * 16 -> compensating for the grid size, then move the character to the top left of the grid
                32, // Size of character (in pixels)
                32)
        }
        character.src = "/images/characters/character.png"

        // Perspective/shadow for the character
        const shadow = new Image();
        shadow.onload = () => {
            this.ctx.drawImage(shadow,
                0, 
                0, 
                32, 
                32, 
                x * 16 -8, 
                y * 16 -18, 
                32, 
                32)
        }
        shadow.src = "images/characters/shadow.png" 

*/