package main

import (
	"fmt"

	"github.com/jroimartin/gocui"
)

// NewLayoutInput create new input
func NewLayoutInput(g *gocui.Gui, title string) *LayoutInput {
	l := &LayoutInput{
		viewName: "input",
		g:        g,
		title:    title,
		value:    "",
	}
	l.layout()
	l.keybindings()
	return l
}

// LayoutInput comment
type LayoutInput struct {
	g          *gocui.Gui
	viewName   string
	title      string
	value      string
	onSelected func(string)
}

func (l *LayoutInput) layout() error {
	if v, err := l.g.SetView(l.viewName, 40-20, 10-1, 40+20, 10+1); err != nil {
		if err != gocui.ErrUnknownView {
			return err
		}
		v.Editable = true
		v.Title = "[Input] " + l.title
		v.SetCursor(0, 1)
		l.g.SetCurrentView(l.viewName)
	}
	return nil
}

func (l *LayoutInput) onCursorUp(g *gocui.Gui, v *gocui.View) error {
	if v != nil {
		ox, oy := v.Origin()
		cx, cy := v.Cursor()
		if cy == 1 {
			return nil
		}
		if err := v.SetCursor(cx, cy-1); err != nil && oy > 0 {
			if err := v.SetOrigin(ox, oy-1); err != nil {
				return err
			}
		}
	}
	return nil
}

func (l *LayoutInput) setOnSelected(listener func(string)) {
	l.onSelected = listener
}

func (l *LayoutInput) onEnter(g *gocui.Gui, v *gocui.View) error {
	if l.onSelected != nil {
		_, cy := v.Cursor()
		s, _ := v.Line(cy)
		l.onSelected(s)
	}
	return nil
}

func (l *LayoutInput) keybindings() {
	if err := l.g.SetKeybinding(l.viewName, gocui.KeyArrowUp, gocui.ModNone, l.onCursorUp); err != nil {
		fmt.Println(err)
	}
	if err := l.g.SetKeybinding(l.viewName, gocui.KeyEnter, gocui.ModNone, l.onEnter); err != nil {
		fmt.Println(err)
	}
}
