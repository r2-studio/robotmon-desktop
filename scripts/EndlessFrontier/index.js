var Config = {
  screenWidth: 0, // auto detect
  screenHeight: 0, // auto detect
  resizeWidth: 0,
  resizeHeight: 0,
  virtualButtonHeight: 0, // auto detect
  // isCheckTask: false,
  // isCheckTreasure: true,
  // isCheckAutoTask: false,
  // isCheckArmy: false,
  // isCheckDoubleSpeed: true,
  // isCheckRevolution: true,
  // revolutionMinutes: 10,
  hasVirtualButtonBar: false,
};

function log () {
  sleep(100);
  if (typeof arguments[0] == 'object') {
    console.log(JSON.stringify(arguments[0]));
  } else {
    console.log.apply(console, arguments);
  }
}

function isSameColor(c1, c2, diff) {
  if (diff == undefined) {
    diff = 20;
  }
  if (Math.abs(c1.r - c2.r) > diff) {
    return false;
  }
  if (Math.abs(c1.g - c2.g) > diff) {
    return false;
  }
  if (Math.abs(c1.b - c2.b) > diff) {
    return false;
  }
  if (Math.abs(c1.a - c2.a) > diff) {
    return false;
  }
  return true;
}

function getColor(img, xy) {
  var xy = toResizeXYs(xy);
  return getImageColor(img, xy.x, xy.y);
}

function toResizeXYs(xy) {
  return toResizeXY(xy.x, xy.y);
}

function toResizeXY(x, y) {
  var rx = Math.floor(x * Config.resizeWidth / Config.screenWidth);
  var ry = Math.floor(y * Config.resizeHeight / Config.screenHeight);
  return {x: rx, y: ry};
}

// init
(function(){
  var size = getScreenSize();
  Config.screenHeight = size.height;
  Config.screenWidth = size.width;
  Config.resizeWidth = Math.floor(Config.screenWidth / 3);
  Config.resizeHeight =Math.floor(Config.screenHeight / 3);
  Config.virtualButtonHeight = getVirtualButtonHeight();
})();

function EndlessFrontier() {
  this.Const = {
    // screen layout
    captureWidth: 1080,
    captureHeight: 1776,
    menuHeight: 136,
    tableCellHeight: 186,

    ButtonEnableColor: {r: 1, g:1, b: 1, a: 0},

    InGameCheck: {x: 340, y: 820, color: {r: 1, g:1, b: 1, a: 0}},
    ButtonMenuArmyRevolution: {x: 725, y: 920},
    ButtonRevolutionTeam: {x: 500, y: 1180},
    ButtonMenuStoreProp: {x: 700, y: 750},
    ButtonTaskIcon: {x: 100, y: 1070},
    ButtonTaskMoney: {x: 1040, y: 1070},
    ButtonTaskMax: {x: 420, y: 1060},
    ButtonAutoTask: {x: 1040, y: 900},
    ButtonUnopenedTask: {x: 630, y: 1120},
    ButtonTooLongBack: {x: 650, y: 1450},
    ButtonDiamondFree: {x: 650, y: 1250},
    ButtonDiamondSeeAd: {x: 460, y: 1130},
    ButtonDiamondCancel: {x: 780, y: 1130},
    ButtonDoubleSpeed: {x: 1010, y: 1093},
    ButtonTaskInfoCancel: {x: 620, y: 1410},
    ButtonNetwork: {x: 650, y: 1093},
    ButtonExitGame: {x: 820, y: 990},
    ButtonArmyInfoCancel: {x: 1020, y: 260},
    ButtonTableTop: {x: 1040, y: 996},
    ButtonTableBottom: {x: 1040, y: 1642},
    // AdButtonBottomRightCancel: {x: 1036, y: 1736},
    // AdButtonTopRightCancel: {x: 1003, y: 83},
    // AdButtonTopLeftCancel: {x: 73, y: 73},
    // AdButtonPersonalizedOK: {x: 750, y: 820},
    // AdBackground: {x: 160, y: 1750},
    // AdInfoIconBottomLeft: {x: 20, y: 1756},
    // AdInfoIconTopRight: {x: 1056, y: 20},
    Treasure: {x: 550, y: 550},

    // config
    during: 400,
  };
  this.ScreenInfo = {
    ratio: 0,
    offsetX: 0,
    gameHeight: 0,
    gameWidth: 0,
  };
  // from 1776 * 1080 screen
  this.Buttons = {};
  this.init();
}

