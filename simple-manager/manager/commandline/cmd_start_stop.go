package main

import (
	fmt "fmt"
	"time"

	"github.com/r2-studio/robotmon-desktop/simple-manager/manager"
)

func startService(client *manager.AdbClient, serial string) {
	pids, err := client.StartRobotmonService(serial)
	if err != nil {
		fmt.Printf("Serial:[%s] Start service failed. %s\n", serial, err.Error())
		return
	}
	fmt.Printf("Serial:[%s] Pids: [%s, %s] Start service success\n", serial, pids[0], pids[1])
}

func stopService(client *manager.AdbClient, serial string) {
	err := client.StopService(serial)
	if err != nil {
		fmt.Printf("Serial:[%s] Stop service failed. %s\n", serial, err.Error())
		return
	}
	fmt.Printf("Serial:[%s] Stop service success\n", serial)
}

// StartService start device
func StartService(client *manager.AdbClient, serial string) {
	if serial == "" {
		fmt.Println("Start All Derivces...")
	}
	devices := getDeviceInformations(client)
	success := false
	for _, device := range devices {
		if device == nil {
			continue
		}
		if serial != "" && serial == device.Serial {
			startService(client, serial)
			return
		}
		if serial == "" {
			startService(client, device.Serial)
			success = true
			break
		}
	}
	if serial != "" && !success {
		fmt.Printf("Serial:[%s] Start service faild. No serial\n", serial)
	}
}

// StopService stop device
func StopService(client *manager.AdbClient, serial string) {
	if serial == "" {
		fmt.Println("Stop All Derivces...")
	}
	devices := getDeviceInformations(client)
	success := false
	for _, device := range devices {
		if device == nil {
			continue
		}
		if serial != "" && serial == device.Serial {
			stopService(client, serial)
			success = true
			break
		}
		if serial == "" {
			stopService(client, device.Serial)
			time.Sleep(time.Second)
		}
	}
	if serial != "" && !success {
		fmt.Printf("Serial:[%s] Stop service faild. No serial\n", serial)
	}
}
