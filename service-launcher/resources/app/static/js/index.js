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

function addLog(log) {
    $("#log").val($("#log").val() + '\n' + log);
}
function refresh() {
    location.reload();
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
    var mailToLink = "mailto:r2studio@gmail.com?subject=ServiceManagerReport&body=" + encodeURIComponent(formattedBody);
    window.location.href = mailToLink;
}
function setadb() {
    astilectron.send({"name": "setadb", "payload": $("#adb-path").val()});
}
function runadb() {
    astilectron.send({"name": "runadb", "payload": [$("#adbtype").val(), $("#adbcommand").val()]});
}
function connect() {
    astilectron.send({"name": "connect", "payload": $("#port").val()});
}