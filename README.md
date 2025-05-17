# hello-world
Repository Practice

## Patient Tracking Database Schema
See `patient_tracking_schema.sql` for an example SQL schema to manage hospitals, floors, physicians, patients, and attachments.

## React Native Prototype

This repository contains a minimal React Native app in the `PatientTracker` folder. It demonstrates a simple patient tracking system with four screens:

1. **Hospital List** – Filter hospitals by name, view patient counts, and navigate to patient lists.
2. **Add Hospital** – Create hospitals with notes and a configurable number of floors.
3. **Patient List** – View and filter patients for a hospital. Patients not checked in appear in gray.
4. **Add Patient** – Add new patients and assign them to a hospital and floor.

The app stores data in a local SQLite database and includes audit triggers defined in `patient_tracking_schema.sql`.

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- Xcode (for iOS builds on macOS) and Android Studio (for Android)

### Running on macOS (iOS)

```bash
cd PatientTracker
npm install
npx react-native run-ios
```

### Running on Linux or macOS (Android)

```bash
cd PatientTracker
npm install
npx react-native run-android
```

### Tests

The project includes a basic Jest configuration. Run tests with:

```bash
npm test
```
