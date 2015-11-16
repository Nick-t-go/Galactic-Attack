WhackaMole.Preloader = function(game) {
	this.preloadBar = null;
	this.titleText = null;
	this.ready = false;
};

WhackaMole.Preloader.prototype = {

	preload: function () {
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
		this.titleText = this.add.image(this.world.centerX, this.world.centerY-220, 'titleimage');
		this.titleText.anchor.setTo(0.5, 0.5);
		this.load.image('titlescreen', 'assets/whack_assets/images/newMainMenu.png');
		this.load.bitmapFont('eightbitwonder', 'assets/whack_assets/fonts/eightbitwonder.png', 'assets/whack_assets/fonts/eightbitwonder.fnt');
		this.load.image('land', 'assets/whack_assets/images/newMeadow.png');
		this.load.image('sky', 'assets/whack_assets/images/newSky.png');
		this.load.image('spacemole', 'assets/whack_assets/images/newSpaceMole.png');
		this.load.image('molehole', 'assets/whack_assets/images/newHole.png');
		this.load.image('moon', 'assets/whack_assets/images/moon.png');
		this.load.image('hammer', 'assets/whack_assets/images/hammer.png');
		this.load.image('sun', 'assets/whack_assets/images/newSun.png');
		this.load.image('bomb', 'assets/whack_assets/images/bomb.png');
		this.load.image('stars', 'assets/whack_assets/images/stars.png');
		this.load.image('star1', 'assets/whack_assets/images/star1.png');
		this.load.image('start', 'assets/whack_assets/images/newPressStart.png');
		this.load.image('crosshair', 'assets/whack_assets/images/crosshair.png');
		this.load.image('mole', 'assets/whack_assets/images/newMole.png');
		this.load.atlasJSONHash('mole', 'assets/whack_assets/images/spritesheets/molepop.png', 'assets/whack_assets/images/spritesheets/molepop.json');
		this.load.atlasJSONHash('mole', 'assets/whack_assets/images/spritesheets/molepop.png', 'assets/whack_assets/images/spritesheets/molepop.json');
		this.load.atlasJSONHash('spacemole1', 'assets/whack_assets/images/spritesheets/spacemole.png', 'assets/whack_assets/images/spritesheets/spacemole.json');
		this.load.atlasJSONHash('clouds', 'assets/whack_assets/images/spritesheets/clouds.png', 'assets/whack_assets/images/spritesheets/clouds.json');
		this.load.atlasJSONHash('bombexplode', 'assets/whack_assets/images/spritesheets/explosion.png', 'assets/whack_assets/images/spritesheets/explosion.json');
		this.load.image('explosion', 'assets/whack_assets/images/explosion.png');
		this.load.audio('explosion_audio', 'assets/whack_assets/audio/explosion_audio.mp3');
		this.load.audio('hurt_audio', 'assets/whack_assets/audio/hurt.mp3');
		this.load.audio('select_audio', 'assets/whack_assets/audio/select.mp3');
		this.load.audio('game_audio', 'assets/whack_assets/audio/bgm.mp3');
	},

	create: function () {
		this.preloadBar.cropEnabled = false;
	},

	update: function () {
		if(this.cache.isSoundDecoded('game_audio') && this.ready == false) {
			this.ready = true;
			this.state.start('StartMenu');
		}
	}
};