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
		this.load.image('titlescreen', 'images/newMainMenu.png');
		this.load.bitmapFont('eightbitwonder', 'fonts/eightbitwonder.png', 'fonts/eightbitwonder.fnt');
		this.load.image('land', 'images/newMeadow.png');
		this.load.image('sky', 'images/newSky.png');
		this.load.image('spacemole', 'images/newSpaceMole.png');
		this.load.image('molehole', 'images/newHole.png');
		this.load.image('moon', 'images/moon.png');
		this.load.image('sun', 'images/newSun.png');
		this.load.image('bomb', 'images/bomb.png');
		this.load.image('stars', 'images/stars.png');
		this.load.image('star1', 'images/star1.png');
		this.load.image('start', 'images/newPressStart.png');
		this.load.image('crosshair', 'images/crosshair.png');
		this.load.image('mole', 'images/newMole.png');
		this.load.atlasJSONHash('mole', 'images/spritesheets/molepop.png', 'images/spritesheets/molepop.json');
		this.load.atlasJSONHash('mole', 'images/spritesheets/molepop.png', 'images/spritesheets/molepop.json');
		this.load.atlasJSONHash('spacemole1', 'images/spritesheets/spacemole.png', 'images/spritesheets/spacemole.json');
		this.load.atlasJSONHash('clouds', 'images/spritesheets/clouds.png', 'images/spritesheets/clouds.json');
		this.load.atlasJSONHash('bombexplode', 'images/spritesheets/explosion.png', 'images/spritesheets/explosion.json');
		this.load.image('explosion', 'images/explosion.png');
		this.load.audio('explosion_audio', 'audio/explosion_audio.mp3');
		this.load.audio('hurt_audio', 'audio/hurt.mp3');
		this.load.audio('select_audio', 'audio/select.mp3');
		this.load.audio('game_audio', 'audio/bgm.mp3');
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