package main

import (
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"runtime"
	"time"

	"github.com/gobuffalo/packr"
	"github.com/r2-studio/robotmon-desktop/simple-manager/manager"
)

func main() {
	client := manager.GetAdbClient()
	manager.NewAppService(client)
	go serveUI()
	time.Sleep(time.Second)
	openbrowser("http://localhost:8888")

	select {}
}

func serveUI() {
	fmt.Println("Listen :8888 for SimpleManager")
	box := packr.NewBox("../../simple-ui/dist")
	http.Handle("/", http.FileServer(box))
	http.ListenAndServe(":8888", nil)
}

func openbrowser(url string) {
	var err error
	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default:
		err = fmt.Errorf("unsupported platform")
	}
	if err != nil {
		log.Fatal(err)
	}
}
