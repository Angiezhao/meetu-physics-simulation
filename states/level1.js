var Level1 = function(game) {};
var caption;
var fireTimeout = 0;
var hammers = [];
var usingHammer = true;
var hammerCount = 10;

Level1.prototype = {
  preload:function(){
    this.game.load.image('hammer', 'assets/img/bunny.png');
    this.game.load.image("back","assets/img/back.png");
    this.game.load.image("rope","assets/img/rope.png");
  },
  create:function(){
    this.game.stage.backgroundColor = '#222222';
    var back = this.game.add.sprite(0,0,"back");
    
    // Enable Box2D physics
    this.game.physics.startSystem(Phaser.Physics.BOX2D);
    this.game.physics.box2d.debugDraw.joints = true;
    this.game.physics.box2d.gravity.y = 500;
    this.game.physics.box2d.restitution = 0.025;
    
    // Swing body
    var swingBody = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
    
    // Body with long thin fixture
    var rope = this.game.add.sprite(600,300,'rope');
    this.game.physics.box2d.enable(rope);
    rope.body.dynamic = true;
    rope.body.setPolygon([-5, -250, -5, 250, 5, 250, 5, -250, ],null,3);
    
    // Join long thin body to Swing
    this.game.physics.box2d.revoluteJoint(swingBody, rope, 600, 50, 0, -250);
    
    this.game.add.text(5, 5, 'Throw the Hammer follow the direction of the rope to add a positive energy', { fill: '#ffffff', font: '14pt Arial' });
    caption = this.add.text(5, 250, '', { fill: '#ffffff', font: '14pt Arial' });
    
    updateCaption();
    
    this.game.input.onDown.add( toggleHammer, this );

  },
  update:function(){

    // Destroy any hammers that go off screen
    for (var i = hammers.length - 1; i >= 0; i--)
    {
        var hammer = hammers[i];

        if (hammer.x < 0 || hammer.x > 800 || hammer.y < 0 || hammer.y > 600)
        {
            hammer.destroy();
            hammers.splice(i,1);
        }
    }
  }
}
// function render(){
//     game.debug.box2dWorld();
//   }
function toggleHammer(){
    if (hammerCount > 0)
    {
        fireHammer();
        hammerCount--;
    }
    updateCaption();
};
function updateCaption(){
    caption.text = 'Click to toggle hammer bodies. Currently Numbers: ' + (hammerCount);
};
function fireHammer(){
    // Create the hammer body and set the angle
    var hammer = game.add.sprite(50, 300, 'hammer');
    game.physics.box2d.enable(hammer);
    hammer.body.setCircle(5);
    
    // Set velocity
    hammer.body.velocity.x = 3000 + 1000 * Math.random();
    hammer.body.velocity.y = -500 + 1000 * Math.random();

    if (usingHammer)
    {
        hammer.body.bullet = true;
    }    
    
    // Add hammers to a list so we can remove them when they go offscreen
    hammers.push(hammer);
  }
