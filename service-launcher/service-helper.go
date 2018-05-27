package main

import (
	"fmt"
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

const (
	// StartCommand launch service command
	BaseStartCommand = "LD_LIBRARY_PATH=/system/lib:/data/data/com.r2studio.robotmon/lib:%s CLASSPATH=%s %s /system/bin com.r2studio.robotmon.Main $@"
	StartCommand = "%s sh -c \"" + BaseStartCommand + "\" > /dev/null 2> /dev/null && sleep 1 &"
)

type Adb interface {
	GetDevices() []string
	RunCommand(string, string, string) string
	RunCommand3(string, string, string, string) string
}

var adbPath string
var client Adb

type AdbExec struct {
	AdbPath string
}

func (a *AdbExec) GetDevices() []string {
	devices := []string{}
	cmd := exec.Command(a.AdbPath, "devices")
	hideWindow(cmd);
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

func (a *AdbExec) RunCommand(serial, command1, command2 string) string {
	var cmd *exec.Cmd
	if serial == "" {
		cmd = exec.Command(a.AdbPath, command1, command2)
	} else {
		cmd = exec.Command(a.AdbPath, "-s", serial, command1, command2)
	}
	hideWindow(cmd);
	cmd.Stderr = os.Stderr
	result, err := cmd.Output()
	if err != nil {
		fmt.Println(nil)
		return ""
	}
	return string(result)
}

func (a *AdbExec) RunCommand3(serial, command1, command2, command3 string) string {
	var cmd *exec.Cmd
	if serial == "" {
		cmd = exec.Command(a.AdbPath, command1, command2, command3)
	} else {
		cmd = exec.Command(a.AdbPath, "-s", serial, command1, command2, command3)
	}
	hideWindow(cmd);
	cmd.Stderr = os.Stderr
	result, err := cmd.Output()
	if err != nil {
		fmt.Println(nil)
		return ""
	}
	return string(result)
}

func NewAdbExec(adbPath string) Adb {
	return &AdbExec{
		AdbPath: adbPath,
	}
}

func getAdbPath() string {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	prefixes := []string{".", "..", "bin", "resources/app/static/bin"}
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
	result := client.RunCommand(serial, "shell", "ps | grep app_process")

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
	result := client.RunCommand(serial, "shell", "ls "+path)

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
	result := client.RunCommand(serial, "shell", "pm path com.r2studio.robotmon")

	result = strings.Trim(result, "\r\n")
	paths := strings.Split(string(result), ":")
	if len(paths) < 2 {
		return ""
	}
	return paths[1]
}

func getStartCommand(serial string) string {
	nohup := "" // some device not exist nohup
	if isExistPath(serial, "/system/bin/nohup") {
		nohup = "nohup"
	} else if isExistPath(serial, "/system/bin/daemonize") {
		nohup = "daemonize"
	}
	apk := getApkPath(serial)
	apkDir := path.Dir(apk)
	lib8 := apkDir + "/lib:" + apkDir + "/lib/arm:" + apkDir + "/lib/x86"
	process := getAppProcess(serial)
	command := fmt.Sprintf(StartCommand, nohup, lib8, apk, process)
	return command
}

func getBaseStartCommand(serial string) string {
	apk := getApkPath(serial)
	lib8 := path.Dir(apk) + "/lib:" + path.Dir(apk) + "/lib/arm"
	process := getAppProcess(serial)
	command := fmt.Sprintf(BaseStartCommand, lib8, apk, process)
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
					client.RunCommand(serial, "shell", command)
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
				client.RunCommand(serial, "shell", "kill "+pid)
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

func getDeviceAndroidVersion(serial string) string {
	result := client.RunCommand(serial, "shell", "getprop ro.build.version.release")
	result = strings.Trim(result, "\r\n")
	if result == "" {
		return "unknown"
	}
	return result
}

func getDeviceModel(serial string) string {
	manufacturer := client.RunCommand(serial, "shell", "getprop ro.product.manufacturer")
	manufacturer = strings.Trim(manufacturer, "\r\n")
	model := client.RunCommand(serial, "shell", "getprop ro.product.model")
	model = strings.Trim(model, "\r\n")
	if manufacturer == "" {
		return "unknown"
	}
	if model == "" {
		return "unknown"
	}
	return manufacturer + " " + model
}

// func main() {
// 	startCmd := flag.Bool("start", false, "start robotmon service")
// 	stopCmd := flag.Bool("stop", false, "stop robotmon service")
// 	isExecAdb := flag.Bool("exec", true, "use exec adb")
// 	isConnectVM := flag.Bool("connvm", false, "connect to 5555 and 62001")
// 	flag.Parse()

// 	adbPath := getAdbPath()
// 	fmt.Println("find adb path:", adbPath)

// 	if *isExecAdb {
// 		client = NewAdbExec(adbPath)
// 	} else {
// 		client = NewAdbClient(adbPath)
// 	}

// 	if *isConnectVM {
// 		// connect to BS
// 		cmd := exec.Command(adbPath, "connect", "127.0.0.1:5555")
// 		cmd.Stdout = os.Stdout
// 		cmd.Stderr = os.Stderr
// 		cmd.Run()
// 		// connetc to 夜神
// 		cmd = exec.Command(adbPath, "connect", "127.0.0.1:62001")
// 		cmd.Stdout = os.Stdout
// 		cmd.Stderr = os.Stderr
// 		cmd.Run()
// 		time.Sleep(1 * time.Second)
// 	}

// 	if *startCmd {
// 		startServices()
// 	} else if *stopCmd {
// 		stopServices()
// 	} else {
// 		listServices()
// 	}
// 	fmt.Println("Enter to exit...")
// 	bufio.NewReader(os.Stdin).ReadBytes('\n')
// }
