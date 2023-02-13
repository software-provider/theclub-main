import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        console.log("preload");
        this.load.atlas('female','assets/images/female.png','assets/images/female_atlas.json');
    }

    create() {
        console.log("create");
        this.player = new Phaser.Physics.Matter.Sprite(this.matter.world,0,0,'female','townsfolk_f_idle_1');
        this.add.existing(this.player);

        // Player I/O device input for player movement
        this.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        })
    }

    update() {
        console.log("update");
        const speed = 2.5;
        let playerVelocity = new Phaser.Math.Vector2();
        
        // Velocity vector configuration
        // X v.vector
        if(
            this.inputKeys.left.isDown
        ) {
            playerVelocity.x = -1
        } else if (this.inputKeys.right.isDown) {
            playerVelocity.x = 1
        }
        // Y velocity vector
        if(
            this.inputKeys.down.isDown
        ) {
            playerVelocity.y = -1
        } else if (this.inputKeys.up.isDown) {
            playerVelocity.y = 1
        }
        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.player.setVelocity(playerVelocity.x,playerVelocity.y);
    }
}