/* eslint-disable */
/**
 * @fileoverview gRPC-Web generated client stub for apprpc
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.apprpc = require('./app_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.apprpc.AppServiceClient =
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
proto.apprpc.AppServicePromiseClient =
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
 *   !proto.apprpc.Empty,
 *   !proto.apprpc.Devices>}
 */
const methodDescriptor_AppService_GetDevices = new grpc.web.MethodDescriptor(
  '/apprpc.AppService/GetDevices',
  grpc.web.MethodType.UNARY,
  proto.apprpc.Empty,
  proto.apprpc.Devices,
  /** @param {!proto.apprpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Devices.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.apprpc.Empty,
 *   !proto.apprpc.Devices>}
 */
const methodInfo_AppService_GetDevices = new grpc.web.AbstractClientBase.MethodInfo(
  proto.apprpc.Devices,
  /** @param {!proto.apprpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Devices.deserializeBinary
);


/**
 * @param {!proto.apprpc.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.apprpc.Devices)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.apprpc.Devices>|undefined}
 *     The XHR Node Readable Stream
 */
proto.apprpc.AppServiceClient.prototype.getDevices =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/apprpc.AppService/GetDevices',
      request,
      metadata || {},
      methodDescriptor_AppService_GetDevices,
      callback);
};


/**
 * @param {!proto.apprpc.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.apprpc.Devices>}
 *     A native promise that resolves to the response
 */
proto.apprpc.AppServicePromiseClient.prototype.getDevices =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/apprpc.AppService/GetDevices',
      request,
      metadata || {},
      methodDescriptor_AppService_GetDevices);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.apprpc.DeviceSerial,
 *   !proto.apprpc.GetStartCommandResult>}
 */
const methodDescriptor_AppService_GetStartCommand = new grpc.web.MethodDescriptor(
  '/apprpc.AppService/GetStartCommand',
  grpc.web.MethodType.UNARY,
  proto.apprpc.DeviceSerial,
  proto.apprpc.GetStartCommandResult,
  /** @param {!proto.apprpc.DeviceSerial} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.GetStartCommandResult.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.apprpc.DeviceSerial,
 *   !proto.apprpc.GetStartCommandResult>}
 */
const methodInfo_AppService_GetStartCommand = new grpc.web.AbstractClientBase.MethodInfo(
  proto.apprpc.GetStartCommandResult,
  /** @param {!proto.apprpc.DeviceSerial} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.GetStartCommandResult.deserializeBinary
);


/**
 * @param {!proto.apprpc.DeviceSerial} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.apprpc.GetStartCommandResult)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.apprpc.GetStartCommandResult>|undefined}
 *     The XHR Node Readable Stream
 */
proto.apprpc.AppServiceClient.prototype.getStartCommand =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/apprpc.AppService/GetStartCommand',
      request,
      metadata || {},
      methodDescriptor_AppService_GetStartCommand,
      callback);
};


/**
 * @param {!proto.apprpc.DeviceSerial} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.apprpc.GetStartCommandResult>}
 *     A native promise that resolves to the response
 */
proto.apprpc.AppServicePromiseClient.prototype.getStartCommand =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/apprpc.AppService/GetStartCommand',
      request,
      metadata || {},
      methodDescriptor_AppService_GetStartCommand);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.apprpc.AdbConnectParams,
 *   !proto.apprpc.Message>}
 */
const methodDescriptor_AppService_AdbConnect = new grpc.web.MethodDescriptor(
  '/apprpc.AppService/AdbConnect',
  grpc.web.MethodType.UNARY,
  proto.apprpc.AdbConnectParams,
  proto.apprpc.Message,
  /** @param {!proto.apprpc.AdbConnectParams} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Message.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.apprpc.AdbConnectParams,
 *   !proto.apprpc.Message>}
 */
const methodInfo_AppService_AdbConnect = new grpc.web.AbstractClientBase.MethodInfo(
  proto.apprpc.Message,
  /** @param {!proto.apprpc.AdbConnectParams} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Message.deserializeBinary
);


/**
 * @param {!proto.apprpc.AdbConnectParams} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.apprpc.Message)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.apprpc.Message>|undefined}
 *     The XHR Node Readable Stream
 */
proto.apprpc.AppServiceClient.prototype.adbConnect =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/apprpc.AppService/AdbConnect',
      request,
      metadata || {},
      methodDescriptor_AppService_AdbConnect,
      callback);
};


