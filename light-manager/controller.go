package main

import (
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/jroimartin/gocui"
)

func NewController(adbHelper *AdbHelper) *Controller {
	c := &Controller{
		adbHelper: adbHelper,
	}
	c.init()
	return c
}

// Controller UI controller
type Controller struct {
	adbHelper             *AdbHelper
	layoutSlectionMenu    *LayoutMenu
	layoutSlectionDevices *LayoutDevices
	layoutLog             *LayoutLog
	layoutInput           *LayoutInput
	g                     *gocui.Gui
	task                  string
	deviceSerial          string
}

func (c *Controller) init() {
	// prepare GUI
	g, err := gocui.NewGui(gocui.OutputNormal)
	g.ASCII = true
	if err != nil {
		log.Panicln(err)
	}

	c.layoutSlectionMenu = NewLayoutMenu(g)

	c.layoutSlectionDevices = NewLayoutDevices(g)
	c.setOnEvent()
	c.layoutLog = NewLayoutLogs(g)

	g.Cursor = true
	g.SetManagerFunc(c.layout)

	c.layoutSlectionMenu.keybindings()
	c.layoutSlectionDevices.keybindings()
	c.layoutLog.keybindings()

	if err := g.SetKeybinding("", gocui.KeyCtrlC, gocui.ModNone, c.quit); err != nil {
		g.Close()
		log.Panicln(err)
	}
	if err := g.SetKeybinding("", gocui.KeyTab, gocui.ModNone, c.nextView); err != nil {
		log.Panicln(err)
	}

	if err := g.SetKeybinding(c.layoutSlectionMenu.viewName, rune('1'), gocui.ModNone, c.key1); err != nil {
		log.Panicln(err)
	}

	if err := g.SetKeybinding(c.layoutSlectionMenu.viewName, rune('2'), gocui.ModNone, c.key2); err != nil {
		log.Panicln(err)
	}

	if err := g.SetKeybinding(c.layoutSlectionMenu.viewName, rune('3'), gocui.ModNone, c.key3); err != nil {
		log.Panicln(err)
	}

	if err := g.SetKeybinding(c.layoutSlectionMenu.viewName, rune('4'), gocui.ModNone, c.key4); err != nil {
		log.Panicln(err)
	}

	if err := g.SetKeybinding(c.layoutSlectionMenu.viewName, rune('5'), gocui.ModNone, c.key5); err != nil {
		log.Panicln(err)
	}

	if err := g.SetKeybinding(c.layoutSlectionMenu.viewName, rune('6'), gocui.ModNone, c.key6); err != nil {
		log.Panicln(err)
	}

	if err := g.SetKeybinding(c.layoutSlectionMenu.viewName, rune('7'), gocui.ModNone, c.key7); err != nil {
		log.Panicln(err)
	}

	if err := g.SetKeybinding(c.layoutSlectionMenu.viewName, rune('8'), gocui.ModNone, c.key8); err != nil {
		log.Panicln(err)
	}

	c.refreshDevices()
	c.g = g
}

// StartUI comment
func (c *Controller) StartUI() {
	if err := c.g.MainLoop(); err != nil && err != gocui.ErrQuit {
		log.Panicln(err)
	}
}

func (c *Controller) layout(*gocui.Gui) error {
	c.layoutSlectionMenu.layout()
	c.layoutSlectionDevices.layout()
	c.layoutLog.layout()
	if c.g.CurrentView() == nil {
		c.g.SetCurrentView(c.layoutSlectionMenu.viewName)
	}
	return nil
}

func (c *Controller) quit(g *gocui.Gui, v *gocui.View) error {
	return gocui.ErrQuit
}

func (c *Controller) nextView(g *gocui.Gui, v *gocui.View) error {
	c.task = ""
	_, err := g.SetCurrentView(c.layoutSlectionMenu.viewName)
	return err
}

func (c *Controller) key1(g *gocui.Gui, v *gocui.View) error {
	v.SetCursor(0, 0)
	c.layoutSlectionMenu.onEnter(g, v)
	return nil
}

func (c *Controller) key2(g *gocui.Gui, v *gocui.View) error {
	v.SetCursor(0, 1)
	c.layoutSlectionMenu.onEnter(g, v)
	return nil
}

