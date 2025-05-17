# Patient Tracker

This repository contains a minimal prototype of a cross-platform mobile application for tracking patients by hospital and floor. It is intended for use on both iOS and Android devices.

## Database Schema

The SQL schema in `patient_tracking_schema.sql` defines the tables for hospitals, floors, physicians, patients, and attachments. It also includes an `audit_log` table with triggers that record inserts, updates, and deletes for these tables.

To initialize the database, load the contents of `patient_tracking_schema.sql` into a local SQLite database. The React Native app uses this schema when first run.

## Building the React Native App

### Prerequisites

- Node.js and npm
- React Native CLI (`npm install -g react-native-cli`)
- Xcode with command-line tools (macOS for iOS builds)
- Android Studio (for Android builds)

### Installation

```bash
cd PatientTracker
npm install
```

### Running on iOS (macOS only)

```bash
npx react-native run-ios
```

### Running on Android

Open an emulator or connect a device and run:

```bash
npx react-native run-android
```

### Testing

This prototype includes a small Jest test to ensure the main app renders. Run tests with:

```bash
npm test
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
