// Code generated by protoc-gen-go. DO NOT EDIT.
// source: grpc.proto

/*
Package rpc is a generated protocol buffer package.

It is generated from these files:
	grpc.proto

It has these top-level messages:
	Empty
	Response
	RequestRunScript
	RequestScreenshot
	RequestTap
	ResponseScreenshot
	ResponseScreenSize
*/
package main

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"

import (
	context "golang.org/x/net/context"
	grpc "google.golang.org/grpc"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion2 // please upgrade the proto package

type Empty struct {
}

func (m *Empty) Reset()                    { *m = Empty{} }
func (m *Empty) String() string            { return proto.CompactTextString(m) }
func (*Empty) ProtoMessage()               {}
func (*Empty) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

type Response struct {
	Message string `protobuf:"bytes,1,opt,name=message" json:"message,omitempty"`
}

func (m *Response) Reset()                    { *m = Response{} }
func (m *Response) String() string            { return proto.CompactTextString(m) }
func (*Response) ProtoMessage()               {}
func (*Response) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{1} }

func (m *Response) GetMessage() string {
	if m != nil {
		return m.Message
	}
	return ""
}

type RequestRunScript struct {
	Script string `protobuf:"bytes,1,opt,name=script" json:"script,omitempty"`
}

func (m *RequestRunScript) Reset()                    { *m = RequestRunScript{} }
func (m *RequestRunScript) String() string            { return proto.CompactTextString(m) }
func (*RequestRunScript) ProtoMessage()               {}
func (*RequestRunScript) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{2} }

func (m *RequestRunScript) GetScript() string {
	if m != nil {
		return m.Script
	}
	return ""
}

type RequestScreenshot struct {
	CropX        int32 `protobuf:"varint,1,opt,name=cropX" json:"cropX,omitempty"`
	CropY        int32 `protobuf:"varint,2,opt,name=cropY" json:"cropY,omitempty"`
	CropWidth    int32 `protobuf:"varint,3,opt,name=cropWidth" json:"cropWidth,omitempty"`
	CropHeight   int32 `protobuf:"varint,4,opt,name=cropHeight" json:"cropHeight,omitempty"`
	ResizeWidth  int32 `protobuf:"varint,5,opt,name=resizeWidth" json:"resizeWidth,omitempty"`
	ResizeHeight int32 `protobuf:"varint,6,opt,name=resizeHeight" json:"resizeHeight,omitempty"`
	Quality      int32 `protobuf:"varint,7,opt,name=quality" json:"quality,omitempty"`
}

func (m *RequestScreenshot) Reset()                    { *m = RequestScreenshot{} }
func (m *RequestScreenshot) String() string            { return proto.CompactTextString(m) }
func (*RequestScreenshot) ProtoMessage()               {}
func (*RequestScreenshot) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{3} }

func (m *RequestScreenshot) GetCropX() int32 {
	if m != nil {
		return m.CropX
	}
	return 0
}

func (m *RequestScreenshot) GetCropY() int32 {
	if m != nil {
		return m.CropY
	}
	return 0
}

func (m *RequestScreenshot) GetCropWidth() int32 {
	if m != nil {
		return m.CropWidth
	}
	return 0
}

func (m *RequestScreenshot) GetCropHeight() int32 {
	if m != nil {
		return m.CropHeight
	}
	return 0
}

func (m *RequestScreenshot) GetResizeWidth() int32 {
	if m != nil {
		return m.ResizeWidth
	}
	return 0
}

func (m *RequestScreenshot) GetResizeHeight() int32 {
	if m != nil {
		return m.ResizeHeight
	}
	return 0
}

func (m *RequestScreenshot) GetQuality() int32 {
	if m != nil {
		return m.Quality
	}
	return 0
}

type RequestTap struct {
	X  int32 `protobuf:"varint,1,opt,name=x" json:"x,omitempty"`
	Y  int32 `protobuf:"varint,2,opt,name=y" json:"y,omitempty"`
	Id int32 `protobuf:"varint,3,opt,name=id" json:"id,omitempty"`
}

func (m *RequestTap) Reset()                    { *m = RequestTap{} }
func (m *RequestTap) String() string            { return proto.CompactTextString(m) }
func (*RequestTap) ProtoMessage()               {}
func (*RequestTap) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{4} }

