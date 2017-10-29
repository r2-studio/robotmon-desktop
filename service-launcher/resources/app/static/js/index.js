 var index = {
    init: function() {
        // Wait for astilectron to be ready
        document.addEventListener('astilectron-ready', function() {
            // Listen
            index.listen();

            // Refresh list
            index.refreshList();
        })
    },
    listen: function() {
        astilectron.listen(function(message) {
            console.log(message);
            // switch (message.name) {
            //     case "set.style":
            //         index.listenSetStyle(message);
            //         break;
            // }
        });
    },
    listenSetStyle: function(message) {
        document.body.className = message.payload;
    },
    refreshList: function() {
        astilectron.send({"name": "envTest"}, function(message) {
            console.log(message)
        })
    }
};