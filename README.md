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
