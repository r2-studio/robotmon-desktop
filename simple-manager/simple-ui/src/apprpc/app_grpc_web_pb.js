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


module.exports = proto.apprpc;

