let loadingScene = new Phaser.Scene('Loading');

// load asset files for our game
loadingScene.preload = function() {
    // Show logo
    let logo = this.app.sprite(this.sys.game.config.width/2, 250, 'logo');

    // Get user's character NFT image
    const rawSVG = await Moralis.Cloud.run("getSVG",{numericTraits:numericTraits,equippedWearables:equippedWearables});
    
    // load assets
    this.load.image('backyard', 'assets/images/backyard.png');
    this.load.image('apple', 'assets/images/apple.png');
    this.load.image('candy', 'assets/images/candy.png');
    this.load.image('toy', 'assets/images/rubber_duck.png');
    this.load.image('rotate', 'assets/images/rotate.png');
  
    // Load spritesheet asset (for pet character)
    this.load.spritesheet('pet', 'assets/images/pet.png', {
      frameWidth: 97,
      frameHeight: 83,
      margin: 1,
      spacing: 1,
    });
};

// When preloading assets finishes: create function -> go to homeScene
loadingScene.create = function() {
    // Character animations
    this.anims.create({
        key: 'funnyfaces',
        frames: this.anims.generateFrameNames('pet', {frames: [1, 2, 3]}),
        frameRate: 7,
        yoyo: true,
        repeat: 0,
    });

    // this.scene.start('Home');
};