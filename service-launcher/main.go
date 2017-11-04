package main

import (
	"github.com/asticode/go-astilectron"
	"github.com/asticode/go-astilectron-bootstrap"
	"github.com/asticode/go-astilog"
	"github.com/pkg/errors"
)

// Vars
var (
	AppName string
	BuiltAt string
	window  *astilectron.Window
)

func main() {
	// Init
	astilog.FlagInit()

	// Run bootstrap
	if err := bootstrap.Run(bootstrap.Options{
		Asset: Asset,
		AstilectronOptions: astilectron.Options{
			AppName: AppName,
		},
		Debug: false,
		Homepage: "index.html",
		MessageHandler: handleMessages,
		OnWait: func(_ *astilectron.Astilectron, w *astilectron.Window, _ *astilectron.Menu, t *astilectron.Tray, _ *astilectron.Menu) error {
			// Store global variables
			window = w

			return nil
		},
		RestoreAssets: RestoreAssets,
		WindowOptions: &astilectron.WindowOptions{
			BackgroundColor: astilectron.PtrStr("#333"),
			Center:          astilectron.PtrBool(true),
			Height:          astilectron.PtrInt(850),
			Width:           astilectron.PtrInt(1080),
			MinHeight:       astilectron.PtrInt(850),
			MinWidth:        astilectron.PtrInt(1080),
		},
	}); err != nil {
		astilog.Fatal(errors.Wrap(err, "running bootstrap failed"))
	}
}
