package manager

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path"
	"runtime"
	"strings"
	"time"
)

var adbClient *AdbClient

type AdbClient struct {
	adbPath string
}

func GetAdbClient() *AdbClient {

	if adbClient == nil {
		adbClient = newAdbClient()
	}
	return adbClient
}

func newAdbClient() *AdbClient {
	a := &AdbClient{}
	a.Init()
	return a
}

// Init init client
func (a *AdbClient) Init() {
	if runtime.GOOS == "windows" {
		os.Setenv("PATH", os.Getenv("PATH")+";"+"C:\\Program Files\\Nox\\bin")
		os.Setenv("PATH", os.Getenv("PATH")+";"+"D:\\Program Files\\Nox\\bin")
		os.Setenv("PATH", os.Getenv("PATH")+";"+"C:\\Program Files (x86)\\Nox\\bin")
		os.Setenv("PATH", os.Getenv("PATH")+";"+"D:\\Program Files (x86)\\Nox\\bin")
	}
	pwd, _ := os.Getwd()
	if runtime.GOOS == "windows" {
		os.Setenv("PATH", os.Getenv("PATH")+";"+pwd+"\\bin")
	} else {
		os.Setenv("PATH", os.Getenv("PATH")+":"+pwd+"/bin")
	}

	adbPath, err := exec.LookPath("adb")
	if adbPath == "" || err != nil {
		fmt.Println("adb not found, download it...")
		downloadAdb()
		fmt.Println("adb download success")
		adbPath, err = exec.LookPath("adb")
	}
	if err != nil {
		fmt.Println("Error adb not found... exit")
		os.Exit(1)
	}
	fmt.Println("Found adb:", adbPath)
	a.adbPath = adbPath
}

// GetDevices adb devices
func (a *AdbClient) GetDevices() ([]string, error) {
	devices := []string{}
	cmd := exec.Command(a.adbPath, "devices")
	hideWindow(cmd)
	result, err := cmd.Output()
	if err != nil {
		return []string{}, err
	}
	lines := strings.Split(string(result), "\n")
	for _, line := range lines {
		tabs := strings.Split(line, "\t")
		if len(tabs) > 1 && !strings.Contains(tabs[1], "offline") {
			devices = append(devices, tabs[0])
		}
	}
	return devices, nil
}

// Forward adb forward
func (a *AdbClient) Forward(serial string, devicePort, pcPort string) (bool, error) {
	cmd := exec.Command(a.adbPath, "-s", serial, "forward", "--no-rebind", "tcp:"+devicePort, "tcp:"+pcPort)
	hideWindow(cmd)
	bs, err := cmd.Output()
	if err != nil {
		return false, err
	}
	if strings.Contains(string(bs), "error") {
		return false, fmt.Errorf(string(bs))
	}
	return true, nil
}

// Connect adb connect
func (a *AdbClient) Connect(ip string, port string) (string, error) {
	cmd := exec.Command(a.adbPath, "connect", ip+":"+port)
	hideWindow(cmd)
	bs, err := cmd.Output()
	if strings.Contains(string(bs), "connected") {
		return ip + ":" + port, nil
	}
	cmd = exec.Command(a.adbPath, "disconnect", ip+":"+port)
	hideWindow(cmd)
	cmd.Output()
	if err != nil {
		return "", err
	}
	return "", nil
}

// Restart adb kill-server then adb start-server
func (a *AdbClient) Restart() {
	cmd := exec.Command(a.adbPath, "kill-server")
	hideWindow(cmd)
	cmd.Output()
	time.Sleep(time.Second)
	cmd = exec.Command(a.adbPath, "start-server")
	hideWindow(cmd)
	cmd.Output()
}

// TCPIP adb tcpip
func (a *AdbClient) TCPIP(serial, port string) error {
	cmd := exec.Command(a.adbPath, "-s", serial, "tcpip", port)
	hideWindow(cmd)
	_, err := cmd.Output()
	if err != nil {
		return err
	}
	return nil
}

// Shell adb shell
func (a *AdbClient) Shell(serial, command string) (string, error) {
	cmd := exec.Command(a.adbPath, "-s", serial, "shell", command)
	hideWindow(cmd)
	bs, err := cmd.Output()
	if err != nil {
		return "", err
	}
	return string(bytes.Trim(bs, "\r\n ")), nil
}

// Install adb install
func (a *AdbClient) Install(serial, apk string) (string, error) {
	cmd := exec.Command(a.adbPath, "-s", serial, "install", "-r", apk)
	hideWindow(cmd)
	bs, err := cmd.Output()
	if err != nil {
		return "", err
	}
	if strings.Contains(string(bs), "error") {
		return "", nil
	}
	return string(bytes.Trim(bs, "\r\n ")), nil
}

