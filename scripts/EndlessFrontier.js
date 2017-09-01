/* eslint-disable */

function Task(name, func, times, during) {
  this.name = name;
  this.func = func;
  this.times = times;
  this.during = during;
}

Task.prototype.run = function() {
  var loop = function (func, times, during) {
    if (times) {
      func();
      times = times - 1;
      sleep(during);
      loop(func, times);
    }
  }
  var times = this.times;
  loop(this.func, times, this.during);
}

function TaskController(during) {
  this.during = during;
  this.isRunning = false;
  this.tasks = {};
}

TaskController.prototype.loop = function() {  
  if (this.isRunning) {
    for (var taskName in this.tasks) {
     this.tasks[taskName].run();
    }
    sleep(this.during);
    this.loop();
  }
}

TaskController.prototype.addTask = function(taskName, func, times, during) {
  var task = new Task(taskName, func, times, during);
  this.tasks[taskName] = task;
}

TaskController.prototype.removeTask = function(taskName) {
  delete this.tasks[taskName];
}

TaskController.prototype.removeAllTasks = function() {
  log('[任務控制器] 移除所有任務');
  this.tasks = {};
  this.stop();
}

TaskController.prototype.start = function() {
  if (!this.isRunning) {
    log('[任務控制器] 啟動');
    this.isRunning = true;
    this.loop(this.tasks, this.isRunning);
  }
}

TaskController.prototype.stop = function() {
  log('[任務控制器] 停止');
  this.isRunning = false;
}

var gTaskController = new TaskController(500);

var SCREEN_WIDTH = 0;
var SCREEN_HEIGHT = 0;

var RESIZE_WIDTH = 270;
var RESIZE_HEIGHT = 480;

function log() {
  sleep(100);
  console.log.apply(console, arguments);
}

function initScreenWH() {
  if (SCREEN_WIDTH == 0 || SCREEN_HEIGHT == 0) {
    var size = getScreenSize();
    SCREEN_WIDTH = size.width;
    SCREEN_HEIGHT = size.height;
  }
}
// must call first
initScreenWH();

// Utils
function toResizeXY(x, y) {
  var rx = Math.floor(x * RESIZE_WIDTH / SCREEN_WIDTH);
  var ry = Math.floor(y * RESIZE_HEIGHT / SCREEN_HEIGHT);
  return [rx, ry];
}

function toResizeXYs(xy) {
  return toResizeXY(xy[0], xy[1]);
}

function toRotationRXY(x, y) {
  return [y, SCREEN_WIDTH - x];
}

function toRotationObjectRXY(position) {
  return {x: position.y, y: SCREEN_WIDTH - position.x};
}

function toRotationRXYs(xy) {
  return toRotationRXY(xy[0], xy[1]);
}

function toRotationLXY(x, y) {
  return [SCREEN_HEIGHT - y, x];
}

