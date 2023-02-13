let homeScene = new Phaser.Scene('Home');

homeScene.create = function() {
    // Game background with active input
    let bg = this.add.sprite(0, 0, 'backyard').setInteractive();
    bg.setOrigin(0, 0);

    // Welcome text
    let gameW = this.sys.game.config.width;
    let gameH = this.sys.game.config.height;
    let text = this.add.text(gameW/2, gameW/2, 'VIRTUAL PET', {
        font: '40px Arial',
        fill: "#ffffff",
    });
    text.setOrigin(0.5, 0.5);
    text.depth = 1;

    // Background around text
    let textBg = this.add.graphics();
    textBg.fillStyle(0x000000, 0.7); // colour hexadec, alpha
    textBg.fillRect(gameW/2 - text.width/2 - 10, gameH/2 - text.height/2 - 10, text.width + 20, text.height + 20);

    // Start the game when user clicks anywhere on scene (background)
    bg.on('pointerdown', function() {
        this.scene.start('Game');
    }, this);
};