func (m *RequestTap) GetX() int32 {
	if m != nil {
		return m.X
	}
	return 0
}

func (m *RequestTap) GetY() int32 {
	if m != nil {
		return m.Y
	}
	return 0
}

func (m *RequestTap) GetId() int32 {
	if m != nil {
		return m.Id
	}
	return 0
}

type ResponseScreenshot struct {
	Image        []byte `protobuf:"bytes,1,opt,name=image,proto3" json:"image,omitempty"`
	DeviceWidth  int32  `protobuf:"varint,2,opt,name=deviceWidth" json:"deviceWidth,omitempty"`
	DeviceHeight int32  `protobuf:"varint,3,opt,name=deviceHeight" json:"deviceHeight,omitempty"`
}

func (m *ResponseScreenshot) Reset()                    { *m = ResponseScreenshot{} }
func (m *ResponseScreenshot) String() string            { return proto.CompactTextString(m) }
func (*ResponseScreenshot) ProtoMessage()               {}
func (*ResponseScreenshot) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{5} }

func (m *ResponseScreenshot) GetImage() []byte {
	if m != nil {
		return m.Image
	}
	return nil
}

func (m *ResponseScreenshot) GetDeviceWidth() int32 {
	if m != nil {
		return m.DeviceWidth
	}
	return 0
}

func (m *ResponseScreenshot) GetDeviceHeight() int32 {
	if m != nil {
		return m.DeviceHeight
	}
	return 0
}

type ResponseScreenSize struct {
	Width  int32 `protobuf:"varint,1,opt,name=width" json:"width,omitempty"`
	Height int32 `protobuf:"varint,2,opt,name=height" json:"height,omitempty"`
}

func (m *ResponseScreenSize) Reset()                    { *m = ResponseScreenSize{} }
func (m *ResponseScreenSize) String() string            { return proto.CompactTextString(m) }
func (*ResponseScreenSize) ProtoMessage()               {}
func (*ResponseScreenSize) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{6} }

func (m *ResponseScreenSize) GetWidth() int32 {
	if m != nil {
		return m.Width
	}
	return 0
}

func (m *ResponseScreenSize) GetHeight() int32 {
	if m != nil {
		return m.Height
	}
	return 0
}