function toRotationLXYs(xy) {
  return toRotationLXY(xy[0], xy[1]);
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

var DEFAULT_CHECK_CONFIG = {
  isCheckTask: false,
  isCheckTreasure: true,
  isCheckAutoTask: false,
  isCheckArmy: false,
  isCheckDoubleSpeed: true,
  isCheckRevolution: true,
  revolutionMinutes: 10,
  hasVirtualButtonBar: false,
};

var GLOBAL = {
  lastRevolutionTime: new Date().getTime(),
  checkConfig: DEFAULT_CHECK_CONFIG,
};

var ROW_HEIGHT = 185;
var VIRTUAL_BUTTON_BAR_HEIGHT = 140;
var DURING = 300;
var DURING_DOUBLE_SPEED_SLEEP = 30 * 60 * 1000;
var DURING_AD = 50 * 1000;
var DURING_REVOLUTION = 60 * 1000;

var ButtonBack = {x: 250, y: 1850};
var ButtonLandscapedBack = toRotationObjectRXY(ButtonBack);
var ButtonMenuTask = {x: 90, y: 1700};
var ButtonMenuArmy = {x: 270, y: 1700};
var ButtonMenuArmyRevolution = {x: 725, y: 920};
var ButtonRevolution = {x: 930, y: 1680};
var ButtonRevolutionTeam = {x: 500, y: 1180};
var ButtonRevolutionDone = {x: 620, y: 1700};
var ButtonMenuStore = {x: 1000, y: 1700};
var ButtonMenuStoreProp = {x: 700, y: 750};
var ButtonTaskIcon = {x: 100, y: 1070};
var ButtonTaskMoney = {x: 1040, y: 1070};
var ButtonTaskMax = {x: 420, y: 1060};
var ButtonAutoTask = {x: 1040, y: 900};
var ButtonUnopenedTask = {x: 630, y: 1120};
var ButtonTooLongBack = {x: 650, y: 1450};
var ButtonDiamondFree = {x: 650, y: 1250};
var ButtonDiamondSeeAd = {x: 460, y: 1130};
var ButtonDiamondCancel = {x: 780, y: 1130};
var ButtonDoubleSpeed = {x: 1010, y: 1093};
var ButtonTaskInfoCancel = {x: 620, y: 1410};
var ButtonArmyInfoCancel = {x: 1020, y: 260};
var ButtonNetwork = {x: 650, y: 1093};
var ButtonExitGame = {x: 820, y: 990};
var AdButtonBottomRightCancel = {x: 1036, y: 1736};
var AdButtonTopRightCancel = {x: 1003, y: 83};
var AdButtonTopLeftCancel = {x: 73, y: 73};
var AdButtonPersonalizedOK = {x: 750, y: 820};
var AdBackground = {x: 160, y: 1750};
var AdInfoIconBottomLeft = {x: 20, y: 1756};
var AdInfoIconTopRight = {x: 1056, y: 20};
var Treasure = {x: 550, y: 550};

var ButtonEnabledColor = {r: 1, g:1, b: 1, a: 0};
var ButtonArmyInfoCancelColor = {r: 102, g:72, b: 161, a: 0};
var AdButtonBottomRightCancelColor = {r: 195, g:195, b: 195, a: 0};
var AdButtonTopRightCancelColor = {r: 203, g:203, b: 203, a: 0};
var AdButtonTopLeftCancelColor = {r: 0, g:11, b: 0, a: 0};
var AdButtonPersonalizedOKColor = {r: 209, g:120, b: 6, a: 0};
var AdBackgroundColorWhite = {r: 255, g:255, b: 255, a: 0};
var AdBackgroundColorLight = {r: 224, g:224, b: 224, a: 0};
var AdBackgroundColorDark = {r: 1, g:1, b: 1, a: 0};
var AdIconColor = {r: 176, g:176, b: 176, a: 0};
var AdIconColor2 = {r: 204, g:190, b: 192, a: 0};

function printColor(img, xy) {
  var xy = toResizeXYs(xy);
  var color = getImageColor(img, xy[0], xy[1]);
  log('r: ' + color.r + ', g: ' + color.g + ', b: ' + color.b + ', a: ' + color.a);
};

function getColor(img, xy) {
  var xy = toResizeXYs(xy);
  return getImageColor(img, xy[0], xy[1]);
}

function goToNextRow() {
  var x = 900;
  var y1 = 1500;
  var y2 = 1265;

  tapDown(x, y1);
  sleep(DURING);

  var count = (y1 - y2) / 50;
  for (var i = 1; i < count; i++) {
    moveTo(x, y1 - i * 50);
    sleep(DURING);
  }

  moveTo(x, y2);
  sleep(DURING);
  tapUp(x, y2);
}

function goToPreviousRow() {
  var x = 900;
  var y1 = 1500;
  var y2 = 1265;

  tapDown(x, y2);
  sleep(DURING);

  var count = (y1 - y2) / 50;
  for (var i = 1; i < count; i++) {
    moveTo(x, y2 + i * 50);    
    sleep(DURING);
  }

  moveTo(x, y1);
  sleep(DURING);
  tapUp(x, y1);
}

function goToPreviousRowHalf() {
  var x = 900;
  var y1 = 1500;
  var y2 = 1382;

  tapDown(x, y2);
  sleep(DURING);

  var count = (y1 - y2) / 50;
  for (var i = 1; i < count; i++) {
    moveTo(x, y2 + i * 50);    
    sleep(DURING);
  }

  moveTo(x, y1);
  sleep(DURING);
  tapUp(x, y1);
}

function taps(x, y, times) {
  for (var i = 0; i < times; i++) {
    tap(x, y)
    sleep(DURING);
  }
}

function pressTaskButton(rowIndex, clickTimes) {
  var diffHeight = rowIndex * ROW_HEIGHT;
  var screenshot = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
  var checkColor = getColor(screenshot, [ButtonTaskMoney.x, ButtonTaskMoney.y + diffHeight]);
  var checkColor2 = getColor(screenshot, [ButtonTaskMoney.x, ButtonTaskMoney.y + diffHeight + ROW_HEIGHT / 2]);    
  releaseImage(screenshot);
  if (isSameColor(ButtonEnabledColor, checkColor)) {
    tap(ButtonTaskIcon.x, ButtonTaskIcon.y + diffHeight)
    sleep(DURING);
    taps(ButtonTaskMoney.x, ButtonTaskMoney.y + diffHeight, clickTimes);
  } else if (isSameColor(ButtonEnabledColor, checkColor2)) {
    tap(ButtonTaskIcon.x, ButtonTaskMoney.x, ButtonTaskMoney.y + diffHeight + ROW_HEIGHT / 2)
    sleep(DURING);
    taps(ButtonTaskMoney.x, ButtonTaskMoney.y + diffHeight + ROW_HEIGHT / 2, clickTimes);
    sleep(DURING);
    goToPreviousRowHalf();
    return;
  } else {
    sleep(DURING)
    goToPreviousRow();
    return;
  }

  var screenshot = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
  var checkColor = getColor(screenshot, [ButtonTaskMax.x, ButtonTaskMax.y + diffHeight]);
  releaseImage(screenshot);
  if (isSameColor(ButtonEnabledColor, checkColor)) {
    taps(ButtonTaskMax.x, ButtonTaskMax.y + diffHeight, clickTimes);
  }

  var screenshot = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
  var checkColor = getColor(screenshot, [ButtonTaskInfoCancel.x, ButtonTaskInfoCancel.y]);
  releaseImage(screenshot);
  if (isSameColor(ButtonEnabledColor, checkColor)) {
    tap(ButtonTaskInfoCancel.x, ButtonTaskInfoCancel.y);
    sleep(DURING);
  }
}

function pressArmyButton(rowIndex, clickTimes) {
  var diffHeight = rowIndex * ROW_HEIGHT;
  var screenshot = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
  var checkColor = getColor(screenshot, [ButtonTaskMoney.x, ButtonTaskMoney.y + diffHeight]);
  releaseImage(screenshot);
  if (isSameColor(ButtonEnabledColor, checkColor)) {
    taps(ButtonTaskMoney.x, ButtonTaskMoney.y + diffHeight, clickTimes);
  } else {
    return;
  }

  var screenshot = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
  var checkColor = getColor(screenshot, [ButtonTaskMax.x, ButtonTaskMax.y + diffHeight]);
  releaseImage(screenshot);
  if (isSameColor(ButtonEnabledColor, checkColor)) {
    taps(ButtonTaskMax.x, ButtonTaskMax.y + diffHeight, clickTimes);
  }

  tap(ButtonArmyInfoCancel.x, ButtonArmyInfoCancel.y + VIRTUAL_BUTTON_BAR_HEIGHT);
  sleep(DURING);
}

function checkTooLongBack() {
  var screenshot = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
  var checkColor = getColor(screenshot, [ButtonTooLongBack.x, ButtonTooLongBack.y]);
  releaseImage(screenshot);
  if (isSameColor(ButtonEnabledColor, checkColor)) {
    tap(ButtonTooLongBack.x, ButtonTooLongBack.y);
    sleep(DURING);
  }
}

function pressBackButton() {
  // keycode('BACK', DURING);
  tap(ButtonBack.x, ButtonBack.y);
  sleep(DURING);
  
  tap(ButtonLandscapedBack.x, ButtonLandscapedBack.y);
  sleep(DURING);
}

function checkAd() {
  var screenshot = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
  var checkColor = getColor(screenshot, [ButtonDiamondFree.x, ButtonDiamondFree.y + VIRTUAL_BUTTON_BAR_HEIGHT / 2]);
  releaseImage(screenshot);
  if (isSameColor(ButtonEnabledColor, checkColor)) {
    log('[寶箱] 恭喜你撿到免費鑽石 :)');
    tap(ButtonDiamondFree.x, ButtonDiamondFree.y + VIRTUAL_BUTTON_BAR_HEIGHT / 2);
    sleep(2000);
  } else {
    log('[寶箱] 觀看廣告拿鑽石 :(');
    sleep(DURING_AD);
    checkTooLongBack();
  }
  
  var screenshot = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
  var checkColor = getColor(screenshot, [AdBackground.x, AdBackground.y + VIRTUAL_BUTTON_BAR_HEIGHT]);
  if (isSameColor(AdBackgroundColorWhite, checkColor) || isSameColor(AdBackgroundColorLight, checkColor) || isSameColor(AdBackgroundColorDark, checkColor)) {
    pressBackButton();
    sleep(1000);
    checkTooLongBack();
    releaseImage(screenshot);
    return;
  }

  var checkColor = getColor(screenshot, [AdInfoIconBottomLeft.x, AdInfoIconBottomLeft.y + VIRTUAL_BUTTON_BAR_HEIGHT]);
  if (isSameColor(AdIconColor, checkColor)) {
    pressBackButton();
    sleep(1000);
    checkTooLongBack();
    releaseImage(screenshot);
    return;
  }

  var checkColor = getColor(screenshot, [AdInfoIconTopRight.x, AdInfoIconTopRight.y]);
  if (isSameColor(AdIconColor2, checkColor)) {
    pressBackButton();
    sleep(1000);
    checkTooLongBack();
    releaseImage(screenshot);
    return;
  }

  var checkColor = getColor(screenshot, [AdButtonTopRightCancel.x, AdButtonTopRightCancel.y]);
  if (isSameColor(AdButtonTopRightCancelColor, checkColor)) {
    tap(AdButtonTopRightCancel.x, AdButtonTopRightCancel.y);
    sleep(2000);
    checkTooLongBack();
    releaseImage(screenshot);
    return;
  }

  var checkColor = getColor(screenshot, [AdButtonTopLeftCancel.x, AdButtonTopLeftCancel.y]);
  if (isSameColor(AdButtonTopLeftCancelColor, checkColor)) {
    tap(AdButtonTopLeftCancel.x, AdButtonTopLeftCancel.y);
    sleep(2000);
    checkTooLongBack();
    releaseImage(screenshot);
    return;
  }

  var checkColor = getColor(screenshot, [AdButtonPersonalizedOK.x, AdButtonPersonalizedOK.y]);
  if (isSameColor(AdButtonPersonalizedOKColor, checkColor)) {
    pressBackButton();
    sleep(1000);
    checkTooLongBack();
    releaseImage(screenshot);
    return;
  }

  var checkColor = getColor(screenshot, [AdButtonBottomRightCancel.x, AdButtonBottomRightCancel.y + VIRTUAL_BUTTON_BAR_HEIGHT]);
  if (isSameColor(AdButtonBottomRightCancelColor, checkColor)) {
    pressBackButton();
    sleep(1000);
    checkTooLongBack();
    releaseImage(screenshot);
    return;
  }
  
  sleep(2000);
  pressBackButton();
  sleep(1000);
  checkTooLongBack();
}

function checkTreasure() {
  log('檢查自動開寶箱');
  taps(Treasure.x, Treasure.y, 10);

  var screenshot = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
  var checkColor = getColor(screenshot, [ButtonDiamondSeeAd.x, ButtonDiamondSeeAd.y]);
  releaseImage(screenshot);
  if (isSameColor(ButtonEnabledColor, checkColor)) {
    log('[寶箱] 是鑽石寶箱阿！！！');
    tap(ButtonDiamondSeeAd.x, ButtonDiamondSeeAd.y);
    sleep(2000);
    checkAd();
  }
}

function checkTask() {
  log('檢查自動完成任務');
  tap(ButtonMenuTask.x, ButtonMenuTask.y + VIRTUAL_BUTTON_BAR_HEIGHT);
  sleep(DURING);

  var screenshot = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
  var checkColor = getColor(screenshot, [ButtonTaskMoney.x, ButtonTaskMoney.y + ROW_HEIGHT * 2]);
  releaseImage(screenshot);
  if (isSameColor(ButtonEnabledColor, checkColor)) {
    sleep(DURING)
    goToNextRow();
    return;
  }
  
  pressTaskButton(0, 4);
  pressTaskButton(1, 4);
}

function checkArmy() {
  log('檢查自動完成士兵');
  // Go to army list
  tap(ButtonMenuArmy.x, ButtonMenuArmy.y + VIRTUAL_BUTTON_BAR_HEIGHT);
  sleep(DURING);

  for (var i = 0; i < 9; i++) {
    pressArmyButton(0, 4);
    pressArmyButton(1, 4);
    pressArmyButton(2, 4);
    pressArmyButton(3, 4);
    if (!GLOBAL.checkConfig.hasVirtualButtonBar) {
      pressArmyButton(4, 4);
    }
    sleep(DURING)
    goToNextRow();
  }
  for (var i = 0; i < 9; i++) {
    sleep(DURING)
    goToPreviousRow();
  }

  // Go back to task list
  tap(ButtonMenuTask.x, ButtonMenuTask.y + VIRTUAL_BUTTON_BAR_HEIGHT);
  sleep(DURING);
}

function checkAutoTask() {
  log('檢查自動完成自動任務');
  tap(ButtonMenuTask.x, ButtonMenuTask.y + VIRTUAL_BUTTON_BAR_HEIGHT);
  sleep(DURING);

  var screenshot = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
  var checkColor = getColor(screenshot, [ButtonAutoTask.x, ButtonAutoTask.y]);
  releaseImage(screenshot);
  if (isSameColor(ButtonEnabledColor, checkColor)) {
    tap(ButtonAutoTask.x, ButtonAutoTask.y);
    sleep(DURING)

    var screenshot = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
    var checkColor = getColor(screenshot, [ButtonUnopenedTask.x, ButtonUnopenedTask.y]);
    releaseImage(screenshot);
    if (isSameColor(ButtonEnabledColor, checkColor)) {
      tap(ButtonUnopenedTask.x, ButtonUnopenedTask.y);
      sleep(DURING)
    }
  }
}

function checkDoubleSpeed() {
  log('檢查自動兩倍遊戲加速');
  tap(ButtonMenuStore.x, ButtonMenuStore.y + VIRTUAL_BUTTON_BAR_HEIGHT);
  sleep(DURING);
  tap(ButtonMenuStoreProp.x, ButtonMenuStoreProp.y);
  sleep(DURING);

  var screenshot = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
  var checkColor = getColor(screenshot, [ButtonDoubleSpeed.x, ButtonDoubleSpeed.y]);
  releaseImage(screenshot);
  if (!isSameColor(ButtonEnabledColor, checkColor)) {
    tap(ButtonDoubleSpeed.x, ButtonDoubleSpeed.y);
    sleep(2000);
    checkAd();
  }

  // Go back to task list
  tap(ButtonMenuTask.x, ButtonMenuTask.y + VIRTUAL_BUTTON_BAR_HEIGHT);
  sleep(DURING);
}

function checkRevolution() {
  var time = new Date().getTime();
  var revolutionMilliseconds = DURING_REVOLUTION * GLOBAL.checkConfig.revolutionMinutes;
  log('檢查自動定時轉世: 剩下 ' + Math.round((revolutionMilliseconds - (time - GLOBAL.lastRevolutionTime)) / 1000) + ' 秒');
  if (time - GLOBAL.lastRevolutionTime <= revolutionMilliseconds) {
    return;
  }
  
  tap(ButtonMenuArmy.x, ButtonMenuArmy.y + VIRTUAL_BUTTON_BAR_HEIGHT);
  sleep(1000);
  tap(ButtonMenuArmyRevolution.x, ButtonMenuArmyRevolution.y)
  sleep(2000);

  var screenshot = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
  var checkColor = getColor(screenshot, [ButtonRevolution.x, ButtonRevolution.y + VIRTUAL_BUTTON_BAR_HEIGHT]);
  releaseImage(screenshot);
  if (isSameColor(ButtonEnabledColor, checkColor)) {
    tap(ButtonRevolution.x, ButtonRevolution.y + VIRTUAL_BUTTON_BAR_HEIGHT)
    sleep(2000);
    tap(ButtonRevolutionTeam.x, ButtonRevolutionTeam.y)
    sleep(20 * 1000);
    tap(ButtonRevolutionDone.x, ButtonRevolutionDone.y + VIRTUAL_BUTTON_BAR_HEIGHT)
    sleep(DURING);
    GLOBAL.lastRevolutionTime = time;
  }
  
  tap(ButtonMenuTask.x, ButtonMenuTask.y + VIRTUAL_BUTTON_BAR_HEIGHT);
  sleep(DURING);
}

function checkAccidentlyPressed() {
  console.log('檢查意外點擊');
  var screenshot = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
  var checkColor = getColor(screenshot, [ButtonTaskInfoCancel.x, ButtonTaskInfoCancel.y]);
  if (isSameColor(ButtonEnabledColor, checkColor)) {
    tap(ButtonTaskInfoCancel.x, ButtonTaskInfoCancel.y);
    sleep(DURING);
  }

  tap(ButtonArmyInfoCancel.x, ButtonArmyInfoCancel.y + VIRTUAL_BUTTON_BAR_HEIGHT);
  sleep(DURING);
  
  var checkColor = getColor(screenshot, [ButtonTooLongBack.x, ButtonTooLongBack.y]);
  if (isSameColor(ButtonEnabledColor, checkColor)) {
    tap(ButtonTooLongBack.x, ButtonTooLongBack.y);
    sleep(DURING);
  }

  var checkColor = getColor(screenshot, [ButtonNetwork.x, ButtonNetwork.y]);
  if (isSameColor(ButtonEnabledColor, checkColor)) {
    tap(ButtonNetwork.x, ButtonNetwork.y);
    sleep(DURING);
  }

  var checkColor = getColor(screenshot, [ButtonExitGame.x, ButtonExitGame.y + VIRTUAL_BUTTON_BAR_HEIGHT / 2]);
  if (isSameColor(ButtonEnabledColor, checkColor)) {
    tap(ButtonExitGame.x, ButtonExitGame.y + VIRTUAL_BUTTON_BAR_HEIGHT / 2);
    sleep(DURING);
  }

  releaseImage(screenshot);
}

function priority25Task() {
  if (GLOBAL.checkConfig.isCheckTreasure) {
    checkTreasure();
  }
  if (GLOBAL.checkConfig.isCheckTask) {
    checkTask();
  }
  checkAccidentlyPressed();
}

function priority0Task() {
  if (GLOBAL.checkConfig.isCheckAutoTask) {
    checkAutoTask();
  }
  if (GLOBAL.checkConfig.isCheckArmy) {
    checkArmy();
  }
  if (GLOBAL.checkConfig.isCheckDoubleSpeed) {
    checkDoubleSpeed();
  }
  if (GLOBAL.checkConfig.isCheckRevolution) {
    checkRevolution();
  }
  checkAccidentlyPressed();
}

function stop() {
  log('[無盡的邊疆] 停止');
  gTaskController.removeAllTasks();
}

function start(isCheckTask, isCheckTreasure, isCheckAutoTask, isCheckArmy, isCheckDoubleSpeed, isCheckRevolution, revolutionMinutes, hasVirtualButtonBar) {
  log('[無盡的邊疆] 啟動');
  
  GLOBAL.lastRevolutionTime = new Date().getTime();
  GLOBAL.checkConfig = {
    isCheckTask: isCheckTask,
    isCheckTreasure: isCheckTreasure,
    isCheckAutoTask: isCheckAutoTask,
    isCheckArmy: isCheckArmy,
    isCheckDoubleSpeed: isCheckDoubleSpeed,
    isCheckRevolution: isCheckRevolution,
    revolutionMinutes: revolutionMinutes,
    hasVirtualButtonBar: hasVirtualButtonBar,
  };
 
  if (hasVirtualButtonBar) {
    VIRTUAL_BUTTON_BAR_HEIGHT = 0;
  } else {
    VIRTUAL_BUTTON_BAR_HEIGHT = 140;
  }

  log(JSON.stringify(GLOBAL.checkConfig));
  stop();

  gTaskController = new TaskController(500);
  gTaskController.addTask('priority25Task', priority25Task, 20, 500);
  gTaskController.addTask('priority0Task', priority0Task, 1);
  gTaskController.start();
};

// start(DEFAULT_CHECK_CONFIG.isCheckTask, DEFAULT_CHECK_CONFIG.isCheckTreasure, DEFAULT_CHECK_CONFIG.isCheckAutoTask, DEFAULT_CHECK_CONFIG.isCheckArmy, DEFAULT_CHECK_CONFIG.isCheckDoubleSpeed, DEFAULT_CHECK_CONFIG.isCheckRevolution, DEFAULT_CHECK_CONFIG.revolutionMinutes, DEFAULT_CHECK_CONFIG.hasVirtualButtonBar);