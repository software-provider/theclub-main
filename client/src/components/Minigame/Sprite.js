class Sprite {
    constructor(config) {
        // Set image for the character(s) or other object(s)
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        // Shadow for game objects
        this.shadow = new Image();
        this.useShadow = true; // config the usage of a shadow for the asset (config.useShadow || false)
        if (this.useShadow) {
            this.shadow.src = "/images/characters/shadow.png"; // Currently, each game object will have the same shadow. This should either be changed to be configured based on params for each object or have different original assets for each object's shadow
        }
        this.shadow.onlaoad = () => {
            this.isShadowLoaded = true;
        }

        // Configure animation & initial state
        this.animation = config.animations || {
            idleDown: [
                [0,0]
            ],
            /*walkDown: [

            ]*/
        }
        this.currentAnimation = config.currentAnimation || "idleDown";
        this.currentAnimationFrame = 0; // What animation [frame] will be shown?

        // Reference the game object
        this.gameObject = config.gameObject;
    }

    draw(ctx) {
        const x = this.gameObject.x - 8; // Set this value for the sprite to be equal to the specific game object's position
        const y = this.gameObject.y - 18;

        // Draw the shadow first
        this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

        // Draw the character sprite (on top of the object's shadow)
        this.isLoaded && ctx.drawImage(this.image, // Ensure that the game context is loaded before [attempting to] drawing sprites
            0,0,
            32,32,
            x,y-0.05, // Levitate the character (y) over the shadow's layer
            32,32
        ) // Customise this for different sized sprite sheets (or image/asset params, if not pixel art/from sprite sheet(s))
    }
}

/* Some notes:
Any game object can pass in their own definitions for animations -> not just the player character
*/

export default Sprite;