// Uninstall adb uninstall
func (a *AdbClient) Uninstall(serial, apkID string) (string, error) {
	cmd := exec.Command(a.adbPath, "-s", serial, "uninstall", apkID)
	hideWindow(cmd)
	bs, err := cmd.Output()
	if err != nil {
		return "", err
	}
	if strings.Contains(string(bs), "error") {
		return "", nil
	}
	return string(bytes.Trim(bs, "\r\n ")), nil
}

// GetPids adb shell "ps | grep process"  (app_process)
func (a *AdbClient) GetPids(serial string, process string) ([]string, error) {
	cmd := exec.Command(a.adbPath, "-s", serial, "shell", "ps | grep "+process)
	hideWindow(cmd)
	bs, err := cmd.Output()
	if err != nil {
		if !strings.Contains(err.Error(), "exit") {
			return nil, err
		}
	}
	result := string(bs)
	// try ps -A
	if result == "" {
		cmd := exec.Command(a.adbPath, "-s", serial, "shell", "ps -A | grep "+process)
		hideWindow(cmd)
		bs, err := cmd.Output()
		if err != nil {
			if !strings.Contains(err.Error(), "exit") {
				return nil, err
			}
		}
		result = string(bs)
	}

	pids := []string{}
	lines := strings.Split(result, "\n")
	for _, line := range lines {
		tabs := strings.Split(line, " ")
		for i, tab := range tabs {
			if i > 0 && tab != "" {
				pids = append(pids, tab)
				break
			}
		}
	}
	return pids, nil
}

// IsFileExist check is file exist in device
func (a *AdbClient) IsFileExist(serial, path string) bool {
	cmd := exec.Command(a.adbPath, "-s", serial, "shell", "ls "+path)
	hideWindow(cmd)
	bs, err := cmd.Output()
	if err != nil {
		return false
	}
	result := string(bs)

	if strings.Contains(result, "No such file") {
		return false
	}
	return true
}

// GetDeviceABI get device abi, arm64-v8a, armeabi-v7a or x86
func (a *AdbClient) GetDeviceABI(serial string) (string, error) {
	return a.Shell(serial, "getprop ro.product.cpu.abi")
}

// GetAppProcess for robotmon starting service
func (a *AdbClient) GetAppProcess(serial string) (bool, bool, bool) {
	isExist := a.IsFileExist(serial, "/system/bin/app_process")
	isExist32 := a.IsFileExist(serial, "/system/bin/app_process32")
	isExist64 := a.IsFileExist(serial, "/system/bin/app_process64")
	return isExist, isExist32, isExist64
}

// GetApkPath get apk installed path (com.r2studio.robotmon)
func (a *AdbClient) GetApkPath(serial, packageName string) (string, error) {
	cmd := exec.Command(a.adbPath, "-s", serial, "shell", "pm path ", packageName)
	hideWindow(cmd)
	bs, err := cmd.Output()
	if err != nil {
		if !strings.Contains(err.Error(), "exit status 1") {
			return "", err
		}
	}
	result := string(bs)
	result = strings.Trim(result, "\r\n")
	paths := strings.Split(string(result), ":")
	if len(paths) < 2 {
		return "", fmt.Errorf("Can not find robotmon package, please install it first")
	}
	return paths[1], nil
}

func (a *AdbClient) getNohubPath(serial string) string {
	nohup := "" // some device not exist nohup
	if a.IsFileExist(serial, "/system/bin/nohup") || a.IsFileExist(serial, "/system/xbin/nohup") {
		nohup = "nohup"
	} else if a.IsFileExist(serial, "/system/bin/daemonize") || a.IsFileExist(serial, "/system/xbin/daemonize") {
		nohup = "daemonize"
	}
	return nohup
}

