'use strict';

var game,
	coins,
	player,
	score,
	scoreText,
	pickup;

function initGame(){
	game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });
};

function preload(){
	game.load.image("back", "assets/back.png");
	game.load.image("player", "assets/player.png");
	game.load.image("coin", "assets/coin.png");

	game.load.audio("pickup", "assets/pickup.wav");

	pickup = this.game.add.audio('pickup', 0.1, false);
};


function create(){
	game.physics.startSystem(Phaser.Physics.ARCADE);
	this.stage.disableVisibilityChange = true;

	game.add.sprite(0, 0, "back");
	
	coins = game.add.group();
	coins.enableBody = true;

	for (var i = 0; i <= 10; i++) {
		createCoin()
	};

	player = game.add.sprite(game.world.width/2, game.world.height - 400, 'player');
	player.anchor.setTo(0.5, 0.5);
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.body.collideWorldBounds = true;
	player.body.immovable = true;

	score = 0;
	scoreText = game.add.text(game.world.width/2, 64, 'COINS: 0', { fontSize: '24px', fill:'#444' } );
	scoreText.anchor.setTo(0.5, 0.5);

};

function createCoin(){
	var coin = coins.create(64 + game.rnd.integerInRange(1, 10)*64, 64, 'coin');
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