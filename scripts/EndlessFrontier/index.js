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

    MenuColor: {r: 32, g:32, b: 32, a: 0},
    ButtonEnableColor: {r: 1, g:1, b: 1, a: 0},
    ButtonRedCancelColor: {r: 32, g:54, b: 179, a: 0},

    InGameCheck: {x: 340, y: 820, color: {r: 1, g:1, b: 1, a: 0}},
    ButtonMenuArmyRevolution: {x: 725, y: 920},
    ButtonRevolutionTeam: {x: 500, y: 1180},
    ButtonMenuStoreProp: {x: 700, y: 750},
    ButtonTableRightTask: {x: 1040, y: 1100},
    ButtonTableRightOther: {x: 1040, y: 1070},
    ButtonTaskIcon: {x: 100, y: 1100},
    ButtonTaskMoney: {x: 1040, y: 1100},
    ButtonTaskMax: {x: 420, y: 1100},
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
    during: 300,
  };
  this.ScreenInfo = {
    ratio: 0,
    offsetX: 0,
    gameHeight: 0,
    gameWidth: 0,
  };
  // from 1776 * 1080 screen
  this.Buttons = {};
  this.Status = {
    taskTaskIgnore: 0,
    taskWarIdx: 0,
  };
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

  this.menuY = menuY;
  this.menuW = menuW;

  this.ButtonMenuTask = {x: (menuW * 1 - menuOffset), y: menuY};
  this.ButtonMenuArmy = {x: (menuW * 2 - menuOffset), y: menuY};
  this.ButtonMenuWar = {x: (menuW * 3 - menuOffset), y: menuY};
  this.ButtonMenuTreasure = {x: (menuW * 4 - menuOffset), y: menuY};
  this.ButtonMenuBattle = {x: (menuW * 5 - menuOffset), y: menuY};
  this.ButtonMenuStore = {x: (menuW * 6 - menuOffset), y: menuY};

  // table size
  this.ButtonTableTop = this.getRealWHRatio(this.Const.ButtonTableTop);
  this.ButtonTableBottom = {x: this.ButtonTableTop.x, y: this.ScreenInfo.gameHeight - this.getRealHeightRatio(this.Const.menuHeight)};
  this.TableCellHeight = this.getRealHeightRatio(this.Const.tableCellHeight);

  // from top
  this.ButtonMenuArmyRevolution = this.getRealWHRatio(this.Const.ButtonMenuArmyRevolution);
  this.ButtonRevolutionTeam = this.getRealWHRatio(this.Const.ButtonRevolutionTeam);
  this.ButtonMenuStoreProp = this.getRealWHRatio(this.Const.ButtonMenuStoreProp);
  this.ButtonTableRightTask = this.getRealWHRatio(this.Const.ButtonTableRightTask);
  this.ButtonTableRightOther = this.getRealWHRatio(this.Const.ButtonTableRightOther);
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

  // from bottom
  var cellHeight = this.TableCellHeight;

  this.ButtonRevolution = {x: menuW * 5, y: menuY};
  this.ButtonRevolutionDone = {x: menuW * 3, y: menuY};
  this.ButtonArmyInfoCancel = this.getRealWHRatioBottom(this.Const.ButtonArmyInfoCancel);
  this.ButtonTableRightOtherBottom = {
    x: this.ButtonTableRightTask.x,
    y: this.ScreenInfo.gameHeight - this.getRealHeightRatio(this.Const.menuHeight) - cellHeight / 2,
  };
  
};

EndlessFrontier.prototype.goBack = function() {keycode('BACK', this.Const.during);}

EndlessFrontier.prototype.tap = function(xy, during) {
  if (during === undefined) {
    during = this.Const.during;
  }
  // console.log('tap', xy.x, xy.y);
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
      moveTo(x, topY + deltaY * j * 5, during);
      moveTo(x, topY + deltaY * j * 5, during);
    }
    tapUp(x, topY + deltaY * j * 5, 10);
    sleep(100);
  }
}

