package proxy

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"time"

	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	grpc_prometheus "github.com/grpc-ecosystem/go-grpc-prometheus"
	"github.com/mwitkow/grpc-proxy/proxy"
	"github.com/poi5305/grpc-web/go/grpcweb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
)

// RunProxy 0.0.0.0:9488, localhost:9487
func RunProxy(httpHost, grpcHost string) {
	log.SetOutput(os.Stdout)

	grpcServer := buildGrpcProxyServer(grpcHost)
	errChan := make(chan error)
	options := []grpcweb.Option{
		grpcweb.WithCorsForRegisteredEndpointsOnly(false),
		grpcweb.WithOriginFunc(makeHttpOriginFunc()),
	}
	options = append(
		options,
		grpcweb.WithWebsockets(true),
		grpcweb.WithWebsocketOriginFunc(makeWebsocketOriginFunc()),
	)
	wrappedGrpc := grpcweb.WrapServer(grpcServer, options...)
	server := buildServer(wrappedGrpc)
	listener := buildListenerOrFail(httpHost)
	serveServer(server, listener, errChan)
	<-errChan
	fmt.Println("Error")
}

func buildGrpcProxyServer(grpcHost string) *grpc.Server {
	grpc.EnableTracing = true
	// gRPC proxy logic.
	backendConn := dialBackendOrFail(grpcHost)
	director := func(ctx context.Context, fullMethodName string) (context.Context, *grpc.ClientConn, error) {
		md, _ := metadata.FromIncomingContext(ctx)
		outCtx, _ := context.WithCancel(ctx)
		mdCopy := md.Copy()
		delete(mdCopy, "user-agent")
		outCtx = metadata.NewOutgoingContext(outCtx, mdCopy)
		return outCtx, backendConn, nil
	}
	// Server with logging and monitoring enabled.
	return grpc.NewServer(
		grpc.CustomCodec(proxy.Codec()), // needed for proxy to function.
		grpc.UnknownServiceHandler(proxy.TransparentHandler(director)),
		grpc_middleware.WithUnaryServerChain(grpc_prometheus.UnaryServerInterceptor),
		grpc_middleware.WithStreamServerChain(grpc_prometheus.StreamServerInterceptor),
	)
}

func dialBackendOrFail(grpcHost string) *grpc.ClientConn {
	if grpcHost == "" {
		log.Fatalf("flag 'backend_addr' must be set")
	}
	opt := []grpc.DialOption{}
	opt = append(opt, grpc.WithCodec(proxy.Codec()))
	opt = append(opt, grpc.WithInsecure())
	opt = append(opt,
		grpc.WithDefaultCallOptions(grpc.MaxCallRecvMsgSize(1024*1024*64)),
		grpc.WithBackoffMaxDelay(grpc.DefaultBackoffConfig.MaxDelay),
	)
	cc, err := grpc.Dial(grpcHost, opt...)
	if err != nil {
		log.Fatalf("failed dialing backend: %v", err)
	}
	return cc
}

func makeHttpOriginFunc() func(origin string) bool {
	return func(origin string) bool {
		return true
	}
}

func makeWebsocketOriginFunc() func(req *http.Request) bool {
	return func(req *http.Request) bool {
		return true
	}
}

func buildServer(wrappedGrpc *grpcweb.WrappedGrpcServer) *http.Server {
	return &http.Server{
		WriteTimeout: 10 * time.Second,
		ReadTimeout:  10 * time.Second,
		Handler: http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			// w.Header().Set("Access-Control-Allow-Origin", "*")
			// w.Header().Set("Access-Control-Allow-Origin", "*")
			// w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
			// w.Header().Set("Access-Control-Expose-Headers", "grpc-status, grpc-message")
			// w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, XMLHttpRequest, x-user-agent, x-grpc-web, grpc-status, grpc-message")
			wrappedGrpc.ServeHTTP(w, req)
		}),
	}
}

func buildListenerOrFail(httpHost string) net.Listener {
	listener, err := net.Listen("tcp", httpHost)
	if err != nil {
		log.Fatalf("failed listening on %v: %v", httpHost, err)
	}
	return listener
	// return conntrack.NewListener(listener,
	// 	conntrack.TrackWithName("http"),
	// 	conntrack.TrackWithTcpKeepAlive(20*time.Second),
	// 	conntrack.TrackWithTracing(),
	// )
}

func serveServer(server *http.Server, listener net.Listener, errChan chan error) {
	go func() {
		if err := server.Serve(listener); err != nil {
			errChan <- fmt.Errorf("http server error: %v", err)
		}
	}()
}
