/**
 * @fileoverview gRPC-Web generated client stub for rpc
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.rpc = require('./grpc_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.rpc.GrpcServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.rpc.GrpcServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.rpc.RequestRunScript,
 *   !proto.rpc.Response>}
 */
const methodDescriptor_GrpcService_RunScript = new grpc.web.MethodDescriptor(
  '/rpc.GrpcService/RunScript',
  grpc.web.MethodType.UNARY,
  proto.rpc.RequestRunScript,
  proto.rpc.Response,
  /** @param {!proto.rpc.RequestRunScript} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.rpc.RequestRunScript,
 *   !proto.rpc.Response>}
 */
const methodInfo_GrpcService_RunScript = new grpc.web.AbstractClientBase.MethodInfo(
  proto.rpc.Response,
  /** @param {!proto.rpc.RequestRunScript} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @param {!proto.rpc.RequestRunScript} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.rpc.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.rpc.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.rpc.GrpcServiceClient.prototype.runScript =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/rpc.GrpcService/RunScript',
      request,
      metadata || {},
      methodDescriptor_GrpcService_RunScript,
      callback);
};


/**
 * @param {!proto.rpc.RequestRunScript} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.rpc.Response>}
 *     A native promise that resolves to the response
 */
proto.rpc.GrpcServicePromiseClient.prototype.runScript =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/rpc.GrpcService/RunScript',
      request,
      metadata || {},
      methodDescriptor_GrpcService_RunScript);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.rpc.RequestRunScript,
 *   !proto.rpc.Response>}
 */
const methodDescriptor_GrpcService_RunScriptAsync = new grpc.web.MethodDescriptor(
  '/rpc.GrpcService/RunScriptAsync',
  grpc.web.MethodType.UNARY,
  proto.rpc.RequestRunScript,
  proto.rpc.Response,
  /** @param {!proto.rpc.RequestRunScript} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.rpc.RequestRunScript,
 *   !proto.rpc.Response>}
 */
const methodInfo_GrpcService_RunScriptAsync = new grpc.web.AbstractClientBase.MethodInfo(
  proto.rpc.Response,
  /** @param {!proto.rpc.RequestRunScript} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @param {!proto.rpc.RequestRunScript} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.rpc.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.rpc.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.rpc.GrpcServiceClient.prototype.runScriptAsync =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/rpc.GrpcService/RunScriptAsync',
      request,
      metadata || {},
      methodDescriptor_GrpcService_RunScriptAsync,
      callback);
};


/**
 * @param {!proto.rpc.RequestRunScript} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.rpc.Response>}
 *     A native promise that resolves to the response
 */
proto.rpc.GrpcServicePromiseClient.prototype.runScriptAsync =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/rpc.GrpcService/RunScriptAsync',
      request,
      metadata || {},
      methodDescriptor_GrpcService_RunScriptAsync);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.rpc.Empty,
 *   !proto.rpc.Response>}
 */
const methodDescriptor_GrpcService_Logs = new grpc.web.MethodDescriptor(
  '/rpc.GrpcService/Logs',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.rpc.Empty,
  proto.rpc.Response,
  /** @param {!proto.rpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.rpc.Empty,
 *   !proto.rpc.Response>}
 */
const methodInfo_GrpcService_Logs = new grpc.web.AbstractClientBase.MethodInfo(
  proto.rpc.Response,
  /** @param {!proto.rpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @param {!proto.rpc.Empty} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.rpc.Response>}
 *     The XHR Node Readable Stream
 */
proto.rpc.GrpcServiceClient.prototype.logs =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/rpc.GrpcService/Logs',
      request,
      metadata || {},
      methodDescriptor_GrpcService_Logs);
};


/**
 * @param {!proto.rpc.Empty} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.rpc.Response>}
 *     The XHR Node Readable Stream
 */
proto.rpc.GrpcServicePromiseClient.prototype.logs =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/rpc.GrpcService/Logs',
      request,
      metadata || {},
      methodDescriptor_GrpcService_Logs);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.rpc.RequestScreenshot,
 *   !proto.rpc.ResponseScreenshot>}
 */
