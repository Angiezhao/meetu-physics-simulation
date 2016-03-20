var star;

// 一个区域用来生成球 并且发射抛物线
var launchRectangle = new Phaser.Rectangle(30, 450, 200, 150);

// 球的轨迹
var trajectoryGraphics;

// 一个常数来增加发射功率
var forceMult = 4;

// 储存物体发射速度
var launchVelocity;

// 接球器
//var cloud.body;

// 接球器的移动速度
var crateSpeed = 50;

//倒计时30秒
var timeText;
var intersection;

var back;

var cloud;

var partner;

var moon;

var coda = false;

// 窗口加载时的执行内容
window.onload = function() {	
    // 开始游戏
	var game = new Phaser.Game(1200, 750, Phaser.AUTO, "");
    // 创建执行状态（开始游戏）
    game.state.add("Game",Game);
    game.state.start("Game");
}

var Game = function(game){
  
};

Game.prototype = {
     // 预先下载图片和球(only the star)
	preload: function(){
          game.load.image("star", "assets/img/GreenLuma.png");
          game.load.image("back","assets/img/back.png");
          game.load.image("cloud","assets/img/clouds.png");
          game.load.image("star2","assets/img/GreenDarkLuma.png");
          game.load.image("cloud2","assets/img/clouds2.png")
          game.load.image("moon","assets/img/moon.png");
          game.load.image("coda","assets/img/coda.png");
          game.load.image("a","assets/img/a.png");
          this.optionCount = 1;
	},
     // 执行球生成
  	create: function(){
  	      var back = game.add.sprite(0,0,"back");
  	      var moon = game.add.sprite(900,0,"moon");
  	      var a = game.add.sprite(30,610,"a");
          // 发球区域的设定和发球器的图样
          var launchGraphics = game.add.graphics(0, 0);
          //发球器样式
          launchGraphics.lineStyle(5, "0xFF9966");
          launchGraphics.drawRect(launchRectangle.x, launchRectangle.y, launchRectangle.width, launchRectangle.height);          
          // 球的轨迹图
          trajectoryGraphics = game.add.graphics(0, 0);          
          // 设置发球器初始速率为0
          launchVelocity = new Phaser.Point(0, 0);
          // 游戏背景色
		      game.stage.backgroundColor = "#4682B4";
          // 初始化box2d
		      game.physics.startSystem(Phaser.Physics.BOX2D);
          // 设置重力
          game.physics.box2d.gravity.y = 500;
		      // 玩家按下鼠标后，开始call placeStar这个function
          game.input.onDown.add(placeStar);
          //接球器partner的物理位置
          partner = game.add.sprite(1100, 140,'star2');
          game.physics.box2d.enable(partner);
          partner.body.kinematic = true;
          partner.body.restitution = 0.98;
          // 在框里的一个区域来判定球是否在框内
          var sensor = partner.body.addRectangle(150, 150, -10, -20);
          sensor.m_isSensor = true;
          // 给这个框命名
          sensor.m_userData = "inside";
          // 碰撞设置
          partner.body.setCollisionCategory(2);
          // 设置云朵障碍
          cloud = game.add.sprite(760, 340,'cloud');
          game.physics.box2d.enable(cloud);
          cloud.body.kinematic = true;
          cloud.body.restitution = 0.98;
          // 大云的水平移动的速度
          cloud.body.velocity.x = crateSpeed;
          var cloudSecond = game.add.sprite(500, 440,'cloud2');
          game.physics.box2d.enable(cloudSecond);
          cloudSecond.body.static = true;
          cloudSecond.body.restitution = 1.28;
	},
    // render: function(){
    //       // debug专用渲染器
    //       game.debug.box2dWorld();
    // },
     update: function(){
          // 接球器rebounce设定
          if(cloud.body.x > 850){
               cloud.body.velocity.x = - crateSpeed; 
          }
          if(cloud.body.x < 750){
               cloud.body.velocity.x = crateSpeed;         
          } 
          if(coda){
            star.body.kill();
            var love = game.add.sprite(0,0,"coda");
            coda=false;
          }
     }
}

// 球
function placeStar(e){
     // 球在发球器内可以生成
     if(launchRectangle.contains(e.x, e.y)){
          // 添加球的图片
          star = game.add.sprite(e.x, e.y,"star");
          // 在box2D中确认球的物理形状
          game.physics.box2d.enable(star);
          // 初始球的重力为0，避免掉落
          star.body.gravityScale = 0;
          // 初始球的物理形状circle,和撞击面积大小
          star.body.setCircle(star.width/3);
          star.body.restitution = 0.98;
          //触发事件设计
          // 消除鼠标点击事的球的设置
          game.input.onDown.remove(placeStar);
          // 鼠标抬起，开始发球
          game.input.onUp.add(launchStar);
          // 移开鼠标，调取控制球的函数
          game.input.addMoveCallback(chargeStar);
      }	
}

