Robotmon Desktop
================

## Install & Start

### Install Desktop

``` shell
npm install
./node_modules/.bin/electron-rebuild
npm start
```

### Install Android App

```
adb install robotmon.apk
```

### Run Robotmon service on background

```
export LD_LIBRARY_PATH=/system/lib:/data/app/com.r2sutdio.robotmon-1/lib/arm; CLASSPATH=/data/app/com.r2sutdio.robotmon-1/base.apk nohup nice -n -10 app_process /system/bin com.r2sutdio.robotmon.Main '$@' > /dev/null &
```

If install twice, try

```
export LD_LIBRARY_PATH=/system/lib:/data/app/com.r2sutdio.robotmon-2/lib/arm; CLASSPATH=/data/app/com.r2sutdio.robotmon-2/base.apk nohup nice -n -10 app_process /system/bin com.r2sutdio.robotmon.Main '$@' > /dev/null &
```