const methodDescriptor_GrpcService_GetScreenshot = new grpc.web.MethodDescriptor(
  '/rpc.GrpcService/GetScreenshot',
  grpc.web.MethodType.UNARY,
  proto.rpc.RequestScreenshot,
  proto.rpc.ResponseScreenshot,
  /** @param {!proto.rpc.RequestScreenshot} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.ResponseScreenshot.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.rpc.RequestScreenshot,
 *   !proto.rpc.ResponseScreenshot>}
 */
const methodInfo_GrpcService_GetScreenshot = new grpc.web.AbstractClientBase.MethodInfo(
  proto.rpc.ResponseScreenshot,
  /** @param {!proto.rpc.RequestScreenshot} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.ResponseScreenshot.deserializeBinary
);


/**
 * @param {!proto.rpc.RequestScreenshot} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.rpc.ResponseScreenshot)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.rpc.ResponseScreenshot>|undefined}
 *     The XHR Node Readable Stream
 */
proto.rpc.GrpcServiceClient.prototype.getScreenshot =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/rpc.GrpcService/GetScreenshot',
      request,
      metadata || {},
      methodDescriptor_GrpcService_GetScreenshot,
      callback);
};


/**
 * @param {!proto.rpc.RequestScreenshot} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.rpc.ResponseScreenshot>}
 *     A native promise that resolves to the response
 */
proto.rpc.GrpcServicePromiseClient.prototype.getScreenshot =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/rpc.GrpcService/GetScreenshot',
      request,
      metadata || {},
      methodDescriptor_GrpcService_GetScreenshot);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.rpc.Empty,
 *   !proto.rpc.ResponseScreenSize>}
 */
const methodDescriptor_GrpcService_GetScreenSize = new grpc.web.MethodDescriptor(
  '/rpc.GrpcService/GetScreenSize',
  grpc.web.MethodType.UNARY,
  proto.rpc.Empty,
  proto.rpc.ResponseScreenSize,
  /** @param {!proto.rpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.ResponseScreenSize.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.rpc.Empty,
 *   !proto.rpc.ResponseScreenSize>}
 */
const methodInfo_GrpcService_GetScreenSize = new grpc.web.AbstractClientBase.MethodInfo(
  proto.rpc.ResponseScreenSize,
  /** @param {!proto.rpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.ResponseScreenSize.deserializeBinary
);


/**
 * @param {!proto.rpc.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.rpc.ResponseScreenSize)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.rpc.ResponseScreenSize>|undefined}
 *     The XHR Node Readable Stream
 */
proto.rpc.GrpcServiceClient.prototype.getScreenSize =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/rpc.GrpcService/GetScreenSize',
      request,
      metadata || {},
      methodDescriptor_GrpcService_GetScreenSize,
      callback);
};


/**
 * @param {!proto.rpc.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.rpc.ResponseScreenSize>}
 *     A native promise that resolves to the response
 */
proto.rpc.GrpcServicePromiseClient.prototype.getScreenSize =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/rpc.GrpcService/GetScreenSize',
      request,
      metadata || {},
      methodDescriptor_GrpcService_GetScreenSize);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.rpc.Empty,
 *   !proto.rpc.Response>}
 */
const methodDescriptor_GrpcService_GetStoragePath = new grpc.web.MethodDescriptor(
  '/rpc.GrpcService/GetStoragePath',
  grpc.web.MethodType.UNARY,
  proto.rpc.Empty,
  proto.rpc.Response,
  /** @param {!proto.rpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.rpc.Empty,
 *   !proto.rpc.Response>}
 */
const methodInfo_GrpcService_GetStoragePath = new grpc.web.AbstractClientBase.MethodInfo(
  proto.rpc.Response,
  /** @param {!proto.rpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @param {!proto.rpc.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.rpc.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.rpc.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.rpc.GrpcServiceClient.prototype.getStoragePath =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/rpc.GrpcService/GetStoragePath',
      request,
      metadata || {},
      methodDescriptor_GrpcService_GetStoragePath,
      callback);
};


/**
 * @param {!proto.rpc.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.rpc.Response>}
 *     A native promise that resolves to the response
 */
proto.rpc.GrpcServicePromiseClient.prototype.getStoragePath =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/rpc.GrpcService/GetStoragePath',
      request,
      metadata || {},
      methodDescriptor_GrpcService_GetStoragePath);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.rpc.RequestTap,
 *   !proto.rpc.Response>}
 */
