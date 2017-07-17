/* eslint-disable */

function Task(t,r,s,i){this.createTime=Date.now(),this.taskOrder=i,this.runTimes=0,this.func=r,this.config=s||{},this.taskName=t,this.priority=this.config.priority||DEFAULT_TASK_CONFIG.priority,this.delay=this.config.delay||DEFAULT_TASK_CONFIG.delay,this.maxRunTimes=this.config.times||DEFAULT_TASK_CONFIG.times}function TaskController(t){this.runOverPriority=t.runOverPriority||DEFAULT_CONTROLLER_CONFIG.runOverPriority,this.loopDelay=t.loopDelay||DEFAULT_CONTROLLER_CONFIG.loopDelay,this.isRunning=!1,this.tasks={},this.taskOrder=0,this.taskRunOrder=0}function printTaskStatus(){console.log(JSON.stringify(gTaskController))}var DEFAULT_CONTROLLER_CONFIG={loopDelay:100,runOverPriority:.5},DEFAULT_TASK_CONFIG={priority:5,delay:50,times:1},UiParameters={};Task.prototype.run=function(){return this.runTimes++,this.func(),this.runTimes==this.maxRunTimes},TaskController.prototype.loop=function(){for(console.log("loop start");this.isRunning;){var t=[];for(var r in this.tasks)t.push(this.tasks[r]);if(0!=t.length){t.sort(function(t,r){return t.priority+(this.taskRunOrder-t.taskOrder)*this.runOverPriority<r.priority+(this.taskRunOrder-r.taskOrder)*this.runOverPriority}.bind(this));var s=t[0];sleep(s.delay),s.run()?delete this.tasks[s.taskName]:s.taskOrder=this.taskRunOrder,this.taskRunOrder++}sleep(this.loopDelay)}this.isRunning=!1,console.log("loop stop")},TaskController.prototype.addTask=function(t,r,s){var i=new Task(t,r,s,this.taskOrder++);return this.tasks[t]=i,i},TaskController.prototype.removeTask=function(t){delete this.tasks[t]},TaskController.prototype.removeAllTasks=function(){this.tasks={}},TaskController.prototype.start=function(){this.isRunning||(this.isRunning=!0,this.loop())},TaskController.prototype.stop=function(){this.isRunning=!1};var gTaskController;gTaskController instanceof TaskController&&gTaskController.stop(),gTaskController=new TaskController(DEFAULT_CONTROLLER_CONFIG);

var SCREEN_WIDTH = 0;
var SCREEN_HEIGHT = 0;

var RESIZE_WIDTH = 270;
var RESIZE_HEIGHT = 480;

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


// Huuuge game
function earn100KTask() {
  var x = 1720;
  var y = 520;
  tap(x, y);
}

var BUTTON = {
  allianceInHome: [80, 1750],
  homeInAlliance: [1060, 40],
  exitBannerCancel: [440, 950],
  get100KTab: [890, 1260],
  get100K: [180, 1740],
  homeInGame: [900, 900],
  get10K: [70, 160],
  goToGame: [780, 1520],
  spin: [160, 1830],
  maxBet: [160, 1680],
  plusBet: [130, 900],
  minusBet: [130, 320],
  // autoExitGameOk: [310, 700],
};

var SCREEN = {
  homeIcon: { xy: [1060, 40], color: {r: 27, g: 3, b: 199, a: 0}},
  exitBanner: { xy: [700, 1020], color: {r: 64, g: 0, b: 221, a: 0}},
  alliance: { xy: [900, 30], color: {r: 239, g: 181, b: 106, a: 0}},
  game: { xy: [30, 1200], color: {r: 1, g: 1, b: 1, a: 0}},
  autoExitGame: { xy: [850, 860], color: {r: 64, g: 0, b: 199, a: 0}},
  checkPlayingGame: { xy: [580, 970], color: {r: -100, g: -100, b: -100, a: 0}},
  checkWin: { xy: [30, 275], color: {r: 0, g: 0, b: 0, a: 0}},
};

var GLOBAL = {
  isStart: false,
  gameLastWinTime: 0,
  gameLastInGameTime: 0,
  setMaxBet: false,
  setSmallBet: false,
};

function spin() {
  pressButton(BUTTON.spin);
}

