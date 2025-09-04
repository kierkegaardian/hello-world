PatientTracker is a React Native app for tracking hospitals and patients locally (SQLite, offline-first). It includes retiring entities (soft-hide), a patients overview across hospitals/floors, and a developer reset to reseed demo data.

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Project Layout

- Entry: `index.js` loads `src/App`.
- App: screens in `src/screens/*`.
- Database: `src/db.js` (schema + init + seed + reset). Uses `react-native-sqlite-storage`.
- iOS: `ios/PatientTracker.xcworkspace` (CocoaPods integrated).

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

Install CocoaPods dependencies (first clone or when native deps change):

```sh
cd ios && npx pod-install && cd -
```

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Features

- Hospitals
  - List with text filter and “View Retired” toggle
  - Add hospital with optional floors
  - Retire/Unretire hospitals (soft-hide)
- Patients
  - Per-hospital list with filter and “View Retired” toggle
  - Add/Edit patient with hospital and floor selection
  - Retire/Unretire patients
- Patients Overview
  - Cross-hospital list with filters: hospital, floor, search, retired
  - Tap to edit a patient
- Developer Reset
  - On the Hospitals screen header, “Reset” drops/recreates local tables and seeds demo data

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open files in `src/` (e.g., `src/App.js`, `src/screens/*`). When you save, your app will automatically update — powered by Fast Refresh.

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

- If the simulator can’t connect to Metro on 8081, specify a port: `npx react-native start --port 8082` and `npx react-native run-ios --port 8082`.
- If you see missing native modules after adding packages: run `cd ios && npx pod-install`.
- To reset and reseed local data: use the “Reset” header button on the Hospitals screen.

## Test Plan

Manual test coverage for core flows:

1) App boot + seed
- Launch on iOS. Verify Hospitals shows “General Hospital” and “City Clinic”.
- If empty, tap “Reset” in header and confirm demo data appears.

2) Hospitals
- Filter by a substring (case-insensitive) and see matching rows.
- Tap “View Retired” to include any retired hospitals; toggle a hospital Retire/Unretire and see color change.
- Add Hospital: provide name, location, and a few floors; save and verify it appears with correct patient count (0).

3) Patients (per hospital)
- Tap a hospital to view its patients.
- Filter by name, toggle “View Retired”, and verify list updates.
- Add Patient: provide name, birthdate, issue, select a floor; save and verify it appears.
- Edit Patient: tap an existing patient and change a field; save and verify updates.
- Retire/Unretire patient and verify styling/toggle behavior.

4) Patients Overview
- Open via Hospitals header “Overview”.
- Filter by hospital (All or specific), optionally by floor; search by name.
- Toggle “View Retired” to include retired patients.
- Tap a patient to open edit; change a field and save; verify overview refreshes.

5) Data integrity
- After adding floors, ensure new patients can select those floors.
- Verify that hospitals with zero patients still show (patient count 0).

6) Reset flow
- Tap “Reset”, confirm tables are cleared and demo data reappears.

7) Dev ergonomics
- Hot reload works when editing files in `src/`.
- If Metro cache is stale, run: `npx react-native start --reset-cache`.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
