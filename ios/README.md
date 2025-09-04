# iOS Setup

This directory is a placeholder for the iOS project files needed to run the app on a Mac.

To generate the actual Xcode project, run the following commands on your Mac:

```bash
cd PatientTracker
 npx react-native init PatientTracker --directory .
 cd ios && pod install
```

After generating the project, open `PatientTracker.xcworkspace` in Xcode and build the app.
