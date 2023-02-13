// create a new scene
let moralisScene = new Phaser.Scene("Game");

// Connect to Moralis game server
Moralis.initialize("ppKsJ87zo59ln2WnmJm3n66TM9mq06I4GYGqLxRq");
Moralis.serverURL = "https://5naflsgtclgx.moralisweb3.com:2053/server";

// Beginning of Moralis base scene
var platforms;

var player;
var competitors = {};

var cursor;

var jumpHeight = -100;
var that;

function launch() { // launch game only if user is authenticated with web3
  let user = Moralis.User.current();
  if (!user) {
    alert("Not authenticated yet")
  } else {
    console.log(user.get('ethAddress') + " " + "logged in");
    game = new Phaser.Game(config);
  }
}

launch();

moralisScene.preload = function() {
  that = this;

  this.load.image('background', 'assets/BG.png');
  this.load.image('ground', 'assets/Tiles/Tile (2).png');
  this.load.image('competitor', 'assets/player.png'); // square (transparent) player image. Will eventually be the user's NFT

  // Fetch player svg
  const numericTraits = [1, 99, 99, 99, 1, 1]; // UI to change the traits
  const equippedWearables = [23,6,2,43,0,4,0,1,0,0,0,0,0,0,0,0];

  const rawSVG = await Moralis.Cloud.run("getSVG",{numericTraits:numericTraits,equippedWearables:equippedWearables});
  const svgBlob = new Blob([rawSVG], {type:"image/svg+xml;charset=utf-8"})
  const url = URL.createObjectURL(svgBlob);

  this.load.image('player', url);
  this.loa.on('filecomplete', function() {
    initPlayer()
  }, this);

  this.load.start();
}

// Player character
async function initPlayer() {
  player = that.physics.add.sprite(500, 250, 'player').setScale(0.3).refreshBody();
  player.setBounce(0.3);
  that.physics.add.collider(player, platforms) // World building -> interactions between player & objects
}

moralisScene.create = function() {
  this.add.image(400, 300, 'background').setScale(0.55); // Update the width and height of phaser scene, or change positioning
  
  platforms = this.physics.add.staticGroup();
  platforms.create(470, 400, 'ground').setScale(0.4).refreshBody;
  platforms.create(535, 400, 'ground').setScale(0.4).refreshBody;
  platforms.create(600, 400, 'ground').setScale(0.4).refreshBody;
  platforms.create(665, 400, 'ground').setScale(0.4).refreshBody;

  // World building -> interactions between player & objects
  cursors = this.input.keyboard.createCursorKeys();

  // Moralis db reading player data
  let user = Moralis.User.current();

  let query = new Moralis.Query('PlayerLocation');
  let subscription = await query.subscribe();
  subscription.on('create', (plocation) => {
    if(plocation.get("player") != user.get("ethAddress")) {
      // If first time seeing
      if(competitors[plocation.get("player")] == undefined) {
        competitors[plocation.get("player")] = this.add.image( plocation.get("x"), plocation.get("y"), 'comptetitor').setScale(0.3); // Create a sprite
      } else {
        competitors[plocation.get("player")].x = plocation.get("x");
        competitors[plocation.get("player")].y = plocation.get("y");
      }

      console.log("someone moved!")
      console.log(plocation.get("player"))
      console.log("new X ", plocation.get("x"))
      console.log("new Y ", plocation.get("y"))
    }
  });
}

moralisScene.update = function() {
  if(!player)
    return;

  if (cursors.left.isDown) {
    player.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
  } else {
    player.setVelocityX(0);
  }

  // Jumping
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(jumpHeight);
  }

  if(player.lastX!=player.x || player.lastY!=player.y) { // Only save the player position to Moralis db if the position has changed
    let user = Moralis.User.current();

    const PlayerPosition = Moralis.Object.extend("PlayerPosition");
    const playerPosition = new PlayerPosition();

    playerPosition.set("player", user.get("ethAddress"));
    playerPosition.set("x", player.x);
    playerPosition.set("y", player.y);

    player.lastX = player.x;
    player.lastY = player.y;

    await playerPosition.save();
  }
}

async function login() {
  let user = Moralis.User.current();
  if (!user) {
      user = await Moralis.Web3.authenticte();
      launch();
  }
  console.log("Logged in user: ", user);
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out user");
  location.reload();
}

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  physics: { // This is only for the moralisScene
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    }
  },
  scene: [bootScene, loadingScene, homeScene, gameScene, moralisScene,],
  title: 'Virtual Pet', 
  pixelArt: false, // Browser should soften the images
  backgroundColor: 'ffffff',
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);