EndlessFrontier.prototype.swipeTable = function(number, m) {
  var during = 60;
  var cellHeight = this.TableCellHeight;
  var x = Math.floor(this.ScreenInfo.gameWidth / 2);
  var topY = Math.floor(this.ButtonTableTop.y + cellHeight);
  var deltaY = m * cellHeight / 5 * number;
  tapDown(x, topY, during);
  for (var j = 0; j <= 6; j++) {
    moveTo(x, topY + deltaY * j, during);
    moveTo(x, topY + deltaY * j, during);
  }
  sleep(during);
  tapUp(x, topY + deltaY * 6, during);
}

EndlessFrontier.prototype.swipeTableUp = function(number) {
  this.swipeTable(number, 1);
}

EndlessFrontier.prototype.swipeTableDown = function(number) {
  this.swipeTable(number, -1);
}

EndlessFrontier.prototype.goToGame = function(during) {
  if (during === undefined) {
    during = 35 * 1000;
  }
  tapUp(0, 0);
  var start = Date.now();
  while(true) {
    log('檢查是否在遊戲中');
    var img = this.screenshot();
    var color = getColor(img, this.InGameCheck);
    var isMenu1 = isSameColor(this.Const.MenuColor, getColor(img, {x: this.menuW * 0.90, y: this.menuY }));
    var isMenu2 = isSameColor(this.Const.MenuColor, getColor(img, {x: this.menuW * 2.90, y: this.menuY }));
    var isMenuEnable = isSameColor(this.Const.ButtonEnableColor, getColor(img, this.ButtonMenuTask));
    releaseImage(img);
    if ((isMenu1 || isMenu2) && isSameColor(this.Const.InGameCheck.color, color)) {
      return;
    }
    if (Date.now() - start > during) {
      return;
    }
    this.goBack();
    if (!isMenuEnable) {
      this.tap(this.ButtonMenuTask);
    }
    sleep(3000);
  }
}

EndlessFrontier.prototype.screenshot = function() {
  return getScreenshotModify(0, 0, 0, 0, Config.resizeWidth, Config.resizeHeight);
}

EndlessFrontier.prototype.tapTableMaxValue = function(y, clickIcon) {
  for (var i = 0; i < 5; i++) {
    this.tap({x: this.ButtonTableRightOther.x, y: y}, 100);
  }
  var img = this.screenshot();
  var btnEnable = isSameColor(this.Const.ButtonEnableColor, getColor(img, {x: this.ButtonTaskMax.x, y: y}));
  releaseImage(img);
  if (btnEnable) {
    this.tap({x: this.ButtonTaskMax.x, y: y}, 100);
  }
  if (clickIcon) {
    this.tap({x: this.ButtonTaskIcon.x, y: y});
  }
}

// EndlessFrontier.prototype.checkAndClickTable = function(xy, slideTimes, ignoreCount, clickIcon) {
//   var cellHeight = this.TableCellHeight;
//   var rightBtnX = xy.x;
//   var rightBtn1Y = xy.y;
//   var rightBtn2Y = rightBtn1Y + cellHeight;
//   var rightBtn3Y = rightBtn2Y + cellHeight;
//   var rightBtn4Y = rightBtn3Y + cellHeight;
  
//   var rightBtn5YBottom = this.ButtonTableRightOtherBottom.y;
//   var rightBtn4YBottom = rightBtn5YBottom - cellHeight;
//   var rightBtn3YBottom = rightBtn4YBottom - cellHeight;
//   var rightBtn2YBottom = rightBtn3YBottom - cellHeight;
  
//   this.swipeTableTop();
//   sleep(this.Const.during);
//   if (ignoreCount > 0) {
//     this.swipeTableDown(ignoreCount);
//   }