const methodDescriptor_GrpcService_TapDown = new grpc.web.MethodDescriptor(
  '/rpc.GrpcService/TapDown',
  grpc.web.MethodType.UNARY,
  proto.rpc.RequestTap,
  proto.rpc.Response,
  /** @param {!proto.rpc.RequestTap} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.rpc.RequestTap,
 *   !proto.rpc.Response>}
 */
const methodInfo_GrpcService_TapDown = new grpc.web.AbstractClientBase.MethodInfo(
  proto.rpc.Response,
  /** @param {!proto.rpc.RequestTap} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @param {!proto.rpc.RequestTap} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.rpc.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.rpc.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.rpc.GrpcServiceClient.prototype.tapDown =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/rpc.GrpcService/TapDown',
      request,
      metadata || {},
      methodDescriptor_GrpcService_TapDown,
      callback);
};


/**
 * @param {!proto.rpc.RequestTap} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.rpc.Response>}
 *     A native promise that resolves to the response
 */
proto.rpc.GrpcServicePromiseClient.prototype.tapDown =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/rpc.GrpcService/TapDown',
      request,
      metadata || {},
      methodDescriptor_GrpcService_TapDown);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.rpc.RequestTap,
 *   !proto.rpc.Response>}
 */
const methodDescriptor_GrpcService_MoveTo = new grpc.web.MethodDescriptor(
  '/rpc.GrpcService/MoveTo',
  grpc.web.MethodType.UNARY,
  proto.rpc.RequestTap,
  proto.rpc.Response,
  /** @param {!proto.rpc.RequestTap} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.rpc.RequestTap,
 *   !proto.rpc.Response>}
 */
const methodInfo_GrpcService_MoveTo = new grpc.web.AbstractClientBase.MethodInfo(
  proto.rpc.Response,
  /** @param {!proto.rpc.RequestTap} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @param {!proto.rpc.RequestTap} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.rpc.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.rpc.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.rpc.GrpcServiceClient.prototype.moveTo =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/rpc.GrpcService/MoveTo',
      request,
      metadata || {},
      methodDescriptor_GrpcService_MoveTo,
      callback);
};


/**
 * @param {!proto.rpc.RequestTap} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.rpc.Response>}
 *     A native promise that resolves to the response
 */
proto.rpc.GrpcServicePromiseClient.prototype.moveTo =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/rpc.GrpcService/MoveTo',
      request,
      metadata || {},
      methodDescriptor_GrpcService_MoveTo);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.rpc.RequestTap,
 *   !proto.rpc.Response>}
 */
const methodDescriptor_GrpcService_TapUp = new grpc.web.MethodDescriptor(
  '/rpc.GrpcService/TapUp',
  grpc.web.MethodType.UNARY,
  proto.rpc.RequestTap,
  proto.rpc.Response,
  /** @param {!proto.rpc.RequestTap} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.rpc.RequestTap,
 *   !proto.rpc.Response>}
 */
const methodInfo_GrpcService_TapUp = new grpc.web.AbstractClientBase.MethodInfo(
  proto.rpc.Response,
  /** @param {!proto.rpc.RequestTap} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @param {!proto.rpc.RequestTap} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.rpc.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.rpc.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.rpc.GrpcServiceClient.prototype.tapUp =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/rpc.GrpcService/TapUp',
      request,
      metadata || {},
      methodDescriptor_GrpcService_TapUp,
      callback);
};


/**
 * @param {!proto.rpc.RequestTap} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.rpc.Response>}
 *     A native promise that resolves to the response
 */
proto.rpc.GrpcServicePromiseClient.prototype.tapUp =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/rpc.GrpcService/TapUp',
      request,
      metadata || {},
      methodDescriptor_GrpcService_TapUp);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.rpc.Empty,
 *   !proto.rpc.Response>}
 */
