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