func init() {
	proto.RegisterType((*Empty)(nil), "rpc.Empty")
	proto.RegisterType((*Response)(nil), "rpc.Response")
	proto.RegisterType((*RequestRunScript)(nil), "rpc.RequestRunScript")
	proto.RegisterType((*RequestScreenshot)(nil), "rpc.RequestScreenshot")
	proto.RegisterType((*RequestTap)(nil), "rpc.RequestTap")
	proto.RegisterType((*ResponseScreenshot)(nil), "rpc.ResponseScreenshot")
	proto.RegisterType((*ResponseScreenSize)(nil), "rpc.ResponseScreenSize")
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConn

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion4

// Client API for GrpcService service

type GrpcServiceClient interface {
	RunScript(ctx context.Context, in *RequestRunScript, opts ...grpc.CallOption) (*Response, error)
	RunScriptAsync(ctx context.Context, in *RequestRunScript, opts ...grpc.CallOption) (*Response, error)
	Logs(ctx context.Context, in *Empty, opts ...grpc.CallOption) (GrpcService_LogsClient, error)
	GetScreenshot(ctx context.Context, in *RequestScreenshot, opts ...grpc.CallOption) (*ResponseScreenshot, error)
	GetScreenSize(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*ResponseScreenSize, error)
	GetStoragePath(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*Response, error)
	TapDown(ctx context.Context, in *RequestTap, opts ...grpc.CallOption) (*Response, error)
	MoveTo(ctx context.Context, in *RequestTap, opts ...grpc.CallOption) (*Response, error)
	TapUp(ctx context.Context, in *RequestTap, opts ...grpc.CallOption) (*Response, error)
	Pause(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*Response, error)
	Resume(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*Response, error)
	Reset(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*Response, error)
}

type grpcServiceClient struct {
	cc *grpc.ClientConn
}

func NewGrpcServiceClient(cc *grpc.ClientConn) GrpcServiceClient {
	return &grpcServiceClient{cc}
}

func (c *grpcServiceClient) RunScript(ctx context.Context, in *RequestRunScript, opts ...grpc.CallOption) (*Response, error) {
	out := new(Response)
	err := grpc.Invoke(ctx, "/rpc.GrpcService/RunScript", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *grpcServiceClient) RunScriptAsync(ctx context.Context, in *RequestRunScript, opts ...grpc.CallOption) (*Response, error) {
	out := new(Response)
	err := grpc.Invoke(ctx, "/rpc.GrpcService/RunScriptAsync", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *grpcServiceClient) Logs(ctx context.Context, in *Empty, opts ...grpc.CallOption) (GrpcService_LogsClient, error) {
	stream, err := grpc.NewClientStream(ctx, &_GrpcService_serviceDesc.Streams[0], c.cc, "/rpc.GrpcService/Logs", opts...)
	if err != nil {
		return nil, err
	}
	x := &grpcServiceLogsClient{stream}
	if err := x.ClientStream.SendMsg(in); err != nil {
		return nil, err
	}
	if err := x.ClientStream.CloseSend(); err != nil {
		return nil, err
	}
	return x, nil
}

type GrpcService_LogsClient interface {
	Recv() (*Response, error)
	grpc.ClientStream
}

type grpcServiceLogsClient struct {
	grpc.ClientStream
}

func (x *grpcServiceLogsClient) Recv() (*Response, error) {
	m := new(Response)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

func (c *grpcServiceClient) GetScreenshot(ctx context.Context, in *RequestScreenshot, opts ...grpc.CallOption) (*ResponseScreenshot, error) {
	out := new(ResponseScreenshot)
	err := grpc.Invoke(ctx, "/rpc.GrpcService/GetScreenshot", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *grpcServiceClient) GetScreenSize(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*ResponseScreenSize, error) {
	out := new(ResponseScreenSize)
	err := grpc.Invoke(ctx, "/rpc.GrpcService/GetScreenSize", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *grpcServiceClient) GetStoragePath(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*Response, error) {
	out := new(Response)
	err := grpc.Invoke(ctx, "/rpc.GrpcService/GetStoragePath", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *grpcServiceClient) TapDown(ctx context.Context, in *RequestTap, opts ...grpc.CallOption) (*Response, error) {
	out := new(Response)
	err := grpc.Invoke(ctx, "/rpc.GrpcService/TapDown", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *grpcServiceClient) MoveTo(ctx context.Context, in *RequestTap, opts ...grpc.CallOption) (*Response, error) {
	out := new(Response)
	err := grpc.Invoke(ctx, "/rpc.GrpcService/MoveTo", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *grpcServiceClient) TapUp(ctx context.Context, in *RequestTap, opts ...grpc.CallOption) (*Response, error) {
	out := new(Response)
	err := grpc.Invoke(ctx, "/rpc.GrpcService/TapUp", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *grpcServiceClient) Pause(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*Response, error) {
	out := new(Response)
	err := grpc.Invoke(ctx, "/rpc.GrpcService/Pause", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *grpcServiceClient) Resume(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*Response, error) {
	out := new(Response)
	err := grpc.Invoke(ctx, "/rpc.GrpcService/Resume", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *grpcServiceClient) Reset(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*Response, error) {
	out := new(Response)
	err := grpc.Invoke(ctx, "/rpc.GrpcService/Reset", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// Server API for GrpcService service

type GrpcServiceServer interface {
	RunScript(context.Context, *RequestRunScript) (*Response, error)
	RunScriptAsync(context.Context, *RequestRunScript) (*Response, error)
	Logs(*Empty, GrpcService_LogsServer) error
	GetScreenshot(context.Context, *RequestScreenshot) (*ResponseScreenshot, error)
	GetScreenSize(context.Context, *Empty) (*ResponseScreenSize, error)
	GetStoragePath(context.Context, *Empty) (*Response, error)
	TapDown(context.Context, *RequestTap) (*Response, error)
	MoveTo(context.Context, *RequestTap) (*Response, error)
	TapUp(context.Context, *RequestTap) (*Response, error)
	Pause(context.Context, *Empty) (*Response, error)
	Resume(context.Context, *Empty) (*Response, error)
	Reset(context.Context, *Empty) (*Response, error)
}

func RegisterGrpcServiceServer(s *grpc.Server, srv GrpcServiceServer) {
	s.RegisterService(&_GrpcService_serviceDesc, srv)
}

func _GrpcService_RunScript_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RequestRunScript)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GrpcServiceServer).RunScript(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rpc.GrpcService/RunScript",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GrpcServiceServer).RunScript(ctx, req.(*RequestRunScript))
	}
	return interceptor(ctx, in, info, handler)
}

func _GrpcService_RunScriptAsync_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RequestRunScript)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GrpcServiceServer).RunScriptAsync(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rpc.GrpcService/RunScriptAsync",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GrpcServiceServer).RunScriptAsync(ctx, req.(*RequestRunScript))
	}
	return interceptor(ctx, in, info, handler)
}

func _GrpcService_Logs_Handler(srv interface{}, stream grpc.ServerStream) error {
	m := new(Empty)
	if err := stream.RecvMsg(m); err != nil {
		return err
	}
	return srv.(GrpcServiceServer).Logs(m, &grpcServiceLogsServer{stream})
}

type GrpcService_LogsServer interface {
	Send(*Response) error
	grpc.ServerStream
}

type grpcServiceLogsServer struct {
	grpc.ServerStream
}

func (x *grpcServiceLogsServer) Send(m *Response) error {
	return x.ServerStream.SendMsg(m)
}

func _GrpcService_GetScreenshot_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RequestScreenshot)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GrpcServiceServer).GetScreenshot(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rpc.GrpcService/GetScreenshot",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GrpcServiceServer).GetScreenshot(ctx, req.(*RequestScreenshot))
	}
	return interceptor(ctx, in, info, handler)
}

func _GrpcService_GetScreenSize_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GrpcServiceServer).GetScreenSize(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rpc.GrpcService/GetScreenSize",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GrpcServiceServer).GetScreenSize(ctx, req.(*Empty))
	}
	return interceptor(ctx, in, info, handler)
}

func _GrpcService_GetStoragePath_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GrpcServiceServer).GetStoragePath(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rpc.GrpcService/GetStoragePath",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GrpcServiceServer).GetStoragePath(ctx, req.(*Empty))
	}
	return interceptor(ctx, in, info, handler)
}

func _GrpcService_TapDown_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RequestTap)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GrpcServiceServer).TapDown(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rpc.GrpcService/TapDown",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GrpcServiceServer).TapDown(ctx, req.(*RequestTap))
	}
	return interceptor(ctx, in, info, handler)
}

