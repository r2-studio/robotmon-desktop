package main

import (
	"fmt"
	"time"
)

var adbHelper *AdbHelper

func initAdb() {
	// prepare adb
	adbHelper = NewAdbHelper()
	if adbHelper == nil {
		fmt.Println("Can not find adb. Try to download adb...")
		err := DownloadAdb()
		if err != nil {
			fmt.Println(err)
			return
		}
		adbHelper = NewAdbHelper()
	}
}

func main() {
	initAdb()
	if adbHelper == nil {
		fmt.Println("Can not find adb. please place adb in bin/")
		return
	}
	fmt.Println("Find adb path:", adbHelper.GetAdbPath())

	adbHelper.GetDevices()
	time.Sleep(1 * time.Second)

	controller := NewController(adbHelper)
	controller.StartUI()

}
