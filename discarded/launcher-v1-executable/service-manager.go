package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	adb "github.com/poi5305/go-adb"
)

const (
	// StartCommand launch service command
	StartCommand = "%s sh -c \"LD_LIBRARY_PATH=/system/lib:/data/data/com.r2studio.robotmon/lib:/data/app/com.r2studio.robotmon-1/lib/arm:/data/app/com.r2studio.robotmon-2/lib/arm CLASSPATH=%s %s /system/bin com.r2studio.robotmon.Main $@\" > /dev/null 2> /dev/null && sleep 1 &"
)

type Adb interface {
	GetDevices() []string
	RunCommand(string, string) string
}

type AdbClient struct {
	AdbPath string
	Client  *adb.Adb
}

func (a *AdbClient) GetDevices() []string {
	serials, err := a.Client.ListDeviceSerials()
	if err != nil {
		fmt.Println(err)
		return []string{}
	}
	if len(serials) == 0 {
		fmt.Println("Can not find any devicde")
	}
	return serials
}

func (a *AdbClient) RunCommand(serial, command string) string {
	descriptor := adb.DeviceWithSerial(serial)
	device := a.Client.Device(descriptor)
	result, err := device.RunCommand(command)
	if err != nil {
		fmt.Println(err)
		return ""
	}
	return result
}

type AdbExec struct {
	AdbPath string
}

func (a *AdbExec) GetDevices() []string {
	devices := []string{}
	cmd := exec.Command(a.AdbPath, "devices")
	cmd.Stderr = os.Stderr
	result, err := cmd.Output()
	if err != nil {
		fmt.Println(err)
		return []string{}
	}
	lines := strings.Split(string(result), "\n")
	for _, line := range lines {
		tabs := strings.Split(line, "\t")
		if len(tabs) > 1 {
			devices = append(devices, tabs[0])
		}
	}
	if len(devices) == 0 {
		fmt.Println("Can not find any devicde")
	}
	return devices
}

func (a *AdbExec) RunCommand(serial, command string) string {
	cmd := exec.Command(a.AdbPath, "-s", serial, "shell", command)
	cmd.Stderr = os.Stderr
	result, err := cmd.Output()
	if err != nil {
		fmt.Println(nil)
		return ""
	}
	return string(result)
}

func NewAdbClient(adbPath string) Adb {
	cmd := exec.Command(adbPath, "start-server")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Run()

	client, err := adb.New()

	if err != nil {
		fmt.Println(err)
		bufio.NewReader(os.Stdin).ReadBytes('\n')
		os.Exit(0)
	}

	client.StartServer()
	return &AdbClient{
		AdbPath: adbPath,
		Client:  client,
	}
}

func NewAdbExec(adbPath string) Adb {
	return &AdbExec{
		AdbPath: adbPath,
	}
}

var client Adb

func getAdbPath() string {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	prefixes := []string{".", "..", "bin"}
	if err != nil {
		fmt.Println(err)
	}
	for _, prefix := range prefixes {
		adbPath := dir + string(os.PathSeparator) + prefix + string(os.PathSeparator) + "adb." + runtime.GOOS
		if _, err := os.Stat(adbPath); !os.IsNotExist(err) {
			return adbPath
		}
	}
	return ""
}

func getPid(serial string) string {
	result := client.RunCommand(serial, "ps | grep app_process")

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
	result := client.RunCommand(serial, "ls "+path)

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
	result := client.RunCommand(serial, "pm path com.r2studio.robotmon")

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
	serials := client.GetDevices()
	for _, serial := range serials {
		pid := getPid(serial)
		if pid == "" {
			command := getStartCommand(serial)
			fmt.Println("start service command:")
			fmt.Println(command)
			adbDelay()
			for i := 0; i < 10; i++ {
				cv := make(chan bool, 1)
				go func() {
					client.RunCommand(serial, command)
					cv <- true
				}()
				select {
				case <-cv:
				case <-time.After(3 * time.Second):
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
	serials := client.GetDevices()
	for _, serial := range serials {
		for i := 0; i < 2; i++ {
			pid := getPid(serial)
			if pid != "" {
				client.RunCommand(serial, "kill "+pid)
				fmt.Println("stop robotmon service", serial, pid)
			}
			adbDelay()
		}
	}
}

func listServices() {
	serials := client.GetDevices()
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
	isExecAdb := flag.Bool("exec", true, "use exec adb")
	isConnectVM := flag.Bool("connvm", false, "connect to 5555 and 62001")
	flag.Parse()

	adbPath := getAdbPath()
	fmt.Println("find adb path:", adbPath)

	if *isExecAdb {
		client = NewAdbExec(adbPath)
	} else {
		client = NewAdbClient(adbPath)
	}

	if *isConnectVM {
		// connect to BS
		cmd := exec.Command(adbPath, "connect", "127.0.0.1:5555")
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		cmd.Run()
		// connetc to 夜神
		cmd = exec.Command(adbPath, "connect", "127.0.0.1:62001")
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		cmd.Run()
		time.Sleep(1 * time.Second)
	}

	if *startCmd {
		startServices()
	} else if *stopCmd {
		stopServices()
	} else {
		listServices()
	}
	fmt.Println("Enter to exit...")
	bufio.NewReader(os.Stdin).ReadBytes('\n')
}
