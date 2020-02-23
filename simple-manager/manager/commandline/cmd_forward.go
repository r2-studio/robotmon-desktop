package main

import (
	fmt "fmt"

	"github.com/r2-studio/robotmon-desktop/simple-manager/manager"
)

func isPCPortUsed(forwardInfos *map[string]map[string]string, port string) bool {
	if forwardInfos == nil {
		return false
	}
	for _, ports := range *forwardInfos {
		if ports == nil {
			continue
		}
		for pcPort := range ports {
			if pcPort == port {
				return true
			}
		}
	}
	return false
}

func isDevicePortBind(forwardInfos *map[string]map[string]string, searial, port string) bool {
	if forwardInfos == nil {
		return false
	}
	ports := (*forwardInfos)[searial]
	if ports == nil {
		return false
	}
	for _, devicePort := range ports {
		if devicePort == port {
			return true
		}
	}
	return false
}

func findAvailablePort(forwardInfos *map[string]map[string]string) string {
	if forwardInfos == nil {
		return "9000"
	}
	for port := 9000; port <= 9020; port++ {
		portStr := fmt.Sprintf("%d", port)
		if !isPCPortUsed(forwardInfos, portStr) {
			return portStr
		}
	}
	return "9000"
}

func forwardImpl(client *manager.AdbClient, serial, pcPort, devicePort string) {
	success, err := adbClient.Forward(serial, devicePort, pcPort)
	if err != nil {
		fmt.Printf("Serial:[%s] Forward faild. %s\n", serial, err.Error())
	}
	if !success {
		fmt.Printf("Serial:[%s] Forward faild.\n", serial)
	}
	fmt.Printf("Serial:[%s] Forward Success. [PC: %s -> Device: %s]\n", serial, pcPort, devicePort)
}

// Forward forward
func Forward(client *manager.AdbClient, serial, pcPort, devicePort string) {
	devices := getDeviceInformations(client)
	forwardInfos := getForwardInformations(client)
	if devicePort == "" {
		devicePort = "8081" // gRPC port
	}
	// check port is already used
	if pcPort != "" && isPCPortUsed(forwardInfos, pcPort) {
		fmt.Printf("PC port already used\n")
		return
	}
	if pcPort == "" {
		pcPort = findAvailablePort(forwardInfos)
	}

	if serial != "" {
		// check serial exists
		if getSerial(devices, serial) == nil {
			fmt.Printf("Serial:[%s] Forward faild. No serial\n", serial)
			return
		}
		// check serial already bind
		if isDevicePortBind(forwardInfos, serial, devicePort) {
			fmt.Printf("Serial:[%s] Forward faild. Already bind %s\n", serial, devicePort)
			return
		}

		forwardImpl(client, serial, pcPort, devicePort)
		return
	}
	// forward all devices
	for _, device := range devices {
		if device == nil {
			continue
		}
		if isDevicePortBind(forwardInfos, device.Serial, devicePort) {
			continue
		}
		forwardImpl(client, device.Serial, pcPort, devicePort)
		// udpate available pc port
		forwardInfos := getForwardInformations(client)
		pcPort = findAvailablePort(forwardInfos)
	}
}