func (c *Controller) key3(g *gocui.Gui, v *gocui.View) error {
	v.SetCursor(0, 2)
	c.layoutSlectionMenu.onEnter(g, v)
	return nil
}

func (c *Controller) key4(g *gocui.Gui, v *gocui.View) error {
	v.SetCursor(0, 3)
	c.layoutSlectionMenu.onEnter(g, v)
	return nil
}

func (c *Controller) key5(g *gocui.Gui, v *gocui.View) error {
	v.SetCursor(0, 4)
	c.layoutSlectionMenu.onEnter(g, v)
	return nil
}

func (c *Controller) key6(g *gocui.Gui, v *gocui.View) error {
	v.SetCursor(0, 6)
	c.layoutSlectionMenu.onEnter(g, v)
	return nil
}

func (c *Controller) key7(g *gocui.Gui, v *gocui.View) error {
	v.SetCursor(0, 7)
	c.layoutSlectionMenu.onEnter(g, v)
	return nil
}

func (c *Controller) key8(g *gocui.Gui, v *gocui.View) error {
	v.SetCursor(0, 8)
	c.layoutSlectionMenu.onEnter(g, v)
	return nil
}

func (c *Controller) refreshDevices() {
	c.layoutLog.NewLog("Refreshing... please wait")
	devices, err := c.adbHelper.GetDevices()
	for i, serialNo := range devices {
		pids, err := c.adbHelper.getPids(serialNo)
		if err != nil {
			devices[i] = fmt.Sprintf("%s (error)", serialNo)
			continue
		}
		if len(pids) > 0 {
			devices[i] = fmt.Sprintf("%s (on)", serialNo)
		} else {
			devices[i] = fmt.Sprintf("%s (off)", serialNo)
		}
		for _, pid := range pids {
			devices[i] += fmt.Sprintf("(%s)", pid)
		}
	}
	if err != nil {
		c.layoutLog.NewLog(err.Error())
	}
	c.layoutSlectionDevices.UpdateDevices(devices)
	c.layoutLog.NewLog(fmt.Sprintf("Refresh done. Found %d devices", len(devices)))
}

func (c *Controller) startService(serialNo string) error {
	apk, err := adbHelper.getApkPath(serialNo)
	if err != nil {
		return err
	}
	c.layoutLog.NewLog(fmt.Sprintf("APK PATH: %s", apk))
	process := adbHelper.getAppProcess(serialNo)
	c.layoutLog.NewLog(fmt.Sprintf("app_process: %s", process))
	command, err := adbHelper.getStartCommand(serialNo)
	if err != nil {
		return err
	}
	c.layoutLog.NewLog(fmt.Sprintf("command: %s", command))
	return adbHelper.startService(serialNo)
}

