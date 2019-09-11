package main

import (
	"fmt"

	"github.com/r2-studio/robotmon-desktop/simple-manager/manager"
)

func main() {
	client := manager.GetAdbClient()
	fmt.Println(client)
	client.GetDeviceABI("FA7B81A03059")
	client.GetRobotmonStartCommand("FA7B81A03059")
	// devices, _ := client.GetDevices()
	// if len(devices) > 0 {
	// 	client.Forward(devices[0], "8088", "8088")
	// }

	select {}
}
