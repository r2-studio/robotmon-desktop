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
function start() {
    astilectron.send({"name": "start", "payload": ""});
}
function stop() {
    astilectron.send({"name": "stop", "payload": ""});
}
function report() {
    astilectron.send({"name": "report", "payload": ""});
}
function setadb() {
    astilectron.send({"name": "setadb", "payload": $("#adb-path").val()});
}
function runadb() {
    astilectron.send({"name": "runadb", "payload": $("#command").val()});
}