func _GrpcService_MoveTo_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RequestTap)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GrpcServiceServer).MoveTo(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rpc.GrpcService/MoveTo",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GrpcServiceServer).MoveTo(ctx, req.(*RequestTap))
	}
	return interceptor(ctx, in, info, handler)
}

func _GrpcService_TapUp_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RequestTap)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GrpcServiceServer).TapUp(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rpc.GrpcService/TapUp",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GrpcServiceServer).TapUp(ctx, req.(*RequestTap))
	}
	return interceptor(ctx, in, info, handler)
}

func _GrpcService_Pause_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GrpcServiceServer).Pause(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rpc.GrpcService/Pause",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GrpcServiceServer).Pause(ctx, req.(*Empty))
	}
	return interceptor(ctx, in, info, handler)
}

func _GrpcService_Resume_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GrpcServiceServer).Resume(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rpc.GrpcService/Resume",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GrpcServiceServer).Resume(ctx, req.(*Empty))
	}
	return interceptor(ctx, in, info, handler)
}

func _GrpcService_Reset_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GrpcServiceServer).Reset(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/rpc.GrpcService/Reset",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GrpcServiceServer).Reset(ctx, req.(*Empty))
	}
	return interceptor(ctx, in, info, handler)
}

var _GrpcService_serviceDesc = grpc.ServiceDesc{
	ServiceName: "rpc.GrpcService",
	HandlerType: (*GrpcServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "RunScript",
			Handler:    _GrpcService_RunScript_Handler,
		},
		{
			MethodName: "RunScriptAsync",
			Handler:    _GrpcService_RunScriptAsync_Handler,
		},
		{
			MethodName: "GetScreenshot",
			Handler:    _GrpcService_GetScreenshot_Handler,
		},
		{
			MethodName: "GetScreenSize",
			Handler:    _GrpcService_GetScreenSize_Handler,
		},
		{
			MethodName: "GetStoragePath",
			Handler:    _GrpcService_GetStoragePath_Handler,
		},
		{
			MethodName: "TapDown",
			Handler:    _GrpcService_TapDown_Handler,
		},
		{
			MethodName: "MoveTo",
			Handler:    _GrpcService_MoveTo_Handler,
		},
		{
			MethodName: "TapUp",
			Handler:    _GrpcService_TapUp_Handler,
		},
		{
			MethodName: "Pause",
			Handler:    _GrpcService_Pause_Handler,
		},
		{
			MethodName: "Resume",
			Handler:    _GrpcService_Resume_Handler,
		},
		{
			MethodName: "Reset",
			Handler:    _GrpcService_Reset_Handler,
		},
	},
	Streams: []grpc.StreamDesc{
		{
			StreamName:    "Logs",
			Handler:       _GrpcService_Logs_Handler,
			ServerStreams: true,
		},
	},
	Metadata: "grpc.proto",
}

