package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"time"

	"github.com/asticode/go-astilectron"
	"github.com/asticode/go-astilectron-bootstrap"
)

// ListItem represents a list item
type ListItem struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

func sendLog(msg string) {
	window.Send(bootstrap.MessageOut{Name: "log", Payload: msg})
}

// handleMessages handles messages
func handleMessages(w *astilectron.Window, m bootstrap.MessageIn) (payload interface{}, err error) {
	switch m.Name {
	case "envTest":
		dir, _ := filepath.Abs(filepath.Dir(os.Args[0]))
		sendLog("[EnvTest] Current Path: " + dir)

		adbPath = getAdbPath()

		if adbPath == "" {
			sendLog("[EnvTest] ADB NOT Found")
			window.Send(bootstrap.MessageOut{Name: "adbPath", Payload: "ADB NOT Found, You can set ADB Path yourself"})
			return
		}

		window.Send(bootstrap.MessageOut{Name: "adbPath", Payload: adbPath})
		client = NewAdbExec(adbPath)
		sendLog("[EnvTest] ADB path: " + adbPath)
		sendLog("[EnvTest] Find Devices... Please Wait")
		devices := client.GetDevices()
		for _, serial := range devices {
			sendLog("[EvnTest] Find Device: " + serial)

			apkPath := getApkPath(serial)
			sendLog("[EvnTest] -- Robotmon APK Path: " + apkPath)

			appProcess := getAppProcess(serial)
			sendLog("[EvnTest] -- Robotmon App Process: " + appProcess)

			startCommand := getStartCommand(serial)
			sendLog("[EvnTest] -- Robotmon Start Command: " + startCommand)

			pid := getPid(serial)
			if pid == "" {
				sendLog("[EvnTest] -- Robotmon Service NOT Found")
			} else {
				sendLog("[EvnTest] -- Robotmon Service Started PID: " + pid)
			}
		}
		if len(devices) == 0 {
			sendLog("[EvnTest] -- USB Devices not found")
		}

	case "start":
		devices := client.GetDevices()
		for _, serial := range devices {
			startCommand := getStartCommand(serial)
			sendLog("[Start] -- Robotmon Start Command: " + startCommand)

			cv := make(chan bool, 1)
			go func() {
				client.RunCommand(serial, startCommand)
				cv <- true
			}()
			select {
			case <-cv:
			case <-time.After(3 * time.Second):
			}

			pid := getPid(serial)
			if pid == "" {
				sendLog("[Start] -- Robotmon Service Start Failed")
			} else {
				sendLog("[Start] -- Robotmon Service Started PID: " + pid)
			}
		}
	case "stop":
		serials := client.GetDevices()
		for _, serial := range serials {
			for i := 0; i < 2; i++ {
				pid := getPid(serial)
				if pid != "" {
					client.RunCommand(serial, "kill "+pid)
					sendLog("[Stop] -- Try to stop Robotmon Service " + serial + " pid: " + pid + " ...")
				}
			}
		}
	case "report":
	case "setadb":
		json.Unmarshal(m.Payload, &adbPath)
		sendLog("New ADB Path: " + adbPath)
	case "runadb":
		serials := client.GetDevices()
		for _, serial := range serials {
			command := ""
			json.Unmarshal(m.Payload, &command)
			sendLog("[RunADB] -- Command: " + command)
			result := client.RunCommand(serial, command)
			sendLog("[RunADB] -- " + serial + " Result: " + result)
		}
	}
	return
}
