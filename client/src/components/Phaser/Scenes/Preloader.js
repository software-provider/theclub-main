import Phaser from "phaser";
import { events, LOGIN_PLAYER } from "../Phaser";
import { createStore, applyMiddleware } from "redux";
import ThunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { emit } from "process";
import { EventEmitter } from "stream";

// Phaser event emitter
var emitter = new Phaser.Events.EventEmitter();
// Initial Phaser vars
const initState = { players: [], score: 0, gameOver: false };

// Reducer
function reducer(state = initState, action) {
    switch (action.type) {
        case AUTH:
            EventEmitter.emit("AUTH", ".");
            return { ...state, players: [...state.players, action.player] };
        default:
            return state;
    }
}

// Event types
export const AUTH = "AUTH";

// Redux
export const authEvents = createStore(
    reducer,
    applyMiddleware(ThunkMiddleware, createLogger())
)

export default class Preloader extends Phaser.Scene
{
    constructor ()
    {
        super('Preloader');
        // Event handler for authenticated (web3) login
        emitter.on("AUTH", (event) => {
            console.log(event);
            this.scene.state("MainMenu");
        });
    }

    preload ()
    {
        this.loading = this.add.image(512, 384, 'loading');

        this.load.setPath('assets/phaser/');

        this.load.image('start');
        this.load.image('title');
        this.load.image('logo');
        this.load.image('background');
        this.load.image('bulletHole', 'bullet-hole.png');
        this.load.atlas('assets', 'bank-panic.png', 'bank-panic.json');

        this.load.audio('shot', [ 'shot.ogg', 'shot.m4a', 'shot.mp3' ]);
        this.load.audio('banditShot', [ '50cal.ogg', '50cal.m4a', '50cal.mp3' ]);
        this.load.audio('money', [ 'money.ogg', 'money.m4a', 'money.mp3' ]);
        this.load.audio('levelComplete', [ 'complete.ogg', 'complete.m4a', 'complete.mp3' ]);
        this.load.audio('gameOver', [ 'gameover.ogg', 'gameover.m4a', 'gameover.mp3' ]);
        this.load.audio('music', [ 'music.ogg', 'music.m4a', 'music.mp3' ]);
        this.load.audio('door', [ 'door.ogg', 'door.m4a', 'door.mp3' ]);
        this.load.audio('scream1', [ 'scream1.ogg', 'scream1.m4a', 'scream1.mp3' ]);
        this.load.audio('scream2', [ 'scream2.ogg', 'scream2.m4a', 'scream2.mp3' ]);
        this.load.audio('scream3', [ 'scream3.ogg', 'scream3.m4a', 'scream3.mp3' ]);
    }

    create ()
    {
        //  Create our global animations

        this.anims.create({
            key: 'doorOpen',
            frames: this.anims.generateFrameNames('assets', { prefix: 'door', start: 1, end: 5 }),
            frameRate: 20
        });

        this.anims.create({
            key: 'doorClose',
            frames: this.anims.generateFrameNames('assets', { prefix: 'door', start: 5, end: 1 }),
            frameRate: 20
        });

        this.loading.setTexture('start');

        this.loading.setInteractive();

        // Start button - to play/begin the game
        this.loading.once('pointerdown', () => {
            //this.scene.start('MainMenu');
            events.dispatch({ type: LOGIN_PLAYER, score: 0 }); // Dispatch player event to the app/Phaser component. Trigger web3 wallet when the game starts
        });
    }
}
