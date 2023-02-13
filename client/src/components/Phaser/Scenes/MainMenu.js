import Phaser from "phaser";
import { createStore, applyMiddleware } from "redux";
import ThunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";

// Phaser initial setup
var emitter = new Phaser.Events.EventEmitter(); // Phaser event emitter
const initState = { player: {}, score: 0, nft: "", gameOver: false }; // Initial variables for the player's state

// Reducer
function reducer(state = initState, action) {
    switch (action.type) {
        case LOAD_NFT:
            emitter.emit("LOAD_NFT", action);
            return { ...state };
        default:
            return state;
    }
}

// Event types
export const LOAD_NFT = "LOAD_NFT";
let valid_nft_image = "";

// Redux
export const nftEvents = createStore(
    reducer,
    applyMiddleware(ThunkMiddleware, createLogger())
);

export default class MainMenu extends Phaser.Scene
{
    constructor () {
        super('MainMenu');

        // Display image from (nft) metadata in game
        emitter.on("LOAD_NFT", (event) => { // Event handler for authentication
            console.log("NFT: ", event.nft); // Check user has signed-in & id exists [in wallet]
            valid_nft_image = event.nft;
        });
    }

    preload() {
        this.load.image("Validnft", valid_nft_image);
    }

    create () {
        this.add.image(512, 384, 'title');

        // Display valid NFT within game's mainmenu
        this.add.image(512, 384, "validnft");
        let sign = this.add.image(512, -400, 'logo');

        this.tweens.add({
            targets: sign,
            y: 180,
            ease: 'Bounce.easeOut',
            duration: 2000
        });

        let cactus1 = this.add.image(150, 680, 'assets', 'cactus');
        let cactus2 = this.add.image(880, 680, 'assets', 'cactus').setFlipX(true);

        this.tweens.add({
            targets: cactus1,
            props: {
                scaleX: { value: 0.9, duration: 250 },
                scaleY: { value: 1.1, duration: 250 },
                angle: { value: -20, duration: 500, delay: 250 },
                y: { value: 660, duration: 250 }
            },
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });

        this.tweens.add({
            targets: cactus2,
            props: {
                scaleX: { value: 0.9, duration: 250 },
                scaleY: { value: 1.1, duration: 250 },
                angle: { value: 20, duration: 500, delay: 250 },
                y: { value: 660, duration: 250 }
            },
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });

        this.music = this.sound.play('music', { loop: true });

        this.input.once('pointerdown', () => {

            this.sound.stopAll();

            this.sound.play('shot');

            this.scene.start('MainGame');

        });
    }
}
