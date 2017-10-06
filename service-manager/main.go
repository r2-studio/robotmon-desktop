package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	adb "github.com/yosemite-open/go-adb"
)

const (
	// StartCommand launch service command
	StartCommand = "%s sh -c \"LD_LIBRARY_PATH=/system/lib:/data/data/com.r2studio.robotmon/lib:/data/app/com.r2studio.robotmon-1/lib/arm:/data/app/com.r2studio.robotmon-2/lib/arm CLASSPATH=%s %s /system/bin com.r2studio.robotmon.Main $@\" > /dev/null 2> /dev/null &"
)

var client *adb.Adb

func init() {
	client, _ = adb.New()
	// client.StartServer()
}

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
	serials, _ := client.ListDeviceSerials()
	return serials
}

func getPid(serial string) string {
	descriptor := adb.DeviceWithSerial(serial)
	device := client.Device(descriptor)
	result, _ := device.RunCommand("ps | grep app_process")

	line := strings.Split(result, "\n")[0]
	tabs := strings.Split(line, " ")
	for i, tab := range tabs {
		if i > 0 && tab != "" {
			return tabs[i]
		}
	}
	return ""
}

func isExistPath(serial, path string) bool {
	descriptor := adb.DeviceWithSerial(serial)
	device := client.Device(descriptor)
	result, _ := device.RunCommand("ls " + path)

	if strings.Contains(result, "No such file") {
		return false
	}
	return true
}

func getAppProcess(serial string) string {
	if isExistPath(serial, "/system/bin/app_process32") {
		return "app_process32"
	}
	return "app_process"
}

func getApkPath(serial string) string {
	descriptor := adb.DeviceWithSerial(serial)
	device := client.Device(descriptor)
	result, _ := device.RunCommand("pm path com.r2studio.robotmon")

	result = strings.Trim(result, "\r\n")
	path := strings.Split(string(result), ":")[1]
	return path
}

func getStartCommand(serial string) string {
	nohup := "" // some device not exist nohup
	if isExistPath(serial, "/system/bin/nohup") {
		nohup = "nohup"
	} else if isExistPath(serial, "/system/bin/daemonize") {
		nohup = "daemonize"
	}
	apk := getApkPath(serial)
	process := getAppProcess(serial)
	command := fmt.Sprintf(StartCommand, nohup, apk, process)
	return command
}

func adbDelay() {
	time.Sleep(200 * time.Millisecond)
}

func startServices() {
	serials := getDevices()
	// adbDelay()
	for _, serial := range serials {
		pid := getPid(serial)
		// adbDelay()
		if pid == "" {
			command := getStartCommand(serial)
			fmt.Println(command)
			adbDelay()
			descriptor := adb.DeviceWithSerial(serial)
			device := client.Device(descriptor)
			adbDelay()
			// result, err := device.RunCommand(command)
			// for i := 0; i < 10; i++ {
			// result, err := device.RunCommand("sh", "-c", "LD_LIBRARY_PATH=/system/lib:/data/data/com.r2studio.robotmon/lib:/data/app/com.r2studio.robotmon-1/lib/arm:/data/app/com.r2studio.robotmon-2/lib/arm CLASSPATH=/data/app/com.r2studio.robotmon-1/base.apk app_process32 /system/bin com.r2studio.robotmon.Main $@ & sleep 1")
			result, err := device.RunCommand("LD_LIBRARY_PATH=/system/lib:/data/data/com.r2studio.robotmon/lib:/data/app/com.r2studio.robotmon-1/lib/arm:/data/app/com.r2studio.robotmon-2/lib/arm CLASSPATH=/data/app/com.r2studio.robotmon-1/base.apk app_process32 /system/bin com.r2studio.robotmon.Main $@")
			fmt.Println(result, err)
			// }

			adbDelay()
			pid := getPid(serial)
			fmt.Println("start robotmon service", serial, "pid", pid)
		} else {
			fmt.Println("robotmon service already started", serial, pid)
		}
	}
}

func stopServices() {
	serials := getDevices()
	// adbDelay()
	for _, serial := range serials {
		pid := getPid(serial)
		if pid != "" {
			// adbDelay()
			descriptor := adb.DeviceWithSerial(serial)
			device := client.Device(descriptor)
			device.RunCommand("kill " + pid)
		}
		fmt.Println("stop robotmon service", serial, pid)
	}
}

func listServices() {
	serials := getDevices()
	adbDelay()
	for _, serial := range serials {
		pid := getPid(serial)
		if pid == "" {
			fmt.Println("Device", serial, "service is not running")
		} else {
			fmt.Println("Device", serial, "service is running", pid)
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
