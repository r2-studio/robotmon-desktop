// package: rpc
// file: grpc.proto

import * as grpc_pb from "./grpc_pb";
import {grpc} from "grpc-web-client";

type GrpcServiceRunScript = {
  readonly methodName: string;
  readonly service: typeof GrpcService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof grpc_pb.RequestRunScript;
  readonly responseType: typeof grpc_pb.Response;
};

type GrpcServiceRunScriptAsync = {
  readonly methodName: string;
  readonly service: typeof GrpcService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof grpc_pb.RequestRunScript;
  readonly responseType: typeof grpc_pb.Response;
};

type GrpcServiceLogs = {
  readonly methodName: string;
  readonly service: typeof GrpcService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof grpc_pb.Empty;
  readonly responseType: typeof grpc_pb.Response;
};

type GrpcServiceGetScreenshot = {
  readonly methodName: string;
  readonly service: typeof GrpcService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof grpc_pb.RequestScreenshot;
  readonly responseType: typeof grpc_pb.ResponseScreenshot;
};

type GrpcServiceGetScreenSize = {
  readonly methodName: string;
  readonly service: typeof GrpcService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof grpc_pb.Empty;
  readonly responseType: typeof grpc_pb.ResponseScreenSize;
};

type GrpcServiceGetStoragePath = {
  readonly methodName: string;
  readonly service: typeof GrpcService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof grpc_pb.Empty;
  readonly responseType: typeof grpc_pb.Response;
};

type GrpcServiceTapDown = {
  readonly methodName: string;
  readonly service: typeof GrpcService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof grpc_pb.RequestTap;
  readonly responseType: typeof grpc_pb.Response;
};

type GrpcServiceMoveTo = {
  readonly methodName: string;
  readonly service: typeof GrpcService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof grpc_pb.RequestTap;
  readonly responseType: typeof grpc_pb.Response;
};

type GrpcServiceTapUp = {
  readonly methodName: string;
  readonly service: typeof GrpcService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof grpc_pb.RequestTap;
  readonly responseType: typeof grpc_pb.Response;
};

type GrpcServicePause = {
  readonly methodName: string;
  readonly service: typeof GrpcService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof grpc_pb.Empty;
  readonly responseType: typeof grpc_pb.Response;
};

type GrpcServiceResume = {
  readonly methodName: string;
  readonly service: typeof GrpcService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof grpc_pb.Empty;
  readonly responseType: typeof grpc_pb.Response;
};

type GrpcServiceReset = {
  readonly methodName: string;
  readonly service: typeof GrpcService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof grpc_pb.Empty;
  readonly responseType: typeof grpc_pb.Response;
};

export class GrpcService {
  static readonly serviceName: string;
  static readonly RunScript: GrpcServiceRunScript;
  static readonly RunScriptAsync: GrpcServiceRunScriptAsync;
  static readonly Logs: GrpcServiceLogs;
  static readonly GetScreenshot: GrpcServiceGetScreenshot;
  static readonly GetScreenSize: GrpcServiceGetScreenSize;
  static readonly GetStoragePath: GrpcServiceGetStoragePath;
  static readonly TapDown: GrpcServiceTapDown;
  static readonly MoveTo: GrpcServiceMoveTo;
  static readonly TapUp: GrpcServiceTapUp;
  static readonly Pause: GrpcServicePause;
  static readonly Resume: GrpcServiceResume;
  static readonly Reset: GrpcServiceReset;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: () => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: () => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: () => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class GrpcServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  runScript(
    requestMessage: grpc_pb.RequestRunScript,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
  runScript(
    requestMessage: grpc_pb.RequestRunScript,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
  runScriptAsync(
    requestMessage: grpc_pb.RequestRunScript,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
  runScriptAsync(
    requestMessage: grpc_pb.RequestRunScript,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
  logs(requestMessage: grpc_pb.Empty, metadata?: grpc.Metadata): ResponseStream<grpc_pb.Response>;
  getScreenshot(
    requestMessage: grpc_pb.RequestScreenshot,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.ResponseScreenshot|null) => void
  ): UnaryResponse;
  getScreenshot(
    requestMessage: grpc_pb.RequestScreenshot,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.ResponseScreenshot|null) => void
  ): UnaryResponse;
  getScreenSize(
    requestMessage: grpc_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.ResponseScreenSize|null) => void
  ): UnaryResponse;
  getScreenSize(
    requestMessage: grpc_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.ResponseScreenSize|null) => void
  ): UnaryResponse;
  getStoragePath(
    requestMessage: grpc_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
  getStoragePath(
    requestMessage: grpc_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
  tapDown(
    requestMessage: grpc_pb.RequestTap,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
  tapDown(
    requestMessage: grpc_pb.RequestTap,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
  moveTo(
    requestMessage: grpc_pb.RequestTap,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
  moveTo(
    requestMessage: grpc_pb.RequestTap,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
  tapUp(
    requestMessage: grpc_pb.RequestTap,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
  tapUp(
    requestMessage: grpc_pb.RequestTap,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
  pause(
    requestMessage: grpc_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
  pause(
    requestMessage: grpc_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
  resume(
    requestMessage: grpc_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
  resume(
    requestMessage: grpc_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
  reset(
    requestMessage: grpc_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
  reset(
    requestMessage: grpc_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: grpc_pb.Response|null) => void
  ): UnaryResponse;
}

