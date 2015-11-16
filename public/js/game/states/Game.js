WhackaMole.Game = function(game) {



    this.totalSpacerocks;
    this.moleholegroup;
    this.totalSpacemoles;
    this.spacerockgroup;
    this.bombGroup;
    this.spacemolegroup;
    this.burst;
    this.gameover;
    this.scoreText;
    this.overmessage;
    this.newBomb;
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
    this.timerText;
    this.counter;
    this.hammer;


    this.bmd;

    this.mode;

    this.points;

    this.path;

    this.pi;

    this.roamingSpaceMole;

    this.players = [];

    this.player;
    this.user =  {
        username: null,
        lastbutton: null
    };

    this.socket;


    this.n ;


};





WhackaMole.Game.prototype = {

    create: function() {

        this.counter = 30;
        this.gameover = false;
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
        this.input.onDown.add(this.hammerDown, this);
        this.input.onUp.add(this.hammerUp, this)

        this.timerText = this.add.bitmapText(this.world.width - 75, 20, 'eightbitwonder', 'Time ' + this.counter, 20);

        this.timerText.anchor.setTo(0.5, 0.5);
        this.time.events.loop(Phaser.Timer.SECOND, this.updateTimer, this);

        this.socket = io();

        this.n = nunchuck.init('host', this.socket);

        this.n.onJoin(function(data) {
            this.user = {
                username: data.username,
                lastbutton: []
            };
            console.log(user)
        });
    },

    hammerDown: function(pointer) {
        this.hammer = this.add.sprite(pointer.x, pointer.y, 'hammer')

    },

    hammerUp: function(pointer) {
        this.hammer.kill();

    },


    updateTimer: function() {
        this.counter--;
        if (this.counter >= 1 && !this.gameover){
            this.timerText.setText('Time ' + this.counter)
        } else{
            this.timerText.setText('Time 0');
            this.molesWhacked >= 0 ? this.scoreText.setText('Final Score ' + this.molesWhacked) : this.scoreText.setText('You Suck');
            this.gameover = true;
            this.music.stop();
            this.overmessage = this.add.bitmapText(this.world.centerX-180, this.world.centerY-40, 'eightbitwonder', 'GAME OVER', 42);
            this.overmessage.align = "center";
            this.overmessage.inputEnabled = true;
            this.overmessage.events.onInputDown.addOnce(this.quitGame, this);
        }

    },

    pointUpdate: function(){
        this.scoreText.setText('Moles Whacked ' + this.molesWhacked)
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

        }

    },





    buildWorld: function() {
        this.add.image(0, 0, 'sky');
        this.add.image(0, 0, 'stars');
        this.add.image(0, 0, 'land');
        this.add.image(40, 40, 'sun');
        this.clouds = this.add.sprite(0,0, 'clouds');
        this.clouds.anchor.set = (.5);
        this.clouds.animations.add('flow',[0,1,2,3,4,5,6,7,8], true);
        this.clouds.animations.play('flow', 2, true);


        this.buildMoleHoles();
        this.molesInit();
        this.bombInit();
        this.roamingSpaceMoleInit();


        this.crosshair = this.add.sprite(this.world.centerX,this.world.centerY, 'crosshair');
        this.crosshair.anchor.setTo(0.5,0.5);
        this.physics.arcade.enable(this.crosshair);
        this.crosshair.collideWorldBounds = true;
        this.crosshair.body.maxVelocity.setTo(400, 400);
        this.crosshair.body.collideWorldBounds = true;



        this.buildEmitter();
        this.scoreText = this.add.bitmapText(10, 10, 'eightbitwonder', 'Moles Whacked ' + this.molesWhacked, 20);
    },

    buildMoles: function(a,b){
        console.log("build mole", a, b);
        this.newMole = this.molegroup.create(a,b, 'mole');
        this.newMole.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.newMole, Phaser.Physics.ARCADE);
        this.newMole.enableBody = true;
        this.newMole.inputEnabled = true;
        this.newMole.events.onInputDown.add(this.moleCollision, this);
        this.newMole.animations.add('Up',[1,2,3,4,5,6,5,6,5,6,6,5,4,3,2,1,0,0,0,0,0,0]);
        var random = this.rnd.integerInRange(10, 20);
        this.newMole.animations.play('Up', random, false, true);
        console.log(this.newMole.animations);



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
        this.roamingSpaceMole.inputEnabled = true;
        this.roamingSpaceMole.events.onInputDown.add(this.spacemoleCollision, this);



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
        if (this.molesWhacked > 0){
            this.scoreText.setText('Moles Whacked ' + this.molesWhacked);
        }

    },


    buildEmitter:function() {
        this.burst = this.add.emitter(0, 0, 10);
        this.burst.minParticleScale = 0.3;
        this.burst.maxParticleScale = 1;
        this.burst.minParticleSpeed.setTo(-10, 10);
        this.burst.maxParticleSpeed.setTo(10, -10);
        this.burst.makeParticles('explosion');
        this.input.onDown.add(this.fireBurst, this);
    },

    fireBurst: function(pointer) {
        if(this.gameover == false){
            this.boom.play();
            this.boom.volume = 0.2;
            this.burst.emitX = pointer.x;
            this.burst.emitY = pointer.y;
            this.burst.start(true, 100, null, 1);
        }
    },


    spacemoleCollision: function(sm) {
        if(sm.exists && !this.gameover){
            this.ouch.play();
            this.roamingSpaceMole.kill();
            this.time.events.add(Phaser.Timer.SECOND * 3.5, this.roamingSpaceMoleInit, this);
            this.molesWhacked += 3;
            this.pointsTweener(sm, "500");
        }
    },



    moleCollision: function(m) {
        console.log("mole collision:", m)
        if(m.exists && !this.gameover){
            this.molesWhacked += 1;
            this.ouch.play();
            this.respawn(m);
            //add explostion
            m.kill();
            this.pointsTweener(m, "100");
        }
    },






    respawn: function(item){
        var that = this;
        if(this.gameover == false){
            this.time.events.add(Phaser.Timer.SECOND * 3, function() {
                var randomNum = that.rnd.integerInRange(1, 100);
                randomNum % 2 == 0 ? that.buildMoles(item.x, item.y) :  that.buildBomb(item.x, item.y);
            });
        }

    },

    bombInit: function(){
        this.bombGroup = this.add.group();
        this.bombGroup.enablebody = true;
    },

    buildBomb: function(bombX, bombY){
        console.log("build bomb", bombX, bombY);
        this.newBomb = this.bombGroup.create(bombX, bombY, 'bombexplode');
        this.newBomb.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.newBomb, Phaser.Physics.ARCADE);
        this.newBomb.enableBody = true;
        this.newBomb.inputEnabled = true;
        this.newBomb.events.onInputDown.add(this.bombCollision, this);
        this.newBomb.animations.add('grow', [1,2,3,4,5,6,7,5,6,5,7,6,5,4,3,2,1]);
        this.newBomb.animations.add('baboom', [13,14,15]);

        this.newBomb.animations.play('grow',10, false, true);
    },




    bombCollision: function(b) {

        if(b.exists && !this.gameover){
            b.animations.play('baboom', 4, false, true);
            console.log('bomb collision:', b.x, b.y, this.burst.x, this.burst.y);
            //console.log("burst", this.burst.emit.x, this.burst.emit.y, "bomb:", b.x, b.y);
            this.molesWhacked -= 2;
            //this.pointUpdate();
            this.ouch.play();
            this.respawn(b);
            this.pointsTweener(b, "BAD");

        }

    },

    quitGame: function(pointer) {
        this.ding.play();
        this.state.start('StartMenu');
    },



    update: function() {
        var that = this;

        this.n.receive(function(data){
            that.user.lastbutton = data.buttons[0];
        });



        if(!this.gameover && this.roamingSpaceMole) {

            this.roamingSpaceMole.x = this.path[this.pi].x;
            this.roamingSpaceMole.y = this.path[this.pi].y;

            this.pi += 4;

            if (this.pi >= this.path.length && !this.gameover) {
                this.changeMode();
                this.pi = 0;
            }
        }

        if (this.user.lastbutton === "LEFT" ) {
            this.crosshair.body.velocity.x = -400;
        }
        else if (this.user.lastbutton === "RIGHT") {
            this.crosshair.body.velocity.x = 400;
        } else {this.crosshair.body.velocity.x = 0}

        if (this.user.lastbutton === "UP") {
            // The speed we'll travel at
            this.crosshair.body.velocity.y = -400;
        } else if
        (this.user.lastbutton === "DOWN") {
            this.crosshair.body.velocity.y = 400;
        } else {this.crosshair.body.velocity.y = 0}

        if (this.user.lastbutton === "A" )
        {
            this.fireBurst(this.crosshair);
        }

        //this.pointUpdate.call(this);

        if(this.bombGroup) {
            this.bombGroup.forEach(function (bomb) {
                if(bomb.animations.currentAnim.name === "grow" && bomb.animations.currentAnim.isFinished === true){
                    bomb.destroy();
                    that.respawn(bomb);
                    bomb.kill();
                }

            });
        }



        if(this.molegroup) {
            this.molegroup.forEach(function (mole) {
                if(mole.animations.currentAnim.isFinished == true ){
                    mole.destroy();
                    that.respawn(mole);
                    mole.kill();
                }

            });
        }

    }

};