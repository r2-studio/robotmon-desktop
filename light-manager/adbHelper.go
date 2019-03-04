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
	// BaseStartCommand launch service command
	BaseStartCommand = "LD_LIBRARY_PATH=/system/lib:/data/data/com.r2studio.robotmon/lib:%s CLASSPATH=%s %s /system/bin com.r2studio.robotmon.Main $@"
	// StartCommand full comment
	StartCommand = "%s sh -c \"" + BaseStartCommand + "\" > /dev/null 2> /dev/null && sleep 1 &"
)

// NewAdbHelper create AdbHelper
func NewAdbHelper() *AdbHelper {
	// current directory
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err == nil {
		os.Setenv("PATH", dir+":"+dir+string(os.PathSeparator)+"bin"+":"+os.Getenv("PATH"))
	}
	adbPath := dir + string(os.PathSeparator) + "bin" + string(os.PathSeparator) + "adb"
	if runtime.GOOS == "windows" {
		adbPath += ".exe"
	}
	_, err = os.Stat(adbPath)
	if err == nil {
		if !os.IsNotExist(err) {
			return &AdbHelper{
				adbPath: adbPath,
			}
		}
	}

	var cmd *exec.Cmd
	if runtime.GOOS == "windows" {
		cmd = exec.Command("which", "adb.exe")
	} else {
		cmd = exec.Command("which", "adb")
	}

	hideWindow(cmd)
	bs, err := cmd.Output()
	if err != nil || string(bs) == "" {
		return nil
	}
	return &AdbHelper{
		adbPath: strings.Trim(string(bs), "\r\n "),
	}
}

// AdbHelper comment
type AdbHelper struct {
	adbPath string
}

// GetAdbPath comment
func (a *AdbHelper) GetAdbPath() string {
	return a.adbPath
}

// GetDevices adb devices
func (a *AdbHelper) GetDevices() ([]string, error) {
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
		if len(tabs) > 1 {
			devices = append(devices, tabs[0])
		}
	}
	return devices, nil
}

func (a *AdbHelper) forward(port string) (bool, error) {
	cmd := exec.Command(a.adbPath, "forward", "--no-rebind", "tcp:"+port, "tcp:8080")
	hideWindow(cmd)
	bs, err := cmd.Output()
	if err != nil {
		return false, err
	}
	if strings.Contains(string(bs), "error") {
		return false, nil
	}
	return true, nil
}

func (a *AdbHelper) connect(ip string, port string) (bool, error) {
	cmd := exec.Command(a.adbPath, "connect", ip+":"+port)
	hideWindow(cmd)
	bs, err := cmd.Output()
	if strings.Contains(string(bs), "connected") {
		return true, nil
	}
	cmd = exec.Command(a.adbPath, "disconnect", ip+":"+port)
	hideWindow(cmd)
	cmd.Output()
	if err != nil {
		return false, err
	}
	return false, nil
}

func (a *AdbHelper) tcpip(serial string) error {
	cmd := exec.Command(a.adbPath, "-s", serial, "tcpip", "5555")
	hideWindow(cmd)
	_, err := cmd.Output()
	if err != nil {
		return err
	}
	return nil
}

func (a *AdbHelper) getPids(serial string) ([]string, error) {
	cmd := exec.Command(a.adbPath, "-s", serial, "shell", "ps | grep app_process")
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
		cmd := exec.Command(a.adbPath, "-s", serial, "shell", "ps -A | grep app_process")
		hideWindow(cmd)
		bs, err := cmd.Output()
		if !strings.Contains(err.Error(), "exit") {
			return nil, err
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

func (a *AdbHelper) isExistPath(serial, path string) bool {
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

func (a *AdbHelper) getAppProcess(serial string) string {
	isExist := a.isExistPath(serial, "/system/bin/app_process32")
	if isExist {
		return "app_process32"
	}
	return "app_process"
}

func (a *AdbHelper) getApkPath(serial string) (string, error) {
	cmd := exec.Command(a.adbPath, "-s", serial, "shell", "pm path com.r2studio.robotmon")
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

func (a *AdbHelper) getStartCommand(serial string) (string, error) {
	nohup := "" // some device not exist nohup
	if a.isExistPath(serial, "/system/bin/nohup") || a.isExistPath(serial, "/system/xbin/nohup") {
		nohup = "nohup"
	} else if a.isExistPath(serial, "/system/bin/daemonize") || a.isExistPath(serial, "/system/xbin/daemonize") {
		nohup = "daemonize"
	}
	apk, err := a.getApkPath(serial)
	if err != nil {
		return "", err
	}
	apkDir := path.Dir(apk)
	lib8 := apkDir + "/lib:" + apkDir + "/lib/arm:" + apkDir + "/lib/x86"
	process := a.getAppProcess(serial)
	command := fmt.Sprintf(StartCommand, nohup, lib8, apk, process)
	return command, err
}

func (a *AdbHelper) startService(serial string) error {
	pids, err := a.getPids(serial)
	if err != nil {
		return err
	}
	if len(pids) > 0 {
		return nil
	}
	command, err := a.getStartCommand(serial)
	if err != nil {
		return err
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
		case <-time.After(4 * time.Second):
		}

		// check pids
		pids, err = a.getPids(serial)
		if err != nil {
			return err
		}
		if len(pids) > 0 {
			return nil
		}
		time.Sleep(800 * time.Millisecond)
	}
	return fmt.Errorf("Start service failed")
}

func (a *AdbHelper) stopService(serial string) error {
	pids, err := a.getPids(serial)
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
	return nil
}
