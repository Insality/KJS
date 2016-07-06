'use strict';

var game,
	coins,
	player,
	score,
	scoreText,
	pickup,
	width,
	height;

function initGame(w, h, parent){
	width = w;
	height = h;
	game = new Phaser.Game(w, h, Phaser.AUTO, "game", { preload: preload, create: create, update: update });
};


function preload(){
	var projectFolder = "Coins/"
	game.load.image("back", projectFolder + "assets/back.png");
	game.load.image("player", projectFolder + "assets/player.png");
	game.load.image("coin", projectFolder + "assets/coin.png");

	game.load.audio("pickup", projectFolder + "assets/pickup.wav");

	pickup = this.game.add.audio('pickup', 0.1, false);
};

function toogleFullscreen(){
	if (game.scale.isFullScreen)
	{
		game.scale.stopFullScreen();
	}
	else
	{
		game.scale.startFullScreen(false);
	}
};

function create(){
	game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

	var fKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
	fKey.onDown.add(toogleFullscreen, this);

	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVerticaly = true;
	game.physics.startSystem(Phaser.Physics.ARCADE);
	this.stage.disableVisibilityChange = true;

	game.add.sprite(0, 0, "back");

	coins = game.add.group();
	coins.enableBody = true;

	for (var i = 0; i <= 10; i++) {
		createCoin()
	};

	player = game.add.sprite(game.world.width/2, game.world.height - width/2, 'player');
	player.anchor.setTo(0.5, 0.5);
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.body.collideWorldBounds = true;
	player.body.immovable = true;

	score = 0;
	scoreText = game.add.text(game.world.width/2, 64, 'COINS: 0', { fontSize: '24px', fill:'#444' } );
	scoreText.anchor.setTo(0.5, 0.5);

	var t = game.add.text(0, height-30, 'Press F to toogle fullscreen', { fontSize: '24px', fill:'#444' } );
};

function createCoin(){
	var coin = coins.create(game.rnd.integerInRange(64, width-64), 64, 'coin');
	coin.enableBody = true;
	coin.anchor.setTo(0.5, 0.5);
	coin.body.immovable = true;
	coin.speed = game.rnd.integerInRange(1, 3);
}

function update(){
	updateControl();
	updateCollisions();
	updateLogic();
};


function updateControl(){
	var speed = 5;
	if (player.x < game.input.x)
		player.x += speed;

	if (player.x > game.input.x)
		player.x -= speed;

	if (player.y < game.input.y)
		player.y += speed;

	if (player.y > game.input.y)
		player.y -= speed;
};


function updateLogic(){
	coins.forEach(function(coin){
		coin.y += coin.speed;

		if (coin.y > game.world.height){
			coin.y = 0;
		}
	});
}

function updateCollisions(){
	game.physics.arcade.overlap(player, coins, collectCoin, null,  this);
};


function collectCoin(player, coin){
	coin.kill();
	createCoin();

	score += 1;
	scoreText.text = 'COINS: ' + score;
	pickup.play();
};