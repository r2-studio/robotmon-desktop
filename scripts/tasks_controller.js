/* eslint-disable */

var DEFAULT_CONTROLLER_CONFIG = {
  loopDelay: 100,
  runOverPriority: 0.5,
};

var DEFAULT_TASK_CONFIG = {
  priority: 5,
  delay: 50,
  times: 1, // 0 means no limit
};

var UiParameters = {

};

function Task(name, func, config, order) {
  this.createTime = Date.now();
  this.taskOrder = order;
  this.runTimes = 0;

  this.func = func;
  this.config = config || {};
  this.taskName = name;
  this.priority = this.config.priority || DEFAULT_TASK_CONFIG.priority;
  this.delay = this.config.delay || DEFAULT_TASK_CONFIG.delay;
  this.maxRunTimes = this.config.times || DEFAULT_TASK_CONFIG.times;
}

Task.prototype.run = function () {
  this.runTimes++;
  this.func();
  return this.runTimes == this.maxRunTimes; // remove task?
}

function TaskController(config) {
  this.runOverPriority = config.runOverPriority || DEFAULT_CONTROLLER_CONFIG.runOverPriority;
  this.loopDelay = config.loopDelay || DEFAULT_CONTROLLER_CONFIG.loopDelay;

  this.isRunning = false;
  this.tasks = {};
  this.taskOrder = 0;
  this.taskRunOrder = 0;
}

TaskController.prototype.loop = function() {
  console.log('loop start');
  while(this.isRunning) {
    var tmpTasks = [];
    for (var key in this.tasks) {
      tmpTasks.push(this.tasks[key]);
    }
    if (tmpTasks.length != 0) {
      tmpTasks.sort(function(a, b) {
        var ap = a.priority + (this.taskRunOrder - a.taskOrder) * this.runOverPriority;
        var bp = b.priority + (this.taskRunOrder - b.taskOrder) * this.runOverPriority;
        // console.log(a.taskName, ap, this.taskRunOrder - a.taskOrder, 'b',bp, this.taskRunOrder - b.taskOrder);
        return ap < bp;
      }.bind(this)); // desc
      var task = tmpTasks[0];
      sleep(task.delay);
      var isRemove = task.run();
      if (isRemove) {
        delete this.tasks[task.taskName];
      } else {
        task.taskOrder = this.taskRunOrder;
      }
      this.taskRunOrder++;
    }
    sleep(this.loopDelay);
  }
  this.isRunning = false;
  console.log('loop stop');
};

TaskController.prototype.addTask = function (taskName, func, config) {
  var task = new Task(taskName, func, config, this.taskOrder++);
  this.tasks[taskName] = task;
  return task;
}

TaskController.prototype.removeTask = function (taskName) {
  delete this.tasks[taskName];
}

TaskController.prototype.removeAllTasks = function() {
  this.tasks = {};
}

TaskController.prototype.start = function () {
  if (!this.isRunning) {
    this.isRunning = true;
    this.loop();
  }
}

TaskController.prototype.stop = function () {
  this.isRunning = false;
}

function printTaskStatus() {
  console.log(JSON.stringify(gTaskController));
}

var gTaskController;

if (!gTaskController instanceof TaskController) {
  console.log('New TaskController...');
  gTaskController = new TaskController(DEFAULT_CONTROLLER_CONFIG);
} else {
  console.log('TaskController is running...');
}
gTaskController.start();