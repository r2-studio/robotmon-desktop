# Robotmon Desktop

## Installation

if you're on Windows:
```
npm install --global --production windows-build-tools
```

## Quick Start

```
git clone https://github.com/r2-studio/robotmon-desktop.git
cd app
npm install
./node_modules/.bin/electron-rebuild
npm start
```

## Install App (Only support Android) (No need to root)

Download Robotmon on [Google Play](https://play.google.com/store/apps/details?id=com.r2studio.robotmon).

<a href='https://play.google.com/store/apps/details?id=com.r2studio.robotmon'><img alt='Get Robotmon on Google Play' style='width: 200px;'  src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png'/></a>

## Run background service (Important)

Service is built in app com.r2studio.robotmon.Main, that's start it.

First, connect android phone to PC with USB

### Using Double-Click Tools

1. Download [Robotmon-service-manager](https://github.com/r2-studio/robotmon-desktop/raw/master/service-manager/service-manager.zip)
2. Unzip it
3. Double Click `windows-start.bat` in windows, `mac-start.command` in mac, `linux-start.sh` in linux

#### Using developer tool

1. Click `掃描 Scan`
2. Click `啟動 Start`

#### Using command line (need adb tools) 

```
adb shell 'nohup sh -c "LD_LIBRARY_PATH=/system/lib:/data/app/com.r2studio.robotmon-1/lib/arm:/data/app/com.r2studio.robotmon-2/lib/arm CLASSPATH=/data/app/com.r2studio.robotmon-1/base.apk:/data/app/com.r2studio.robotmon-2/base.apk app_process32 /system/bin com.r2studio.robotmon.Main $@" > /dev/null 2> /dev/null &'
```

#### Check service is running

```
$ adb shell 'ps | grep app_process'
# or
$ adb shell 'ps | grep app_process'
shell     16035 16032 2295692 40508 futex_wait ab35c858 S app_process32
```

#### Troubling

* Check LD_LIBRARY_PATH, CLASSPATH and app_process32 is correct/exists
* Thers is no `nohub` in some devices, you may remove it and try again
* Using `app_process` instead of `app_process32` in old phones

#### Tested devices
|brand|model|
|---|---|
|HTC|U11, M9, E9+, Eye, X9, 10, A9, butterfly 2, butterfly|
|Samsung|S7, Note 8|
|Asus|ZenFone 2|
|Oneplus|3t|

#### If you want to kill Robotmon Service

```
# find pid
adb shell ps app_process
or
adb shell "ps | grep app_process"

# kill it
adb shell kill <pid>
```