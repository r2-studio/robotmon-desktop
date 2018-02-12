 var index = {
    init: function() {
        // Wait for astilectron to be ready
        document.addEventListener('astilectron-ready', function() {
            index.listen();
            astilectron.sendMessage({"name": "envTest"});
        })
    },
    listen: function() {
        astilectron.onMessage(function(message) {
            // console.log(message);
            switch (message.name) {
                case "log":
                    addLog(message.payload);
                break;
                case "adbPath":
                    $("#adb-path").val(message.payload);
                break;
            }
        });
    }
};
var isDebugOpened = false;

$.fn.scrollBottom = function() {
    return $(this).scrollTop($(this)[0].scrollHeight);
};

function addLog(log) {
    $("#log").val($("#log").val() + log + '\n').scrollBottom();
}
function debug() {
    isDebugOpened = !isDebugOpened;
    astilectron.sendMessage({"name": "debug", "payload": isDebugOpened});
}
function refresh() {
    location.reload();
}
function advanced() {
    $("#devices").toggle();
    $("#debug").toggle();
    $("#refresh").toggle();
    $("#adbPath").toggle();
    $("#adbPort").toggle();
    $("#adbShell").toggle();
}
function connectBS() {
    astilectron.sendMessage({"name": "bs", "payload": ""});
}
function connectNOX() {
    astilectron.sendMessage({"name": "nox", "payload": ""});
}
function start() {
    astilectron.sendMessage({"name": "start", "payload": ""});
}
function stop() {
    astilectron.sendMessage({"name": "stop", "payload": ""});
}
function report() {
    var formattedBody = $("#log").val();
    var mailToLink = "mailto:r2studio.root@gmail.com?subject=ServiceManagerReport&body=" + encodeURIComponent(formattedBody);
    window.location.href = mailToLink;
}
function setadb() {
    astilectron.sendMessage({"name": "setadb", "payload": $("#adb-path").val()});
}
function runadb() {
    astilectron.sendMessage({"name": "runadb", "payload": $("#adbcommand").val()});
}
function printDevices() {
    astilectron.sendMessage({"name": "printDevices", "payload": ""});
}
function connect() {
    astilectron.sendMessage({"name": "connect", "payload": $("#port").val()});
}
function forward() {
    astilectron.sendMessage({"name": "forward", "payload": ""});
}