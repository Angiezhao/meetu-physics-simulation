var GameMenu = function() {};


GameMenu.prototype = {

  menuConfig: {
    startY: 360,
    startX: 600
  },

  init: function () {
    this.titleText = game.make.text(game.world.centerX+30, 300, "MEET", {
      font: 'bold 60pt TheMinion',
      fill: '#F4A460',
      align: 'center'
    });
    this.titleText.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
  },
  
  addMenuOption: function(text, callback) {
    var optionStyle = { font: '30pt TheMinion', fill: '#F4A460', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var txt = game.add.text(game.world.centerX+50, (this.optionCount * 80) + 470, text, optionStyle);
    txt.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
    txt.anchor.setTo(0.6);
    txt.stroke = "rgba(0,0,0,0";
    txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#F08080";
      target.stroke = "rgba(200,200,200,0.5)";
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "#F4A460";
      target.stroke = "rgba(0,0,0,0)";
      txt.useHandCursor = false;
    };
    //txt.useHandCursor = true;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback, this);
    txt.events.onInputOver.add(onOver, this);
    txt.events.onInputOut.add(onOut, this);

    this.optionCount ++;
  },

  create: function () {

    if (music.name !== "dangerous" && playMusic) {
      music.stop();
      music = game.add.audio('dangerous');
      music.loop = true;
      music.play();
    }
    game.stage.disableVisibilityChange = true;
    game.add.sprite(0, 0, 'menu-bg');
    game.add.existing(this.titleText);

    this.addMenuOption('Start', function () {
      game.state.start("Level");
    });
    this.addMenuOption('Options', function () {
      game.state.start("Options");
    });

  }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
