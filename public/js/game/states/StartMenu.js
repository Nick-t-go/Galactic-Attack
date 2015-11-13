WhackaMole.StartMenu = function(game) {
    this.startBG;
    this.startPrompt;
	this.emitter = null;
};

WhackaMole.StartMenu.prototype = {

	create: function () {



		this.startBG = this.add.image(0, 0 , 'titlescreen');
		this.startBG.inputEnabled = true;
		this.startBG.events.onInputDown.addOnce(this.startGame, this);

		this.emitter = this.add.emitter(this.world.centerX, 400);
		this.emitter.makeParticles('bomb');
		this.emitter.setXSpeed(-200, 200);
		this.emitter.setYSpeed(-150, -250);
		this.emitter.gravity = 300;
		this.emitter.flow(5000, 500, 1, -1);

		this.startPrompt = this.add.image(this.world.centerX-125, -this.world.centerY -200, 'start');//this.add.bitmapText(this.world.centerX-155, -180, 'eightbitwonder', 'Touch to Start', 24);
		this.add.tween(this.startPrompt).to( { y: this.world.centerY + 300 }, 4000, Phaser.Easing.Bounce.Out, true);



		//this.input.onDown.addOnce(this.back, this);
	},

	startGame: function (pointer) {
		this.state.start('Game');
	}
};