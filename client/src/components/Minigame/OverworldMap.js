import { createContext } from "react";
import GameObject from "./GameObject";
import utils from "./utils";

import png from "./images/characters/player"; // Set this to be the player's unique NFT (based on the nft collection, like in Phaser)
import Person from "./Person";

class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;
        this.lowerImage = new Image();
        this.upperImage = new Image();
        this.lowerImage.src = config.lowerSrc; // Contains tiles that objects stand on
        this.upperImage.src = config.upperSrc; // drawn above the gameobjects (e.g. player) like roofs
    }

    drawLowerImage(ctx) {
        ctx.drawImage(this.lowerImage, 0, 0)
    }
    drawUpperImage(ctx) {
        ctx.drawImage(this.upperImage, 0, 0)
    }
}

window.OverworldMaps = { // Configuration for every map in the game
    DemoRoom: {
        lowerSrc: "/images/maps/DemoLower.png",
        upperSrc: "/images/maps/DemoUpper.png",
        gameObjects: {
            character: new Person({ 
                x: utils.withGrid(5),
                y: utils.withGrid(6),
            }),
            npc1: new GameObject({
                x: utils.withGrid(7),
                y: utils.withGrid(9),
                src: '/images/characters/npc1.png',
            }),
        }
    },
    DemoRoom2: {
        lowerSrc: "/images/maps/DemoLower.png",
        upperSrc: "/images/maps/DemoUpper.png",
        gameObjects: {
            character: new GameObject({ // Can also create new instances of the same character/object
                x: 6,
                y: 9,
            }),
        }
    }
}

export default OverworldMap;