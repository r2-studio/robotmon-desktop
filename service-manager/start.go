package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"syscall"
)

func main() {
	dir, _ := filepath.Abs(filepath.Dir(os.Args[0]))
	path := dir + string(os.PathSeparator) + "service-manager." + runtime.GOOS
	fmt.Println(path)
	binary, lookErr := exec.LookPath(path)
	if lookErr != nil {
		panic(lookErr)
	}
	args := []string{"service-manager", "--start"}
	env := os.Environ()
	err := syscall.Exec(binary, args, env)
	fmt.Println(err)
}
