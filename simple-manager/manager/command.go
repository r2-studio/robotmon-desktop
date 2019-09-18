// +build linux darwin freebsd !windows

package manager

import (
	"os/exec"
)

func hideWindow(cmd *exec.Cmd) {
}
