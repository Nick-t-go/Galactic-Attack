/**
 * Created by uzer-y on 11/15/15.
 */

WhackaMole.BossLevel1 = function(game) {
    this.boss1;
    this.moleholegroup;
    this.scoreText;
    this.hammer;
    this.ricochet;
    this.pointerSpot = {};
    this.circle;
    this.osExplosion;
    this.hitBox1;
    this.hitBox2;
    this.rectangle;

};

WhackaMole.BossLevel1.prototype = {

    init: function(molesWhacked){
        this.points = molesWhacked
    },

    create: function(){
        this.boss1Music = this.add.audio('boss1Song');
        this.boss1Music.play('',0,3,true);
        this.boom = this.add.audio('explosion_audio');
        this.grumble = this.add.audio('boss1Sound');
        this.buildWorld();
    },


    buildWorld: function() {
        this.bonusPoints = 0;
        this.over = true;
        this.sky = this.add.image(0, 0, 'sky');
        this.sky.tint = 0x002080;
        this.add.image(0, 0, 'stars');
        this.add.image(0, 0, 'land');
        this.moon = this.add.image(40, 40, 'moon');
        this.moon.tint = 0xffd27f;
        this.clouds = this.add.sprite(0, 0, 'clouds');
        this.clouds.anchor.set = (.5);
        this.clouds.animations.add('flow', [0, 1, 2, 3, 4, 5, 6, 7, 8], true);
        this.clouds.animations.play('flow', 2, true);
        this.clouds.tint = 0x666699;
        this.buildMoleHoles();
        this.initBoss1();
        this.darkBG = this.add.image(0,0, 'darkBG');
        this.darkBG.alpha = .8;
        this.scoreText = this.add.text(10, 10, "POINTS " +  this.points);
        this.scoreText.font = 'Press Start 2P';
        this.scoreText.fontWeight = 'bold';
        this.scoreText.fontSize = 20;
        this.scoreText.fill = 'white';
        this.style = { font: "Press Start 2P", fill: "white", fontSize: 25};
        this.ding = this.add.audio('select_audio');
        this.blip = this.add.audio('blip');
        this.input.onDown.add(this.hammerDown, this);
        this.initHeart();
        this.initHitBox();
        this.initMoleHeart();
        this.initScreenFlash();
        this.makeItRain();

    },

    makeItRain: function() {
        this.emitter = this.add.emitter(this.world.centerX, 0, 400);

        this.emitter.width = this.world.width;
        // emitter.angle = 30; // uncomment to set an angle for the rain.

        this.emitter.makeParticles('stars');

        this.emitter.minParticleScale = 0.1;
        this.emitter.maxParticleScale = 0.5;

        this.emitter.setYSpeed(300, 500);
        this.emitter.setXSpeed(-5, 5);

        this.emitter.minRotation = 0;
        this.emitter.maxRotation = 0;

        this.emitter.start(false, 1600, 5, 0);


    },


    initScreenFlash: function(){
        this.bitmap = this.add.bitmapData(this.game.width, this.game.height);
        this.bitmap.ctx.beginPath();
        this.bitmap.ctx.rect(0, 0, this.game.width, this.game.height);
        this.bitmap.ctx.fillStyle = '#ffffff';
        this.bitmap.ctx.fill();
        this.drawnObject = this.add.sprite(this.game.centerX, this.game.centerY, this.bitmap);
        //this.drawnObject.anchor.setTo(.5,.5);
        this.drawnObject.alpha = 0;
    },

    initHitBox: function(){
        this.bmd = this.add.bitmapData(100,100);
        this.bmd.ctx.beginPath();
        this.bmd.ctx.rect(0,0,100,100);
        this.hitBox1 = this.add.sprite(390, 620, this.bmd);
        this.hitBox1.anchor.setTo(.5,.5);
        this.hitBox2 = this.add.sprite(140, 600, this.bmd);
        this.hitBox2.anchor.setTo(.5,.5);
        this.physics.enable(this.hitBox1, Phaser.Physics.ARCADE);
        this.hitBox1.enableBody = true;
        this.hitBox1.inputEnabled=true;
        this.physics.enable(this.hitBox2, Phaser.Physics.ARCADE);
        this.hitBox2.enableBody = true;
        this.hitBox2.inputEnabled=true ;
        this.hitBox1.events.onInputDown.add(this.bangBoom, this);
        this.hitBox1.hit = false;
        this.hitBox2.hit = false;
    },

    initBoss1: function() {
        this.boss1 = this.add.sprite(270,590, 'boss1');
        this.boss1.anchor.setTo(.5,.5);
        this.physics.enable(this.boss1, Phaser.Physics.ARCADE);
        this.boss1.enableBody = true;
        this.boss1.inputEnabled = true;
        this.boss1.bossLoop = this.boss1.animations.add('bossLoop',this.loopArray(15,51));
        this.boss1.bossStart = this.boss1.animations.add('bossStart', this.loopArray(0,51));
        this.boss1.bossStart.play(5,false);
        this.boss1.bossStart.onComplete.add(this.bossAnimationLoop, this);
    },

    bossAnimationLoop: function(boss){
        boss.bossLoop.play(6,true)
    },

    loopArray: function(low, hi){
        var loopArr = [];
        while(low <= hi){
            loopArr.push(low++);
        }
        return loopArr
    },

    initHeart: function(){
        this.heartGroup = this.add.group();
        this.x = 10;
        this.y = 40;
        for(var i = 0; i < 5; i++) {
            this.newHeart = this.heartGroup.create(this.x, this.y, 'heart');
            this.newHeart.anchor.setTo = (0.5,0.5);
            this.y+=40;
        }
    },

    initMoleHeart: function(){
        this.moleHeartGroup = this.add.group();
        this.x = this.game.width - 40;
        this.y = 40;
        for(var i = 0; i < 5; i++) {
            this.newMoleHeart = this.moleHeartGroup.create(this.x, this.y, 'purpleheart');
            this.newMoleHeart.anchor.setTo = (0.5,0.5);
            this.y+=40;
        }
    },


    buildMoleHoles: function(){
        this.moleholegroup = this.add.group();
        this.moleholegroup.enablebody = true;
        var mhA1 = this.moleholegroup.create(90,500, 'molehole');
        var mhA2 =this.moleholegroup.create(90, 715, 'molehole');
        var mhB1 = this.moleholegroup.create(270,430, 'molehole');
        //var mhB2 = this.moleholegroup.create(270,590, 'molehole');
        var mhB3 = this.moleholegroup.create(270,806, 'molehole');
        var mhC1 = this.moleholegroup.create(455,500, 'molehole');
        var mhC2 = this.moleholegroup.create(455,715, 'molehole');
        this.moleholegroup.forEach(function(molehole){
            molehole.anchor.setTo(0.5, 0.5);
        });
    },

    hammerDown: function(pointer) {
        this.pointerSpot.x = pointer.x;
        this.pointerSpot.y = pointer.y;
        this.hammer = this.add.sprite(pointer.x, pointer.y, 'hammer1');
        this.hammer.anchor.setTo(0.5,0.5);
        this.hammer.animations.add('hammerTime');
        this.hammer.animations.play('hammerTime', 15,false, true);

    },

    ricochetAnimation: function(boss){
        this.ricochet = this.add.sprite(this.pointerSpot.x,this.pointerSpot.y, 'ricochet');
        this.ricochet.anchor.setTo(0.5,0.5);
        this.ricochet.animations.add('bounceOff', [0,9,10,11,12,13,14,15,16]);
        this.ricochet.animations.play('bounceOff', 7,false, true);

    },

    bangBoom:function(box){
        box.hit = true;
        this.osExplosion = this.add.sprite(this.pointerSpot.x,this.pointerSpot.y,'osExplode');
        this.osExplosion.scale.x = 5;
        this.osExplosion.scale.y = 5;
        this.osExplosion.anchor.setTo(0.5,0.5);
        this.osExplosion.animations.add('flow', this.loopArray(20,42));
        this.osExplosion.animations.play('flow', 25,false, true);
    },


    flash: function(){
        this.time.events.repeat(25, 40, this.flashingRed, this);
        this.time.events.repeat(100, 20, this.flashingWhite, this);
        this.moleHeartGroup.children.pop()

    },

    flashingRed: function(){
        this.boss1.tint = Math.random() * 0xffffff; //0xff0000;

    },

    flashingWhite: function(){
        this.boss1.tint = 0xffffff;
    },

    screenFlash: function(box){
        this.time.events.repeat(25, 40, this.screenFlashingRed, this);
        this.time.events.repeat(100, 20, this.screenFlashingWhite, this);
        this.heartGroup.children.pop()
    },

    screenFlashingRed: function(){
        this.drawnObject.alpha = .6;
        this.drawnObject.tint = Math.random() * 0xffffff; //0xff0000;

    },

    screenFlashingWhite: function(){
        this.drawnObject.alpha = 0;
        this.drawnObject.tint = 0xffffff;
    },

    bossExplode: function(){
        this.bonusTallyText = this.add.text(this.world.centerX, this.world.centerY,  'Bonus ' + this.bonusPoints, {fontSize:30, fill: "white", align: "center" });
        this.bonusTallyText.font = 'Press Start 2P';
        this.bonusTallyText.anchor.set(0.5);
        this.time.events.repeat(10, 200, this.finalTally, this);
        this.bossExplosion = this.add.sprite(75,350,'osExplode');
        this.bossExplosion.scale.x = 7;
        this.bossExplosion.scale.y = 7;
        this.bossExplosion.anchor.set = (0,0);
        this.bossExplosion1 = this.bossExplosion.animations.add('die', this.loopArray(17,245));
        this.bossExplosion1.onComplete.add(this.screenFlash, this);
        this.bossExplosion1.play(60,false, true);
        this.bossExplosion1.play(45, false, true);
        this.bossExplosion2 = this.bossExplosion.animations.add('die2', this.loopArray(17,200));
        this.bossExplosion2.play(35,false, true);
        this.bossExplosion2.onComplete.add(this.nextLevel, this);
        this.boss1.kill();
        this.screenFlash();
    },


    finalTally: function(textArray){
        if (this.bonusPoints < 10000) {
            this.bonusPoints += 50;
            this.bonusTallyText.text = "Bonus "+ this.bonusPoints;
        }
        this.blip.play();
    },

    nextLevel: function(){
        this.finalPoints = this.points + this.bonusPoints;
        this.scoreText.setText('Final Score ' + this.finalPoints);
        this.overmessage = this.add.bitmapText(this.world.centerX-180, this.world.centerY-80, 'eightbitwonder', 'You Win', 42);
        this.overmessage.inputEnabled = true;
        this.overmessage.events.onInputDown.addOnce(this.quitGame, this);
    },


    playerGameOver: function(){
        this.overmessage = this.add.bitmapText(this.world.centerX-180, this.world.centerY-40, 'eightbitwonder', 'GAME OVER', 42);
        this.overovermessage = this.moleTallyText = this.add.text(this.world.centerX, this.world.centerY-80,'Try Again',  {fontSize:40, fill: "white", align: "center" });
        this.overovermessage.font = 'Press Start 2P';
        this.overovermessage.anchor.set(0.5);
        this.overmessage.inputEnabled = true;
        this.overmessage.events.onInputDown.addOnce(this.quitGame, this);
        this.boss1.laughLoop = this.boss1.animations.add('laughLoop',this.loopArray(27,35));
        this.boss1.bossLoop.stop();
        this.boss1.laughLoop.play(5,true,false)
    },

    quitGame: function(pointer) {
        this.ding.play();
        this.state.start('StartMenu', true, false);
    },

    update: function() {


    if(this.boss1.exists) {
        if (this.boss1.animations.currentFrame.index === 10 || this.boss1.animations.currentFrame.index === 14 || this.boss1.animations.currentFrame.index === 50 || this.boss1.animations.currentFrame.index === 35) {
            this.grumble.play('', 0, .6);
            this.boss1.events.onInputDown.remove(this.ricochetAnimation, this);
            this.boss1.events.onInputDown.add(this.flash, this);
        } else {
            this.boss1.events.onInputDown.remove(this.flash, this);
            this.boss1.events.onInputDown.add(this.ricochetAnimation, this);
        }

        if (this.boss1.animations.currentFrame.index === 24 || this.boss1.animations.currentFrame.index === 44) {
            this.boom.play('', 0, .4);
        }


        if (this.boss1.animations.currentFrame.index === 25) {
            this.hitBox2.events.onInputDown.add(this.bangBoom, this);
        } else {
            this.hitBox2.events.onInputDown.remove(this.bangBoom, this)
        }

        if (this.boss1.animations.currentFrame.index === 45) {
            this.hitBox1.events.onInputDown.add(this.bangBoom, this);
        } else {
            this.hitBox1.events.onInputDown.remove(this.bangBoom, this)
        }

        if (this.boss1.animations.currentFrame.index === 26 && !this.hitBox2.hit) {
            this.hitBox2.hit = true;
            this.screenFlash()
        }

        if (this.boss1.animations.currentFrame.index === 46 && !this.hitBox1.hit) {
            this.hitBox1.hit = true;
            this.screenFlash();
        }

        if (this.boss1.animations.currentFrame.index === 47) {
            this.hitBox1.hit = false;
        }
        if (this.boss1.animations.currentFrame.index === 27) {
            this.hitBox2.hit = false;
        }
    }

        if(this.heartGroup.children.length === 0 && this.over === true){
            this.over = false;
            this.boss1Music.stop();
            this.playerGameOver()
        }

        if(this.moleHeartGroup.children.length === 0 && this.over ===true){
            this.over = false;
            this.boss1Music.stop();
            this.bossExplode();

        }


    }




};