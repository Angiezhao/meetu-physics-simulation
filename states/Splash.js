var Splash = function () {};

Splash.prototype = {

  loadScripts: function () {
    game.load.script('style', 'lib/style.js');
    game.load.script('mixins', 'lib/mixins.js');
    game.load.script('WebFont', 'vendor/webfontloader.js');
    game.load.script('gamemenu','states/GameMenu.js');
    game.load.script('game', 'states/Game.js');
    game.load.script('gameover','states/GameOver.js');
    game.load.script('options', 'states/Options.js');
    game.load.script('level', 'states/level.js');
    game.load.script('level1', 'states/level1.js');
    game.load.script('level2', 'states/level2.js');
  },

  loadBgm: function () {
    // thanks Kevin Macleod at http://incompetech.com/
    game.load.audio('dangerous', 'assets/bgm/Dangerous.mp3');
    game.load.audio('exit', 'assets/bgm/Exit the Premises.mp3');
  },
  // varios freebies found from google image search
  loadImages: function () {
    game.load.image('menu-bg', 'assets/images/menu-bg.png');
    game.load.image('options-bg', 'assets/images/options-bg.png');
    game.load.image('gameover-bg', 'assets/images/gameover-bg.png');
  },

  loadFonts: function () {
    WebFontConfig = {
      custom: {
        families: ['TheMinion'],
        urls: ['assets/style/theminion.css']
      }
    }
  },

  init: function () {
    this.loadingBar = game.make.sprite(game.world.centerX-(387/2), 400, "loading");
    this.logo       = game.make.sprite(game.world.centerX, 200, 'brand');
    this.status     = game.make.text(game.world.centerX, 380, 'I am trying hard...', {fill: '#F4A460'});
    utils.centerGameObjects([this.logo, this.status]);
  },

  preload: function () {
    game.add.sprite(0, 0, 'stars');
    game.add.existing(this.logo).scale.setTo(0.5);
    game.add.existing(this.loadingBar);
    game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);

    this.loadScripts();
    this.loadImages();
    this.loadFonts();
    this.loadBgm();

  },

  addGameStates: function () {

    game.state.add("GameMenu",GameMenu);
    game.state.add("Game",Game);
    game.state.add("GameOver",GameOver);
    game.state.add("Options",Options);
    game.state.add("Level",Level);
    game.state.add("Level1",Level1);
    game.state.add("Level2",Level2);
  },

  addGameMusic: function () {
    music = game.add.audio('dangerous');
    music.loop = true;
    music.play();
  },

  create: function() {
    this.status.setText('I am trying hard...');
    this.addGameStates();
    this.addGameMusic();

    setTimeout(function () {
      game.state.start("GameMenu");
    }, 1000);
  }
};
