package main

import (
	fmt "fmt"

	"github.com/r2-studio/robotmon-desktop/simple-manager/manager"
)

// ServiceInformation service informations
type ServiceInformation struct {
	Serial    string
	IsLaunch  bool
	IPAddress string
	Pid1      string
	Pid2      string
}

// Print Serial:[emulator-5554] Pids:[2030, 2030] Launch:[true] IP:[10.0.2.15]
func (s *ServiceInformation) Print() {
	fmt.Printf("Serial:[%s] Pids:[%s, %s] Launch:[%t] IP:[%s]\n", s.Serial, s.Pid1, s.Pid1, s.IsLaunch, s.IPAddress)
}

func getDeviceInformations(client *manager.AdbClient) []*ServiceInformation {
	services := []*ServiceInformation{}
	serials, err := adbClient.GetDevices()
	if err != nil {
		fmt.Println("[Warning] Can not get adb devices", err)
		return services
	}
	for _, serial := range serials {
		ip := adbClient.GetIPAddress(serial)
		pids, err := adbClient.GetPids(serial, "app_process")
		if err != nil {
			fmt.Println("[Warning] Can not get pids", serial, err)
			continue
		}
		si := &ServiceInformation{
			Serial:    serial,
			IPAddress: ip,
		}
		if len(pids) >= 2 {
			si.Pid1 = pids[0]
			si.Pid2 = pids[1]
			si.IsLaunch = true
		}
		services = append(services, si)
	}
	return services
}

// ListDevices list devices
func ListDevices(client *manager.AdbClient) {
	serviceInfos := getDeviceInformations(client)
	for _, serviceInfo := range serviceInfos {
		serviceInfo.Print()
	}
}
