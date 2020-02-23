package main

import (
	fmt "fmt"
	"strings"

	"github.com/r2-studio/robotmon-desktop/simple-manager/manager"
)

// ServiceInformation service informations
type ServiceInformation struct {
	Serial    string
	IsLaunch  bool
	IPAddress string
	Pid1      string
	Pid2      string

	Forward map[string]string // {[pcPort]: devicePort}
}

// Print Serial:[emulator-5554] Pids:[2030, 2030] Launch:[true] IP:[10.0.2.15]
func (s *ServiceInformation) Print() {
	forward := ""
	if s.Forward != nil {
		for pcPort, devicePort := range s.Forward {
			forward += fmt.Sprintf("[%s -> %s] ", pcPort, devicePort)
		}
		if len(forward) > 0 {
			forward = forward[:len(forward)-1]
		}
	}
	fmt.Printf("Serial:[%s] Pids:[%s, %s] Launch:[%t] IP:[%s] Forward(PC->Device): [%s]\n", s.Serial, s.Pid1, s.Pid1, s.IsLaunch, s.IPAddress, forward)
}

// {[serial]: {[pcPort]: devicePort}}
func getForwardInformations(client *manager.AdbClient) *map[string]map[string]string {
	results := map[string]map[string]string{}
	raw := client.ForwardList()
	lines := strings.Split(raw, "\n")
	for _, line := range lines {
		serial := ""
		pcPort := ""
		devicePort := ""
		fmt.Sscanf(line, "%s tcp:%s tcp:%s", &serial, &pcPort, &devicePort)
		if serial != "" && pcPort != "" && devicePort != "" {
			if results[serial] == nil {
				results[serial] = map[string]string{pcPort: devicePort}
			} else {
				results[serial][pcPort] = devicePort
			}
		}
	}
	return &results
}

func getDeviceInformations(client *manager.AdbClient) []*ServiceInformation {
	services := []*ServiceInformation{}
	forwardInfos := getForwardInformations(client)
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
			Forward:   (*forwardInfos)[serial],
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
