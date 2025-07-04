# Patient Tracker

A minimal cross-platform (iOS + Android) React-Native prototype for tracking patients by hospital and floor.
All data live in a local SQLite database; audit triggers log every insert, update, and delete.

---

## Database Schema

The SQL schema `patient_tracking_schema.sql` defines:

- **Hospitals**
- **Floors**
- **Physicians**
- **Patients**
- **Attachments**
- **Audit Log** – triggers on every table above

### Database Initialization

You can load the schema using a database engine of your choice. SQLite is ideal for development, while PostgreSQL is suitable for production deployments.

#### Using SQLite

Run this command to create a local database and initialize the schema:

```bash
sqlite3 patient_tracking.db < patient_tracking_schema.sql
```

### Running on iOS

The repository does not include the generated iOS project files. To run the React Native app on a Mac:

1. Ensure Xcode and CocoaPods are installed.
2. From the `PatientTracker` directory, generate the iOS project and install pods:
   ```bash
   npx react-native init ios --directory ios --skip-install
   cd ios
   pod install
   ```
3. Open `PatientTracker.xcworkspace` in Xcode and build the app or run:
   ```bash
  npx react-native run-ios
  ```

4. React Native `0.73` renamed the Hermes helper script to
   `replace_hermes_version.js`. If your build configuration or Podspec
   still references `replaceHermesVersion.js`, update the path to
   `node_modules/react-native/sdks/hermes-engine/utils/replace_hermes_version.js`.

### Running the Metro bundler

The `PatientTracker` directory now includes a minimal `metro.config.js`. After
installing dependencies, you can start the React Native development server with:

```bash
cd PatientTracker
npm install
npm start
```


### patient_tracking_app (Expo Demo)

The `patient_tracking_app` folder contains a simplified React Native project configured for Expo. It ships with sample data and is meant for quickly exploring the patient tracking concept without generating native builds.

To install dependencies and launch the demo:

```bash
cd patient_tracking_app
npm install
npx expo start
```


