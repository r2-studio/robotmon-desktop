package main

import (
	"github.com/asticode/go-astilectron"
	"github.com/asticode/go-astilectron-bootstrap"
)

// ListItem represents a list item
type ListItem struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

// handleMessages handles messages
func handleMessages(w *astilectron.Window, m bootstrap.MessageIn) (payload interface{}, err error) {
	switch m.Name {
	case "envTest":
		// adbPath = getAdbPath()
		adbPath = "/Users/Andy/project/go/src/github.com/r2-studio/robotmon-desktop/service-manager/bin/adb.darwin"
		client = NewAdbExec(adbPath)
		devices := client.GetDevices()

		window.Send("[EnvTest] ADB path: " + adbPath)
		window.Send("[EnvTest] Find Devices... Please Wait")
		for _, serial := range devices {
			window.Send("[EvnTest] Find Device: " + serial)

			apkPath := getApkPath(serial)
			window.Send("[EvnTest] -- Robotmon APK Path: " + apkPath)

			appProcess := getAppProcess(serial)
			window.Send("[EvnTest] -- Robotmon App Process: " + appProcess)

			startCommand := getStartCommand(serial)
			window.Send("[EvnTest] -- Robotmon Start Command: " + startCommand)

			pid := getPid(serial)
			if pid == "" {
				window.Send("[EvnTest] -- Robotmon Service NOT Found")
			} else {
				window.Send("[EvnTest] -- Robotmon Service Started PID: " + pid)
			}
		}
	}
	return
}
