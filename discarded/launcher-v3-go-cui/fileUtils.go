package main

import (
	"archive/zip"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"
)

func downloadFile(filepath string, url string) error {
	// Get the data
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Create the file
	out, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer out.Close()

	// Write the body to file
	_, err = io.Copy(out, resp.Body)
	return err
}

func unzip(src, dest string) error {
	r, err := zip.OpenReader(src)
	if err != nil {
		return err
	}
	defer r.Close()

	for _, f := range r.File {
		rc, err := f.Open()
		if err != nil {
			return err
		}
		defer rc.Close()

		fpath := filepath.Join(dest, f.Name)
		if f.FileInfo().IsDir() {
			os.MkdirAll(fpath, f.Mode())
		} else {
			var fdir string
			if lastIndex := strings.LastIndex(fpath, string(os.PathSeparator)); lastIndex > -1 {
				fdir = fpath[:lastIndex]
			}

			err = os.MkdirAll(fdir, f.Mode())
			if err != nil {
				log.Fatal(err)
				return err
			}
			f, err := os.OpenFile(
				fpath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
			if err != nil {
				return err
			}
			defer f.Close()

			_, err = io.Copy(f, rc)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

// DownloadAdb comment
func DownloadAdb() error {
	downloadURL := ""
	if runtime.GOOS == "windows" {
		downloadURL = "https://s3-ap-northeast-1.amazonaws.com/robotmon.elggum.com/adb/windows_adb.zip"
	} else if runtime.GOOS == "darwin" {
		downloadURL = "https://s3-ap-northeast-1.amazonaws.com/robotmon.elggum.com/adb/darwin_adb.zip"
	} else if runtime.GOOS == "linux" {
		downloadURL = "https://s3-ap-northeast-1.amazonaws.com/robotmon.elggum.com/adb/linux_adb.zip"
	}
	os.MkdirAll("bin", 0755)
	zipPath := "bin" + string(os.PathSeparator) + "adb.zip"
	err := downloadFile(zipPath, downloadURL)
	if err != nil {
		return err
	}
	unzip(zipPath, "bin")
	adbPath := "bin" + string(os.PathSeparator) + "adb"
	os.Chmod(adbPath, 755)
	if runtime.GOOS == "windows" {
		os.Rename(adbPath, adbPath+".exe")
	}
	os.Remove(zipPath)
	return nil
}
