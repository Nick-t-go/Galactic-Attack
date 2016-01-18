/**
 * Created by uzer-y on 11/15/15.
 */

WhackaMole.BossLevel1 = function(game) {
    this.boss1;
    this.moleholegroup;
    this.scoreText;
    this.hammer;
    this.ricochet;

};

WhackaMole.BossLevel1.prototype = {

    init: function(molesWhacked){
        this.points = molesWhacked
    },

    create: function(){

        this.buildWorld();
    },


    buildWorld: function() {
        this.add.image(0, 0, 'sky');
        this.add.image(0, 0, 'stars');
        this.add.image(0, 0, 'land');
        this.add.image(40, 40, 'sun');
        this.clouds = this.add.sprite(0, 0, 'clouds');
        this.clouds.anchor.set = (.5);
        this.clouds.animations.add('flow', [0, 1, 2, 3, 4, 5, 6, 7, 8], true);
        this.clouds.animations.play('flow', 2, true);
        this.buildMoleHoles();
        this.initBoss1();
        this.scoreText = this.add.text(10, 10, "POINTS " +  this.points);
        this.scoreText.font = 'Press Start 2P';
        this.scoreText.fontWeight = 'bold';
        this.scoreText.fontSize = 20;
        this.scoreText.fill = 'white';
        this.style = { font: "Press Start 2P", fill: "white", fontSize: 25}
        this.input.onDown.add(this.hammerDown, this);
    },

    initBoss1: function() {
        this.boss1 = this.add.sprite(270,590, 'boss1');
        this.boss1.anchor.setTo(.65,.8);
        this.physics.enable(this.boss1, Phaser.Physics.ARCADE);
        this.boss1.enableBody = true;
        this.boss1.inputEnabled = true;
        this.boss1.events.onInputDown.add(this.ricochetAnimation, this);
        this.boss1.animations.add('bossLoop');
        this.boss1.animations.play('bossLoop', 3, true);
    },


    buildMoleHoles: function(){
        this.moleholegroup = this.add.group();
        this.moleholegroup.enablebody = true;
        var mhA1 = this.moleholegroup.create(90,500, 'molehole');
        var mhA2 =this.moleholegroup.create(90, 715, 'molehole');
        var mhB1 = this.moleholegroup.create(270,430, 'molehole');
        var mhB2 = this.moleholegroup.create(270,590, 'molehole');
        var mhB3 = this.moleholegroup.create(270,806, 'molehole');
        var mhC1 = this.moleholegroup.create(455,500, 'molehole');
        var mhC2 = this.moleholegroup.create(455,715, 'molehole');
        this.moleholegroup.forEach(function(molehole){
            molehole.anchor.setTo(0.5, 0.5);
        });
    },

    hammerDown: function(pointer) {
        this.hammer = this.add.sprite(pointer.x, pointer.y, 'hammer1');
        this.hammer.anchor.setTo(0.5,0.5);
        this.hammer.animations.add('hammerTime');
        this.hammer.animations.play('hammerTime', 15,false, true);
    },

    ricochetAnimation: function(el){
        this.ricochet = this.add.sprite(el.x,el.y, 'ricochet');
        this.ricochet.anchor.setTo(0.5,0.5);
        this.ricochet.animations.add('bounceOff', [9,10,11,12,13,14,15,16]);
        this.ricochet.animations.play('bounceOff', 10,false, true);

    }



};