import Phaser from "Phaser";
import styles from "./Styles/phaser-styles.css";
import init from "./init.js";
import Sprite from "./Sprite";
import GameObject from "./GameObject";
import Overworld from "./Overworld.js";
import OverworldMap from "./OverworldMap";

const Minigame = () => {
  return (
    <div>
      <title>Star Sailors</title>
      <link href='./Styles/phaser-styles.css' type='text/css' rel='stylesheet' />
      <div className='game-container'>
        <canvas className='game-canvas' width='352' height='198' />
      </div>
      {/* Second compontent of the game -> copy data between each container */}
      <div id="crafting-game-container">
        <script type="module" src="./crafting/game.js"></script>
      </div>

      <script src="/utils.js"></script>
      <script src="/DirectionInput.js"></script>
      <script src="/Overworld.js"></script>
      <script src="/GameObject.js"></script>
      <script src="/Person.js"></script>
      <script src="/Sprite.js"></script>
      <script src="/OverworldMap.js"></script>
      <script src="/init.js"></script>
    </div>
  )
}

export default Minigame;