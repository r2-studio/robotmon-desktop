/* eslint-disable */

function earn100KTask() {
  var x = 1720;
  var y = 520;
  tap(x, y);
}

function screenshot() {
  console.log(Date.now());
  var img = getScreenshot();
  console.log(Date.now());
  var color = getImageColor(img, 196, 553);
  console.log(Date.now(), color.r, color.g, color.b, color.a);//bug bgra
  releaseImage(img);
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