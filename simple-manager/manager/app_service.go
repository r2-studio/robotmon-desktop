package manager

import (
	"context"
	"fmt"
	"log"
	"net"
	"time"

	rpc "github.com/r2-studio/robotmon-desktop/simple-manager/manager/apprpc"
	"github.com/r2-studio/robotmon-desktop/simple-manager/manager/proxy"
	"google.golang.org/grpc"
)

// AppService app service struct
type AppService struct {
	adbClient *AdbClient
}

// NewAppService new app service
func NewAppService(adbClient *AdbClient) *AppService {
	a := &AppService{
		adbClient: adbClient,
	}
	a.Init()
	return a
}

// Init init app service
func (a *AppService) Init() {
	opt1 := grpc.MaxRecvMsgSize(64 * 1024 * 1024)
	opt2 := grpc.MaxSendMsgSize(64 * 1024 * 1024)
	grpcServer := grpc.NewServer(opt1, opt2)

	rpc.RegisterAppServiceServer(grpcServer, a)
	lis, err := net.Listen("tcp", ":9487")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	fmt.Println("Listen :9487 for gRPC")
	go grpcServer.Serve(lis)

	time.Sleep(time.Second)

	fmt.Println("Listen :9488 for http")
	go proxy.RunProxy("0.0.0.0:9488", "localhost:9487")
}

// GetDevices get devices
func (a *AppService) GetDevices(context.Context, *rpc.Empty) (*rpc.Devices, error) {
	serials, err := adbClient.GetDevices()
	if err != nil {
		return nil, err
	}
	devices := make([]*rpc.Device, 0, len(serials))
	for _, serial := range serials {
		device := &rpc.Device{
			Serial: serial,
		}
		devices = append(devices, device)
	}
	result := &rpc.Devices{
		Devices: devices,
	}
	return result, nil
}

// AdbConnect call adb connect
func (a *AppService) AdbConnect(ctx context.Context, req *rpc.AdbConnectParams) (*rpc.Message, error) {
	result, err := adbClient.Connect(req.Ip, req.Port)
	if err != nil {
		return nil, err
	}
	return &rpc.Message{Message: result}, nil
}

// AdbShell call adb shell
func (a *AppService) AdbShell(ctx context.Context, req *rpc.AdbShellParams) (*rpc.Message, error) {
	result, err := adbClient.Shell(req.Serial, req.Command)
	if err != nil {
		return nil, err
	}
	return &rpc.Message{Message: result}, nil
}