// 允许玩家控制球
function chargeStar(pointer, x, y, down){
     // 单点点击事，鼠标为0
     if(pointer.id == 0){
          // 清楚轨迹的图像，设置轨迹线段样式并且移除笔在球上的位置
          trajectoryGraphics.clear();
          trajectoryGraphics.lineStyle(3, 0x00ff00);
          trajectoryGraphics.moveTo(star.x, star.y);
          // 鼠标在发球器内拖拽
          if(launchRectangle.contains(x, y)){
               //画出鼠标的轨迹方向
               trajectoryGraphics.lineTo(x, y);
               launchVelocity.x = star.x - x;
               launchVelocity.y = star.y - y;               
          }
          // 鼠标在发球器外拖拽
          else{
               // 鼠标的发球线与发球框之间有无交点，交点的坐标
               intersection = lineIntersectsRectangle(new Phaser.Line(x, y, star.x, star.y), launchRectangle);
               trajectoryGraphics.lineTo(intersection.x, intersection.y);
               launchVelocity.x = star.x - intersection.x;
               launchVelocity.y = star.y - intersection.y;
          } 
          // 画发球的抛物线 
          trajectoryGraphics.lineStyle(1, 0xFF9966);  
          launchVelocity.multiply(forceMult, forceMult);
          for (var i = 0; i < 180; i += 3){
               var trajectoryPoint = getTrajectoryPoint(star.x, star.y, launchVelocity.x, launchVelocity.y, i);
               trajectoryGraphics.moveTo(trajectoryPoint.x - 3, trajectoryPoint.y - 3); 
               trajectoryGraphics.lineTo(trajectoryPoint.x + 3, trajectoryPoint.y + 3);
               trajectoryGraphics.moveTo(trajectoryPoint.x - 3, trajectoryPoint.y + 3);  
               trajectoryGraphics.lineTo(trajectoryPoint.x + 3, trajectoryPoint.y - 3);        
          }     
     }
}

// 发球的判定
function launchStar(){
     // 重新调整球
     game.input.deleteMoveCallback(0);
     game.input.onUp.remove(launchStar);
     game.input.onDown.add(placeStar);
     // 设置发球速度
     star.body.velocity.x = launchVelocity.x;
     star.body.velocity.y = launchVelocity.y;
     // 以及相应的重力
     star.body.gravityScale = 1;
     // 球撞击的判定
     star.body.setCategoryContactCallback(2, starHitsCrate);     
}

// 球撞到板子时的函数
function starHitsCrate(body1, body2, fixture1, fixture2, begin){ 
     // 如果球撞了
     if(begin){ 
          // 如果撞在接球器里
          if(fixture2.m_userData == "inside"){
               //  反弹清零
               body1.restitution = 0;
               // 球变为与容器关联，不再触发容器的sensor
               body1.setCategoryContactCallback(4, starHitsCrate);
               coda = true;
          }
          // 如果星星弹出屏幕，星星消失  
     }
}

// 球和墙有无交点
function lineIntersectsRectangle(l, r){
    return l.intersects(new Phaser.Line(r.left, r.top, r.right, r.top), true) ||
          l.intersects(new Phaser.Line(r.left, r.bottom, r.right, r.bottom), true) ||
          l.intersects(new Phaser.Line(r.left, r.top, r.left, r.bottom), true) ||
          l.intersects(new Phaser.Line(r.right, r.top, r.right, r.bottom), true);
}

// 抛物线
function getTrajectoryPoint(startX, startY, velocityX, velocityY, n) {
     var t = 1 / 60;    
     var stepVelocityX = t * game.physics.box2d.pxm(-velocityX); 
     var stepVelocityY = t * game.physics.box2d.pxm(-velocityY);    
     var stepGravityX = t * t * game.physics.box2d.pxm(-game.physics.box2d.gravity.x); 
     var stepGravityY = t * t * game.physics.box2d.pxm(-game.physics.box2d.gravity.y);
     startX = game.physics.box2d.pxm(-startX);
     startY = game.physics.box2d.pxm(-startY);    
     var tpx = startX + n * stepVelocityX + 0.5 * (n * n + n) * stepGravityX;
     var tpy = startY + n * stepVelocityY + 0.5 * (n * n + n) * stepGravityY;    
     tpx = game.physics.box2d.mpx(-tpx);
     tpy = game.physics.box2d.mpx(-tpy);    
     return {
          x: tpx, 
          y: tpy 
     };

}