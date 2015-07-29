var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update});

var fruits;
var pacman;
var monsters;
var score = 0;
var scoreText;

var startButton;
var gameStarted = false;

var fireRate = 100;
var nextFire = 0;

var monsterRate = 1000;
var nextMonster = 0;

function preload() {

    game.load.spritesheet('ghost_red', 'img/ghost_red.png', 20, 20);
    game.load.spritesheet('start_button', 'img/button.png', 100, 40);
    game.load.spritesheet('start_button_animation', 'img/startbuttonsprites.png', 100, 40);
    game.load.spritesheet('pacman', 'img/pacman.png', 20, 20);
    game.load.image('fruit', 'img/fruit.png');

}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 100;

    // SCORE
    scoreText = game.add.text(game.world.centerX, 10, "Score: "+ score, {font: "16px Arial", fill: "#ffffff"});
    scoreText.anchor.set(0.5);

    // BUTTON
    startButtonAnimation = game.add.sprite(game.world.centerX, game.world.centerY, 'start_button_animation');
    startButtonAnimation.anchor.set(0.5, 0.5);
    startButtonAnimation.animations.add('anim', [0,1,2,4], 5, false);
    startButton = game.add.button(game.world.centerX, game.world.centerY, 'start_button', startButtonClicked, this, 1, 0, 1);
    startButton.anchor.set(0.5, 0.5);


    // MONSTERS
    monsters = game.add.group();
    monsters.enableBody = true;
    monsters.physicsBodyType = Phaser.Physics.ARCADE;

    monsters.createMultiple(50, 'ghost_red');
    monsters.setAll('checkWorldBounds', true);
    monsters.setAll('outOfBoundsKill', true);
    monsters.callAll('animations.add', 'animations', 'look', [0,1,6,7,2,3,4,5], 5, true);
    monsters.callAll('animations.play', 'animations', 'look');

    // FRUITS
    fruits = game.add.group();
    fruits.enableBody = true;
    fruits.physicsBodyType = Phaser.Physics.ARCADE;

    fruits.createMultiple(50, 'fruit');
    fruits.setAll('checkWorldBounds', true);
    fruits.setAll('outOfBoundsKill', true);
    fruits.setAll('body.allowGravity', false);

    // PACMAN
    pacman = game.add.sprite(game.world.centerX, 590, 'pacman');
    pacman.anchor.set(0.5);
    pacman.frame = 3;
    pacman.animations.add('eat', [2,3,4], 10, false);

    game.physics.arcade.enable([pacman, monsters]);

    pacman.body.allowGravity = false;
}

function update() {
    game.physics.arcade.collide(fruits, monsters, explode);

    pacman.rotation = game.physics.arcade.angleToPointer(pacman);
    scoreText.text = 'Score: '+ score;

    if( gameStarted ) {
        if(game.input.activePointer.isDown) {
            fire();
            pacman.animations.play('eat');
        }

        spawmMonster();
    }
}

function spawmMonster() {
    if(game.time.now > nextMonster && monsters.countDead() > 0) {
        nextMonster = game.time.now + monsterRate;

        var monster = monsters.getFirstDead();

        monster.reset(game.world.randomX,10);
    }
}

function fire() {
    if(game.time.now > nextFire && fruits.countDead() > 0 ) {
        nextFire = game.time.now + fireRate;

        var fruit = fruits.getFirstDead();

        fruit.reset(pacman.x - 8, pacman.y - 8);

        game.physics.arcade.moveToPointer(fruit, 300);

    }
}

function explode(fruit, monster) {
    fruit.kill();
    monster.kill();
    score++;
}

function startButtonClicked() {
    startButton.destroy();
    startButtonAnimation.animations.play('anim');
    setTimeout(startGame, 1000);
}

function startGame() {
    startButtonAnimation.destroy();
    gameStarted = true;
}