/**
 * @param {!proto.apprpc.AdbConnectParams} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.apprpc.Message>}
 *     A native promise that resolves to the response
 */
proto.apprpc.AppServicePromiseClient.prototype.adbConnect =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/apprpc.AppService/AdbConnect',
      request,
      metadata || {},
      methodDescriptor_AppService_AdbConnect);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.apprpc.Empty,
 *   !proto.apprpc.Empty>}
 */
const methodDescriptor_AppService_AdbRestart = new grpc.web.MethodDescriptor(
  '/apprpc.AppService/AdbRestart',
  grpc.web.MethodType.UNARY,
  proto.apprpc.Empty,
  proto.apprpc.Empty,
  /** @param {!proto.apprpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Empty.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.apprpc.Empty,
 *   !proto.apprpc.Empty>}
 */
const methodInfo_AppService_AdbRestart = new grpc.web.AbstractClientBase.MethodInfo(
  proto.apprpc.Empty,
  /** @param {!proto.apprpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Empty.deserializeBinary
);


/**
 * @param {!proto.apprpc.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.apprpc.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.apprpc.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.apprpc.AppServiceClient.prototype.adbRestart =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/apprpc.AppService/AdbRestart',
      request,
      metadata || {},
      methodDescriptor_AppService_AdbRestart,
      callback);
};


/**
 * @param {!proto.apprpc.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.apprpc.Empty>}
 *     A native promise that resolves to the response
 */
proto.apprpc.AppServicePromiseClient.prototype.adbRestart =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/apprpc.AppService/AdbRestart',
      request,
      metadata || {},
      methodDescriptor_AppService_AdbRestart);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.apprpc.AdbShellParams,
 *   !proto.apprpc.Message>}
 */
const methodDescriptor_AppService_AdbShell = new grpc.web.MethodDescriptor(
  '/apprpc.AppService/AdbShell',
  grpc.web.MethodType.UNARY,
  proto.apprpc.AdbShellParams,
  proto.apprpc.Message,
  /** @param {!proto.apprpc.AdbShellParams} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Message.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.apprpc.AdbShellParams,
 *   !proto.apprpc.Message>}
 */
const methodInfo_AppService_AdbShell = new grpc.web.AbstractClientBase.MethodInfo(
  proto.apprpc.Message,
  /** @param {!proto.apprpc.AdbShellParams} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Message.deserializeBinary
);


/**
 * @param {!proto.apprpc.AdbShellParams} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.apprpc.Message)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.apprpc.Message>|undefined}
 *     The XHR Node Readable Stream
 */
proto.apprpc.AppServiceClient.prototype.adbShell =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/apprpc.AppService/AdbShell',
      request,
      metadata || {},
      methodDescriptor_AppService_AdbShell,
      callback);
};


/**
 * @param {!proto.apprpc.AdbShellParams} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.apprpc.Message>}
 *     A native promise that resolves to the response
 */
proto.apprpc.AppServicePromiseClient.prototype.adbShell =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/apprpc.AppService/AdbShell',
      request,
      metadata || {},
      methodDescriptor_AppService_AdbShell);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.apprpc.AdbForwardParams,
 *   !proto.apprpc.Message>}
 */
const methodDescriptor_AppService_AdbForward = new grpc.web.MethodDescriptor(
  '/apprpc.AppService/AdbForward',
  grpc.web.MethodType.UNARY,
  proto.apprpc.AdbForwardParams,
  proto.apprpc.Message,
  /** @param {!proto.apprpc.AdbForwardParams} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Message.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.apprpc.AdbForwardParams,
 *   !proto.apprpc.Message>}
 */
const methodInfo_AppService_AdbForward = new grpc.web.AbstractClientBase.MethodInfo(
  proto.apprpc.Message,
  /** @param {!proto.apprpc.AdbForwardParams} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Message.deserializeBinary
);


/**
 * @param {!proto.apprpc.AdbForwardParams} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.apprpc.Message)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.apprpc.Message>|undefined}
 *     The XHR Node Readable Stream
 */
proto.apprpc.AppServiceClient.prototype.adbForward =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/apprpc.AppService/AdbForward',
      request,
      metadata || {},
      methodDescriptor_AppService_AdbForward,
      callback);
};


