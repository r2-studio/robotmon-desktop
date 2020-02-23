package main

import (
	"os"

	"github.com/r2-studio/robotmon-desktop/simple-manager/manager"
	"gopkg.in/alecthomas/kingpin.v2"
)

var (
	app   = kingpin.New("chat", "Robotmon command-line tools")
	debug = app.Flag("debug", "Enable debug mode.").Bool()
	// serverIP = app.Flag("server", "Server address.").Default("127.0.0.1").IP()

	list = app.Command("list", "List all adb devices")

	rList = app.Command("rlist", "List all remote devices. Receive broadcase.")

	start       = app.Command("start", "Start robotmon service")
	startSerial = start.Arg("serial", "Device serial to start").String()

	stop       = app.Command("stop", "Stop robotmon service")
	stopSerial = stop.Arg("serial", "Device serial to stop").String()

	forward       = app.Command("forward", "Forward adb port for being connected")
	forwardSerial = forward.Arg("serial", "Device serial to forward").String()
	pcPort        = forward.Flag("pcPort", "pc port").String()
	devicePort    = forward.Flag("devicePort", "device port").String()

	reset    = app.Command("reset", "Reset")
	resetAdb = reset.Command("adb", "Reset adb")

	// TODO adb already has this function
	// connect    = app.Command("connect", "Connect to the adb device")
	// connectAdb = connect.Command("adb", "Connect to the adb device")
	// ip         = connectAdb.Arg("ip", "Device IP").Default("127.0.0.1").String()
	// port       = connectAdb.Arg("port", "Device PORT").Default("5555").String()

	run       = app.Command("run", "Run script to the device through adb")
	runSerial = run.Arg("serial", "Device serial to run script").String()
	runFile   = run.Flag("file", "Script file path").String()
	runScript = run.Flag("script", "Short script").String()
	runSync   = run.Flag("sync", "Run script sync. (Interrupt mode)").Bool()

	logs      = app.Command("log", "Listen logs through adb")
	logSerial = logs.Arg("serial", "Device serial to listen").String()
)

var (
	adbClient *manager.AdbClient
)

func main() {
	adbClient = manager.GetAdbClient()
	switch kingpin.MustParse(app.Parse(os.Args[1:])) {
	case list.FullCommand():
		ListDevices(adbClient)
	case start.FullCommand():
		StartService(adbClient, *startSerial)
	case stop.FullCommand():
		StopService(adbClient, *stopSerial)
	case forward.FullCommand():
		Forward(adbClient, *forwardSerial, *pcPort, *devicePort)
		ListDevices(adbClient)
	case resetAdb.FullCommand():
		adbClient.Restart()
	case run.FullCommand():
		RunScript(adbClient, *runSerial, *runSync, *runFile, *runScript)
	case logs.FullCommand():
		ListenLog(adbClient, *logSerial)
	}
}
