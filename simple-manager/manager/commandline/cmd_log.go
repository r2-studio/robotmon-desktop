package main

import (
	fmt "fmt"

	"github.com/r2-studio/robotmon-desktop/simple-manager/manager"
	context "golang.org/x/net/context"
	grpc "google.golang.org/grpc"
)

func listenLogImpl(serial, ip, port string) {
	conn, err := grpc.Dial(fmt.Sprintf("%s:%s", ip, port), grpc.WithInsecure())
	if err != nil {
		return
	}
	deviceClient := NewGrpcServiceClient(conn)
	ctx, _ := context.WithCancel(context.Background())

	logClient, err := deviceClient.Logs(ctx, &Empty{})
	if err != nil {
		return
	}
	fmt.Printf("Serial:[%s] Listening...\n", serial)
	for {
		resp, err := logClient.Recv()
		if err != nil {
			fmt.Printf("Serial:[%s] Listen log disconnect.\n", serial)
			break
		}
		fmt.Printf("[%s] %s\n", serial, resp.GetMessage())
	}
	conn.Close()
}

// ListenLog run script
func ListenLog(client *manager.AdbClient, serial string) {
	devices := getDeviceInformations(client)
	if serial != "" {
		device := getSerial(devices, serial)
		if device == nil {
			fmt.Printf("Serial:[%s] Run Script faild. No serial\n", serial)
			return
		}
		pcPort := prepareToConnect(client, device)
		if pcPort != "" {
			go listenLogImpl(serial, "127.0.0.1", pcPort)
			select {}
		}
		return
	}

	for _, device := range devices {
		pcPort := prepareToConnect(client, device)
		if pcPort != "" {
			go listenLogImpl(device.Serial, "127.0.0.1", pcPort)
		}
	}
	select {}
}
