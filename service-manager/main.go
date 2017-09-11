package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
)

const (
	// StartCommand start robotmon service command
	StartCommand = "nohup sh -c \"LD_LIBRARY_PATH=/system/lib:/data/app/com.r2sutdio.robotmon-1/lib/arm:/data/app/com.r2sutdio.robotmon-2/lib/arm CLASSPATH=/data/app/com.r2sutdio.robotmon-1/base.apk:/data/app/com.r2sutdio.robotmon-2/base.apk app_process32 /system/bin com.r2sutdio.robotmon.Main $@\" > /dev/null 2> /dev/null &"
)

func getAdbPath() string {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
		log.Fatal(err)
	}
	if runtime.GOOS == "linux" {
		return dir + "/adb.linux"
	} else if runtime.GOOS == "darwin" {
		return dir + "/adb.darwin"
	} else {
		return dir + "\\adb.win32"
	}
}

func getDevices() []string {
	devices := []string{}
	result, _ := exec.Command(getAdbPath(), "devices").Output()
	lines := strings.Split(string(result), "\n")
	for _, line := range lines {
		tabs := strings.Split(line, "\t")
		if len(tabs) > 1 {
			devices = append(devices, tabs[0])
		}
	}
	return devices
}

func getPid(device string) string {
	var result []byte
	if device == "" {
		result, _ = exec.Command(getAdbPath(), "shell", "ps | grep app_process32").Output()
	} else {
		result, _ = exec.Command(getAdbPath(), "-s", device, "shell", "ps | grep app_process32").Output()
	}
	line := strings.Split(string(result), "\n")[0]
	tabs := strings.Split(line, " ")
	for i, tab := range tabs {
		if i > 0 && tab != "" {
			return tabs[i]
		}
	}
	return ""
}

func startServices() {
	devices := getDevices()
	for _, device := range devices {
		pid := getPid(device)
		if pid == "" {
			exec.Command(getAdbPath(), "-s", device, "shell", StartCommand).Output()
			pid := getPid(device)
			fmt.Println("start robotmon service", device, "pid", pid)
		} else {
			fmt.Println("robotmon service already started", device, pid)
		}
	}
}

func stopServices() {
	devices := getDevices()
	for _, device := range devices {
		pid := getPid(device)
		if pid != "" {
			exec.Command(getAdbPath(), "-s", device, "shell", "kill "+pid).Output()
		}
		fmt.Println("stop robotmon service", device, pid)
	}
}

func listServices() {
	devices := getDevices()
	for _, device := range devices {
		pid := getPid(device)
		if pid == "" {
			fmt.Println("Device", device, "service is not running")
		} else {
			fmt.Println("Device", device, "service is running", pid)
		}
	}
}

func main() {

	startCmd := flag.Bool("start", false, "start robotmon service")
	stopCmd := flag.Bool("stop", false, "stop robotmon service")
	flag.Parse()

	if *startCmd {
		startServices()
	} else if *stopCmd {
		stopServices()
	} else {
		listServices()
	}
}
