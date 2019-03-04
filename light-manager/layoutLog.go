package main

import (
	"fmt"

	"github.com/jroimartin/gocui"
)

// NewLayoutLogs create new menu
func NewLayoutLogs(g *gocui.Gui) *LayoutLog {
	l := &LayoutLog{
		viewName: "logs",
		g:        g,
		logs:     []string{},
	}
	return l
}

// LayoutLog comment
type LayoutLog struct {
	g        *gocui.Gui
	viewName string
	logs     []string
}

func (l *LayoutLog) layout() error {
	if v, err := l.g.SetView(l.viewName, 0, 11, 79, 23); err != nil {
		if err != gocui.ErrUnknownView {
			return err
		}
		v.Highlight = true
		v.SelBgColor = gocui.ColorYellow
		v.SelFgColor = gocui.ColorBlack
		l.genContent(v)
	}
	return nil
}

// NewLog comment
func (l *LayoutLog) NewLog(msg string) {
	for len(msg) > 78 {
		l.logs = append(l.logs, msg[0:78])
		msg = msg[78:]
	}
	if len(msg) > 0 {
		l.logs = append(l.logs, msg)
	}
	l.Update()
}

// Update comment
func (l *LayoutLog) Update() {
	l.g.Update(func(g *gocui.Gui) error {
		v, err := g.View(l.viewName)
		if err != nil {
			return nil
		}
		l.genContent(v)
		return nil
	})
}

func (l *LayoutLog) genContent(v *gocui.View) {
	v.Clear()
	fmt.Fprintln(v, "[Logs]")
	for _, s := range l.logs {
		fmt.Fprintln(v, s)
	}
	_, y := v.Size()
	if len(l.logs) < y {
		y = len(l.logs)
	}
	v.SetOrigin(0, len(l.logs)-y+1)
	v.SetCursor(0, y-1)
}

func (l *LayoutLog) keybindings() {
}