/**
 * @param {!proto.apprpc.AdbForwardParams} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.apprpc.Message>}
 *     A native promise that resolves to the response
 */
proto.apprpc.AppServicePromiseClient.prototype.adbForward =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/apprpc.AppService/AdbForward',
      request,
      metadata || {},
      methodDescriptor_AppService_AdbForward);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.apprpc.Empty,
 *   !proto.apprpc.Message>}
 */
const methodDescriptor_AppService_AdbForwardList = new grpc.web.MethodDescriptor(
  '/apprpc.AppService/AdbForwardList',
  grpc.web.MethodType.UNARY,
  proto.apprpc.Empty,
  proto.apprpc.Message,
  /** @param {!proto.apprpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Message.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.apprpc.Empty,
 *   !proto.apprpc.Message>}
 */
const methodInfo_AppService_AdbForwardList = new grpc.web.AbstractClientBase.MethodInfo(
  proto.apprpc.Message,
  /** @param {!proto.apprpc.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Message.deserializeBinary
);


/**
 * @param {!proto.apprpc.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.apprpc.Message)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.apprpc.Message>|undefined}
 *     The XHR Node Readable Stream
 */
proto.apprpc.AppServiceClient.prototype.adbForwardList =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/apprpc.AppService/AdbForwardList',
      request,
      metadata || {},
      methodDescriptor_AppService_AdbForwardList,
      callback);
};


/**
 * @param {!proto.apprpc.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.apprpc.Message>}
 *     A native promise that resolves to the response
 */
proto.apprpc.AppServicePromiseClient.prototype.adbForwardList =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/apprpc.AppService/AdbForwardList',
      request,
      metadata || {},
      methodDescriptor_AppService_AdbForwardList);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.apprpc.AdbTCPIPParams,
 *   !proto.apprpc.Message>}
 */
const methodDescriptor_AppService_AdbTCPIP = new grpc.web.MethodDescriptor(
  '/apprpc.AppService/AdbTCPIP',
  grpc.web.MethodType.UNARY,
  proto.apprpc.AdbTCPIPParams,
  proto.apprpc.Message,
  /** @param {!proto.apprpc.AdbTCPIPParams} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Message.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.apprpc.AdbTCPIPParams,
 *   !proto.apprpc.Message>}
 */
const methodInfo_AppService_AdbTCPIP = new grpc.web.AbstractClientBase.MethodInfo(
  proto.apprpc.Message,
  /** @param {!proto.apprpc.AdbTCPIPParams} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Message.deserializeBinary
);


/**
 * @param {!proto.apprpc.AdbTCPIPParams} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.apprpc.Message)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.apprpc.Message>|undefined}
 *     The XHR Node Readable Stream
 */
proto.apprpc.AppServiceClient.prototype.adbTCPIP =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/apprpc.AppService/AdbTCPIP',
      request,
      metadata || {},
      methodDescriptor_AppService_AdbTCPIP,
      callback);
};


/**
 * @param {!proto.apprpc.AdbTCPIPParams} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.apprpc.Message>}
 *     A native promise that resolves to the response
 */
proto.apprpc.AppServicePromiseClient.prototype.adbTCPIP =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/apprpc.AppService/AdbTCPIP',
      request,
      metadata || {},
      methodDescriptor_AppService_AdbTCPIP);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.apprpc.DeviceSerial,
 *   !proto.apprpc.StartServiceResult>}
 */