// GetRobotmonStartCommand getRobotmonStartCommand
func (a *AdbClient) GetRobotmonStartCommand(serial string) (string, []string, error) {
	nohup := a.getNohubPath(serial)
	apk, err := a.GetApkPath(serial, "com.r2studio.robotmon")
	if err != nil {
		return "", nil, err
	}
	apkDir := path.Dir(apk)

	abi, err := a.GetDeviceABI(serial)
	if err != nil {
		return "", nil, err
	}

	app, app32, app64 := a.GetAppProcess(serial)
	classPath := "CLASSPATH=" + apk
	ldPath := "LD_LIBRARY_PATH="
	appProcess := ""
	if abi == "arm64-v8a" {
		ldPath += "/system/lib64:/system/lib:"
		ldPath += apkDir + "/lib:" + apkDir + "/lib/arm64"
		if app64 {
			appProcess = "app_process64"
		} else if app {
			appProcess = "app_process"
		} else {
			appProcess = "app_process32"
		}
	} else if abi == "x86" {
		ldPath += "/system/lib"
		ldPath += apkDir + "/lib:" + apkDir + "/lib/x84"
		if app32 {
			appProcess = "app_process32"
		} else {
			appProcess = "app_process"
		}
	} else {
		ldPath += "/system/lib"
		ldPath += apkDir + "/lib:" + apkDir + "/lib/arm"
		if app32 {
			appProcess = "app_process32"
		} else {
			appProcess = "app_process"
		}
	}
	baseCommand := fmt.Sprintf("%s %s %s /system/bin com.r2studio.robotmon.Main $@", ldPath, classPath, appProcess)
	command := fmt.Sprintf("%s sh -c \"%s\" > /dev/null 2> /dev/null && sleep 1 &", nohup, baseCommand)
	fmt.Println("============================\n", ldPath)
	fmt.Println("============================\n", classPath)
	fmt.Println("============================\n", appProcess)
	fmt.Println("============================\n", baseCommand)
	fmt.Println("============================\n", command)
	fmt.Println("============================")
	details := []string{
		ldPath, classPath, appProcess, baseCommand, command,
	}
	return command, details, err
}

func (a *AdbClient) StartRobotmonService(serial string) ([]string, error) {
	pids, err := a.GetPids(serial, "app_process")
	if err != nil {
		return nil, err
	}
	if len(pids) > 0 {
		return pids, nil
	}
	command, _, err := a.GetRobotmonStartCommand(serial)
	if err != nil {
		return nil, err
	}
	// try 3 times
	for i := 0; i < 3; i++ {
		cv := make(chan bool, 1)
		go func() {
			cmd := exec.Command(a.adbPath, "-s", serial, "shell", command)
			hideWindow(cmd)
			_, err := cmd.Output()
			if err != nil {
				cv <- false
			}
			cv <- true
		}()

		// wait for running command
		select {
		case <-cv:
		case <-time.After(5 * time.Second):
		}

		// check pids
		pids, err := a.GetPids(serial, "app_process")
		if err != nil {
			return nil, err
		}
		if len(pids) > 0 {
			return pids, nil
		}
		time.Sleep(1000 * time.Millisecond)
	}
	return nil, fmt.Errorf("Start service failed")
}

func (a *AdbClient) StopService(serial string) error {
	pids, err := a.GetPids(serial, "app_process")
	if err != nil {
		return err
	}
	for _, pid := range pids {
		cmd := exec.Command(a.adbPath, "-s", serial, "shell", "kill "+pid)
		hideWindow(cmd)
		_, err := cmd.Output()
		if err != nil {
			return err
		}
		time.Sleep(200 * time.Millisecond)
	}
	pids, err = a.GetPids(serial, "app_process")
	if len(pids) == 0 {
		return nil
	}
	for _, pid := range pids {
		cmd := exec.Command(a.adbPath, "-s", serial, "shell", "kill -9 "+pid)
		hideWindow(cmd)
		_, err := cmd.Output()
		if err != nil {
			return err
		}
		time.Sleep(200 * time.Millisecond)
	}
	return nil
}

func (a *AdbClient) GetIPAddress(serial string) string {
	output, _ := a.Shell(serial, "ifconfig")
	lines := strings.Split(output, "\n")
	ip := ""
	for _, line := range lines {
		if !strings.Contains(line, "inet ") || strings.Contains(line, "127.0.0.1") || strings.Contains(line, "0.0.0.0") || strings.Contains(line, ":172.") {
			continue
		}
		fmt.Sscanf(strings.Trim(line, " \t"), "inet addr:%s ", &ip)
		if ip != "" {
			return ip
		}
	}
	output, _ = a.Shell(serial, "netcfg")
	lines = strings.Split(output, "\n")
	for _, line := range lines {
		ss := strings.Split(line, " ")
		for _, s := range ss {
			if len(s) > 10 && strings.Contains(s, "/") {
				tmpIP := s[0:strings.Index(s, "/")]
				if tmpIP == "0.0.0.0" || tmpIP == "127.0.0.1" || strings.HasPrefix(tmpIP, "172.") {
					continue
				}
				return ip
			}
		}
	}
	return ip
}