EndlessFrontier.prototype.init = function() {
  if (Config.hasVirtualButtonBar) {
    this.ScreenInfo.gameHeight = Config.virtualButtonHeight;
  } else {
    this.ScreenInfo.gameHeight = Config.screenHeight;
  }
  var screenRatio = Config.screenHeight / Config.screenWidth;
  var gameWidthRatio = 0.9;
  if (screenRatio >= 1.6) { // h/w 1.6
    gameWidthRatio = 1;
  } else if (screenRatio < 1.5) { // h/w 1.5
    gameWidthRatio = 0.8;
  }
  this.ScreenInfo.gameWidth = Config.screenWidth * gameWidthRatio;
  this.ScreenInfo.ratio = this.ScreenInfo.gameHeight / this.ScreenInfo.gameWidth;
  this.ScreenInfo.offsetX = (Config.screenWidth - this.ScreenInfo.gameWidth) / 2;

  this.initButtons();
  this.taskTask();
  console.log(JSON.stringify(this.ScreenInfo));
};

EndlessFrontier.prototype.getRealHeightRatio = function(v) {
  return v * this.ScreenInfo.gameWidth / this.Const.captureWidth;
}

EndlessFrontier.prototype.getRealWHRatio = function(xy) {
  return {
    x: xy.x * this.ScreenInfo.gameWidth / this.Const.captureWidth, 
    y: xy.y * this.ScreenInfo.gameWidth / this.Const.captureWidth,
  }
}

EndlessFrontier.prototype.getRealWHRatioBottom = function(xy) {
  var y = this.Const.captureHeight - xy.y;
  return {
    x: xy.x * this.ScreenInfo.gameWidth / this.Const.captureWidth, 
    y: this.ScreenInfo.gameHeight - y * this.ScreenInfo.gameWidth / this.Const.captureWidth,
  }
}

EndlessFrontier.prototype.initButtons = function() {
  // Menu
  var menuY = this.ScreenInfo.gameHeight - this.getRealHeightRatio(this.Const.menuHeight) / 2;
  var menuW = this.ScreenInfo.gameWidth / 6;
  var menuOffset = menuW / 2;
  this.ButtonMenuTask = {x: (menuW * 1 - menuOffset), y: menuY};
  this.ButtonMenuArmy = {x: (menuW * 2 - menuOffset), y: menuY};
  this.ButtonMenuWar = {x: (menuW * 3 - menuOffset), y: menuY};
  this.ButtonMenuTreasure = {x: (menuW * 4 - menuOffset), y: menuY};
  this.ButtonMenuBattle = {x: (menuW * 5 - menuOffset), y: menuY};
  this.ButtonMenuStore = {x: (menuW * 6 - menuOffset), y: menuY};

  // table size
  this.ButtonTableTop = this.getRealWHRatio(this.Const.ButtonTableTop);
  this.ButtonTableBottom = this.getRealWHRatioBottom(this.Const.ButtonTableBottom);
  this.TableCellHeight = this.getRealHeightRatio(this.Const.tableCellHeight);

  // from bottom
  this.ButtonRevolution = {x: menuW * 5, y: menuY};
  this.ButtonRevolutionDone = {x: menuW * 3, y: menuY};
  this.ButtonArmyInfoCancel = this.getRealWHRatioBottom(this.Const.ButtonArmyInfoCancel);

  // from top
  this.ButtonMenuArmyRevolution = this.getRealWHRatio(this.Const.ButtonMenuArmyRevolution);
  this.ButtonRevolutionTeam = this.getRealWHRatio(this.Const.ButtonRevolutionTeam);
  this.ButtonMenuStoreProp = this.getRealWHRatio(this.Const.ButtonMenuStoreProp);
  this.ButtonTaskIcon = this.getRealWHRatio(this.Const.ButtonTaskIcon);
  this.ButtonTaskMoney = this.getRealWHRatio(this.Const.ButtonTaskMoney);
  this.ButtonTaskMax = this.getRealWHRatio(this.Const.ButtonTaskMax);
  this.ButtonAutoTask = this.getRealWHRatio(this.Const.ButtonAutoTask);
  this.ButtonUnopenedTask = this.getRealWHRatio(this.Const.ButtonUnopenedTask);
  this.ButtonTooLongBack = this.getRealWHRatio(this.Const.ButtonTooLongBack);
  this.ButtonDiamondFree = this.getRealWHRatio(this.Const.ButtonDiamondFree);
  this.ButtonDiamondSeeAd = this.getRealWHRatio(this.Const.ButtonDiamondSeeAd);
  this.ButtonDiamondCancel = this.getRealWHRatio(this.Const.ButtonDiamondCancel);
  this.ButtonDoubleSpeed = this.getRealWHRatio(this.Const.ButtonDoubleSpeed);
  this.ButtonTaskInfoCancel = this.getRealWHRatio(this.Const.ButtonTaskInfoCancel);
  this.ButtonNetwork = this.getRealWHRatio(this.Const.ButtonNetwork);
  this.ButtonExitGame = this.getRealWHRatio(this.Const.ButtonExitGame);
  this.Treasure = this.getRealWHRatio(this.Const.Treasure);
  this.InGameCheck = this.getRealWHRatio(this.Const.InGameCheck);
  
};

