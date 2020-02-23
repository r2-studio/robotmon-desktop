package main

import (
	fmt "fmt"
	"io/ioutil"
	"time"

	"github.com/r2-studio/robotmon-desktop/simple-manager/manager"
	context "golang.org/x/net/context"
	grpc "google.golang.org/grpc"
)

func runScriptImpl(serial, ip, port, script string, sync bool) {
	conn, err := grpc.Dial(fmt.Sprintf("%s:%s", ip, port), grpc.WithInsecure())
	if err != nil {
		return
	}
	deviceClient := NewGrpcServiceClient(conn)
	ctx, _ := context.WithCancel(context.Background())
	if !sync {
		_, err := deviceClient.RunScriptAsync(ctx, &RequestRunScript{Script: script})
		if err != nil {
			return
		}
		fmt.Printf("Serial:[%s] IP:PORT:[%s:%s] Run Script Success.\n", serial, ip, port)
	} else {
		resp, err := deviceClient.RunScript(ctx, &RequestRunScript{Script: script})
		if err != nil {
			return
		}
		fmt.Printf("Serial:[%s] IP:PORT:[%s:%s] Run Script Success. Result: %s\n", serial, ip, port, resp.GetMessage())
	}
	conn.Close()
}

func findConnectLocalPort(forward map[string]string) string {
	localPort := ""
	for pcPort, devicePort := range forward {
		if pcPort != "" && devicePort == "8081" {
			localPort = pcPort
			break
		}
	}
	return localPort
}

func prepareToConnect(client *manager.AdbClient, device *ServiceInformation) string {
	// check service started
	if !device.IsLaunch {
		fmt.Printf("Start Service %s ...\n", device.Serial)
		startService(client, device.Serial)
		time.Sleep(3 * time.Second)
		devices := getDeviceInformations(client)
		device = getSerial(devices, device.Serial)
		if !device.IsLaunch {
			fmt.Printf("Run Script Failed... Service not launched %s\n", device.Serial)
			return ""
		}
	}
	// check forward
	localPort := findConnectLocalPort(device.Forward)
	if localPort == "" {
		fmt.Printf("Forward Port %s ...\n", device.Serial)
		Forward(client, device.Serial, "", "8081")
		// reload device information
		devices := getDeviceInformations(client)
		device = getSerial(devices, device.Serial)
		localPort = findConnectLocalPort(device.Forward)
		if localPort == "" {
			fmt.Printf("Run Script Failed... No Forward port %s\n", device.Serial)
			return ""
		}
	}
	return localPort
}

// RunScript run script
func RunScript(client *manager.AdbClient, serial string, sync bool, file string, simpleScript string) {
	script := ""
	if file != "" {
		bs, err := ioutil.ReadFile(file)
		if err != nil {
			fmt.Printf("Serial:[%s] Run Script failed. File not exist\n", serial)
			return
		}
		script = string(bs)
	} else if simpleScript != "" {
		script = simpleScript
	}
	if script == "" {
		fmt.Printf("Serial:[%s] Run Script failed. Script is empty\n", serial)
		return
	}

	devices := getDeviceInformations(client)
	if serial != "" {
		device := getSerial(devices, serial)
		if device == nil {
			fmt.Printf("Serial:[%s] Run Script faild. No serial\n", serial)
			return
		}
		pcPort := prepareToConnect(client, device)
		if pcPort != "" {
			runScriptImpl(serial, "127.0.0.1", pcPort, script, sync)
		}
		return
	}

	for _, device := range devices {
		pcPort := prepareToConnect(client, device)
		if pcPort != "" {
			runScriptImpl(device.Serial, "127.0.0.1", pcPort, script, sync)
		}
	}

}