function gameController() {
  var now = Date.now();
  var wimg = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
  
  var nowPage = getCurrentPage(wimg);
  if (nowPage == 'game') {
    var checkColor = getColor(wimg, SCREEN.checkPlayingGame.xy);
    if (!isSameColor(SCREEN.checkPlayingGame.color, checkColor)) {
      GLOBAL.gameLastInGameTime = now;
      SCREEN.checkPlayingGame.color = checkColor;
    }
    var checkWinColor = getColor(wimg, SCREEN.checkWin.xy);
    if (isSameColor(SCREEN.checkWin.color, {r: 0, g: 0, b: 0, a: 0})) {
      // first use, record current color
      SCREEN.checkWin.color = checkWinColor;
    }
    if (!isSameColor(SCREEN.checkWin.color, checkWinColor)) {
      // in win
      if (now - GLOBAL.gameLastWinTime > 6 * 1000) {
        GLOBAL.gameLastWinTime = now;
        console.log('Win', now);
        log('huuuge', 'win-' + now);
        saveImage(wimg, getStoragePath() + '/' + 'huuuge-win-' + now + '.jpg');
        GLOBAL.setMaxBet = true;
        GLOBAL.setSmallBet = false;
      }
    }
    var lastWinDuring = now - GLOBAL.gameLastWinTime;
    if (lastWinDuring < 120 * 1000) {
      if (lastWinDuring > 10 * 1000 && GLOBAL.setMaxBet) {
        console.log('Set max bet');
        GLOBAL.setMaxBet = false;
        sleep(3000);
      }
      pressButton(BUTTON.maxBet);
      GLOBAL.setSmallBet = true;
    } else if (GLOBAL.setSmallBet) {
      GLOBAL.setSmallBet = false;
      sleep(3000);
      pressButton(BUTTON.maxBet);
      sleep(3000);
      pressButton(BUTTON.plusBet);
    }
  }
  // 超過 20 秒都不在遊戲中
  if (now - GLOBAL.gameLastInGameTime > 20 * 1000) {
    console.log('Not palying game. Go home.');
    stopSpin();
    sleep(1 * 1000);
    goBackHome(wimg);
    sleep(5 * 1000);
    pressButton(BUTTON.goToGame);
    sleep(12 * 1000);
    startSpin();
  }
  releaseImage(wimg);
}

// btns
function printColor(img, xy) {
  var xy = toResizeXYs(xy);
  var color = getImageColor(img, xy[0], xy[1]);
  console.log('r: ' + color.r + ', g: ' + color.g + ', b: ' + color.b + ', a: ' + color.a);
};
function getColor(img, xy) {
  var xy = toResizeXYs(xy);
  return getImageColor(img, xy[0], xy[1]);
}
function pressButton(xy) {
  xy = toRotationRXYs(xy);
  tap(xy[0], xy[1], 200);
}
function btnBack() {keycode('BACK', 10);}
function isScreen(img, screen) {
  var xy = toResizeXYs(screen.xy);
  var color = getImageColor(img, xy[0], xy[1]);
  return isSameColor(color, screen.color);
}
function isHomePage(img) {
  var xy = toResizeXYs(SCREEN.homeIcon.xy);
  var color = getImageColor(img, xy[0], xy[1]);
  return isSameColor(color, SCREEN.homeIcon.color);
};
function getCurrentPage(img) {
  for(var key in SCREEN) {
    if (isScreen(img, SCREEN[key])) {
      return key;
    }
  }
  return null;
}
function goBackHome(img) {
  var currentTime = Date.now();
  var delayTime = 5000;
  if (isHomePage(img)) {
    sleep(2000);
  }
  while (true) {
    var cimg = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
    var page = getCurrentPage(cimg);
    if (page == 'homeIcon') {
      if (Date.now() - currentTime > delayTime) {
        releaseImage(cimg);
        console.log('go gack home success');
        break;
      }
    } else if (page == 'game') {
      btnBack();
      sleep(2000);
      pressButton(BUTTON.homeInGame);
      sleep(5000);
      delayTime = 12 * 1000;
    } else {
      btnBack();
    }
    releaseImage(cimg);
    sleep(2000);
  }
  pressButton(BUTTON.get10K);
  sleep(1000);
}

function startSpin() {
  console.log('start play game...');
  GLOBAL.gameLastInGameTime = Date.now();
  GLOBAL.gameLastWinTime = Date.now();
  SCREEN.checkWin.color = {r: 0, g: 0, b: 0, a: 0};
  gTaskController.addTask('spin', spin, {priority: 10, delay:100, times: -1});
  gTaskController.addTask('gameController', gameController, {priority: 0, delay:0, times: -1});
  gTaskController.start();
}

function stopSpin() {
  gTaskController.stop();
  gTaskController.removeAllTasks();
}

function stop() {
  stopSpin();
  GLOBAL.isStart = false;
}

function start() {
  if (GLOBAL.isStart) {
    return;
  }
  GLOBAL.isStart = true;
  console.log('start...');
  sleep(500);
  stopSpin();
  sleep(500);
  var img = getScreenshotModify(0, 0, 0, 0, RESIZE_WIDTH, RESIZE_HEIGHT);
  var nowPage = getCurrentPage(img);
  if (nowPage == 'game') {
    console.log('run play game');
  } else {
    goBackHome(img);
    // get 100k in alliance
    console.log('collect 100k...');
    pressButton(BUTTON.allianceInHome);
    sleep(6000);
    pressButton(BUTTON.get100KTab);
    sleep(2000);
    for(var i = 0; i < 10; i++) {
      pressButton(BUTTON.get100K);
      sleep(1200);
    }
    goBackHome(img);
    sleep(2000);
  }
  pressButton(BUTTON.goToGame);
  sleep(8 * 1000);
  startSpin();
  releaseImage(img);
}

// start();
