package main

import (
	"flag"

	"github.com/r2-studio/robotmon-desktop/simple-manager/manager"
)

var (
	adbClient *manager.AdbClient
	fList     bool
)

func init() {
	flag.BoolVar(&fList, "list", false, "list adb and remote devices")
}

func main() {
	flag.Parse()
	adbClient = manager.GetAdbClient()
	if fList {
		ListDevices(adbClient)
		return
	}

}
