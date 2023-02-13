import GameObject from "./GameObject";
import OverworldMap from "./OverworldMap";
import DirectionInput from "./DirectionInput";

class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    startGameLoop() {
        const step = () => { 
            // Clean the canvas each frame 
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw layers for map
            // Draw lower layer
            this.map.drawLowerImage(this.ctx);

            // Draw Game Objects
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction
                })
                object.sprite.draw(this.ctx);
            })

            // Draw upper layer
            this.map.drawUpperImage(this.ctx);

            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }

    init() {
        this.map = new OverworldMap(window.OverworldMaps.DemoRoom) // The game loads with this map
        this.directionInput = new DirectionInput(); 
        this.directionInput.init();
        this.directionInput.direction;

        this.startGameLoop();
    }
}

export default Overworld;