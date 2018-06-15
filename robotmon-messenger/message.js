// Initialize Firebase
var config = {
  apiKey: "AIzaSyBdoy4YKI6GNkpMygh15CvgA9j7X57Jv-4",
  authDomain: "robotmon-98370.firebaseapp.com",
  databaseURL: "https://robotmon-98370.firebaseio.com",
  projectId: "robotmon-98370",
  storageBucket: "robotmon-98370.appspot.com",
  messagingSenderId: "640484500823"
};
firebase.initializeApp(config);
var db = firebase.firestore();
db.settings({timestampsInSnapshots: true});

var gIsLogin = false;
var gReadTime = Date.now() + 86400000;

function initApp() {
  $("#read-more").attr("disabled", true);
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      readMessages();
      $("#logo").hide();
      $("#login-container").hide();
      $("#topMsg-container").show();
      $("#messages").show();
    } else {
      $("#logo").show();
      $("#login-container").show();
      $("#topMsg-container").hide();
      $("#messages").hide();
    }
    updateSignButton();
    $(".user-login").attr("disabled", false);
  });
  
  $("#login-google").click(function() {
    $(".user-login").attr("disabled", true);
    startSignIn("signInGoogle");
  });
  $("#login-facebook").click(function() {
    $(".user-login").attr("disabled", true);
    startSignIn("signInFacebook");
  });
  $(".user-logout").click(function() {
    startSignIn();
  });

  $("#read-more").click(function() {
    $("#read-more").attr("disabled", true);
    readMessages();
  });
}

function handleError(msg) {
  console.log(msg);
}

Date.prototype.Format = function (fmt) { 
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function toast(date) {
  $("#snackbar").text(date.Format("yyyy-MM-dd hh:mm:ss"));
  $("#snackbar").toggleClass("show");
  setTimeout(function() { 
    $("#snackbar").toggleClass("show");
  }, 1500);
}

function handleMessage(msgObj) {
  $("#topMsg").html(msgObj.topMsg);
  var html = $("<div class='msg_group'></div>");
  for(var i in msgObj.messages) {
    var msg = msgObj.messages[i];

    var msgDate = new Date(msg.t);
    var time = msgDate.getTime();
    if (Date.now() - time < 86400000) {
      time = msgDate.Format("hh:mm");
    } else {
      time = msgDate.Format("MM-dd hh:mm");
    }

    var msgTime = $("<span class='msg_time'>" + time + "</span>");
    msgTime.mouseenter(function() {
      toast(msgDate);
    });
    var msgObject = $("<div class='msg_obj'></div>");
    var msgIcon = $("<img class='msg_logo' src='icon.png'/>");
    msgObject.append(msgIcon);
    if (msg.m.length > 90) {
      msgObject.append("<img src='data:image/png;base64, " + msg.m + "' />");
    } else {
      msgObject.append("<div class='msg_text'>" + msg.m + "</div>");
    }
    msgObject.append($("<div></div>").append(msgTime));
    html.append(msgObject);
  }
  $("#messages").prepend(html);
}

function readMessages() {
  var user = firebase.auth().currentUser;
  if (!user) {
    return;
  }
  var messagesRef = db
    .collection("users")
    .doc(user.uid)
    .collection("messages")
    .where("timestamp", "<", gReadTime)
    .orderBy("timestamp", "desc")
    .limit(1);
  messagesRef.get().then(function(msgSnapshot) {
    msgSnapshot.forEach(function(msgDoc) {
      var groupTime = +msgDoc.id;
      var msgObj = msgDoc.data();
      gReadTime = groupTime;
      handleMessage(msgObj);
    });
    $("#read-more").attr("disabled", false);
  }).catch(function(error) {
    handleError("Error getting collection: " + error);
  });
}

function updateSignButton() {
  if (firebase.auth().currentUser) {
    $(".user-login").hide();
    $(".user-logout").show();
  } else {
    $(".user-login").show();
    $(".user-logout").hide();
  }
}

function startSignIn(type) {
  $(".user-login").attr("disabled", true);
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
    $("#topMsg").html("");
    $("#messages").html("");
  } else {
    chrome.runtime.sendMessage({type:type});
  }
}

window.onload = function() {
  initApp();
};