//   var enableSlideTime = 0;
//   for(var i = 0; i < slideTimes; i++) {
//     var img = this.screenshot();
//     var btnEnable1 = isSameColor(this.Const.ButtonEnableColor, getColor(img, {x: rightBtnX, y: rightBtn1Y}));
//     var btnEnable2 = isSameColor(this.Const.ButtonEnableColor, getColor(img, {x: rightBtnX, y: rightBtn2Y}));
//     var btnEnable3 = isSameColor(this.Const.ButtonEnableColor, getColor(img, {x: rightBtnX, y: rightBtn3Y}));
//     var btnEnable4 = isSameColor(this.Const.ButtonEnableColor, getColor(img, {x: rightBtnX, y: rightBtn4Y}));
//     var btnEnable2B = isSameColor(this.Const.ButtonEnableColor, getColor(img, {x: rightBtnX, y: rightBtn2YBottom}));
//     var btnEnable3B = isSameColor(this.Const.ButtonEnableColor, getColor(img, {x: rightBtnX, y: rightBtn3YBottom}));
//     var btnEnable4B = isSameColor(this.Const.ButtonEnableColor, getColor(img, {x: rightBtnX, y: rightBtn4YBottom}));
//     var btnEnable5B = isSameColor(this.Const.ButtonEnableColor, getColor(img, {x: rightBtnX, y: rightBtn5YBottom}));
//     releaseImage(img);
//     // log(btnEnable1, btnEnable2, btnEnable3);
//     if (btnEnable1) { this.tapTableMaxValue(rightBtn1Y, clickIcon); }
//     if (btnEnable2) { this.tapTableMaxValue(rightBtn2Y, clickIcon); }
//     if (btnEnable3) { this.tapTableMaxValue(rightBtn3Y, clickIcon); }
//     if (btnEnable4) { this.tapTableMaxValue(rightBtn4Y, clickIcon); }
//     if (btnEnable2B) { this.tapTableMaxValue(rightBtn2YBottom, clickIcon); }
//     if (btnEnable3B) { this.tapTableMaxValue(rightBtn3YBottom, clickIcon); }
//     if (btnEnable4B) { this.tapTableMaxValue(rightBtn4YBottom, clickIcon); }
//     if (btnEnable5B) { this.tapTableMaxValue(rightBtn5YBottom, clickIcon); }

//     if (btnEnable1 || btnEnable2 || btnEnable3 || btnEnable4 || btnEnable2B || btnEnable3B || btnEnable4B || btnEnable5B) {enableSlideTime = i}
//     if (i >= slideTimes - 2) {
//       this.swipeTableDown(1);
//     } else {
//       this.swipeTableDown(2);
//     }
//     sleep(this.Const.during);
//   }
//   return enableSlideTime;
// }

EndlessFrontier.prototype.checkEnabledTableButtons = function() {
  var cellHeight = this.TableCellHeight;
  var x = this.ButtonTableRightOther.x;
  var enableButtons = [];
  var initY = this.ButtonTableTop.y + cellHeight / 4;
  var img = this.screenshot();
  for (var y = initY; y < this.ButtonTableBottom.y; y += cellHeight / 4) {
    var isEnable1 = isSameColor(this.Const.ButtonEnableColor, getColor(img, {x: x, y: y}));
    var isEnable2 = isSameColor(this.Const.ButtonEnableColor, getColor(img, {x: x, y: y + cellHeight / 8}));
    if (isEnable1 && isEnable2) {
      enableButtons.push({x: x, y: y});
      y += cellHeight / 4;
    }
  }
  releaseImage(img);
  log('enableButtons', JSON.stringify(enableButtons));
  return enableButtons;
}

EndlessFrontier.prototype.checkAndClickTable = function(ignoreCount, maxCount, clickIcon) {
  var cellHeight = this.TableCellHeight;
  if (ignoreCount > 0) {
    this.swipeTableDown(ignoreCount);
  }
  var slideTimes = Math.floor((maxCount - ignoreCount) / 2);
  var maxSlideTimes = 0;
  for(var i = 0; i < slideTimes; i++) {
    var enableButtons = this.checkEnabledTableButtons();
    for (var j in enableButtons) {
      this.tapTableMaxValue(enableButtons[j].y, clickIcon);
    }
    if (enableButtons.length == 0 && maxSlideTimes != 0) {
      break;
    } else {
      maxSlideTimes = i;
    }
    this.swipeTableDown(2);
    sleep(this.Const.during);
  }
  return maxSlideTimes * 2;
}

// game controller
EndlessFrontier.prototype.taskDoubleSpeed = function() {
  log('檢查兩倍速度');
  this.goToGame();
  this.tap(this.ButtonMenuStore);
  this.tap(this.ButtonMenuStoreProp);
  this.tap(this.ButtonDoubleSpeed);
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
    this.goToGame();
  }
};

