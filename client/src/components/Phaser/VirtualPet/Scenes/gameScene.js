// Create a new game scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
    // Game stats
    this.stats = {
      health: 100,
      fun: 100,
    };
  
    // Decay parameters
    this.decayRates = {
      health: -5,
      fun: -2,
    }
  };
  
  // executed once, after assets were loaded
  gameScene.create = function() {
    // Game background
    let bg = this.add.sprite(0, 0, 'backyard').setInteractive();
    bg.setOrigin(0, 0);
    // Event listener for the background
    bg.on('pointerdown', this.placeItem, this)
  
    // Character
    this.pet = this.add.sprite(100, 200, 'pet', 0).setInteractive(); // position, sprite/img, frame
    this.pet.depth = 1; // Appear on top of sprites with default depth (2)
    this.input.setDraggable(this.pet); // Make the pet draggable
  
    this.input.on('drag', function(pointer, gameObject, dragX, dragY){
      // make sprite be located at coords of dragging
      gameObject.x = dragX;
      gameObject.y = dragY;
    }); // Follow the cursor when dragged (this affects all game objects/sprites that are .setDraggable)
  
    // Create ui
    this.createUi();
  
    // Show stats to the user
    this.createHud();
    this.refreshHud();
  
    // Decay of pet stats
    this.timedEventStats = this.timedEventStats.addEvent({
      delay: 1000,
      repeat: -1, // repeat forever
      callback: function(){
        this.updateStats(this.decayRates);
      },
      callbackScope: this,
    });
  };
  
  // Create the UI
  gameScene.createUi = function() {
    // Game UI (Buttons)
    this.appleBtn = this.add.sprite(72, 570, 'apple').setInteractive();
    this.appleBtn.customStats = {health: 20, fun: 0}; // +20, +/-0 (when used)
    this.appleBtn.on('pointerdown', this.pickItem); // When ui sprite is "clicked" by end user
  
    this.candyBtn = this.add.sprite(144, 570, 'candy');
    this.candyBtn.setInteractive();
    this.candyBtn.customStats = {health: -10, fun: 10}
    this.candyBtn.on('pointerdown', this.pickItem);
  
    this.toyBtn = this.add.sprite(216, 570, 'toy').setInteractive();
    this.toyBtn.customStats = {health: 0, fun: 15};
    this.toyBtn.on('pointerdown', this.pickItem);
  
    this.rotateBtn = this.add.sprite(288, 570, 'rotate').setInteractive();
    this.rotateBtn.customStats = {fun: 20};
    this.rotateBtn.on('pointerdown', this.rotatePet);
  
    // every button/item
    this.buttons = [this.appleBtn, this.candyBtn, this.toyBtn, this.rotateBtn];
  
    // UI is not being blocked
    this.uiBlocked = false;
  
    // Refresh UI
    this.uiReady();
  }
  
  // Rotate pet character
  gameScene.rotatePet = function() {
    if(this.scene.uiBlocked) return;
    this.scene.uiReady();
  
    this.scene.uiBlocked = true;
    this.alpha = 0.5;
  
    let scene = this.scene;
    
    // Rotation tween
    let rotateTween = this.scene.tweens.add({
      targets: this.scene.pet,
      duration: 600, // milliseconds
      angle: 720,
      pause: false,
      callbackScope: this,
      onComplete: function(tween, sprites) {
        // Increase stats
        this.scene.updateStats(this.customStats); // customStats of the rotate sprite
        this.scene.uiReady();
        this.scene.refreshHud();
      }
    });
  
    console.log('Pet is being rotated');
  };
  
  // Pick game item
  gameScene.pickItem = function() {
    // User is selecting an item
    if (this.scene.uiBlocked) return; // If the UI is blocked, the user should not be able to select an item
    
    // Make sure the UI is ready
    this.scene.uiReady();
  
    // Select item
    this.scene.selectedItem = this; // sprite context
    this.alpha = 0.5; // change transparency of the item selected
  
    console.log('we are picking ' + this.texture.key); // what item is the user picking (sprite's key)
  };
  
  // Set UI to "ready" -> nothing selected
  gameScene.uiReady = function() {
    // Check to see nothing is being selected
    this.selectedItem = null;
  
    // Set all buttons/sprites to alpha 1
    for(let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].alpha = 1;
    }
  
    // Scene is no longer blocked
    this.uiBlocked = false;
  };
  
  // Place/create new item in the game scene
  gameScene.placeItem = function(pointer, localX, localY) {
    console.log(pointer + localX + localY); // Show where the cursor is (use this information for placing items at desired location). This is based on the coords on the bg (not on the scene), which right now is equal since the bg's origin == scene origin
    if(!this.selectedItem) return; // Check that an item was selected
    if(this.uiBlocked) return; // check if the ui is blocked
  
    // Create a new item in player's desired position
    let newItem = this.add.sprite(localX, localY, this.selectedItem.texture.key);
    this.uiBlocked = true; // block the UI
  
    // Pet movement (tween over x,y)
    let petTween = this.tweens.add({
      targets: [this.pet],
      duration: 500,
      x: newItem.x,
      y: newItem.y,
      paused: false,
      callbackScope: this,
      onComplete: function(tween, sprites) {
        // Play spritesheet animation for pet
        newItem.destroy(); // Remove the new item from the game view
        this.pet.on('animationcomplete', function(){ // Listener for when animation ends
          this.pet.setFrame(0);
          this.uiReady(); // Clear ui after one item is placed 
          this.refreshHud();
        }, this);
        this.pet.play('funnyfaces');
  
        // Update pet stats
        this.updateStats(this.selectedItem.customStats);
      },
    });
  };
  
  // Create text elements for HUD
  gameScene.createHud = function(){
    this.healthText = this.add.text(20, 20, 'Health: ', {
      font: '24px Arial',
      fill: '#ffffff',
    });
  
    this.funText = this.add.text(170, 20, 'Fun: ', {
      font: '24px Arial',
      fill: '#ffffff',
    });
  };
  
  // Show current stat values
  gameScene.refreshHud = function(){
   this.healthText.setText('Health: ' + this.stats.health);
   this.funText.setText('Fun: ' + this.stats.fun);
  };
  
  // Stat [decay] updater
  gameScene.updateStats = function(statDiff) {
    // Flag to see if stat < 0 (if gameOver)
    let isGameOver = false;
    
    // Pet stats
    for(stat in statDiff) { 
      if(statDiff.hasOwnProperty(stat)) {  // Check to make sure the item is owned by the object and not inherited from another object (`__proto__`)
        this.stats[stat] += statDiff[stat]; // Goes through each stat (like health, fun) one by one, matching it to the stat of the custom item
  
        if(this.stats[stat] < 0) {
          isGameOver = true;
          this.stats[stat] = 0;
        }
      }
    }
  
    this.refreshHud();
  
    // Call gameOver if true
    if(isGameOver) this.gameOver();
  };
  
  // GameOver loop
  gameScene.gameOver = function() {
    console.log('game over');
    this.uiBlocked = true;
  
    // Change frame of the pet to the dead frame
    this.pet.setFrame(4);
  
    this.timedEventStats.addEvent({
      delay: 2000,
      repeat: 0,
      callback: function() {
        this.scene.start('Home');
      },
      callbackScope: this
    });
  };