const methodDescriptor_AppService_StartService = new grpc.web.MethodDescriptor(
  '/apprpc.AppService/StartService',
  grpc.web.MethodType.UNARY,
  proto.apprpc.DeviceSerial,
  proto.apprpc.StartServiceResult,
  /** @param {!proto.apprpc.DeviceSerial} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.StartServiceResult.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.apprpc.DeviceSerial,
 *   !proto.apprpc.StartServiceResult>}
 */
const methodInfo_AppService_StartService = new grpc.web.AbstractClientBase.MethodInfo(
  proto.apprpc.StartServiceResult,
  /** @param {!proto.apprpc.DeviceSerial} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.StartServiceResult.deserializeBinary
);


/**
 * @param {!proto.apprpc.DeviceSerial} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.apprpc.StartServiceResult)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.apprpc.StartServiceResult>|undefined}
 *     The XHR Node Readable Stream
 */
proto.apprpc.AppServiceClient.prototype.startService =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/apprpc.AppService/StartService',
      request,
      metadata || {},
      methodDescriptor_AppService_StartService,
      callback);
};


/**
 * @param {!proto.apprpc.DeviceSerial} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.apprpc.StartServiceResult>}
 *     A native promise that resolves to the response
 */
proto.apprpc.AppServicePromiseClient.prototype.startService =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/apprpc.AppService/StartService',
      request,
      metadata || {},
      methodDescriptor_AppService_StartService);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.apprpc.DeviceSerial,
 *   !proto.apprpc.Message>}
 */
const methodDescriptor_AppService_StopService = new grpc.web.MethodDescriptor(
  '/apprpc.AppService/StopService',
  grpc.web.MethodType.UNARY,
  proto.apprpc.DeviceSerial,
  proto.apprpc.Message,
  /** @param {!proto.apprpc.DeviceSerial} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Message.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.apprpc.DeviceSerial,
 *   !proto.apprpc.Message>}
 */
const methodInfo_AppService_StopService = new grpc.web.AbstractClientBase.MethodInfo(
  proto.apprpc.Message,
  /** @param {!proto.apprpc.DeviceSerial} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Message.deserializeBinary
);


/**
 * @param {!proto.apprpc.DeviceSerial} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.apprpc.Message)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.apprpc.Message>|undefined}
 *     The XHR Node Readable Stream
 */
proto.apprpc.AppServiceClient.prototype.stopService =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/apprpc.AppService/StopService',
      request,
      metadata || {},
      methodDescriptor_AppService_StopService,
      callback);
};


/**
 * @param {!proto.apprpc.DeviceSerial} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.apprpc.Message>}
 *     A native promise that resolves to the response
 */
proto.apprpc.AppServicePromiseClient.prototype.stopService =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/apprpc.AppService/StopService',
      request,
      metadata || {},
      methodDescriptor_AppService_StopService);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.apprpc.CreateGRPCProxy,
 *   !proto.apprpc.Message>}
 */
const methodDescriptor_AppService_CreateProxy = new grpc.web.MethodDescriptor(
  '/apprpc.AppService/CreateProxy',
  grpc.web.MethodType.UNARY,
  proto.apprpc.CreateGRPCProxy,
  proto.apprpc.Message,
  /** @param {!proto.apprpc.CreateGRPCProxy} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Message.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.apprpc.CreateGRPCProxy,
 *   !proto.apprpc.Message>}
 */
const methodInfo_AppService_CreateProxy = new grpc.web.AbstractClientBase.MethodInfo(
  proto.apprpc.Message,
  /** @param {!proto.apprpc.CreateGRPCProxy} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.apprpc.Message.deserializeBinary
);


/**
 * @param {!proto.apprpc.CreateGRPCProxy} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.apprpc.Message)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.apprpc.Message>|undefined}
 *     The XHR Node Readable Stream
 */
proto.apprpc.AppServiceClient.prototype.createProxy =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/apprpc.AppService/CreateProxy',
      request,
      metadata || {},
      methodDescriptor_AppService_CreateProxy,
      callback);
};


/**
 * @param {!proto.apprpc.CreateGRPCProxy} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.apprpc.Message>}
 *     A native promise that resolves to the response
 */
proto.apprpc.AppServicePromiseClient.prototype.createProxy =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/apprpc.AppService/CreateProxy',
      request,
      metadata || {},
      methodDescriptor_AppService_CreateProxy);
};


module.exports = proto.apprpc;

