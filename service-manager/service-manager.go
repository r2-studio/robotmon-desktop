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

	adb "github.com/poi5305/go-adb"
)

const (
	// StartCommand launch service command
	StartCommand = "%s sh -c \"LD_LIBRARY_PATH=/system/lib:/data/data/com.r2studio.robotmon/lib:/data/app/com.r2studio.robotmon-1/lib/arm:/data/app/com.r2studio.robotmon-2/lib/arm CLASSPATH=%s %s /system/bin com.r2studio.robotmon.Main $@\" > /dev/null 2> /dev/null &"
)

var client *adb.Adb

func init() {
	adbPath := getAdbPath(false)
	fmt.Println(adbPath)
	client, _ = adb.NewWithConfig(adb.ServerConfig{
		PathToAdb: adbPath,
	})
	client.StartServer()
}

func getAdbPath(bin bool) string {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	prefixes := []string{".", "..", "bin"}
	if err != nil {
		log.Fatal(err)
	}
	for _, prefix := range prefixes {
		adbPath := dir + string(os.PathSeparator) + prefix + string(os.PathSeparator) + "adb." + runtime.GOOS
		if _, err := os.Stat(adbPath); !os.IsNotExist(err) {
			return adbPath
		}
	}
	return ""
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
	for _, serial := range serials {
		pid := getPid(serial)
		if pid == "" {
			command := getStartCommand(serial)
			fmt.Println(command)
			descriptor := adb.DeviceWithSerial(serial)
			device := client.Device(descriptor)
			adbDelay()
			for i := 0; i < 10; i++ {
				_, err := device.RunCommand(command)
				if err != nil {
					fmt.Println("Failed", err)
				}
				pid = getPid(serial)
				if pid != "" {
					fmt.Println("Success", serial, "pid", pid)
					break
				}
				fmt.Println("Retry...", i)
				time.Sleep(800 * time.Millisecond)
			}
			if pid == "" {
				fmt.Println("Failed")
			}
		} else {
			fmt.Println("Already started", serial, pid)
		}
	}
}

func stopServices() {
	serials := getDevices()
	for _, serial := range serials {
		for i := 0; i < 2; i++ {
			pid := getPid(serial)
			if pid != "" {
				descriptor := adb.DeviceWithSerial(serial)
				device := client.Device(descriptor)
				device.RunCommand("kill " + pid)
				fmt.Println("stop robotmon service", serial, pid)
			}
			adbDelay()
		}
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
	time.Sleep(3 * time.Second)
}
