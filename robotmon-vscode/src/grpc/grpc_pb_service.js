// package: rpc
// file: grpc.proto

var grpc_pb = require("./grpc_pb");
var grpc = require("grpc-web-client").grpc;

var GrpcService = (function () {
  function GrpcService() {}
  GrpcService.serviceName = "rpc.GrpcService";
  return GrpcService;
}());

GrpcService.RunScript = {
  methodName: "RunScript",
  service: GrpcService,
  requestStream: false,
  responseStream: false,
  requestType: grpc_pb.RequestRunScript,
  responseType: grpc_pb.Response
};

GrpcService.RunScriptAsync = {
  methodName: "RunScriptAsync",
  service: GrpcService,
  requestStream: false,
  responseStream: false,
  requestType: grpc_pb.RequestRunScript,
  responseType: grpc_pb.Response
};

GrpcService.Logs = {
  methodName: "Logs",
  service: GrpcService,
  requestStream: false,
  responseStream: true,
  requestType: grpc_pb.Empty,
  responseType: grpc_pb.Response
};

GrpcService.GetScreenshot = {
  methodName: "GetScreenshot",
  service: GrpcService,
  requestStream: false,
  responseStream: false,
  requestType: grpc_pb.RequestScreenshot,
  responseType: grpc_pb.ResponseScreenshot
};

GrpcService.GetScreenSize = {
  methodName: "GetScreenSize",
  service: GrpcService,
  requestStream: false,
  responseStream: false,
  requestType: grpc_pb.Empty,
  responseType: grpc_pb.ResponseScreenSize
};

exports.GrpcService = GrpcService;

function GrpcServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

GrpcServiceClient.prototype.runScript = function runScript(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(GrpcService.RunScript, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

GrpcServiceClient.prototype.runScriptAsync = function runScriptAsync(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(GrpcService.RunScriptAsync, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

GrpcServiceClient.prototype.logs = function logs(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(GrpcService.Logs, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.end.forEach(function (handler) {
        handler();
      });
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

GrpcServiceClient.prototype.getScreenshot = function getScreenshot(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(GrpcService.GetScreenshot, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

GrpcServiceClient.prototype.getScreenSize = function getScreenSize(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(GrpcService.GetScreenSize, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.GrpcServiceClient = GrpcServiceClient;

