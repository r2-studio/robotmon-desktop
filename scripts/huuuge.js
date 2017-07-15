/* eslint-disable */

var SCREEN_WIDTH = 0;
var SCREEN_HEIGHT = 0;

var RESIZE_WIDTH = 270;
var RESIZE_HEIGHT = 480;

function initScreenWH() {
  if (SCREEN_WIDTH == 0 || SCREEN_HEIGHT == 0) {
    var size = getScreenSize();
    SCREEN_WIDTH = size[0];
    SCREEN_HEIGHT = size[1];
  }
}
// must call first
initScreenWH();

// Utils
function toResizeXY(x, y) {
  var rx = x * RESIZE_WIDTH / SCREEN_WIDTH;
  var ry = y * RESIZE_HEIGHT / SCREEN_HEIGHT;
  return [rx, ry];
}

function toRotationRXY(x, y) {
  return [y, SCREEN_WIDTH - x];
}

function toRotationLXY(x, y) {
  return [SCREEN_HEIGHT - y, x];
}


// Huuuge game
function earn100KTask() {
  var x = 1720;
  var y = 520;
  tap(x, y);
}

function cropAndGetMoneyNumbers() {
  console.log(Date.now());
  var img = getScreenshot();
  var rImg = resizeImage(img, RESIZE_WIDTH, RESIZE_HEIGHT);
  var cImg = cropImage(rImg, 970, 225, 40);
  console.log(Date.now());
  // var color = getImageColor(img, 196, 553);
  // console.log(Date.now(), color.r, color.g, color.b, color.a);//bug bgra
  releaseImage(img);
  releaseImage(rImg);
}

function spin() {
  var x = 1830;
  var y = 930;
  tap(x, y);
}


// gTaskController.addTask('earn100KTask', earn100KTask, {delay:900, times: 900});
gTaskController.addTask('spin', spin, {priority: 10, delay:100, times: -1});
// gTaskController.addTask('screenshot', screenshot, {priority: 0, delay:0, times: -1});

// delay 100, run 300 times, 1 min, spin 50

// cropAndGetMoneyNumbers();