func (c *Controller) setOnEvent() {
	c.layoutSlectionMenu.setOnSelected(func(selected string) {
		c.task = selected
		if strings.Contains(c.task, "StartService") {
			c.task = "StartService"
			c.layoutLog.NewLog("Please select device...")
			c.g.SetCurrentView(c.layoutSlectionDevices.viewName)
		} else if strings.Contains(c.task, "StopService") {
			c.task = "StopService"
			c.layoutLog.NewLog("Please select device...")
			c.g.SetCurrentView(c.layoutSlectionDevices.viewName)
		} else if strings.Contains(c.task, "EnableRemotePhone") {
			c.task = "EnableRemotePhone"
			c.layoutLog.NewLog("Please select device...")
			c.g.SetCurrentView(c.layoutSlectionDevices.viewName)
		} else if strings.Contains(c.task, "ConnectEmulator") {
			c.layoutLog.NewLog("Auto find and connect to emulator...")
			go c.autoConnectToEmulator()
		} else if strings.Contains(c.task, "ConnectDevice") {
			c.layoutLog.NewLog("Please input ip and port")
			c.layoutInput = NewLayoutInput(c.g, "Ip:Port (127.0.0.1:5555)")
			c.layoutInput.setOnSelected(func(ipport string) {
				ss := strings.Split(strings.Trim(ipport, "\r\n "), ":")
				ip := ss[0]
				port := "5555"
				if len(ss) > 1 {
					port = ss[1]
				}
				c.layoutLog.NewLog(fmt.Sprintf("Try to connect %s:%s...", ip, port))
				go func() {
					success, err := c.adbHelper.connect(ip, port)
					if err != nil {
						c.layoutLog.NewLog(fmt.Sprintf("%s:%s Failed. %s", ip, port, err.Error()))
					} else if !success {
						c.layoutLog.NewLog(fmt.Sprintf("%s:%s Failed", ip, port))
					} else if success {
						c.layoutLog.NewLog(fmt.Sprintf("Connect to %s:%s success", ip, port))
						c.refreshDevices()
					}
					c.layoutInput.setOnSelected(nil)
					c.g.DeleteView(c.layoutInput.viewName)
					c.g.SetCurrentView(c.layoutSlectionMenu.viewName)
				}()
			})
		} else if strings.Contains(c.task, "RefreshDevices") {
			c.refreshDevices()
		} else if strings.Contains(c.task, "DevelopEmulator") {
			c.task = "DevelopEmulator"
			c.layoutLog.NewLog("Please select device...")
			c.g.SetCurrentView(c.layoutSlectionDevices.viewName)
		} else if strings.Contains(c.task, "Exit") {
			os.Exit(0)
		}
	})
	c.layoutSlectionDevices.setOnSelected(func(selected string) {
		serialNo := selected[0:strings.Index(selected, " ")]
		if c.task == "StartService" {
			c.layoutLog.NewLog(fmt.Sprintf("Starting service %s ... please wait", serialNo))
			go func() {
				err := c.startService(serialNo)
				if err != nil {
					c.layoutLog.NewLog(fmt.Sprintf("Error start service failed: %s. %s", serialNo, err.Error()))
				} else {
					c.layoutLog.NewLog(fmt.Sprintf("Start service success: %s", serialNo))
				}
				c.refreshDevices()
				c.task = ""
				c.g.SetCurrentView(c.layoutSlectionMenu.viewName)
			}()
		} else if c.task == "StopService" {
			c.layoutLog.NewLog(fmt.Sprintf("Stop service %s ... please wait", serialNo))
			go func() {
				err := c.adbHelper.stopService(serialNo)
				if err != nil {
					c.layoutLog.NewLog(fmt.Sprintf("Error stop service failed: %s", serialNo))
				} else {
					c.layoutLog.NewLog(fmt.Sprintf("Stop service success: %s", serialNo))
				}
				c.refreshDevices()
				c.task = ""
				c.g.SetCurrentView(c.layoutSlectionMenu.viewName)
			}()
		} else if c.task == "EnableRemotePhone" {
			c.adbHelper.tcpip(serialNo)
			c.layoutLog.NewLog(fmt.Sprintf("adb -s %s tcpip 5555 success", serialNo))
			c.g.SetCurrentView(c.layoutSlectionMenu.viewName)
		} else if c.task == "DevelopEmulator" {
			c.layoutLog.NewLog(fmt.Sprintf("Forward port %s ... please wait", serialNo))
			go func() {
				for i := 8080; i < 8085; i++ {
					success, err := c.adbHelper.forward(fmt.Sprintf("%d", i))
					if !success {
						c.layoutLog.NewLog(fmt.Sprintf("Forward port failed: %d, %s", i, err.Error()))
					} else {
						c.layoutLog.NewLog(fmt.Sprintf("Forward port success: %d", i))
						break
					}
				}
				c.task = ""
				c.g.SetCurrentView(c.layoutSlectionMenu.viewName)
			}()
		}
	})
}

func (c *Controller) autoConnectToEmulator() {
	ports := []string{"62001", "5555", "62025", "5565", "5556", "62026", "5575", "62027", "5557", "62028"}
	for _, port := range ports {
		c.layoutLog.NewLog(fmt.Sprintf("Try to connect 127.0.0.1:%s...", port))
		go func(port string) {
			success, err := c.adbHelper.connect("127.0.0.1", port)
			if err != nil {
				c.layoutLog.NewLog(fmt.Sprintf("127.0.0.1:%s Failed. %s", port, err.Error()))
			} else if !success {
				c.layoutLog.NewLog(fmt.Sprintf("127.0.0.1:%s Failed", port))
			} else if success {
				c.layoutLog.NewLog(fmt.Sprintf("Connect to 127.0.0.1:%s success", port))
				c.refreshDevices()
			}
		}(port)
		time.Sleep(1 * time.Second)
	}
}
