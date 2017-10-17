package main

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
)

func main() {
	dir, _ := filepath.Abs(filepath.Dir(os.Args[0]))
	path := dir + string(os.PathSeparator) + "service-manager." + runtime.GOOS
	fmt.Println(path)
	cmd := exec.Command(path, "-start", "-connvm")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err := cmd.Run()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Enter to exit...")
	bufio.NewReader(os.Stdin).ReadBytes('\n')
}
