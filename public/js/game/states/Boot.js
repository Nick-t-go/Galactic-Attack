var WhackaMole = {};

WhackaMole.Boot = function(game) {};

WhackaMole.Boot.prototype = {
	preload: function() {
		this.load.image('preloaderBar', 'assets/whack_assets/images/loadbar.png');
		this.load.image('titleimage', 'assets/whack_assets/images/newSign.png');
	},

	create: function() {
		this.input.maxPointers = 4;
		this.stage.disableVisibilityChange = false;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.maxWidth = 540;
		this.scale.maxHeight = 960;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.stage.forcePortrait = true;
		//this.scale.setScreenSize(true);

		this.input.addPointer();
		this.stage.backgroundColor = '#ffffff';

		this.state.start('Preloader');
	}
}