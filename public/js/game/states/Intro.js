/**
 * Created by uzer-y on 11/15/15.
 */

WhackaMole.Intro = function(game) {
    this.intro;
    this.video;
    this.text;
    this.BG;
};

WhackaMole.Intro.prototype = {

    create: function(){

        //  This only works in Chrome
        //  No other browser supports webm files with alpha transparency (yet)
        //this.BG = this.add.image(0, 0 , 'titlescreen');
        //this.BG.inputEnabled = true;
        //this.BG.events.onInputDown.addOnce(this.startGame, this);

        //this.intro = this.add.sprite(-30,-170,'newintro');
        //this.intro.anchor.set= (.5);
        //this.intro.animations.add('intro');
        //this.intro.animations.play('intro',12,true);
        //this.intro.inputEnabled = true;
        //this.intro.events.onInputDown.addOnce(this.startGame, this);



        this.video = this.add.video('intro');
        this.video.play(true);
        this.video.loop = false;
        this.video.addToWorld(0, 0);




    },

    startGame: function (pointer) {
        this.state.start('Game');
    },

    update: function(){
        if (this.video.progress === 1){
            this.startGame()
        }

    }

};