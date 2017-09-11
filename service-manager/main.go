package main

import (
	"bytes"
	"flag"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

const (
	// StartCommand launch service command
	StartCommand = "%s sh -c \"LD_LIBRARY_PATH=/system/lib:/data/data/com.r2sutdio.robotmon/lib CLASSPATH=%s %s /system/bin com.r2sutdio.robotmon.Main $@\" > /dev/null 2> /dev/null &"
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
		result, _ = exec.Command(getAdbPath(), "shell", "ps | grep app_process").Output()
	} else {
		result, _ = exec.Command(getAdbPath(), "-s", device, "shell", "ps | grep app_process").Output()
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

func isExistPath(device, path string) bool {
	var result []byte
	if device == "" {
		result, _ = exec.Command(getAdbPath(), "shell", "ls "+path).Output()
	} else {
		result, _ = exec.Command(getAdbPath(), "-s", device, "shell", "ls "+path).Output()
	}
	if bytes.Contains(result, []byte("No such file")) {
		return false
	}
	return true
}

func getAppProcess(device string) string {
	if isExistPath(device, "/system/bin/app_process32") {
		return "app_process32"
	}
	return "app_process"
}

func getApkPath(device string) string {
	var result []byte
	if device == "" {
		result, _ = exec.Command(getAdbPath(), "shell", "pm path com.r2sutdio.robotmon;").Output()
	} else {
		result, _ = exec.Command(getAdbPath(), "-s", device, "shell", "pm path com.r2sutdio.robotmon;").Output()
	}
	result = bytes.Trim(result, "\r\n")
	path := strings.Split(string(result), ":")[1]
	return path
}

func getStartCommand(device string) string {
	nohup := "nohup"
	if !isExistPath(device, "/system/bin/nohup") {
		// TODO check and test it
		nohup = "daemonize"
	}
	apk := getApkPath(device)
	process := getAppProcess(device)
	command := fmt.Sprintf(StartCommand, nohup, apk, process)
	return command
}

func adbDelay() {
	time.Sleep(200 * time.Millisecond)
}

func startServices() {
	devices := getDevices()
	adbDelay()
	for _, device := range devices {
		pid := getPid(device)
		adbDelay()
		if pid == "" {
			command := getStartCommand(device)
			adbDelay()
			exec.Command(getAdbPath(), "-s", device, "shell", command).Output()
			adbDelay()
			pid := getPid(device)
			fmt.Println("start robotmon service", device, "pid", pid)
		} else {
			fmt.Println("robotmon service already started", device, pid)
		}
	}
}

func stopServices() {
	devices := getDevices()
	adbDelay()
	for _, device := range devices {
		pid := getPid(device)
		if pid != "" {
			adbDelay()
			exec.Command(getAdbPath(), "-s", device, "shell", "kill "+pid).Output()
		}
		fmt.Println("stop robotmon service", device, pid)
	}
}

func listServices() {
	devices := getDevices()
	adbDelay()
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
