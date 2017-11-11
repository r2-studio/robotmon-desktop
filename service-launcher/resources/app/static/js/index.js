 var index = {
    init: function() {
        // Wait for astilectron to be ready
        document.addEventListener('astilectron-ready', function() {
            index.listen();
            astilectron.send({"name": "envTest"});
        })
    },
    listen: function() {
        astilectron.listen(function(message) {
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
    astilectron.send({"name": "debug", "payload": isDebugOpened});
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
    astilectron.send({"name": "bs", "payload": ""});
}
function connectNOX() {
    astilectron.send({"name": "nox", "payload": ""});
}
function start() {
    astilectron.send({"name": "start", "payload": ""});
}
function stop() {
    astilectron.send({"name": "stop", "payload": ""});
}
function report() {
    var formattedBody = $("#log").val();
    var mailToLink = "mailto:r2studio.root@gmail.com?subject=ServiceManagerReport&body=" + encodeURIComponent(formattedBody);
    window.location.href = mailToLink;
}
function setadb() {
    astilectron.send({"name": "setadb", "payload": $("#adb-path").val()});
}
function runadb() {
    astilectron.send({"name": "runadb", "payload": $("#adbcommand").val()});
}
function printDevices() {
    astilectron.send({"name": "printDevices", "payload": ""});
}
function connect() {
    astilectron.send({"name": "connect", "payload": $("#port").val()});
}