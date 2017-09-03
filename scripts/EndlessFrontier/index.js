var Config = {
  screenWidth: 0, // auto detect
  screenHeight: 0, // auto detect
  virtualButtonHeight: 0, // auto detect
  // isCheckTask: false,
  // isCheckTreasure: true,
  // isCheckAutoTask: false,
  // isCheckArmy: false,
  // isCheckDoubleSpeed: true,
  // isCheckRevolution: true,
  // revolutionMinutes: 10,
  hasVirtualButtonBar: true,
};

// init
(function(){
  var size = getScreenSize();
  Config.screenHeight = size.height;
  Config.screenWidth = size.width;
  Config.virtualButtonHeight = getVirtualButtonHeight();
})();

function EndlessFrontier() {
  this.Const = {
    // screen layout
    captureWidth: 1080,
    captureHeight: 1776,
    // config
    during: 300,
  };
  this.ScreenInfo = {
    ratio: 0,
    offsetX: 0,
    gameHeight: 0,
    gameWidth: 0,
  };
  // from 1776 * 1080 screen
  this.Buttons = {
    menuTask: {x: 90, y: 1860},
    menuRole: {x: 270, y: 1860},
    menuWar: {x: 450, y: 1860},
    menuTreasure: {x: 630, y: 1860},
    menuBattle: {x: 810, y: 1860},
    menuShop: {x: 990, y: 1860},
  };
  this.init();
}

EndlessFrontier.prototype.init = function() {
  if (Config.hasVirtualButtonBar) {
    this.ScreenInfo.gameHeight = Config.virtualButtonHeight;
  } else {
    this.ScreenInfo.gameHeight = Config.screenHeight;
  }
  var screenRatio = this.ScreenInfo.gameHeight / Config.screenWidth;
  var gameWidthRatio = 0.9;
  if (screenRatio >= 1.6) { // h/w 1.6
    gameWidthRatio = 1;
  } else if (screenRatio < 1.5) { // h/w 1.5
    gameWidthRatio = 0.8;
  }
  this.ScreenInfo.gameWidth = Config.screenWidth * gameWidthRatio;
  this.ScreenInfo.ratio = this.ScreenInfo.gameHeight / this.ScreenInfo.gameWidth;
  this.ScreenInfo.offsetX = (Config.screenWidth - this.ScreenInfo.gameWidth) / 2;
  console.log(JSON.stringify(this.ScreenInfo));
};

EndlessFrontier.prototype.tapLayout = function(xy) {
  var x = xy.x, y = xy.y;
  // convert to captured position 
}

new EndlessFrontier();