func init() { proto.RegisterFile("grpc.proto", fileDescriptor0) }

var fileDescriptor0 = []byte{
	// 493 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x8c, 0x54, 0xdd, 0x6e, 0xd3, 0x4c,
	0x10, 0x8d, 0xd3, 0x38, 0xf9, 0x32, 0x4d, 0xf3, 0xc1, 0x0a, 0x8a, 0x55, 0x21, 0x54, 0xad, 0x52,
	0x09, 0x8a, 0xa8, 0x10, 0x95, 0x50, 0x6f, 0xa9, 0x40, 0xe5, 0x02, 0xa4, 0xca, 0x31, 0x82, 0x5e,
	0x1a, 0x67, 0x64, 0xaf, 0x44, 0xbc, 0xdb, 0xdd, 0x75, 0x5b, 0xf7, 0xfd, 0x78, 0x0c, 0xde, 0x05,
	0xed, 0x8f, 0xb1, 0xd3, 0xa2, 0x90, 0x3b, 0x9f, 0x33, 0x67, 0x7e, 0xce, 0xec, 0xc8, 0x00, 0xb9,
	0x14, 0xd9, 0x91, 0x90, 0x5c, 0x73, 0xb2, 0x25, 0x45, 0x46, 0x47, 0x10, 0x7e, 0x58, 0x0a, 0x5d,
	0xd3, 0x19, 0xfc, 0x17, 0xa3, 0x12, 0xbc, 0x54, 0x48, 0x22, 0x18, 0x2d, 0x51, 0xa9, 0x34, 0xc7,
	0x28, 0xd8, 0x0f, 0x9e, 0x8f, 0xe3, 0x06, 0xd2, 0x43, 0x78, 0x10, 0xe3, 0x65, 0x85, 0x4a, 0xc7,
	0x55, 0x39, 0xcf, 0x24, 0x13, 0x9a, 0xec, 0xc2, 0x50, 0xd9, 0x2f, 0x2f, 0xf6, 0x88, 0xfe, 0x0a,
	0xe0, 0xa1, 0x17, 0xcf, 0x33, 0x89, 0x58, 0xaa, 0x82, 0x6b, 0xf2, 0x08, 0xc2, 0x4c, 0x72, 0xf1,
	0xcd, 0x8a, 0xc3, 0xd8, 0x81, 0x86, 0xbd, 0x88, 0xfa, 0x2d, 0x7b, 0x41, 0x9e, 0xc2, 0xd8, 0x7c,
	0x7c, 0x65, 0x0b, 0x5d, 0x44, 0x5b, 0x36, 0xd2, 0x12, 0xe4, 0x19, 0x80, 0x01, 0x1f, 0x91, 0xe5,
	0x85, 0x8e, 0x06, 0x36, 0xdc, 0x61, 0xc8, 0x3e, 0x6c, 0x4b, 0x54, 0xec, 0x16, 0x5d, 0x7e, 0x68,
	0x05, 0x5d, 0x8a, 0x50, 0x98, 0x38, 0xe8, 0x6b, 0x0c, 0xad, 0x64, 0x85, 0x33, 0xbb, 0xb8, 0xac,
	0xd2, 0x1f, 0x4c, 0xd7, 0xd1, 0xc8, 0x86, 0x1b, 0x48, 0x4f, 0x00, 0xbc, 0xbd, 0x24, 0x15, 0x64,
	0x02, 0xc1, 0x8d, 0xf7, 0x14, 0xdc, 0x18, 0x54, 0x7b, 0x2f, 0x41, 0x4d, 0xa6, 0xd0, 0x67, 0x0b,
	0x6f, 0xa0, 0xcf, 0x16, 0x54, 0x00, 0x69, 0x76, 0xbd, 0xba, 0x19, 0xb6, 0x6c, 0x76, 0x3e, 0x89,
	0x1d, 0x30, 0x2e, 0x16, 0x78, 0xc5, 0x32, 0xef, 0xc2, 0xd5, 0xec, 0x52, 0xc6, 0x85, 0x83, 0xde,
	0x85, 0xeb, 0xb3, 0xc2, 0xd1, 0xd3, 0xbb, 0x1d, 0xe7, 0xec, 0x16, 0x4d, 0xc7, 0x6b, 0x5b, 0xd5,
	0xbf, 0x85, 0x05, 0xe6, 0x3d, 0x0b, 0x57, 0xc9, 0x35, 0xf3, 0xe8, 0xcd, 0xcf, 0x01, 0x6c, 0x9f,
	0x49, 0x91, 0xcd, 0x51, 0x9a, 0xca, 0xe4, 0x18, 0xc6, 0xed, 0x11, 0x3c, 0x3e, 0x32, 0x87, 0x75,
	0xf7, 0x36, 0xf6, 0x76, 0x3c, 0xed, 0x5a, 0xd3, 0x1e, 0x39, 0x81, 0xe9, 0x9f, 0xe8, 0x3b, 0x55,
	0x97, 0xd9, 0xc6, 0x99, 0x07, 0x30, 0xf8, 0xc4, 0x73, 0x45, 0xc0, 0x06, 0xec, 0xd1, 0xde, 0x13,
	0xbd, 0x0e, 0xc8, 0x29, 0xec, 0x9c, 0x61, 0xf7, 0xe0, 0x76, 0xbb, 0xf5, 0x5b, 0x7e, 0xef, 0xc9,
	0x4a, 0x6e, 0x1b, 0xa0, 0x3d, 0xf2, 0xb6, 0x53, 0xc3, 0x2e, 0xaa, 0xdb, 0xf3, 0x6f, 0x79, 0x46,
	0x44, 0x7b, 0xe4, 0x15, 0x4c, 0x4d, 0x9e, 0xe6, 0x32, 0xcd, 0xf1, 0x3c, 0xd5, 0xc5, 0xda, 0x61,
	0xc9, 0x4b, 0x18, 0x25, 0xa9, 0x78, 0xcf, 0xaf, 0x4b, 0xf2, 0x7f, 0x77, 0xc8, 0x24, 0x15, 0xf7,
	0xc5, 0x87, 0x30, 0xfc, 0xcc, 0xaf, 0x30, 0xe1, 0x1b, 0x68, 0x5f, 0x40, 0x98, 0xa4, 0xe2, 0x8b,
	0xd8, 0x40, 0x3a, 0x83, 0xf0, 0x3c, 0xad, 0x14, 0xae, 0x9f, 0xf4, 0x00, 0x86, 0x31, 0xaa, 0x6a,
	0xf9, 0x0f, 0xd9, 0x0c, 0xc2, 0x18, 0x15, 0xea, 0xb5, 0xaa, 0xef, 0x43, 0xfb, 0xfb, 0x39, 0xfe,
	0x1d, 0x00, 0x00, 0xff, 0xff, 0x2b, 0x36, 0xab, 0x35, 0x8c, 0x04, 0x00, 0x00,
}
