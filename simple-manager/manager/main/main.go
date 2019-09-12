package main

import (
	"fmt"

	"github.com/r2-studio/robotmon-desktop/simple-manager/manager"
)

func main() {
	client := manager.GetAdbClient()
	// client.GetDeviceABI("FA7B81A03059")
	// client.GetRobotmonStartCommand("FA7B81A03059")
	fmt.Println(client.GetIPAddress("FA7B81A03059"))
	manager.NewAppService(client)
	// devices, _ := client.GetDevices()
	// if len(devices) > 0 {
	// 	client.Forward(devices[0], "8088", "8088")
	// }

	select {}
}
