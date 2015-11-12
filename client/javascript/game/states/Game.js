WhackaMole.Game = function(game) {



    this.totalSpacerocks;
    this.moleholegroup;
    this.totalSpacemoles
    this.spacerockgroup;
    this.bombGroup;
    this.spacemolegroup;
    this.burst;
    this.gameover;
    this.countdown;
    this.overmessage;
    this.newBomb;
    this.secondsElapsed;
    this.timer;
    this.music;
    this.ouch;
    this.boom;
    this.ding;
    this.molegroup;
    this.hole;
    this.crosshair;
    this.currentSpeed;
    this.emitter;
    this.molesWhacked;
    this.pausedText;
    this.points;
    this.pointsTween;
    this.animationReference;
    this.bomb;
    this.newMole;
    this.newBomb;

    this.bmd;

    this.mode;

    this.points;

    this.path;

    this.pi;

    this.roamingSpaceMole;

    this.players = [];
    this.n;
    this.player;
    //this.user =  {
    //    username: null,
    //    lastbutton: []
    //};
    //
    //this.socket;
    //
    //
    //this.n ;


};




WhackaMole.Game.prototype = {

    create: function() {


        this.gameover = false;
        this.secondsElapsed = 0;
        this.timer = this.time.create(false);
        this.timer.loop(1000, this.updateSeconds, this);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.music = this.add.audio('game_audio');
        this.music.play('', 0, 0.3, true);
        this.ouch = this.add.audio('hurt_audio');
        this.boom = this.add.audio('explosion_audio');
        this.ding = this.add.audio('select_audio');
        this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
        this.currentSpeed = 0;
        this.totalSpacemoles = 30;
        this.molesWhacked = 0;


        this.buildWorld();
        this.makeItRain();

        this.socket = io();


        //this.n = nunchuck.init('host', socket);
        //$(document).ready(function(){
        //    $('.code').text(n.roomId)
        //});
        //
        //
        //this.n.onJoin(function(data) {
        //    this.user = {
        //        username: data.username,
        //        lastbutton: []
        //    }
        //
        //    console.log(user)
        //});




    },

    pointUpdate: function(){
        this.countdown.setText('Moles Whacked ' + this.molesWhacked)
    },

    updateSeconds: function() {
        this.secondsElapsed++;

    },

    changeMode: function () {

        this.mode++;

        if (this.mode === 3)
        {
            this.mode = 0;
        }


        this.plot();

    },


    plot: function () {

        this.bmd.clear();

        this.path = [];

        var x = 1 / this.world.width;

        for (var i = 0; i <= 1; i += x)
        {
            if (this.mode === 0)
            {
                var px = this.math.linearInterpolation(this.points.x, i);
                var py = this.math.linearInterpolation(this.points.y, i);
            }
            else if (this.mode === 1)
            {
                var px = this.math.bezierInterpolation(this.points.x, i);
                var py = this.math.bezierInterpolation(this.points.y, i);
            }
            else if (this.mode === 2)
            {
                var px = this.math.catmullRomInterpolation(this.points.x, i);
                var py = this.math.catmullRomInterpolation(this.points.y, i);
            }

            this.path.push( { x: px, y: py });

            //this.bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');
        }

        //for (var p = 0; p < this.points.x.length; p++)
        //{
        //    this.bmd.rect(this.points.x[p]-3, this.points.y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
        //}

    },





    buildWorld: function() {
        this.add.image(0, 0, 'sky');
        this.add.image(0, 0, 'stars');
        this.add.image(0, 0, 'land');
        this.add.image(40, 40, 'sun');

        this.buildMoleHoles();
        this.molesInit();
        this.bombInit();
        this.roamingSpaceMoleInit();
        //this.spacemoleInit();


        this.crosshair = this.add.sprite(this.world.centerX,this.world.centerY, 'crosshair');
        this.crosshair.anchor.setTo(0.5,0.5);
        this.physics.arcade.enable(this.crosshair);
        this.crosshair.collideWorldBounds = true;
        this.crosshair.body.maxVelocity.setTo(400, 400);
        this.crosshair.body.collideWorldBounds = true;



        this.buildEmitter();
        this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Moles Whacked ' + this.molesWhacked, 20);
        this.timer.start();
    },

    buildMoles: function(a,b){
        this.newMole = this.molegroup.create(a,b, 'mole');
        this.newMole.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.newMole, Phaser.Physics.ARCADE);
        this.newMole.enableBody = true;
        this.newMole.animations.add('Up',[1,2,3,4,5,6,5,6,5,6,6,5,4,3,2,1,0,0,0,0,0,0]);
        var random = this.rnd.integerInRange(10, 20);
        this.newMole.animations.play('Up', random, true);



    },

    molesInit: function() {
        this.molegroup = this.add.group();
        this.molegroup.enablebody = true;
        this.buildMoles(87,440);
        this.buildMoles(87,640);
        this.buildMoles(273,370);
        this.buildMoles(273,540);
        this.buildMoles(273,775);
        this.buildMoles(450,440);
        this.buildMoles(450,660);

    },





    //resetSpacemole: function(sm) {
    //    if(sm.y > this.world.height || sm.x > this.world.width) {
    //        this.respawnSpacemole(sm);
    //    }
    //},

    roamingSpaceMoleInit: function() {
        this.bmd = null;

        this.mode = 0;

        this.points = {
            'x': [ 32, 128, 256, 384, 512, 608 ],
            'y': [ 200, 240, 200, 200, 200, 240 ]
        };

        this.path = [];

        this.pi = 0;



        this.roamingSpaceMole = this.add.sprite(0, 0, 'spacemole1');
        this.roamingSpaceMole.anchor.set(0.5);
        this.physics.enable(this.roamingSpaceMole, Phaser.Physics.ARCADE);
        this.roamingSpaceMole.enableBody = true;
        this.roamingSpaceMole.animations.add('Move',[0,1,2,3,4]);
        //var random = this.rnd.integerInRange(1, 4);
        this.roamingSpaceMole.animations.play('Move',1, true);



        this.bmd = this.add.bitmapData(this.world.width, this.world.height);
        this.bmd.addToWorld();

        var py = this.points.y;

        for (var i = 0; i < py.length; i++)
        {
            py[i] = this.rnd.between(32, 432);
        }

        this.plot();
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

    paused: function () {

        if (this.pausedText)
        {
            this.pausedText.visible = true;
        }
        else
        {
            this.pausedText = this.add.bitmapText(this.world.centerX-100, this.world.centerY, 'eightbitwonder', 'PAUSED', 40);

            this.stage.addChild(this.pausedText);
        }

    },

    resumed: function () {

        this.pausedText.visible = false;

    },




    pointsTweener: function(kill, kScore){
        this.pointScore = this.add.bitmapText(kill.x, kill.y, 'eightbitwonder', kScore, 20);
        this.add.tween(this.pointScore).to({ alpha: 0}, 2000, Phaser.Easing.Linear.None, true);

    },


    buildEmitter:function() {
        this.burst = this.add.emitter(0, 0, 80);
        this.burst.minParticleScale = 0.3;
        this.burst.maxParticleScale = 1.2;
        this.burst.minParticleSpeed.setTo(-30, 30);
        this.burst.maxParticleSpeed.setTo(30, -30);
        this.burst.makeParticles('explosion');
        this.input.onDown.add(this.fireBurst, this);
    },

    fireBurst: function(pointer) {
        if(this.gameover == false){
            this.boom.play();
            this.boom.volume = 0.2;
            this.burst.emitX = pointer.x;
            this.burst.emitY = pointer.y;
            this.burst.start(true, 2000, null, 10);
        }
    },


    spacemoleCollision: function(sm) {
        if(sm.exists){
            this.ouch.play();
            this.roamingSpaceMole.kill();
            this.time.events.add(Phaser.Timer.SECOND * 3, this.roamingSpaceMoleInit, this);
            //add explostion
            this.pointsTweener(sm, "500");
            this.molesWhacked += 5;
        }
    },



    moleCollision: function(m) {
        if(m.exists){
            this.molesWhacked += 1;
            this.ouch.play();
            this.respawnMole(m);
            //add explostion
            m.kill();
            this.pointsTweener(m, "100");
        }
    },






    respawnMole: function(m){
        var that = this;
        if(this.gameover == false){
            this.time.events.add(Phaser.Timer.SECOND * 3, function() {
                var random = that.rnd.integerInRange(1, 100);
                random % 2 == 0 ? that.buildMoles(m.x, m.y) : that.buildBomb(m.x, m.y);
            });
        }

    },

    bombInit: function(){
        this.bombGroup = this.add.group();
        this.bombGroup.enablebody = true;
    },

    buildBomb: function(c, d){
        this.newBomb = this.bombGroup.create(c,d, 'bombexplode');
        this.newBomb.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.newBomb, Phaser.Physics.ARCADE);
        this.newBomb.enableBody = true;
        this.newBomb.animations.add('grow', [1,2,3,4,5,6,7,5,6,5,7]);
        // newBomb.animations.add('baboom', [13,14,15]);
        this.newBomb.animations.play('grow',4, true);
    },




    bombCollision: function(b) {
        this.pointsTweener(b, "BAD");
        if(b.exists){
            this.molesWhacked -= 2;
            //this.pointUpdate();
            this.ouch.play();
            this.respawnMole(b);
            b.kill();
            this.pointsTweener(b, "BAD");

        }

    },





    update: function() {

        //this.n.receive(function(data){
        //    this.user.lastbutton.unshift(data.buttons[0])
        //    if(this.user.lastbutton.length > 5) {this.user.lastbutton.pop()}
        //});


        var that = this;

        if(this.roamingSpaceMole) {

            this.roamingSpaceMole.x = this.path[this.pi].x;
            this.roamingSpaceMole.y = this.path[this.pi].y;

            this.pi += 3;

            if (this.pi >= this.path.length) {
                this.changeMode();
                this.pi = 0;
            }
        }

        if (this.cursors.left.isDown ) {
            this.crosshair.body.velocity.x = -200;
        }
        else if (this.cursors.right.isDown) {
            this.crosshair.body.velocity.x = 200;
        } else {this.crosshair.body.velocity.x = 0}

        if (this.cursors.up.isDown) {
            // The speed we'll travel at
            this.crosshair.body.velocity.y = -200;
        } else if
        (this.cursors.down.isDown) {
            this.crosshair.body.velocity.y = 200;
        } else {this.crosshair.body.velocity.y = 0}

        if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            this.fireBurst(this.crosshair);
        }

        //this.pointUpdate.call(this);

        if(this.bombGroup) {
            this.bombGroup.forEach(function (bomb) {
                if(bomb.animations.currentAnim.loopCount == 1 ){
                    bomb.destroy();
                    that.respawnMole(bomb);
                }

            });
        }

        if(this.molegroup) {
            this.molegroup.forEach(function (mole) {
                if(mole.animations.currentAnim.loopCount == 1 ){
                    mole.destroy();
                    that.respawnMole(mole);
                }

            });
        }

        if((this && this.countdown) && this.molesWhacked) {
            try{
                this.countdown.setText('Moles Whacked ' + this.molesWhacked)
            }
            catch(err){
                console.log(err);
            }
        }



        this.physics.arcade.overlap(this.molegroup, this.burst, this.moleCollision, null, this);
        this.physics.arcade.overlap(this.bombGroup, this.burst, this.bombCollision, null, this);
        this.physics.arcade.overlap(this.roamingSpaceMole, this.burst, this.spacemoleCollision, null, this);
    }


};