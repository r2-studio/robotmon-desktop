// TODO(DEVELOPER): Change the values below using values from the initialization snippet: Firebase Console > Overview > Add Firebase to your web app.
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

function handleMessage(msgObj) {
  $("#topMsg").html(msgObj.topMsg);
  var html = "<div class='msg_group'>";
  for(var i in msgObj.messages) {
    var msg = msgObj.messages[i];
    html += "<div class='msg_obj'>";
    html += "  <div class='msg_time'>";
    html += new Date(msg.t).toString();
    html += "  </div>"
    html += "  <div class='msg_content'>";
    if (msg.m.length > 90) {
      html += "<img src='data:image/png;base64, " + msg.m + "' />";
    } else {
      html += msg.m;
    }
    html += "  </div>"
    html += "</div>"
  }
  html += "</div>";
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
  console.log('updateSignButton')
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