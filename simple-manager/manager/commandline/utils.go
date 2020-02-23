package main

func getSerial(devices []*ServiceInformation, serial string) *ServiceInformation {
	for _, device := range devices {
		if device == nil {
			continue
		}
		if device.Serial == serial {
			return device
		}
	}
	return nil
}