EndlessFrontier.prototype.goBack = function() {keycode('BACK', this.Const.during);}

EndlessFrontier.prototype.tap = function(xy, during) {
  if (during === undefined) {
    during = this.Const.during;
  }
  console.log('tap', xy.x, xy.y);
  tap(Math.round(xy.x), Math.round(xy.y), during);
}

EndlessFrontier.prototype.swipeTableTop = function() {
  var during = 10;
  var cellHeight = this.TableCellHeight;
  var x = Math.floor(this.ScreenInfo.gameWidth / 2);
  var topY = Math.floor(this.ButtonTableTop.y + cellHeight);
  var deltaY = Math.floor((this.ScreenInfo.gameHeight - topY));
  for (var i = 0; i < 2; i++) {
    tapDown(x, topY, 50);
    for (var j = 0; j <= 2; j++) {
      moveTo(x, topY + deltaY * j * 3, during);
      moveTo(x, topY + deltaY * j * 3, during);
    }
    tapUp(x, topY + deltaY * j * 3, 10);
    sleep(100);
  }
}

EndlessFrontier.prototype.swipeTableUp = function(number) {
  var during = 20;
  var cellHeight = this.TableCellHeight;
  var x = Math.floor(this.ScreenInfo.gameWidth / 2);
  var topY = Math.floor(this.ButtonTableTop.y + cellHeight);
  var deltaY = Math.floor(cellHeight / 5);
  for (var i = 0; i < number; i++) {
    tapDown(x, topY, during);
    for (var j = 0; j <= 6; j++) {
      moveTo(x, topY + deltaY * j + 1, during);
      moveTo(x, topY + deltaY * j + 1, during);
    }
    sleep(60);
    tapUp(x, topY + deltaY * 6, 1);
    sleep(60);
  }
}

EndlessFrontier.prototype.goToGame = function(during) {
  if (during === undefined) {
    during = 35 * 1000;
  }
  var start = Date.now();
  while(true) {
    log('檢查是否在遊戲中');
    var img = this.screenshot();
    var color = getColor(img, this.InGameCheck);
    releaseImage(img);
    if (isSameColor(this.Const.InGameCheck.color, color)) {
      return;
    }
    if (Date.now() - start > during) {
      return;
    }
    this.goBack();
    this.tap(this.ButtonMenuTask);
    sleep(2000);
  }
}

EndlessFrontier.prototype.screenshot = function() {
  return getScreenshotModify(0, 0, 0, 0, Config.resizeWidth, Config.resizeHeight);
}

// game controller
EndlessFrontier.prototype.taskDoubleSpeed = function() {
  log('檢查兩倍速度');
  this.goToGame();
  this.tap(this.ButtonMenuStore);
  this.tap(this.ButtonMenuStoreProp);
  this.tap(this.ButtonDoubleSpeed);
  this.goBack();
  this.goBack();
  this.tap(this.ButtonMenuTask);
};

EndlessFrontier.prototype.taskTreasure = function() {
  log('檢查自動開寶箱');
  this.goToGame();
  this.tap(this.Treasure);
  // check and watch Ad
  var img = this.screenshot();
  var color = getColor(img, this.ButtonDiamondSeeAd);
  releaseImage(img);
  if (isSameColor(this.Const.ButtonEnableColor, color)) {
    log('[寶箱] 是鑽石寶箱阿！！！');
    this.tap(this.ButtonDiamondSeeAd);
    sleep(2000);
    goToGame();
  }
};

EndlessFrontier.prototype.taskTask = function() {
  // log('檢查自動做任務');
  
  // this.goToGame();
  
  // this.tap(this.ButtonMenuTask);
  this.swipeTableUp(5);
  // tapDown(555, 1700, 300);
  // moveTo(555, 1650, 300);
  // moveTo(555, 1600, 300);
  // moveTo(555, 1550, 300);
  // moveTo(555, 1500, 300);
  // moveTo(555, 1450, 300);
  // moveTo(555, 1412, 300);
  // moveTo(555, 1312, 300);
  // moveTo(555, 1212, 300);
  // moveTo(555, 1093, 300);
  // tapUp(555, 1093, 300);
  // this.swipe({x: 555, y: 1712}, {x: 555, y: 1093});
  // log('swipe');
  // swipe(555, 1712, 555, 1093, 1000);
}

new EndlessFrontier();