const methodDescriptor_GrpcService_Pause = new grpc.web.MethodDescriptor(
  '/rpc.GrpcService/Pause',
  grpc.web.MethodType.UNARY,
  proto.rpc.Empty,
  proto.rpc.Response,
  /** @param {!proto.rpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.rpc.Empty,
 *   !proto.rpc.Response>}
 */
const methodInfo_GrpcService_Pause = new grpc.web.AbstractClientBase.MethodInfo(
  proto.rpc.Response,
  /** @param {!proto.rpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @param {!proto.rpc.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.rpc.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.rpc.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.rpc.GrpcServiceClient.prototype.pause =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/rpc.GrpcService/Pause',
      request,
      metadata || {},
      methodDescriptor_GrpcService_Pause,
      callback);
};


/**
 * @param {!proto.rpc.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.rpc.Response>}
 *     A native promise that resolves to the response
 */
proto.rpc.GrpcServicePromiseClient.prototype.pause =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/rpc.GrpcService/Pause',
      request,
      metadata || {},
      methodDescriptor_GrpcService_Pause);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.rpc.Empty,
 *   !proto.rpc.Response>}
 */
const methodDescriptor_GrpcService_Resume = new grpc.web.MethodDescriptor(
  '/rpc.GrpcService/Resume',
  grpc.web.MethodType.UNARY,
  proto.rpc.Empty,
  proto.rpc.Response,
  /** @param {!proto.rpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.rpc.Empty,
 *   !proto.rpc.Response>}
 */
const methodInfo_GrpcService_Resume = new grpc.web.AbstractClientBase.MethodInfo(
  proto.rpc.Response,
  /** @param {!proto.rpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @param {!proto.rpc.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.rpc.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.rpc.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.rpc.GrpcServiceClient.prototype.resume =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/rpc.GrpcService/Resume',
      request,
      metadata || {},
      methodDescriptor_GrpcService_Resume,
      callback);
};


/**
 * @param {!proto.rpc.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.rpc.Response>}
 *     A native promise that resolves to the response
 */
proto.rpc.GrpcServicePromiseClient.prototype.resume =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/rpc.GrpcService/Resume',
      request,
      metadata || {},
      methodDescriptor_GrpcService_Resume);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.rpc.Empty,
 *   !proto.rpc.Response>}
 */
const methodDescriptor_GrpcService_Reset = new grpc.web.MethodDescriptor(
  '/rpc.GrpcService/Reset',
  grpc.web.MethodType.UNARY,
  proto.rpc.Empty,
  proto.rpc.Response,
  /** @param {!proto.rpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.rpc.Empty,
 *   !proto.rpc.Response>}
 */
const methodInfo_GrpcService_Reset = new grpc.web.AbstractClientBase.MethodInfo(
  proto.rpc.Response,
  /** @param {!proto.rpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.rpc.Response.deserializeBinary
);


/**
 * @param {!proto.rpc.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.rpc.Response)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.rpc.Response>|undefined}
 *     The XHR Node Readable Stream
 */
proto.rpc.GrpcServiceClient.prototype.reset =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/rpc.GrpcService/Reset',
      request,
      metadata || {},
      methodDescriptor_GrpcService_Reset,
      callback);
};


/**
 * @param {!proto.rpc.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.rpc.Response>}
 *     A native promise that resolves to the response
 */
proto.rpc.GrpcServicePromiseClient.prototype.reset =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/rpc.GrpcService/Reset',
      request,
      metadata || {},
      methodDescriptor_GrpcService_Reset);
};


module.exports = proto.rpc;

