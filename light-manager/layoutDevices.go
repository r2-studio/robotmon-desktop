package main

import (
	"fmt"

	"github.com/jroimartin/gocui"
)

// NewLayoutDevices create new menu
func NewLayoutDevices(g *gocui.Gui) *LayoutDevices {
	l := &LayoutDevices{
		viewName:   "devices",
		g:          g,
		deviceList: []string{},
	}
	return l
}

// LayoutDevices comment
type LayoutDevices struct {
	g          *gocui.Gui
	viewName   string
	deviceList []string
	onSelected func(string)
}

// UpdateDevices comment
func (l *LayoutDevices) UpdateDevices(s []string) {
	l.deviceList = s
	l.Update()
}

func (l *LayoutDevices) layout() error {
	// maxX, maxY := g.Size()
	if v, err := l.g.SetView(l.viewName, 31, 0, 79, 10); err != nil {
		if err != gocui.ErrUnknownView {
			return err
		}
		v.Title = "[Devices][Tab to cancel]"
		v.Highlight = true
		v.SelBgColor = gocui.ColorGreen
		v.SelFgColor = gocui.ColorBlack
		l.genContent(v)
	}
	return nil
}

func (l *LayoutDevices) setOnSelected(listener func(string)) {
	l.onSelected = listener
}

// Update comment
func (l *LayoutDevices) Update() {
	l.g.Update(func(g *gocui.Gui) error {
		v, err := g.View(l.viewName)
		if err != nil {
			return nil
		}
		l.genContent(v)
		return nil
	})
}

func (l *LayoutDevices) genContent(v *gocui.View) {
	v.Clear()
	// fmt.Fprintln(v, "[Devices][Tab to cancel]")
	for _, s := range l.deviceList {
		fmt.Fprintln(v, s)
	}
	v.SetCursor(0, 0)
}

func (l *LayoutDevices) onCursorUp(g *gocui.Gui, v *gocui.View) error {
	if v != nil {
		ox, oy := v.Origin()
		cx, cy := v.Cursor()
		if err := v.SetCursor(cx, cy-1); err != nil && oy > 0 {
			if err := v.SetOrigin(ox, oy-1); err != nil {
				return err
			}
		}
	}
	return nil
}

func (l *LayoutDevices) onCursorDown(g *gocui.Gui, v *gocui.View) error {
	if v != nil {
		cx, cy := v.Cursor()
		if cy < len(l.deviceList) {
			v.SetCursor(cx, cy+1)
		}
	}
	return nil
}

func (l *LayoutDevices) onEnter(g *gocui.Gui, v *gocui.View) error {
	if l.onSelected != nil {
		_, cy := v.Cursor()
		s, _ := v.Line(cy)
		l.onSelected(s)
	}
	return nil
}

func (l *LayoutDevices) keybindings() {
	if err := l.g.SetKeybinding(l.viewName, gocui.KeyArrowUp, gocui.ModNone, l.onCursorUp); err != nil {
		fmt.Println(err)
	}
	if err := l.g.SetKeybinding(l.viewName, gocui.KeyArrowDown, gocui.ModNone, l.onCursorDown); err != nil {
		fmt.Println(err)
	}
	if err := l.g.SetKeybinding(l.viewName, gocui.KeyEnter, gocui.ModNone, l.onEnter); err != nil {
		fmt.Println(err)
	}
}