EndlessFrontier.prototype.taskArmy = function() {
  log('檢查自動升級士兵');
  this.goToGame();
  this.tap(this.ButtonMenuArmy);
  this.swipeTableTop();
  sleep(this.Const.during);
  
  var enableButtons = this.checkEnabledTableButtons();
  if (enableButtons.length == 0) {
    return;
  }
  this.checkAndClickTable(0, 12 - 2, false);
}

EndlessFrontier.prototype.taskTask = function() {
  log('檢查自動做任務' + ',跳過' + this.Status.taskTaskIgnore);
  this.goToGame();
  this.tap(this.ButtonMenuTask);

  var enableButtons = this.checkEnabledTableButtons();
  if (enableButtons.length == 0) {
    this.swipeTableTop();
    sleep(this.Const.during);
    this.Status.taskTaskIgnore = Math.floor(this.Status.taskTaskIgnore * 2 / 3);
  }
  log('this.Status.taskTaskIgnore', this.Status.taskTaskIgnore);
  this.Status.taskTaskIgnore += this.checkAndClickTable(this.Status.taskTaskIgnore, 28 - 2, true);
  this.Status.taskTaskIgnore = Math.max(20, this.Status.taskTaskIgnore);
}

EndlessFrontier.prototype.taskWar = function() {
  log('檢查自動打素材');
  this.goToGame();
  this.tap(this.ButtonMenuWar);

  var warIdx = this.Status.taskWarIdx % 5;
  var cellHeight = this.TableCellHeight;
  var rightBtnX = this.ButtonTableRightOther.x;

  var rightBtn1Y = this.ButtonTableRightOther.y;
  var rightBtn2Y = rightBtn1Y + cellHeight;
  var rightBtn3Y = rightBtn2Y + cellHeight;
  var rightBtn4YBottom = this.ButtonTableRightOtherBottom.y - cellHeight;
  var rightBtn5YBottom = this.ButtonTableRightOtherBottom.y;

  var rightBtnYs = [
    rightBtn1Y,
    rightBtn2Y,
    rightBtn3Y,
    rightBtn4YBottom,
    rightBtn5YBottom,
  ];

  this.Status.taskWarIdx++;

  this.swipeTableTop();
  sleep(this.Const.during);

  if (warIdx > 2) {
    this.swipeTableDown(1);
    sleep(this.Const.during);
  }
  
  this.tap({x: rightBtnX, y: rightBtnYs[warIdx]});
  sleep(2000);

  var img = this.screenshot();
  var btnEnable1 = isSameColor(this.Const.ButtonEnableColor, getColor(img, {x: rightBtnX, y: rightBtn1Y}));
  var btnEnable2 = isSameColor(this.Const.ButtonEnableColor, getColor(img, {x: rightBtnX, y: rightBtn2Y}));
  var btnEnable3 = isSameColor(this.Const.ButtonEnableColor, getColor(img, {x: rightBtnX, y: rightBtn3Y}));
  releaseImage(img);

  if (!btnEnable1 && !btnEnable2 && !btnEnable3) {
    this.goBack();
    return;
  } else if (btnEnable3) {
    this.tap({x: rightBtnX, y: rightBtn2Y});
  } else {
    this.tap({x: rightBtnX, y: rightBtn1Y});
  }
  sleep(3000);
  this.goToGame();
}

EndlessFrontier.prototype.taskRevolution = function() {
  log('===轉世===');
  this.goToGame();
  this.tap(this.ButtonMenuArmy);

  this.tap(this.ButtonMenuArmyRevolution);
  this.tap(this.ButtonRevolution);
  this.tap(this.ButtonRevolutionTeam);
  sleep(2000);
  this.goToGame();
}

var ef = new EndlessFrontier();

gTaskController.newTask('taskTreasure', ef.taskTreasure.bind(ef), 300, 0);
gTaskController.newTask('taskTask', ef.taskTask.bind(ef), 40 * 1000, 0);
gTaskController.newTask('taskArmy', ef.taskArmy.bind(ef), 120 * 1000, 0);
gTaskController.newTask('taskWar', ef.taskWar.bind(ef), 100 * 1000, 0);
gTaskController.newTask('taskDoubleSpeed', ef.taskDoubleSpeed.bind(ef), 15 * 60 * 1000, 0);
gTaskController.newTask('taskRevolution', ef.taskRevolution.bind(ef), 40 * 60 * 1000, 0, true);