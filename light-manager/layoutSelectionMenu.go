package main

import (
	"fmt"

	"github.com/jroimartin/gocui"
)

const (
	menuWidth  = 30
	menuHeight = 10
)

// layer 1 selection
// StartService (start)
// StopService (stop)
// SetRemotePhone (tcpip)
// ConnectEmulator (auto)
// ConnectDevice (connect)
// Refresh (devices)
// ======== Advanced ========
// DevelopEmulator (forward)

// layer 2 selection
// device serialno

// NewLayoutMenu create new menu
func NewLayoutMenu(g *gocui.Gui) *LayoutMenu {
	l := &LayoutMenu{
		viewName: "menu",
		g:        g,
		menuList: []string{
			"[1] StartService (start)",
			"[2] StopService (stop)",
			"[3] EnableRemotePhone (tcpip)",
			"[4] ConnectEmulator (auto)",
			"[5] RefreshDevices (devices)",
			"========= Advanced =========",
			"[6] ConnectDevice (connect)",
			"[7] DevelopEmulator (forward)",
			"[8] Exit (exit)",
		},
	}
	return l
}

// LayoutMenu comment
type LayoutMenu struct {
	g          *gocui.Gui
	viewName   string
	menuList   []string
	onSelected func(string)
}

func (l *LayoutMenu) layout() error {
	// maxX, maxY := g.Size()
	//l.g.Mouse = true
	if v, err := l.g.SetView(l.viewName, 0, 0, menuWidth, menuHeight); err != nil {
		if err != gocui.ErrUnknownView {
			return err
		}
		v.Highlight = true
		v.SelBgColor = gocui.ColorGreen
		v.SelFgColor = gocui.ColorBlack
		v.Title = fmt.Sprintf("[Menu-%s]", VERSION)
		for _, s := range l.menuList {
			fmt.Fprintln(v, s)
		}
		v.SetCursor(0, 0)
	}
	return nil
}

func (l *LayoutMenu) setOnSelected(listener func(string)) {
	l.onSelected = listener
}

func (l *LayoutMenu) onCursorUp(g *gocui.Gui, v *gocui.View) error {
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

func (l *LayoutMenu) onCursorDown(g *gocui.Gui, v *gocui.View) error {
	if v != nil {
		cx, cy := v.Cursor()
		v.SetCursor(cx, cy+1)
	}
	return nil
}

func (l *LayoutMenu) onEnter(g *gocui.Gui, v *gocui.View) error {
	if l.onSelected != nil {
		_, cy := v.Cursor()
		s, _ := v.Line(cy)
		l.onSelected(s)
	}
	return nil
}

func (l *LayoutMenu) keybindings() {
	if err := l.g.SetKeybinding(l.viewName, gocui.KeyArrowUp, gocui.ModNone, l.onCursorUp); err != nil {
		fmt.Println(err)
	}
	if err := l.g.SetKeybinding(l.viewName, gocui.KeyArrowDown, gocui.ModNone, l.onCursorDown); err != nil {
		fmt.Println(err)
	}
	if err := l.g.SetKeybinding(l.viewName, gocui.KeyEnter, gocui.ModNone, l.onEnter); err != nil {
		fmt.Println(err)
	}
	/*
		if err := l.g.SetKeybinding(l.viewName, gocui.MouseLeft, gocui.ModNone, l.onEnter); err != nil {
			fmt.Println(err)
		}
	*/
}
