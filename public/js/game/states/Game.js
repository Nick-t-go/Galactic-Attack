WhackaMole.Game = function(game) {



    this.totalSpacerocks;
    this.moleholegroup;
    this.totalSpacemoles;
    this.spacerockgroup;
    this.bombGroup;
    this.spacemolegroup;
    this.burst;
    this.gameover;
    this.newSnake;
    this.snakegroup;
    this.scoreText;
    this.overmessage;
    this.newBomb;
    this.music;
    this.ouch;
    this.blip;
    this.boom;
    this.max;
    this.ding;
    this.molegroup;
    this.hole;
    this.crosshair;
    this.currentSpeed;
    this.emitter;
    this.molesWhacked;
    this.num1;
    this.num2;
    this.num3;
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
    this.displayText;
    this.killTally = {
        mole: null,
        bomb: null,
        spacemole: null,
        lastkilled: null
    };

    this.bmd;
    this.text;

    this.mode;
    this.multiplyer;

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
    this.managerMole
    this.osExplosion;


};





WhackaMole.Game.prototype = {

    create: function() {
        this.multiplyer = 1;
        this.counter = 30;
        this.gameover = false;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.music = this.add.audio('game_audio');
        this.music.play('', 0, 0.2, true);
        this.ouch = this.add.audio('hurt_audio');
        this.boom = this.add.audio('explosion_audio');
        this.ding = this.add.audio('select_audio');
        this.blip = this.add.audio('blip');
        this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
        this.currentSpeed = 0;
        this.totalSpacemoles = 30;
        this.molesWhacked = 0;
        this.killTally.mole = 0;
        this.killTally.bomb = 0;
        this.killTally.spacemole = 0;
        this.killTally.lastkilled = null;
        this.num = 1;
        this.num1 = 0;
        this.num2 = 0;
        this.num3 = 0;

        this.buildWorld();
        this.input.onDown.add(this.hammerDown, this);
        //this.input.onUp.add(this.hammerUp, this)

        this.timerText = this.add.bitmapText(this.world.width - 75, 20, 'eightbitwonder', 'Time ' + this.counter, 20);

        this.timerText.anchor.setTo(0.5, 0.5);
        this.time.events.repeat(Phaser.Timer.SECOND, this.counter, this.updateTimer, this);

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
        this.hammer = this.add.sprite(pointer.x, pointer.y, 'hammer1');
        this.hammer.anchor.setTo(0.5,0.5);
        this.hammer.animations.add('hammerTime');
        this.hammer.animations.play('hammerTime', 15,false, true);
    },


    updateTimer: function() {
        this.counter--;
        if (this.counter >= 1 && !this.gameover) {
            this.timerText.setText('Time ' + this.counter)
        } else {
            this.gameOverSequence();
        }
    },

    gameOverSequence: function(){
        this.timerText.setText('Time 0');
        this.molesWhacked >= 0 ? this.scoreText.setText('Final Score ' + this.molesWhacked) : this.scoreText.setText('You Suck');
        this.gameover = true;
        this.music.stop();
        this.overmessage = this.add.bitmapText(this.world.centerX-180, this.world.centerY-40, 'eightbitwonder', 'GAME OVER', 42);
        this.overovermessage = this.moleTallyText = this.add.text(this.world.centerX, this.world.centerY-80,'Try Again',  {fontSize:40, fill: "white", align: "center" });
        this.overovermessage.font = 'Press Start 2P';
        this.overovermessage.anchor.set(0.5);
        this.molesWhacked > 0 ? this.overovermessage.text = 'Enter': this.overovermessage.text = 'Try Again';
        this.molesWhacked > 0 ? this.overmessage.text = 'Boss Level': this.overmessage.text = 'Game Over';
        this.moleTallyText = this.add.text(this.world.centerX, this.world.centerY + 25, this.num1 + ' Moles Killed ',  {fontSize:20, fill: "white", align: "center" });
        this.moleTallyText.font = 'Press Start 2P';
        this.moleTallyText.anchor.set(0.5);
        this.spacemoleTallyText = this.add.text(this.world.centerX, this.world.centerY + 65,  this.num2 + ' Spacemoles Killed', { fontSize:20, fill: "white", align: "center" });
        this.spacemoleTallyText.font = 'Press Start 2P';
        this.spacemoleTallyText.anchor.set(0.5);
        this.bombTallyText = this.add.text(this.world.centerX, this.world.centerY + 105,  this.num3 + ' Bombs Destroyed', {fontSize:20, fill: "white", align: "center" });
        this.bombTallyText.font = 'Press Start 2P';
        this.bombTallyText.anchor.set(0.5);
        this.max = Math.max(this.killTally.mole, this.killTally.bomb, this.killTally.spacemole);
        this.time.events.repeat(100, this.max, this.finalTally, this);
        this.overovermessage.align = "center";
        this.overmessage.align = "center";
        this.overmessage.inputEnabled = true;
        this.overmessage.events.onInputDown.addOnce(this.quitGame, this);
    },

    finalTally: function(textArray){
        if (this.num <= this.killTally.mole) {
            this.num1 = this.num;
            this.moleTallyText.text = this.num1 + ' Moles Killed ';
        }
        if (this.num <= this.killTally.spacemole) {
            this.num2 = this.num;
            this.spacemoleTallyText.text = this.num2 + ' Spacemoles Killed';
        }
        if (this.num <= this.killTally.bomb) {
            this.num3 = this.num;
            this.bombTallyText.text = this.num3 + ' Bombs Destroyed';
        }
        this.blip.play();
        this.num++
    },

    pointUpdate: function(){
        this.scoreText.setText('Points ' + this.molesWhacked)
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

        this.snakeInit();
        this.buildMoleHoles();
        this.molesInit();
        this.bombInit();
        this.roamingSpaceMoleInit();


        //this.crosshair = this.add.sprite(this.world.centerX,this.world.centerY, 'crosshair');
        //this.crosshair.anchor.setTo(0.5,0.5);
        //this.physics.arcade.enable(this.crosshair);
        //this.crosshair.collideWorldBounds = true;
        //this.crosshair.body.maxVelocity.setTo(400, 400);
        //this.crosshair.body.collideWorldBounds = true;

        this.buildEmitter();

        this.scoreText = this.add.text(10, 10, "POINTS " + this.molesWhacked);
        this.scoreText.font = 'Press Start 2P';
        this.scoreText.fontWeight = 'bold';
        this.scoreText.fontSize = 20;
        this.scoreText.fill = 'white';

        this.style = { font: "Press Start 2P", fill: "white", fontSize: 25}


    },

    buildMoles: function(a,b){
        this.newMole = this.molegroup.create(a,b, 'mole');
        this.newMole.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.newMole, Phaser.Physics.ARCADE);
        this.newMole.enableBody = true;
        this.newMole.inputEnabled = true;
        this.newMole.events.onInputDown.add(this.moleCollision, this);
        this.newMole.upAnimation = this.newMole.animations.add('Up',[0,0,1,1,2,2,3,3,4,4,5,5,5,5,4,4,3,3,2,2,1,1,0,0]);
        this.newMole.upAnimation.onComplete.add(this.respawn, this);
        //this.newMole.dieAnimation = this.newMole.animations.add('moledie',[7,8,9,10,11,12,13,14,15]);
        //this.newMole.dieAnimation.onComplete.add(this.respawn, this);
        var random = this.rnd.integerInRange(10, 20);
        this.newMole.upAnimation.play(random, false, true);

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

    moleCollision: function(m) {
        if(m.exists && !this.gameover){
            this.killTally.lastkilled = m;
            this.killTally.mole ++;
            m.inputEnabled=false;
            m.loadTexture('alienmoledie',0);
            m.dieAnimation = m.animations.add('moledie',[7,8,9,10,11,12,13,14,15]);
            m.dieAnimation.onComplete.add(this.respawn, this);
            m.dieAnimation.play(20, false, true);
            this.molesWhacked += (100 * this.multiplyer);
            this.ouch.play();
            //add explostion
            this.pointsTweener(m, 100);
        }
    },

    bombInit: function(){
        this.bombGroup = this.add.group();
        this.bombGroup.enablebody = true;
    },

    buildBomb: function(bombX, bombY){
        this.newBomb = this.bombGroup.create(bombX, bombY, 'bombexplode');
        this.newBomb.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.newBomb, Phaser.Physics.ARCADE);
        this.newBomb.enableBody = true;
        this.newBomb.inputEnabled = true;
        this.newBomb.events.onInputDown.add(this.bombCollision, this);
        this.newBomb.growAnimation = this.newBomb.animations.add('grow', [1,2,3,4,5,6,7,5,6,5,7,6,5,4,3,2,1]);
        this.newBomb.baboomAnimation = this.newBomb.animations.add('baboom', [13,14,15]);
        this.newBomb.baboomAnimation.onComplete.add(this.respawn,this);
        this.newBomb.growAnimation.onComplete.add(this.respawn,this);
        this.newBomb.growAnimation.play(10, false, true);

    },

    bombCollision: function(b) {

        if(b.exists && !this.gameover){
            this.killTally.lastkilled = b;
            this.killTally.bomb++;
            b.inputEnabled = false;
            b.baboomAnimation.play(4, false, true);
            this.molesWhacked -= 200;
            //this.pointUpdate();
            this.ouch.play();
            this.pointsTweener(b, false);

        }

    },

    snakeInit: function(){
        this.snakegroup = this.add.group();
        this.snakegroup.enablebody = true;
        this.buildSnake(200,this.world.height - 40)
    },

    buildSnake: function(snakeX, snakeY){
        this.newSnake = this.snakegroup.create(-10,615, 'snake1');
        this.newSnake.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.newSnake, Phaser.Physics.ARCADE);
        this.newSnake.enableBody = true;
        this.newSnake.inputEnabled = true;
        this.newSnake.animations.add('wiggle');
        //this.newSnake.animations.play('wiggle',6, true);


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
        this.displayText = "Bad";
        if (kScore!=false && this.killTally.lastkilled.key == "alienmoledie") {
            this.displayText = (kScore * this.multiplyer).toString();
            this.multiplyer++;
            console.log(this.displayText)
        }else if(this.killTally.lastkilled.key == "spacemole1"){
            this.displayText = "200"
        } else {
            this.multiplyer = 1;
        }
        this.pointScore = this.add.bitmapText(kill.x, kill.y, 'eightbitwonder', this.displayText, 20);
        this.add.tween(this.pointScore).to({ alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
        if (this.molesWhacked > 0){
            this.scoreText.setText('Points ' + this.molesWhacked);
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
            this.killTally.lastkilled = sm;
            this.killTally.spacemole ++;
            this.ouch.play();
            this.osExplosion = this.add.sprite(sm.x - 40,sm.y - 10,'osExplode');
            this.osExplosion.scale.x = 2;
            this.osExplosion.scale.y = 2;
            //this.osExplosion.anchor.set = (0,0);
            this.osExplosion.animations.add('flow', this.loopArray(206,245));
            this.osExplosion.animations.play('flow', 30,false, true);
            this.roamingSpaceMole.kill();
            this.time.events.add(Phaser.Timer.SECOND * 5, this.roamingSpaceMoleInit, this);
            this.molesWhacked += 200;
            this.pointsTweener(sm, 200);
        }
    },

    loopArray: function(low, hi){
        var loopArr = [];
        while(low <= hi){
            loopArr.push(low++);
        }
        return loopArr
    },

    respawn: function(item){
        item.kill();
        var that = this;
        if(this.gameover == false){
            this.time.events.add(Phaser.Timer.SECOND * 3, function() {
                var randomNum = that.rnd.integerInRange(1, 100);
                randomNum % 2 == 0 ? that.buildMoles(item.x, item.y) :  that.buildBomb(item.x, item.y);
            });
        }

    },



    quitGame: function(pointer) {
        if(this.molesWhacked > 0){
            this.ding.play();
            this.state.start('BossLevel1', true, false, this.molesWhacked);
        } else {
            this.ding.play();
            this.state.start('StartMenu', true, false, this.molesWhacked);
        }
    },



    update: function() {
        var that = this;

        this.n.receive(function(data){
            that.user.lastbutton = data.buttons[0];
        });

        if (this.newSnake.x <= 120) {
            this.newSnake.x += 2;
        }

        if (this.newSnake.x > this.world.width)
        {
            this.newSnake.x = -20;
        }
        if (this.newSnake.x == 120){
            this.newSnake.x = 270;
            this.newSnake.y = 590;
            this.newSnake.animations.play('wiggle',6, true);
            console.log(this.newSnake.animations);
        }
        if (this.newSnake.animations.currentAnim.loopCount == 4){
            this.newSnake.animations.stop();
            this.newSnake.y = 615;
            this.newSnake.x +=2;

        }


        if(!this.gameover && this.roamingSpaceMole) {

            this.roamingSpaceMole.x = this.path[this.pi].x;
            this.roamingSpaceMole.y = this.path[this.pi].y;

            this.pi += 4;

            if (this.pi >= this.path.length && !this.gameover) {
                this.changeMode();
                this.pi = 0;
            }
        }

        //if (this.user.lastbutton === "LEFT" ) {
        //    this.crosshair.body.velocity.x = -400;
        //}
        //else if (this.user.lastbutton === "RIGHT") {
        //    this.crosshair.body.velocity.x = 400;
        //} else {this.crosshair.body.velocity.x = 0}
        //
        //if (this.user.lastbutton === "UP") {
        //    // The speed we'll travel at
        //    this.crosshair.body.velocity.y = -400;
        //} else if
        //(this.user.lastbutton === "DOWN") {
        //    this.crosshair.body.velocity.y = 400;
        //} else {this.crosshair.body.velocity.y = 0}
        //
        //if (this.user.lastbutton === "A" )
        //{
        //    this.fireBurst(this.crosshair);
        //}

        //this.pointUpdate.call(this);

        //if(this.bombGroup) {
        //    this.bombGroup.forEach(function (bomb) {
        //        if(bomb.animations.currentAnim.name === "grow" && bomb.animations.currentAnim.isFinished === true){
        //            bomb.destroy();
        //            that.respawn(bomb);
        //            bomb.kill();
        //        }
        //
        //    });
        //}



        //if(this.molegroup) {
        //    this.molegroup.forEach(function (mole) {
        //        if(mole.animations.currentAnim.name === "Up" && mole.animations.currentAnim.isFinished == true ){
        //            mole.destroy();
        //            that.respawn(mole);
        //            mole.kill();
        //        }
        //
        //    });
        //}

    }

};