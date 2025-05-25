# Patient Tracker

A minimal cross-platform (iOS + Android) React-Native prototype for tracking patients by hospital and floor.  
All data live in a local SQLite database; audit triggers log every insert, update, and delete.

---

## Database Schema

`patient_tracking_schema.sql` defines:

- **Hospitals**
- **Floors**
- **Physicians**
- **Patients**
- **Attachments**
- **Audit Log** – triggers on every table above

Load that file into a fresh SQLite DB (the app will initialise it automatically on first run).

---

## App Features

| Screen | Purpose |
|--------|---------|
| **Hospital List** | Filter hospitals by name, view patient counts, jump to patient lists |
| **Add Hospital** | Create a hospital with notes and any number of floors |
| **Patient List** | View / filter patients for a hospital (unchecked-in patients appear in grey) |
| **Add Patient**  | Add a patient and assign hospital + floor |

---

## Prerequisites

- [Node.js](https://nodejs.org/) & npm  
- React-Native CLI `npm i -g react-native-cli`  
- **macOS (iOS builds)** – Xcode + Command-line Tools  
- **Android** – Android Studio (any OS)

---

## Installation

```bash
git clone <repo-url>
cd PatientTracker
npm install          # or: yarn
