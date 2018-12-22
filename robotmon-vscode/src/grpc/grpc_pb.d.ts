// package: rpc
// file: grpc.proto

import * as jspb from "google-protobuf";

export class Empty extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Empty.AsObject;
  static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Empty;
  static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
  export type AsObject = {
  }
}

export class Response extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Response.AsObject;
  static toObject(includeInstance: boolean, msg: Response): Response.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Response, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Response;
  static deserializeBinaryFromReader(message: Response, reader: jspb.BinaryReader): Response;
}

export namespace Response {
  export type AsObject = {
    message: string,
  }
}

export class RequestRunScript extends jspb.Message {
  getScript(): string;
  setScript(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RequestRunScript.AsObject;
  static toObject(includeInstance: boolean, msg: RequestRunScript): RequestRunScript.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RequestRunScript, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RequestRunScript;
  static deserializeBinaryFromReader(message: RequestRunScript, reader: jspb.BinaryReader): RequestRunScript;
}

export namespace RequestRunScript {
  export type AsObject = {
    script: string,
  }
}

export class RequestScreenshot extends jspb.Message {
  getCropx(): number;
  setCropx(value: number): void;

  getCropy(): number;
  setCropy(value: number): void;

  getCropwidth(): number;
  setCropwidth(value: number): void;

  getCropheight(): number;
  setCropheight(value: number): void;

  getResizewidth(): number;
  setResizewidth(value: number): void;

  getResizeheight(): number;
  setResizeheight(value: number): void;

  getQuality(): number;
  setQuality(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RequestScreenshot.AsObject;
  static toObject(includeInstance: boolean, msg: RequestScreenshot): RequestScreenshot.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RequestScreenshot, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RequestScreenshot;
  static deserializeBinaryFromReader(message: RequestScreenshot, reader: jspb.BinaryReader): RequestScreenshot;
}

export namespace RequestScreenshot {
  export type AsObject = {
    cropx: number,
    cropy: number,
    cropwidth: number,
    cropheight: number,
    resizewidth: number,
    resizeheight: number,
    quality: number,
  }
}

export class RequestTap extends jspb.Message {
  getX(): number;
  setX(value: number): void;

  getY(): number;
  setY(value: number): void;

  getId(): number;
  setId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RequestTap.AsObject;
  static toObject(includeInstance: boolean, msg: RequestTap): RequestTap.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RequestTap, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RequestTap;
  static deserializeBinaryFromReader(message: RequestTap, reader: jspb.BinaryReader): RequestTap;
}

export namespace RequestTap {
  export type AsObject = {
    x: number,
    y: number,
    id: number,
  }
}

export class ResponseScreenshot extends jspb.Message {
  getImage(): Uint8Array | string;
  getImage_asU8(): Uint8Array;
  getImage_asB64(): string;
  setImage(value: Uint8Array | string): void;

  getDevicewidth(): number;
  setDevicewidth(value: number): void;

  getDeviceheight(): number;
  setDeviceheight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResponseScreenshot.AsObject;
  static toObject(includeInstance: boolean, msg: ResponseScreenshot): ResponseScreenshot.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResponseScreenshot, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResponseScreenshot;
  static deserializeBinaryFromReader(message: ResponseScreenshot, reader: jspb.BinaryReader): ResponseScreenshot;
}

export namespace ResponseScreenshot {
  export type AsObject = {
    image: Uint8Array | string,
    devicewidth: number,
    deviceheight: number,
  }
}

export class ResponseScreenSize extends jspb.Message {
  getWidth(): number;
  setWidth(value: number): void;

  getHeight(): number;
  setHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResponseScreenSize.AsObject;
  static toObject(includeInstance: boolean, msg: ResponseScreenSize): ResponseScreenSize.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResponseScreenSize, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResponseScreenSize;
  static deserializeBinaryFromReader(message: ResponseScreenSize, reader: jspb.BinaryReader): ResponseScreenSize;
}

export namespace ResponseScreenSize {
  export type AsObject = {
    width: number,
    height: number,
  }
}

