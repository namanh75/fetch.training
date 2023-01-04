## QR Code Scanner
----
#### Features
- Scanner QR code
- Create new QR CODE
- History


## Setup
-----

#### Permission

```xml
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" />
    <uses-feature android:name="android.hardware.camera.autofocus" />
```

#### Hardware Acceleration

```xml
    <application android:hardwareAccelerated="true" ... >
```

#### Gradle

Add this to your package's build.gradle file:

```
dependencies:
    implementation 'com.journeyapps:zxing-android-embedded:4.1.0'
```

